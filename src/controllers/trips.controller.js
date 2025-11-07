const { validationResult } = require("express-validator");
const {
	listTrips,
	getTrip,
	createTrip,
	updateTrip,
	deleteTrip
} = require("../services/trips.service");

const log = (...args) => console.log("[TripsController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const tripsController = {
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		log("List requested", { limit, offset });
		const data = await listTrips({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get requested", { id });
		const trip = await getTrip(id);
		res.json(trip);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", { creator_id: req.body.creator_id });
		const trip = await createTrip(req.body);
		res.status(201).json(trip);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update requested", { id });
		const trip = await updateTrip(id, req.body);
		res.json(trip);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete requested", { id });
		const result = await deleteTrip(id);
		res.json(result);
	}
};

module.exports = tripsController;
