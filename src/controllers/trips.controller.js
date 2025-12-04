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
		const { destination, startDate, endDate, price } = req.query;
		const filters = {};

		if (destination) filters.destination = destination;
		if (startDate) filters.startDate = startDate;
		if (endDate) filters.endDate = endDate;
		if (price) filters.price = Number(price);

		log("List trips", { filters });
		const data = await listTrips(filters);
		const camelData = keysToCamel(data);
		res.json(camelData);
	},

	get: async (req, res) => {
		const id = Number(req.params.tripId);
		log("Get trip", { id });
		const trip = await getTrip(id);
		const camelTrip = keysToCamel(trip);
		res.json(camelTrip);
	},

	create: async (req, res) => {
		handleValidation(req);
		const snakeBody = keysToSnake(req.body);
		log("Create trip", { creator_id: snakeBody.creator_id });
		const trip = await createTrip(snakeBody);
		res.status(201).json({
			success: true,
			tripId: trip.id
		});
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.tripId);
		const snakeBody = keysToSnake(req.body);
		log("Update trip", { id });
		await updateTrip(id, snakeBody);
		res.json({ success: true });
	},

	remove: async (req, res) => {
		const id = Number(req.params.tripId);
		log("Delete trip", { id });
		await deleteTrip(id);
		res.json({ success: true });
	}
};

module.exports = tripsController;
