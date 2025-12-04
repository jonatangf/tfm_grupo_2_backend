const { param } = require("express-validator");

const joinRequestValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt()
];

const listRequestsValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt()
];

const acceptRequestValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt(),
	param("requestId").isInt({ min: 1 }).withMessage("requestId debe ser entero positivo").toInt()
];

const rejectRequestValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt(),
	param("requestId").isInt({ min: 1 }).withMessage("requestId debe ser entero positivo").toInt()
];

const listMembersValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo").toInt()
];

module.exports = {
	joinRequestValidation,
	listRequestsValidation,
	acceptRequestValidation,
	rejectRequestValidation,
	listMembersValidation
};
