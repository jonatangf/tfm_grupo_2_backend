const { body, param } = require("express-validator");

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
		.withMessage("telephone debe tener entre 1 y 20 caracteres"),
	body("avg_rating")
		.optional({ nullable: true })
		.isFloat({ min: 0, max: 9.99 })
		.withMessage("avg_rating debe estar entre 0.00 y 9.99")
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
		.withMessage("username es obligatorio (máx 50 caracteres)")
		.matches(/^[a-zA-Z0-9]+$/)
		.withMessage("username debe ser alfanumérico"),
	body("email")
		.matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("El email debe tener un formato válido")
		.normalizeEmail()
];

const createUserValidation = [
	...sharedBodyValidation,
	body("password").isLength({ min: 8 }).withMessage("password debe tener mínimo 8 caracteres"),
	...optionalFields(),
	...interestsArrayValidation()
];

const updateUserValidation = [
	param("userId").isInt({ min: 1 }),
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("name debe tener máximo 50 caracteres"),
	body("email")
		.optional()
		.matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("El email debe tener un formato válido")
		.normalizeEmail(),
	body("password").optional().isLength({ min: 8 }).withMessage("password debe tener mínimo 8 caracteres"),
	...optionalFields(),
	...interestsArrayValidation()
];

const idParamValidation = [param("userId").isInt({ min: 1 })];

const avatarValidation = [
	param("userId").isInt({ min: 1 }).withMessage("userId debe ser entero positivo")
];

module.exports = {
	createUserValidation,
	updateUserValidation,
	idParamValidation,
	avatarValidation
};
