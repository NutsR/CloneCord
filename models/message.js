const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
	message: {
		type: String,
		required: true,
	},
	channel_id: String,
	user_id: String,
	username: String,
	time: String,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
