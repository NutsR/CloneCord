const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");
const mongoosePaginate = require("mongoose-paginate-v2");
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
});
messageSchema.index({ channel_id: 1 });
messageSchema.plugin(mongoosePaginate);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
