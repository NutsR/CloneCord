const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = require("./message");
const channelSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Channel = mongoose.model("Channel", channelSchema);
channelSchema.post("findOneAndDelete", async (channel) => {
	if (channel.messages && channel.messages.length) {
		await Message.deleteMany({
			_id: {
				$in: Channel.messages,
			},
		});
	}
});
module.exports = Channel;
