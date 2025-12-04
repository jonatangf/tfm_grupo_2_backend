const { validationResult } = require("express-validator");
const {
	listMeansOfTransports,
	getMeansOfTransport,
	createMeansOfTransport,
	updateMeansOfTransport,
	deleteMeansOfTransport
} = require("../services/means_of_transports.service");

const log = (...args) => console.log("[MeansOfTransportsController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const meansOfTransportsController = {
	list: async (req, res) => {
		log("List requested");
		const data = await listMeansOfTransports();
		res.json(data);
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get requested", { id });
		const transport = await getMeansOfTransport(id);
		res.json(transport);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", { name: req.body.name });
		const transport = await createMeansOfTransport({ name: req.body.name });
		res.status(201).json(transport);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update requested", { id });
		const transport = await updateMeansOfTransport(id, req.body);
		res.json(transport);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete requested", { id });
		const result = await deleteMeansOfTransport(id);
		res.json(result);
	}
};

module.exports = meansOfTransportsController;
