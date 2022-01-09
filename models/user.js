const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Valid Email required"],
		unique: true,
	},
	server: [{ type: Schema.Types.ObjectId, ref: "Server" }],
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
