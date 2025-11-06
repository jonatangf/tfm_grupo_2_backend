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

const pickFields = (payload, keys) => {
	const fields = {};
	for (const key of keys) {
		if (payload[key] !== undefined) {
			fields[key] = payload[key];
		}
	}
	return fields;
};

const OPTIONAL_CREATE_FIELDS = [
	"countries_id",
	"photo",
	"birthdate",
	"description",
	"telephone",
	"avg_rating"
];

const MUTABLE_FIELDS = [
	"name",
	"lastname",
	"email",
	...OPTIONAL_CREATE_FIELDS
];

const createUser = async (payload) => {
	const existing = await findByEmail(payload.email);
	if (existing) {
		const err = new Error("Email ya registrado");
		err.status = 409;
		throw err;
	}
	const hashedPassword = await hashPassword(payload.password);
	const id = await create({
		name: payload.name,
		lastname: payload.lastname,
		email: payload.email,
		password: hashedPassword,
		...pickFields(payload, OPTIONAL_CREATE_FIELDS)
	});
	return getUser(id);
};

const updateUser = async (id, payload) => {
	if (payload.email) {
		const existing = await findByEmail(payload.email);
		if (existing && existing.id !== id) {
			const err = new Error("Email ya registrado");
			err.status = 409;
			throw err;
		}
	}

	const allowed = pickFields(payload, MUTABLE_FIELDS);

	if (payload.password) {
		allowed.password = await hashPassword(payload.password);
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
