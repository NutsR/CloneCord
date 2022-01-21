const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");
const Channel = require("./channel");
const User = require("./user");
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
serverSchema.post("findOneAndDelete", (server) => {
	server.users.forEach(async (user) => {
		await User.findByIdAndUpdate(user, {
			$pull: {
				server: server._id,
			},
		});
	});
	server.channels.forEach(async (channel) => {
		await Channel.findByIdAndDelete(channel);
	});
});
const Servers = mongoose.model("Server", serverSchema);
module.exports = Servers;
