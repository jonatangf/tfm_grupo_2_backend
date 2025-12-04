const { validationResult } = require("express-validator");
const {
	createJoinRequest,
	getTripRequests,
	acceptRequest,
	rejectRequest,
	getTripMembers,
	getUserTripRequests
} = require("../services/trips_members.service");

const log = (...args) => console.log("[TripsMembersController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const tripsMembersController = {
	createJoinRequestHandler: async (req, res) => {
		handleValidation(req);
		const userId = req.user?.userId;
		if (!userId) {
			const err = new Error("Usuario no autenticado");
			err.status = 401;
			throw err;
		}

		const tripId = Number(req.params.tripId);
		log("Create trip join request", { userId, tripId });

		const result = await createJoinRequest(userId, tripId);
		res.status(201).json(result);
	},

	listRequests: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		log("List trip join requests", { tripId });

		const requests = await getTripRequests(tripId);
		res.json(requests);
	},

	acceptRequestHandler: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		const requestId = Number(req.params.requestId);
		log("Accept trip join request", { tripId, requestId });

		const result = await acceptRequest(tripId, requestId);
		res.json(result);
	},

	rejectRequestHandler: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		const requestId = Number(req.params.requestId);
		log("Reject trip join request", { tripId, requestId });

		const result = await rejectRequest(tripId, requestId);
		res.json(result);
	},

	listMembers: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		log("List trip members", { tripId });

		const members = await getTripMembers(tripId);
		res.json(members);
	},

	listUserTripRequests: async (req, res) => {
		const userId = req.user?.userId;
		if (!userId) {
			const err = new Error("Usuario no autenticado");
			err.status = 401;
			throw err;
		}
		log("List user trip requests", { userId });

		const requests = await getUserTripRequests(userId);
		res.json(requests);
	}
};

module.exports = tripsMembersController;
