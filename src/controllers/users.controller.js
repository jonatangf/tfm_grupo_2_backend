const { validationResult } = require("express-validator");
const {
	getUser,
	updateUser
} = require("../services/users.service");

const log = (...args) => console.log("[UsersController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const usersController = {
	get: async (req, res) => {
		const id = Number(req.params.userId);
		log("Get requested", { id });
		const user = await getUser(id);
		res.json(user);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.userId);
		log("Update requested", { id });
		await updateUser(id, req.body);
		res.json({ success: true });
	},

	getScore: async (req, res) => {
		const id = Number(req.params.userId);
		log("Get score requested", { id });
		const user = await getUser(id);
		res.json({ averageScore: user.avg_rating || 0 });
	},

	updateAvatar: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.userId);
		const { avatar } = req.body;
		log("Update avatar requested", { id });
		await updateUser(id, { avatar });
		res.json({ success: true });
	}
};

module.exports = usersController;
