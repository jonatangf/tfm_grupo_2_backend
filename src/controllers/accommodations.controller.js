const { validationResult } = require("express-validator");
const {
	listAccommodations,
	getAccommodation,
	createAccommodation,
	updateAccommodation,
	deleteAccommodation
} = require("../services/accommodations.service");

const log = (...args) => console.log("[AccommodationsController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const accommodationsController = {
	list: async (req, res) => {
		log("List accommodations");
		const data = await listAccommodations();
		res.json(data);
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get accommodation", { id });
		const accommodation = await getAccommodation(id);
		res.json(accommodation);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create accommodation", { name: req.body.name });
		const accommodation = await createAccommodation({ name: req.body.name });
		res.status(201).json(accommodation);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update accommodation", { id });
		const accommodation = await updateAccommodation(id, req.body);
		res.json(accommodation);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete accommodation", { id });
		const result = await deleteAccommodation(id);
		res.json(result);
	}
};

module.exports = accommodationsController;
