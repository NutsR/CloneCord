const mongoose = require("mongoose");
const { Schema } = mongoose;

const directMessageSchema = new Schema({
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	messages: [{ type: String, ref: "Message" }],
});
directMessageSchema.virtual("message", {
	ref: "Message",
	localField: "messages",
	foreignField: "_id",
});
const DirectMessage = mongoose.model("DM", directMessageSchema);
module.exports = DirectMessage;
