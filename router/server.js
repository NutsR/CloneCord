const express = require("express");
const router = express.Router();
const Servers = require("../models/server");
router.post("/server/create", async (req, res) => {
	if (req.session.loggedIn) {
		const { serverName } = req.body;
		const server = await createServer(serverName, req.user._id);
		if (server.id) {
			console.log("hi");
			const serverSpace = global.io.of(`${server.server_name}`);
			console.log(server.server_name);
			serverSpace.on("connection", (socket) => {
				console.log(socket.id, "this is namespaceid");
				socket.join("general");
				serverSpace.emit("receive-message", {
					message: `You joined ${server.serverName}`,
					user: "",
					name: "AdminBot",
				});
			});
		}
		res.json({ server });
	}
});

async function createServer(serverName, userId) {
	const server = new Servers({ server_name: serverName, creator: userId });
	await server.save();
	if (server.id) {
		return server;
	}
}

module.exports = router;
