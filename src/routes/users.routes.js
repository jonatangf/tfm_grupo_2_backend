const express = require("express");
const {getAll} = require("../controllers/users.controller");

const router = express.Router();

router.route("/")
	.get(getAll);

module.exports = router;