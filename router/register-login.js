const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
router.post("/register", async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registered = await User.register(user, password);
		req.login(registered, (err) => {
			if (err) next(err);
			req.session.loggedIn = { username: req.user.username, id: req.user.id };
			res.status(200).json(req.session.loggedIn);
		});
	} catch (err) {
		const errorMsg = err.name.replace("Error", "");
		res.status(500).json({ errorMsg });
	}
});
router.post("/login", passport.authenticate("local"), async (req, res) => {
	req.session.loggedIn = { username: req.user.username, id: req.user.id };
	res.status(200).json(req.session.loggedIn);
});

router.post("/logout", (req, res) => {
	if (req.user) {
		req.session.loggedIn = null;
		req.logout();
		return res.json({ success: true });
	}
});
module.exports = router;
