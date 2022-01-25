const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = require("./message");
const { nanoid } = require("nanoid");
const channelSchema = new Schema({
	_id: {
		type: String,
		default: () => nanoid(),
	},
	name: {
		type: String,
		required: true,
	},
	messages: [String],
});

channelSchema.post("findOneAndDelete", async (channel) => {
	if (channel && channel.messages && channel.messages.length) {
		await Message.deleteMany({
			_id: {
				$in: channel.messages,
			},
		});
	}
});
channelSchema.virtual("message", {
	ref: "Message",
	localField: "messages",
	foreignField: "_id",
});
const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
