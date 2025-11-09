const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { createUser } = require("../services/users.service");
const { findByEmail } = require("../models/users.model");
const { comparePassword } = require("../utils/passwords");

const log = (...args) => console.log("[AuthController]", ...args);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const generateToken = (userId, email) => {
	return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authController = {
	register: async (req, res) => {
		handleValidation(req);
		log("Register requested", { email: req.body.email });

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
			interests: req.body.interests
		});

		log("User registered successfully", { id: user.id });
		res.status(201).json({
			success: true,
			userId: user.id
		});
	},

	login: async (req, res) => {
		handleValidation(req);
		const { email, password } = req.body;

		log("Login requested", { email });

		const user = await findByEmail(email);
		if (!user) {
			log("Login failed - user not found", { email });
			const err = new Error("Credenciales inválidas");
			err.status = 401;
			throw err;
		}

		const isValidPassword = await comparePassword(password, user.password);
		if (!isValidPassword) {
			log("Login failed - invalid password", { email });
			const err = new Error("Credenciales inválidas");
			err.status = 401;
			throw err;
		}

		const token = generateToken(user.id, user.email);

		log("Login successful", { id: user.id });
		res.json({
			token,
			userId: user.id
		});
	}
};

module.exports = authController;