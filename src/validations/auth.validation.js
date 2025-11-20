const { body } = require("express-validator");

const optionalFields = () => [
	body("countries_id")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("countries_id debe ser un entero positivo")
		.toInt(),
	body("avatar")
		.optional({ nullable: true })
		.isLength({ min: 1, max: 255 })
		.withMessage("avatar debe tener entre 1 y 255 caracteres"),
	body("birthdate")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("birthdate debe ser una fecha válida")
		.toDate(),
	body("description")
		.optional({ nullable: true })
		.isString()
		.withMessage("description debe ser un valor de texto"),
	body("telephone")
		.optional({ nullable: true })
		.isLength({ min: 1, max: 20 })
		.withMessage("telephone debe tener entre 1 y 20 caracteres")
];

const interestsArrayValidation = () => [
	body("interests")
		.optional({ checkFalsy: true })
		.isArray()
		.withMessage("interests debe ser un array de IDs de intereses"),
	body("interests.*")
		.if(body("interests").exists())
		.isInt({ min: 1 })
		.withMessage("Cada interest debe ser un entero positivo")
		.toInt()
];

const registerValidation = [
	body("username")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("username es obligatorio (máx 50 caracteres)"),	
	body("email")
		.isEmail()
		.withMessage("Email inválido")
		.normalizeEmail(),
	body("password")
		.isLength({ min: 8 })
		.withMessage("password debe tener mínimo 8 caracteres"),
	...optionalFields(),
	...interestsArrayValidation()
];

const loginValidation = [
	body("email")
		.isEmail()
		.withMessage("Email inválido")
		.normalizeEmail(),
	body("password")
		.notEmpty()
		.withMessage("password es obligatorio")
];

module.exports = {
	registerValidation,
	loginValidation
};