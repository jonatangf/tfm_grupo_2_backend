const { body, param } = require("express-validator");

const nameField = () =>
	body("name")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name es obligatorio y máximo 50 caracteres");

const createInterestValidation = [nameField()];

const updateInterestValidation = [
	param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo"),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name debe tener entre 1 y 50 caracteres")
];

const idParamValidation = [param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo")];

module.exports = {
	createInterestValidation,
	updateInterestValidation,
	idParamValidation
};
