const { body, param } = require("express-validator");

const scoreField = () =>
	body("score")
		.isInt({ min: 0, max: 10 })
		.withMessage("score debe ser un entero entre 0 y 10")
		.toInt();

const reviewField = () =>
	body("review")
		.trim()
		.isLength({ min: 1 })
		.withMessage("review es obligatorio");

const createReviewValidation = [
	body("users_id").isInt({ min: 1 }).withMessage("users_id debe ser entero positivo").toInt(),
	body("trips_id").isInt({ min: 1 }).withMessage("trips_id debe ser entero positivo").toInt(),
	body("reviewed_user_id")
		.isInt({ min: 1 })
		.withMessage("reviewed_user_id debe ser entero positivo")
		.toInt(),
	reviewField(),
	scoreField()
];

const updateReviewValidation = [
	param("usersId").isInt({ min: 1 }).withMessage("usersId debe ser entero positivo").toInt(),
	param("tripsId").isInt({ min: 1 }).withMessage("tripsId debe ser entero positivo").toInt(),
	param("reviewedUserId")
		.isInt({ min: 1 })
		.withMessage("reviewedUserId debe ser entero positivo")
		.toInt(),
	body("review")
		.optional()
		.trim()
		.isLength({ min: 1 })
		.withMessage("review debe tener al menos 1 caracter"),
	body("score")
		.optional()
		.isInt({ min: 0, max: 10 })
		.withMessage("score debe ser un entero entre 0 y 10")
		.toInt()
];

const idParamsValidation = [
	param("usersId").isInt({ min: 1 }).withMessage("usersId debe ser entero positivo").toInt(),
	param("tripsId").isInt({ min: 1 }).withMessage("tripsId debe ser entero positivo").toInt(),
	param("reviewedUserId")
		.isInt({ min: 1 })
		.withMessage("reviewedUserId debe ser entero positivo")
		.toInt()
];

module.exports = {
	createReviewValidation,
	updateReviewValidation,
	idParamsValidation
};
