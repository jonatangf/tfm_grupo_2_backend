const { body, param } = require("express-validator");

const tripIdParamValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo")
];

const createCommentValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo"),
	body("title")
		.optional()
		.isString()
		.withMessage("title debe ser texto"),
	body("message")
		.notEmpty()
		.withMessage("message es obligatorio")
		.isString()
		.withMessage("message debe ser texto")
];

const replyCommentValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo"),
	param("commentId").isInt({ min: 1 }).withMessage("commentId debe ser entero positivo"),
	body("message")
		.notEmpty()
		.withMessage("message es obligatorio")
		.isString()
		.withMessage("message debe ser texto")
];

const listRepliesValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo"),
	param("commentId").isInt({ min: 1 }).withMessage("commentId debe ser entero positivo")
];

module.exports = {
	tripIdParamValidation,
	createCommentValidation,
	replyCommentValidation,
	listRepliesValidation
};
