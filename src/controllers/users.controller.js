const usersModel = require("../models/users.model");

// @desc      Get all users
// @route     GET /users
// @access    Public
exports.getAll = async (req, res, next) => {
	const users = await usersModel.selectAll();

	res.status(200).json(users);
};