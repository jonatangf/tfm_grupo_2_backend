const messagesModel = require("../models/messages.model");

// @desc      Get all messages
// @route     GET /messages
// @access    Public
exports.getAll = async (req, res, next) => {
	const messages = await messagesModel.selectAll();

	res.status(200).json(messages);
};