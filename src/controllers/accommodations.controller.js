const accommodationsModel = require("../models/accommodations.model");

// @desc      Get all accomodations
// @route     GET /accomodations
// @access    Public
exports.getAll = async (req, res, next) => {
	const accommodations = await accommodationsModel.selectAll();

	res.status(200).json(accommodations);
};