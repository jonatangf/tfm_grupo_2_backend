const { body, param } = require("express-validator");

const optionalFields = () => [
	body("countries_id")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("countries_id must be a positive integer")
		.toInt(),
	body("avatar")
		.optional({ nullable: true })
		.isLength({ min: 1, max: 255 })
		.withMessage("avatar must be between 1 and 255 chars"),
	body("birthdate")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("birthdate must be a valid date")
		.toDate(),
	body("description")
		.optional({ nullable: true })
		.isString()
		.withMessage("description must be a text value"),
	body("telephone")
		.optional({ nullable: true })
		.isLength({ min: 1, max: 20 })
		.withMessage("telephone must be between 1 and 20 chars"),
	body("avg_rating")
		.optional({ nullable: true })
		.isFloat({ min: 0, max: 9.99 })
		.withMessage("avg_rating must be between 0.00 and 9.99")
		.toFloat()
];

const interestsArrayValidation = () => [
	body("interests")
		.optional()
		.isArray()
		.withMessage("interests debe ser un array de IDs de intereses"),
	body("interests.*")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Cada interest debe ser un entero positivo")
		.toInt()
];

const sharedBodyValidation = [
	body("username")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("username is required (max 50 chars)"),
	body("email").isEmail().withMessage("Invalid email").normalizeEmail()
];

const createUserValidation = [
	...sharedBodyValidation,
	body("password").isLength({ min: 8 }).withMessage("password min 8 chars"),
	...optionalFields(),
	...interestsArrayValidation()
];

const updateUserValidation = [
	param("userId").isInt({ min: 1 }),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name max 50 chars"),
	body("email").optional().isEmail().withMessage("Invalid email").normalizeEmail(),
	body("password").optional().isLength({ min: 8 }).withMessage("password min 8 chars"),
	...optionalFields(),
	...interestsArrayValidation()
];

const idParamValidation = [param("userId").isInt({ min: 1 })];

module.exports = {
	createUserValidation,
	updateUserValidation,
	idParamValidation
};
