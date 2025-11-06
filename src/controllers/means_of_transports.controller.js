const meansOfTransportsModel = require("../models/means_of_transports.model");

// @desc      Get all accomodations
// @route     GET /accomodations
// @access    Public
exports.getAll = async (req, res, next) => {
	const meansOfTransports = await meansOfTransportsModel.selectAll();

	res.status(200).json(meansOfTransports);
};