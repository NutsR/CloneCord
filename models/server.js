const mongoose = require("mongoose");
const { Schema } = mongoose;

const serverSchema = new Schema({
	server_name: String,
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Servers = mongoose.model("Server", serverSchema);
module.exports = Servers;
