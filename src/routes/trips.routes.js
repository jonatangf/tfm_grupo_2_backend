const express = require("express");
const { getAllTrips } = require("../controllers/trips.controller");

const router = express.Router();

router.route("/")
	.get(getAllTrips);

module.exports = router;