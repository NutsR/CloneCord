const crypto = require("crypto");
const { InMemorySessionStore } = require("../utils/sessionStore");
const sessionStore = new InMemorySessionStore();

const randomID = () => crypto.randomBytes(8).toString("hex");
function userAuth(socket, next) {
	const sessionID = socket.handshake.auth.sessionID;
	if (sessionID) {
		const session = sessionStore.findSession(sessionID);
		if (session) {
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			return next();
		}
	}
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid Username"));
	}
	socket.sessionID = randomID();
	socket.userID = randomID();
	socket.username = username;
	console.log(socket.sessionID);
	next();
}
module.exports = { userAuth, sessionStore };
