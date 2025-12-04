const { body, param } = require("express-validator");

const nameField = () =>
	body("name")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name es obligatorio (máx 50 caracteres)");

const createAccommodationValidation = [nameField()];

const updateAccommodationValidation = [
	param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo"),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name debe tener entre 1 y 50 caracteres")
];

const idParamValidation = [param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo")];

module.exports = {
	createAccommodationValidation,
	updateAccommodationValidation,
	idParamValidation
};
