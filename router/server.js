const express = require("express");
const router = express.Router();
const Servers = require("../models/server");
const Channel = require("../models/channel");
const User = require("../models/user");
router.get("/channels/:id", async (req, res) => {
	const { id } = req.params;
	const server = Servers.findById(id).populate({
		path: "channels",
		populate: { path: "messages" },
	});
	console.log(server);
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
		await server.populate({ path: "channels" });
		res.json({ server });
	}
});
router.post("/server/join", async (req, res) => {
	if (req.session.loggedIn) {
		const { serverId } = req.body;
		const server = await joinServer(serverId, req.user.id);
		res.json({ server });
	}
});
async function createServer(serverName, userId) {
	const server = new Servers({
		server_name: serverName,
		creator: userId,
		users: [userId],
	});
	const channel = new Channel({ name: "General" });

	server.channels.push(channel);
	await channel.save();
	await server.save();
	if (server._id) {
		return server;
	}
}
async function joinServer(serverId, userId) {
	const server = await Servers.findOneAndUpdate(
		{ _id: serverId },
		{
			$push: {
				users: userId,
			},
		}
	);
	await User.findByIdAndUpdate(userId, {
		$push: { server: server._id },
	});
	return server.populate({ path: "channels" });
}

router.post("/channels/create", async (req, res) => {
	const { server_id, channel_name } = req.body;
	const server = await Servers.findById(server_id).populate({
		path: "channels",
		populate: { path: "messages" },
	});
	const channel = new Channel({ name: channel_name });
	channel.messages = [];
	server.channels.push(channel);
	await channel.save();
	await server.save();
	res.json({ server, channel });
});
module.exports = router;