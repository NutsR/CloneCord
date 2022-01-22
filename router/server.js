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

router.post("/server/leave", async (req, res) => {
	const { id, user } = req.body;
	try {
		await Servers.findByIdAndUpdate(id, {
			$pull: {
				users: user._id,
			},
		});
		await User.findByIdAndUpdate(user._id, {
			$pull: {
				server: id,
			},
		});
		res.json({ success: true });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});
router.delete("/server/delete", async (req, res) => {
	const { id } = req.body;
	try {
		await Servers.findByIdAndDelete(id);

		res.json({ success: true });
	} catch (err) {
		res.status(500).json(err);
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
	const user = await User.findById(userId).populate("server");
	if (!user.server.some((serv) => serv._id === serverId)) {
		const server = await Servers.findOneAndUpdate(
			{ _id: serverId },
			{
				$push: {
					users: userId,
				},
			}
		);
		user.server.push(server._id);
		await user.save();
		return server.populate({ path: "channels" });
	}
	return { join: "failed" };
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

router.delete("/channels/delete", async (req, res) => {
	const { id } = req.body;
	await Channel.findByIdAndDelete(id);
	res.json({ deleted: true, deleted_id: id });
});
module.exports = router;
