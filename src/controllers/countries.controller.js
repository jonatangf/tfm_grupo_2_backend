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
		log("List countries");
		const data = await listCountries();
		res.json(data);
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get country", { id });
		const country = await getCountry(id);
		res.json(country);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create country", { name: req.body.name });
		const country = await createCountry({ name: req.body.name });
		res.status(201).json(country);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update country", { id });
		const country = await updateCountry(id, req.body);
		res.json(country);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete country", { id });
		const result = await deleteCountry(id);
		res.json(result);
	}
};

module.exports = countriesController;
