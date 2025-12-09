const { validationResult } = require("express-validator");
const { createUser } = require("../services/users.service");
const { loginUser } = require("../services/auth.service");
const { sendWelcomeEmail } = require("../services/email.service");

const log = (...args) => console.log("[AuthController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const authController = {
	register: async (req, res) => {
		handleValidation(req);
		log("Register requested", { email: req.body.email });

		const userData = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			countries_id: req.body.countries_id,
			avatar: req.body.avatar,
			birthdate: req.body.birthdate,
			description: req.body.description,
			telephone: req.body.telephone
		};

		if (req.body.interests !== undefined) {
			userData.interests = req.body.interests;
		}

		const user = await createUser(userData);

		log("User registered successfully", { id: user.id });

		sendWelcomeEmail(userData.email, userData.username).catch((err) => {
			log("Failed to send welcome email", { email: userData.email, error: err.message });
		});

		res.status(201).json({
			success: true,
			userId: user.id
		});
	},

	login: async (req, res) => {
		handleValidation(req);
		const { email, password } = req.body;

		log("Login requested", { email });

		const { token, userId } = await loginUser(email, password);

		log("Login successful", { userId });
		res.json({
			token,
			userId
		});
	}
};

module.exports = authController;