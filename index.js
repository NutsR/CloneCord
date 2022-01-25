if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
// Packages
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");

// server
const app = express();
const server = http.createServer(app);
const eiows = require("eiows");
const parser = require("socket.io-msgpack-parser");
// Local Requires
const dbConnect = require("./lib/connection");
const User = require("./models/user");
const registerRoutes = require("./router/register-login");
const userRoutes = require("./router/user");
const serverRoutes = require("./router/server");

// Socket functions
const {
	sentMessage,
	joinSelf,
	joinChannel,
	getDms,
	joinDm,
	directMessage,
	sentDm,
} = require("./controller/socket.io.controller");

// IO server

const io = new Server(server, {
	wsEngine: eiows.Server,
	pingInterval: 15000,
	pingTimeout: 30000,
	cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
	perMessageDeflate: {
		threshold: 32768,
	},
	parser,
});

// Middleware and app.use //
// Session and cors //
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(
	session({
		name: "free cookies",
		secret: "needstobemoresecure",
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

//Mongoose connection //

app.use("*", async (req, res, next) => {
	await dbConnect();
	next();
});

// Passport //

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Body Parser //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api", registerRoutes, userRoutes, serverRoutes);

// IO And Socket.on Stuff //

io.on("connection", (socket) => {
	app.set("socket", socket);

	//Sent message //
	socket.on("sent-message", (data) => {
		sentMessage(socket, io, data);
	});
	// Joins self after connection
	socket.on("join-self", (userId) => {
		joinSelf(socket, userId);
	});
	// join channel
	socket.on("join-channel", (room) => {
		joinChannel(socket, room);
	});
	// received direct message
	socket.on("sent-dm", (obj) => {
		sentDm(socket, io, obj);
	});
	// get direct message history
	socket.on("get-dms", (user) => {
		getDms(socket, user);
	});
	// join direct message
	socket.on("join-dm", (dmId) => {
		joinDm(socket, dmId);
	});
	// send direct message
	socket.on("direct-message", (messageObj) => {
		directMessage(socket, io, messageObj);
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
