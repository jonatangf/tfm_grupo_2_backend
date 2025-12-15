const { body } = require("express-validator");

const optionalFields = () => [
	body("countries_id")
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage("countries_id debe ser un entero positivo")
		.toInt(),
	body("avatar")
		.optional({ checkFalsy: true })
		.isLength({ min: 1, max: 255 })
		.withMessage("avatar debe tener entre 1 y 255 caracteres"),
	body("birthdate")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("birthdate debe ser una fecha válida")
		.toDate(),
	body("description")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("description debe ser un valor de texto"),
	body("telephone")
		.optional({ checkFalsy: true })
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
		.withMessage("username es obligatorio (máx 50 caracteres)")
		.matches(/^[a-zA-Z0-9]+$/)
		.withMessage("username debe ser alfanumérico"),	
	body("email")
		.matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("El email debe tener un formato válido")
		.normalizeEmail(),
	body("password")
		.isLength({ min: 8 })
		.withMessage("password debe tener mínimo 8 caracteres"),
	...optionalFields(),
	...interestsArrayValidation()
];

const loginValidation = [
	body("email")
		.matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("El email debe tener un formato válido")
		.normalizeEmail(),
	body("password")
		.notEmpty()
		.withMessage("password es obligatorio")
];

module.exports = {
	registerValidation,
	loginValidation
};