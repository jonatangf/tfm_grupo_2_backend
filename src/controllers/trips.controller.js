const tripsModel = require("../models/trips.model");

// @desc      Get all trips
// @route     GET /trips
// @access    Public
exports.getAll = async (req, res, next) => {
	const trips = await tripsModel.selectAll();

	res.status(200).json(trips);
};