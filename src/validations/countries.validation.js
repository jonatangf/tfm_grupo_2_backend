const { body, param } = require("express-validator");

const nameField = () =>
	body("name")
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("name es obligatorio (máx 150 caracteres)");

const createCountryValidation = [nameField()];

const updateCountryValidation = [
	param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo"),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("name debe tener entre 1 y 150 caracteres")
];

const idParamValidation = [param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo")];

module.exports = {
	createCountryValidation,
	updateCountryValidation,
	idParamValidation
};
