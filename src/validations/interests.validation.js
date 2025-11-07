const { body, param } = require("express-validator");

const nameValidation = (field = "name") =>
	body(field)
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name es obligatorio y máximo 50 caracteres");

const createInterestValidation = [nameValidation()];

const updateInterestValidation = [
	param("id").isInt({ min: 1 }),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name debe tener entre 1 y 50 caracteres")
];

const idParamValidation = [param("id").isInt({ min: 1 })];

module.exports = {
	createInterestValidation,
	updateInterestValidation,
	idParamValidation
};
