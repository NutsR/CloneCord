const Message = require("../models/message");
const User = require("../models/user");

const router = require("express").Router();

router.get("/user", async (req, res) => {
	if (req.session.loggedIn) {
		const { salt, hash, ...user } = await User.findById(req.user.id).populate({
			path: "server",
			populate: [
				{ path: "users" },
				{
					path: "channels",
					populate: {
						path: "messages",
					},
				},
			],
		});
		res.status(200).json(user._doc);
	} else {
		res.json({ notfound: true });
	}
});
module.exports = router;
