const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");

const serverSchema = new Schema({
	_id: {
		type: String,
		default: () => nanoid(10),
	},
	server_name: String,
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	invite: String,
});

const Servers = mongoose.model("Server", serverSchema);
module.exports = Servers;
