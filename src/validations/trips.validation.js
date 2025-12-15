const { body, param } = require("express-validator");

const STATUS_VALUES = ["open", "closed", "finished", "cancelled"];

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
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ min: 1, max: 255 })
		.withMessage("name debe tener entre 1 y 255 caracteres"),
	body("description").optional({ checkFalsy: true }).isString().withMessage("description debe ser texto"),
	optionalIntField("destinyCountryId", "destinyCountryId debe ser un entero positivo"),
	body("destinyPlace")
		.optional()
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("destinyPlace debe tener entre 1 y 150 caracteres"),
	body("destinyImage")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ min: 1, max: 500 })
		.withMessage("destinyImage debe tener entre 1 y 500 caracteres"),
	body("itinerary").optional({ checkFalsy: true }).isString().withMessage("itinerary debe ser texto"),
	optionalIntField("meansOfTransportsId", "meansOfTransportsId debe ser un entero positivo"),
	optionalDateField("startDate"),
	optionalDateField("endDate"),
	optionalIntField("accommodationsId", "accommodationsId debe ser un entero positivo"),
	body("costPerPerson")
		.optional({ nullable: true })
		.isInt({ min: 0 })
		.withMessage("costPerPerson debe ser un entero >= 0")
		.toInt(),
	body("minParticipants")
		.optional()
		.isInt({ min: 1 })
		.withMessage("minParticipants debe ser un entero positivo")
		.toInt(),
	body("status")
		.optional()
		.isIn(STATUS_VALUES)
		.withMessage(`status debe ser uno de: ${STATUS_VALUES.join(", ")}`)
];

const createTripValidation = [
	body("destinyPlace")
		.trim()
		.isLength({ min: 1, max: 150 })
		.withMessage("destinyPlace es obligatorio (máx 150 caracteres)"),
	body("creatorId").isInt({ min: 1 }).withMessage("creatorId debe ser entero positivo").toInt(),
	body("minParticipants")
		.isInt({ min: 1 })
		.withMessage("minParticipants debe ser entero positivo")
		.toInt(),
	...baseValidations
];

const updateTripValidation = [
	param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo"),
	body("creatorId")
		.optional()
		.isInt({ min: 1 })
		.withMessage("creatorId debe ser entero positivo")
		.toInt(),
	...baseValidations
];

const idParamValidation = [param("tripId").isInt({ min: 1 }).withMessage("tripId debe ser entero positivo")];

module.exports = {
	createTripValidation,
	updateTripValidation,
	idParamValidation
};
