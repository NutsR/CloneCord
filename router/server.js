const express = require("express");
const router = express.Router();
const Servers = require("../models/server");
const User = require("../models/user");
router.get("/channels/:id", async (req, res) => {
	const { id } = req.params;
	const server = Servers.findById(id).populate("channels");
	if (server._id) {
		res.json(server);
	}
});
router.post("/server/create", async (req, res) => {
	if (req.session.loggedIn) {
		const { serverName } = req.body;
		const server = await createServer(serverName, req.user.id);
		await User.findByIdAndUpdate(req.user.id, {
			$push: { server: server._id },
		});

		res.json({ join: "success" });
	}
});

async function createServer(serverName, userId) {
	const server = new Servers({
		server_name: serverName,
		creator: userId,
		channels: [{ name: "General" }],
		users: [userId],
	});
	await server.save();
	if (server._id) {
		return server;
	}
}

module.exports = router;
