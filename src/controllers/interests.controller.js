const { validationResult } = require("express-validator");
const {
	listInterests,
	getInterest,
	createInterest,
	updateInterest,
	deleteInterest
} = require("../services/interests.service");

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const interestsController = {
	list: async (req, res) => {
		const data = await listInterests();
		res.json(data);
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		const interest = await getInterest(id);
		res.json(interest);
	},

	create: async (req, res) => {
		handleValidation(req);
		const interest = await createInterest({ name: req.body.name });
		res.status(201).json(interest);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		const interest = await updateInterest(id, req.body);
		res.json(interest);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		const result = await deleteInterest(id);
		res.json(result);
	}
};

module.exports = interestsController;
