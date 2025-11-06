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
		const user = await createUser({
			name: req.body.name,
			lastname: req.body.lastname,
			email: req.body.email,
			password: req.body.password,
			countries_id: req.body.countries_id,
			photo: req.body.photo,
			birthdate: req.body.birthdate,
			description: req.body.description,
			telephone: req.body.telephone,
			avg_rating: req.body.avg_rating
		});
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
