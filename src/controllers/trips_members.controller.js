const { validationResult } = require("express-validator");
const {
	listMembers,
	getMember,
	createMember,
	updateMember,
	deleteMember
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
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		log("List requested", { limit, offset });
		const data = await listMembers({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		log("Get requested", { usersId, tripsId });
		const member = await getMember(usersId, tripsId);
		res.json(member);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", { users_id: req.body.users_id, trips_id: req.body.trips_id });
		const member = await createMember(req.body);
		res.status(201).json(member);
	},

	update: async (req, res) => {
		handleValidation(req);
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		log("Update requested", { usersId, tripsId });
		const member = await updateMember(usersId, tripsId, req.body);
		res.json(member);
	},

	remove: async (req, res) => {
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		log("Delete requested", { usersId, tripsId });
		const result = await deleteMember(usersId, tripsId);
		res.json(result);
	}
};

module.exports = tripsMembersController;
