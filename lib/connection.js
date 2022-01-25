const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		cached.promise = await mongoose.connect(MONGO_URI);
		mongoose.set("bufferCommands", false);
		mongoose.set("autoIndex", false);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
module.exports = dbConnect;
