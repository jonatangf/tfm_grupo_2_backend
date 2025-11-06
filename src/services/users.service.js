const { hashPassword } = require("../utils/passwords");
const {
	create,
	findAll,
	findByEmail,
	findById,
	update,
	removeHard
} = require("../models/users.model");

const listUsers = async ({ limit, offset }) => findAll({ limit, offset });

const getUser = async (id) => {
	const user = await findById(id);
	if (!user) {
		const err = new Error("Usuario no encontrado");
		err.status = 404;
		throw err;
	}
	return user;
};

const createUser = async ({ email, password, display_name }) => {
	const existing = await findByEmail(email);
	if (existing) {
		const err = new Error("Email ya registrado");
		err.status = 409;
		throw err;
	}
	const password_hash = await hashPassword(password);
	const id = await create({ email, password_hash, display_name });
	return { user_id: id, email, display_name, is_active: 1 };
};

const updateUser = async (id, payload) => {
	const allowed = {};
	if (payload.display_name !== undefined) allowed.display_name = payload.display_name;
	if (payload.is_active !== undefined) allowed.is_active = payload.is_active ? 1 : 0;

	if (payload.password) {
		allowed.password_hash = await hashPassword(payload.password);
	}

	const affected = await update(id, allowed);
	if (!affected) {
		const err = new Error("Usuario no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	return getUser(id);
};

const deleteUser = async (id) => {
	const affected = await removeHard(id);
	if (!affected) {
		const err = new Error("Usuario no encontrado");
		err.status = 404;
		throw err;
	}
	return { deleted: true };
};

module.exports = {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
};
