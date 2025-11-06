const reviewsModel = require("../models/reviews.model");

// @desc      Get all accomodations
// @route     GET /accomodations
// @access    Public
exports.getAll = async (req, res, next) => {
	const reviews = await reviewsModel.selectAll();

	res.status(200).json(reviews);
};