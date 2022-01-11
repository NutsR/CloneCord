const mongoose = require("mongoose");
const { Schema } = mongoose;

const channelSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
