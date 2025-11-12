const { validationResult } = require("express-validator");
const {
	listTrips,
	getTrip,
	createTrip,
	updateTrip,
	deleteTrip
} = require("../services/trips.service");
const { keysToCamel, keysToSnake } = require("../utils/caseConverter");

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
		const camelData = keysToCamel(data);
		res.json({ data: camelData, limit, offset });
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get requested", { id });
		const trip = await getTrip(id);
		const camelTrip = keysToCamel(trip);
		res.json(camelTrip);
	},

	create: async (req, res) => {
		handleValidation(req);
		const snakeBody = keysToSnake(req.body);
		log("Create requested", { creator_id: snakeBody.creator_id });
		const trip = await createTrip(snakeBody);
		res.status(201).json({
			success: true,
			tripId: trip.id
		});
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		const snakeBody = keysToSnake(req.body);
		log("Update requested", { id });
		const trip = await updateTrip(id, snakeBody);
		const camelTrip = keysToCamel(trip);
		res.json(camelTrip);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete requested", { id });
		const result = await deleteTrip(id);
		res.json(result);
	}
};

module.exports = tripsController;
