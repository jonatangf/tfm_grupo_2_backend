const express = require("express");
const {getAll} = require("../controllers/reviews.controller");

const router = express.Router();

router.route("/")
	.get(getAll);

module.exports = router;