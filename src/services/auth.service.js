const jwt = require("jsonwebtoken");
const { findByEmail } = require("../models/users.model");
const { comparePassword } = require("../utils/passwords");

const log = (...args) => console.log("[AuthService]", ...args);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId, email) => {
	return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const loginUser = async (email, password) => {
	log("Login attempt", { email });

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

	log("Login successful", { userId: user.id });

	return {
		token,
		userId: user.id
	};
};

module.exports = {
	generateToken,
	loginUser
};