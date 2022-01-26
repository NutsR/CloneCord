const Channel = require("../models/channel");
const Message = require("../models/message");
const mongoose = require("mongoose");
const DirectMessage = require("../models/direct-message");

// sent-message socket event
const sentMessage = async (socket, io, data) => {
	if (socket.room) {
		const channel = await Channel.findById(data.channel_id);
		const message = new Message({
			...data,
			time: new Date(),
		});
		channel.messages.push(message._id);
		message.save((err, data) => {
			console.log(data);
			io.to(socket.room).emit("receive-message", message);
		});
		await channel.save();
		return;
	}
};
// join-self socket event
const joinSelf = (socket, userId) => {
	socket.join(userId);
	socket.selfRoom = userId;
};
// join-channel
const joinChannel = async (socket, room) => {
	socket.join(room);
	socket.room = room;
	try {
		const history = await Message.paginate(
			{ channel_id: room },
			{ page: 1, limit: 30, lean: true, sort: { time: -1 } }
		);
		if (history) {
			history.docs.reverse();
			socket.emit("history", history);
		}
	} catch (err) {
		console.log(err);
	}
};

//sent-dm socket event
const sentDm = async (socket, io, obj) => {
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
			return;
		}
	} catch (err) {
		console.log("inside if exist error", err);
	}
};

// get-dms socket event
const getDms = async (socket, user) => {
	const dms = await DirectMessage.find({
		//prettier-ignore
		"users": mongoose.Types.ObjectId(user),
	})
		.lean()
		.populate("users");
	socket.emit("dms-list", dms);
};

//join-dm socket event
const joinDm = async (socket, dmId) => {
	const dm = await DirectMessage.findById(dmId).lean().populate("message");
	socket.dm = dmId;
	socket.join(dmId);
	socket.emit("dm-history", dm.message);
};

// direct-message socket event
const directMessage = async (socket, io, messageObj) => {
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
};

const sendPaginatedHistory = async (id, page, socket) => {
	const history = await Message.paginate(
		{ channel_id: id },
		{
			page,
			limit: 30,
			sort: { time: -1 },
			lean: true,
		}
	);
	if (history) {
		history.docs.reverse();
		socket.emit("get-history", history);
	}
};
module.exports = {
	sentMessage,
	sentDm,
	joinSelf,
	joinChannel,
	sentMessage,
	getDms,
	joinDm,
	directMessage,
	sendPaginatedHistory,
};
