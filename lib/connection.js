const mongoose = require("mongoose");
const MONGO_URI = "mongodb://127.0.0.1:27017/CloneCord";
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
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
module.exports = dbConnect;
