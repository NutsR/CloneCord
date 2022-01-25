const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");
const messageSchema = new Schema({
	_id: {
		type: String,
		default: () => nanoid(),
	},
	message: {
		type: String,
		required: true,
	},
	channel_id: String,
	user_id: String,
	username: String,
	time: Date,
	date: Date,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
