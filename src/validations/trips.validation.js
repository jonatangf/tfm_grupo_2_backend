const { body, param } = require("express-validator");

const STATUS_VALUES = ["open", "closed", "completed", "cancelled"];

const optionalIntField = (field, message) =>
	body(field)
		.optional({ nullable: true })
		.isInt({ min: 1 })
		.withMessage(message)
		.toInt();

const optionalDateField = (field) =>
	body(field)
		.optional({ nullable: true })
		.isISO8601()
		.withMessage(`${field} debe ser una fecha válida`)
		.toDate();

const baseValidations = [
	body("name")
		.optional({ nullable: true })
		.trim()
		.isLength({ min: 1, max: 255 })
		.withMessage("name debe tener entre 1 y 255 caracteres"),
	body("description").optional({ nullable: true }).isString().withMessage("description debe ser texto"),
	optionalIntField("destiny_country_id", "destiny_country_id debe ser un entero positivo"),
	body("destiny_place")
		.optional()
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("destiny_place debe tener entre 1 y 150 caracteres"),
	body("itinerary").optional({ nullable: true }).isString().withMessage("itinerary debe ser texto"),
	optionalIntField("means_of_transports_id", "means_of_transports_id debe ser un entero positivo"),
	optionalDateField("start_date"),
	optionalDateField("end_date"),
	optionalIntField("accommodations_id", "accommodations_id debe ser un entero positivo"),
	body("cost_per_person")
		.optional({ nullable: true })
		.isInt({ min: 0 })
		.withMessage("cost_per_person debe ser un entero >= 0")
		.toInt(),
	body("min_participants")
		.optional()
		.isInt({ min: 1 })
		.withMessage("min_participants debe ser un entero positivo")
		.toInt(),
	body("status")
		.optional()
		.isIn(STATUS_VALUES)
		.withMessage(`status debe ser uno de: ${STATUS_VALUES.join(", ")}`)
];

const createTripValidation = [
	body("destiny_place")
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("destiny_place es obligatorio (máx 150 caracteres)"),
	body("creator_id").isInt({ min: 1 }).withMessage("creator_id debe ser entero positivo").toInt(),
	body("min_participants")
		.isInt({ min: 1 })
		.withMessage("min_participants debe ser entero positivo")
		.toInt(),
	...baseValidations
];

const updateTripValidation = [
	param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo"),
	body("creator_id")
		.optional()
		.isInt({ min: 1 })
		.withMessage("creator_id debe ser entero positivo")
		.toInt(),
	...baseValidations
];

const idParamValidation = [param("id").isInt({ min: 1 }).withMessage("id debe ser entero positivo")];

module.exports = {
	createTripValidation,
	updateTripValidation,
	idParamValidation
};
