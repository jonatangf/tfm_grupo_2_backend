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

const userIdParamValidation = [param("userId").isInt({ min: 1 }).withMessage("userId debe ser entero positivo")];

const setUserInterestsValidation = [
	param("userId").isInt({ min: 1 }).withMessage("userId debe ser entero positivo"),
	body().isArray().withMessage("Body debe ser un array de intereses"),
	body("*.id")
		.isInt({ min: 1 })
		.withMessage("Cada interés debe tener un id entero positivo")
		.toInt(),
	body("*.name")
		.optional()
		.isString()
		.withMessage("name debe ser texto si se proporciona")
];

module.exports = {
	createInterestValidation,
	updateInterestValidation,
	idParamValidation,
	userIdParamValidation,
	setUserInterestsValidation
};
