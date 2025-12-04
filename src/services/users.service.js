const { hashPassword } = require("../utils/passwords");
const {
	create,
	findAll,
	findByEmail,
	findById,
	update,
	removeHard
} = require("../models/users.model");
const { findByIds: findInterestsByIds } = require("../models/interests.model");
const {
	findInterestsByUserIds,
	replaceUserInterests
} = require("../models/interestsUsers.model");

const log = (...args) => console.log("[UsersService]", ...args);


const attachInterestsToUsers = async (users) => {
	if (!users.length) return users;
	const userIds = users.map((user) => user.id);
	const interestsMap = await findInterestsByUserIds(userIds);
	return users.map((user) => ({
		...user,
		interests: interestsMap.get(user.id) || []
	}));
};

const listUsers = async ({ limit, offset }) => {
	log("Listing users", { limit, offset });
	const users = await findAll({ limit, offset });
	const hydrated = await attachInterestsToUsers(users);
	log("Users listed", { count: hydrated.length });
	return hydrated;
};

const getUser = async (id) => {
	log("Fetching user", { id });
	const user = await findById(id);
	if (!user) {
		const err = new Error("Usuario no encontrado");
		err.status = 404;
		throw err;
	}
	const [withInterests] = await attachInterestsToUsers([user]);
	log("User fetched", { id: user.id });
	return withInterests;
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
	"avatar",
	"birthdate",
	"description",
	"telephone",
	"avg_rating"
];

const MUTABLE_FIELDS = [
	"username",
	"email",
	...OPTIONAL_CREATE_FIELDS
];

const extractInterestIds = (payload) => {
	if (!Object.prototype.hasOwnProperty.call(payload, "interests")) {
		return null;
	}
	if (!Array.isArray(payload.interests)) {
		const err = new Error("El campo interests debe ser un array");
		err.status = 400;
		throw err;
	}
	const unique = [...new Set(payload.interests.map(Number))];
	return unique.filter(Number.isFinite);
};

const ensureInterestsExist = async (interestIds) => {
	if (!interestIds.length) return;
	const existing = await findInterestsByIds(interestIds);
	const existingSet = new Set(existing.map((interest) => interest.id));
	const missing = interestIds.filter((id) => !existingSet.has(id));
	if (missing.length) {
		const err = new Error(`Intereses no encontrados: ${missing.join(", ")}`);
		err.status = 400;
		throw err;
	}
};

const syncUserInterests = async (userId, interestIds) => {
	const safeIds = interestIds ?? [];
	log("Syncing interests", { userId, total: safeIds.length });
	await ensureInterestsExist(safeIds);
	await replaceUserInterests(userId, safeIds);
	log("Interests synced", { userId });
};

const createUser = async (payload) => {
	log("Creating user", { email: payload.email });
	const existing = await findByEmail(payload.email);
	if (existing) {
		const err = new Error("Email ya registrado");
		err.status = 409;
		throw err;
	}
	const hashedPassword = await hashPassword(payload.password);
	const interestIds = extractInterestIds(payload) ?? [];
	const id = await create({
		username: payload.username,
		email: payload.email,
		password: hashedPassword,
		...pickFields(payload, OPTIONAL_CREATE_FIELDS)
	});
	await syncUserInterests(id, interestIds);
	log("User created", { id });
	return getUser(id);
};

const updateUser = async (id, payload) => {
	log("Updating user", { id });
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
	const interestIds = extractInterestIds(payload);
	if (interestIds !== null) {
		await syncUserInterests(id, interestIds);
	}
	log("User updated", { id });
	return getUser(id);
};

const deleteUser = async (id) => {
	log("Deleting user", { id });
	const affected = await removeHard(id);
	if (!affected) {
		const err = new Error("Usuario no encontrado");
		err.status = 404;
		throw err;
	}
	log("User deleted", { id });
	return { deleted: true };
};

module.exports = {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
};
