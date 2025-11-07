const { body, param } = require("express-validator");

const STATUS_VALUES = ["pending", "accepted", "rejected"];

const usersIdParam = param("usersId")
	.isInt({ min: 1 })
	.withMessage("usersId debe ser entero positivo")
	.toInt();

const tripsIdParam = param("tripsId")
	.isInt({ min: 1 })
	.withMessage("tripsId debe ser entero positivo")
	.toInt();

const statusField = () =>
	body("status")
		.optional()
		.isIn(STATUS_VALUES)
		.withMessage(`status debe ser uno de: ${STATUS_VALUES.join(", ")}`);

const createTripMemberValidation = [
	body("users_id").isInt({ min: 1 }).withMessage("users_id debe ser entero positivo").toInt(),
	body("trips_id").isInt({ min: 1 }).withMessage("trips_id debe ser entero positivo").toInt(),
	statusField()
];

const updateTripMemberValidation = [usersIdParam, tripsIdParam, statusField()];

const idParamsValidation = [usersIdParam, tripsIdParam];

module.exports = {
	createTripMemberValidation,
	updateTripMemberValidation,
	idParamsValidation
};
