const { validationResult } = require("express-validator");
const {
	listMessages,
	getMessage,
	createMessage,
	updateMessage,
	deleteMessage
} = require("../services/messages.service");

const log = (...args) => console.log("[MessagesController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const messagesController = {
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		log("List requested", { limit, offset });
		const data = await listMessages({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		log("Get requested", { id });
		const message = await getMessage(id);
		res.json(message);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", { user: req.body.users_id, trip: req.body.trips_id });
		const message = await createMessage(req.body);
		res.status(201).json(message);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		log("Update requested", { id });
		const message = await updateMessage(id, req.body);
		res.json(message);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		log("Delete requested", { id });
		const result = await deleteMessage(id);
		res.json(result);
	}
};

module.exports = messagesController;
