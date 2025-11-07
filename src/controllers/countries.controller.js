const { validationResult } = require("express-validator");
const {
	listCountries,
	getCountry,
	createCountry,
	updateCountry,
	deleteCountry
} = require("../services/countries.service");

const log = (...args) => console.log("[CountriesController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const countriesController = {
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		log("List requested", { limit, offset });
		const data = await listCountries({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get requested", { id });
		const country = await getCountry(id);
		res.json(country);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", { name: req.body.name });
		const country = await createCountry({ name: req.body.name });
		res.status(201).json(country);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update requested", { id });
		const country = await updateCountry(id, req.body);
		res.json(country);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete requested", { id });
		const result = await deleteCountry(id);
		res.json(result);
	}
};

module.exports = countriesController;
