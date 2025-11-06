const { validationResult } = require("express-validator");
const {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
} = require("../services/users.service");

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const usersController = {
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		const data = await listUsers({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const id = Number(req.params.id);
		const user = await getUser(id);
		res.json(user);
	},

	create: async (req, res) => {
		handleValidation(req);
		const { email, password, display_name } = req.body;
		const user = await createUser({ email, password, display_name });
		res.status(201).json(user);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.id);
		const user = await updateUser(id, req.body);
		res.json(user);
	},

	remove: async (req, res) => {
		const id = Number(req.params.id);
		const result = await deleteUser(id);
		res.json(result);
	}
};

module.exports = usersController;
