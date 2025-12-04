const { validationResult } = require("express-validator");
const {
	listInterests,
	getInterest,
	createInterest,
	updateInterest,
	deleteInterest,
	getUserInterests,
	setUserInterests
} = require("../services/interests.service");

const log = (...args) => console.log("[InterestsController]", ...args);

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
		log("List interests");
		const data = await listInterests();
		res.json(data);
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get interest", { id });
		const interest = await getInterest(id);
		res.json(interest);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create interest", { name: req.body.name });
		const interest = await createInterest({ name: req.body.name });
		res.status(201).json(interest);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update interest", { id });
		const interest = await updateInterest(id, req.body);
		res.json(interest);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete interest", { id });
		const result = await deleteInterest(id);
		res.json(result);
	},

	getUserInterests: async (req, res) => {
		handleValidation(req);
		const userId = Number(req.params.userId);
		log("Get user interests", { userId });
		const interests = await getUserInterests(userId);
		res.json(interests);
	},

	setUserInterests: async (req, res) => {
		handleValidation(req);
		const userId = Number(req.params.userId);
		const interests = req.body;
		log("Set user interests", { userId, count: interests.length });
		const result = await setUserInterests(userId, interests);
		res.json(result);
	}
};

module.exports = interestsController;
