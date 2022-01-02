const router = require("express").Router();

router.get("/user", (req, res) => {
	console.log(req.session);
	if (req.session.loggedIn) {
		res.status(200).json(req.session.loggedIn);
	} else {
		res.json({ notfound: true });
	}
});
module.exports = router;
