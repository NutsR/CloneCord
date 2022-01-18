const mongoose = require("mongoose");
const { Schema } = mongoose;

const directMessageSchema = new Schema({
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const DirectMessage = mongoose.model("DM", directMessageSchema);
module.exports = DirectMessage;
