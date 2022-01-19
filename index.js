if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const dbConnect = require("./lib/connection");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const registerRoutes = require("./router/register-login");
const userRoutes = require("./router/user");
const serverRoutes = require("./router/server");
const { userAuth, sessionStore } = require("./middleware/userAuth");
const Message = require("./models/message");
const Channel = require("./models/channel");
const DirectMessage = require("./models/direct-message");
const mongoose = require("mongoose");
const io = new Server(server, {
	cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(
	session({
		name: "free cookies",
		secret: "idgafsodgaf",
		resave: true,
		sameSite: "none",
		secure: false,
		httpOnly: true,
		saveUninitialized: false,
		cookie: {
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("*", async (req, res, next) => {
	await dbConnect();
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", registerRoutes, userRoutes, serverRoutes);
io.use(userAuth);
io.on("connection", (socket) => {
	app.set("socket", socket);
	sessionStore.saveSession(socket.handshake.auth.sessionID, {
		userID: socket.userID,
		username: socket.username,
		connected: true,
	});
	socket.emit("session", {
		sessionID: socket.sessionID,
		userID: socket.userID,
	});
	socket.join(socket.userID);
	const users = [];
	sessionStore.findAllSessions().forEach((session) => {
		users.push({
			userID: session.userID,
			username: session.username,
			connected: session.connected,
		});
	});
	socket.emit("users", users);
	socket.on("sent-message", async (data) => {
		if (socket.room) {
			const channel = await Channel.findById(data.channel_id);
			const message = new Message({
				...data,
				time: new Date(),
			});
			channel.messages.push([message._id]);
			await message.save();
			await channel.save();
			io.to(socket.room).emit("receive-message", message);
			return;
		}
	});
	socket.on("join-self", (userId) => {
		socket.join(userId);
		socket.selfRoom = userId;
	});
	socket.on("join-channel", async (room) => {
		socket.join(room);
		socket.room = room;
		const channel = await Channel.findById(room).populate("messages");
		if (channel.messages.length) {
			socket.emit("history", channel.messages);
		}
	});
	socket.on("sent-dm", async (obj) => {
		const message = new Message({
			user_id: obj.sender,
			message: obj.message,
			username: obj.username,
			time: new Date(),
		});
		try {
			const ifexist = await DirectMessage.findOne({
				// prettier-ignore
				"users": {$all: [
				mongoose.Types.ObjectId(obj.channel_id),
				mongoose.Types.ObjectId(obj.sender),
			]},
			});
			if (!ifexist) {
				const dm = new DirectMessage({
					users: [obj.channel_id, obj.sender],
					messages: [message._id],
				});
				await message.save();
				await dm.save();
				socket.emit("dm-join", dm);
				socket.emit("receive-dm", message);
				return;
			}
			if (ifexist._id) {
				ifexist.messages.push(message._id);
				await ifexist.save();
				await message.save();
				socket.emit("dm-join", ifexist);
				io.to(socket.dm).emit("receive-dm", message);
			}
		} catch (err) {
			console.log("inside if exist error", err);
		}
	});
	socket.on("get-dms", async (user) => {
		const dms = await DirectMessage.find({
			//prettier-ignore
			"users": mongoose.Types.ObjectId(user),
		}).populate("users");
		socket.emit("dms-list", dms);
	});
	socket.on("join-dm", async (dmId) => {
		const dm = await DirectMessage.findById(dmId)
			.populate("users")
			.populate("messages");
		socket.dm = dmId;
		socket.join(dmId);
		socket.emit("dm-history", dm);
	});
	socket.on("send-dm", async (messageObj) => {
		if (socket.dm) {
			const message = new Message({
				...messageObj,
				time: new Date(),
			});
			const dm = await DirectMessage.findById(messageObj.channel_id);
			dm.messages.push(message._id);
			await message.save();
			await dm.save();
			io.to(socket.dm).emit("receive-dm", message);
		}
	});
});
if (process.env.NODE_ENV === "production") {
	console.log("hi");
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}
server.listen(process.env.PORT || 3001, () => {
	console.log("on port 3001");
});
