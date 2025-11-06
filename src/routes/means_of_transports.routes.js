const express = require("express");
const {getAll} = require("../controllers/means_of_transports.controller");

const router = express.Router();

router.route("/")
	.get(getAll);

module.exports = router;