const { body, param } = require("express-validator");

const createReviewForTripValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt(),
	body("toUserId")
		.isInt({ min: 1 })
		.withMessage("toUserId debe ser entero positivo")
		.toInt(),
	body("score")
		.isInt({ min: 0, max: 10 })
		.withMessage("score debe ser un entero entre 0 y 10")
		.toInt(),
	body("title")
		.optional()
		.trim()
		.isString()
		.withMessage("title debe ser un texto"),
	body("comment")
		.trim()
		.isLength({ min: 1 })
		.withMessage("comment es obligatorio")
];

const getUserReviewsValidation = [
	param("userId").isInt({ min: 1 }).withMessage("userId debe ser entero positivo").toInt()
];

module.exports = {
	createReviewForTripValidation,
	getUserReviewsValidation
};
