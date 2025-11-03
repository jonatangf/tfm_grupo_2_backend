const db = require("../config/db");

// @desc      Get all trips
// @route     GET /viajes
// @access    Public
exports.getAllTrips = async (req, res, next) => {
	const [trips] = await db.query("SELECT * FROM trips");

	res.status(200).json(trips);
};