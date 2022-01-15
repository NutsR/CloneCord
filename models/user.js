const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const { nanoid } = require("nanoid");
const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Valid Email required"],
		unique: true,
	},
	server: [{ type: String, ref: "Server" }],
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
