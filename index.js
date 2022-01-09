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
const io = new Server(server, {
	cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
global.io = io;

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
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}
app.use("/api", registerRoutes, userRoutes, serverRoutes);
io.use(userAuth);
io.on("connection", (socket) => {
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
	socket.on("sent-message", (message) => {
		if (socket.room) {
			io.to(socket.room).emit("receive-message", message);
			return;
		}
		message.user = socket.id;
		message.time = new Date().toDateString();
		io.emit("receive-message", message);
	});
	socket.on("create-join-room", (room) => {
		socket.join(room);
		socket.room = room;
	});
});
server.listen(3001, () => {
	console.log("on port 3001");
});
