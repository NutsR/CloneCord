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
		channel.messages.push([message._id]);
		await message.save();
		await channel.save();
		io.to(socket.room).emit("receive-message", message);
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
		const channel = await Channel.findById(room).populate("messages");

		socket.emit("history", channel.messages);
	} catch (err) {
		console.log(err);
	}
};

//sent-dm socket event
const sentDm = async (socket, obj) => {
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
	}).populate("users");
	socket.emit("dms-list", dms);
};

//join-dm socket event
const joinDm = async (socket, dmId) => {
	const dm = await DirectMessage.findById(dmId)
		.populate("users")
		.populate("messages");
	socket.dm = dmId;
	socket.join(dmId);
	socket.emit("dm-history", dm);
};

//send-dm socket event
const sendDm = async (socket, messageObj) => {
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

module.exports = {
	sentMessage,
	sentDm,
	joinSelf,
	joinChannel,
	sentMessage,
	getDms,
	joinDm,
	sendDm,
};
