const { body, param } = require("express-validator");

const createUserValidation = [
	body("email").isEmail().withMessage("Invalid email"),
	body("password").isLength({ min: 8 }).withMessage("password min 8 chars"),
	body("display_name").isLength({ min: 1, max: 120 })
];

const updateUserValidation = [
	param("id").isInt({ min: 1 }),
	body("display_name").optional().isLength({ min: 1, max: 120 }),
	body("is_active").optional().isBoolean()
];

const idParamValidation = [
	param("id").isInt({ min: 1 })
];

module.exports = {
	createUserValidation,
	updateUserValidation,
	idParamValidation
};
