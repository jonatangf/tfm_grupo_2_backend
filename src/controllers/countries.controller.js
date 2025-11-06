const countriesModel = require("../models/countries.model");

// @desc      Get all countries
// @route     GET /countries
// @access    Public
exports.getAll = async (req, res, next) => {
	const countries = await countriesModel.selectAll();

	res.status(200).json(countries);
};