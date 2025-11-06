const interestsModel = require("../models/interests.model");

// @desc      Get all interests
// @route     GET /interests
// @access    Public
exports.getAll = async (req, res, next) => {
	const interests = await interestsModel.selectAll();

	res.status(200).json(interests);
};