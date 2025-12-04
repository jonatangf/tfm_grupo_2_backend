const { body, param } = require("express-validator");

const messageField = () =>
	body("message")
		.trim()
		.isLength({ min: 1 })
		.withMessage("message es obligatorio");

const userField = () =>
	body("users_id")
		.isInt({ min: 1 })
		.withMessage("users_id debe ser entero positivo")
		.toInt();

const tripField = () =>
	body("trips_id")
		.isInt({ min: 1 })
		.withMessage("trips_id debe ser entero positivo")
		.toInt();

const optionalParentField = () =>
	body("messages_id")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("messages_id debe ser entero positivo")
		.toInt();

const createMessageValidation = [messageField(), userField(), tripField(), optionalParentField()];

const updateMessageValidation = [
	param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo"),
	body("message")
		.optional()
		.trim()
		.isLength({ min: 1 })
		.withMessage("message debe tener al menos 1 caracter"),
	body("users_id")
		.optional()
		.isInt({ min: 1 })
		.withMessage("users_id debe ser entero positivo")
		.toInt(),
	body("trips_id")
		.optional()
		.isInt({ min: 1 })
		.withMessage("trips_id debe ser entero positivo")
		.toInt(),
	optionalParentField()
];

const idParamValidation = [param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo")];

module.exports = {
	createMessageValidation,
	updateMessageValidation,
	idParamValidation
};
