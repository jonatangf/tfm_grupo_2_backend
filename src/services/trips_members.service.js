const {
	findAll,
	findByIds,
	insert,
	update,
	remove
} = require("../models/trips_members.model");

const STATUS_VALUES = ["pending", "accepted", "rejected"];

const log = (...args) => console.log("[TripsMembersService]", ...args);

const listMembers = async ({ limit, offset }) => {
	log("Listing trip members", { limit, offset });
	const data = await findAll({ limit, offset });
	log("Trip members listed", { count: data.length });
	return data;
};

const getMember = async (usersId, tripsId) => {
	log("Fetching trip member", { usersId, tripsId });
	const member = await findByIds(usersId, tripsId);
	if (!member) {
		const err = new Error("Participación no encontrada");
		err.status = 404;
		throw err;
	}
	return member;
};

const createMember = async ({ users_id, trips_id, status = "pending" }) => {
	log("Creating trip member", { users_id, trips_id });
	if (!STATUS_VALUES.includes(status)) {
		const err = new Error("status inválido");
		err.status = 400;
		throw err;
	}
	const existing = await findByIds(users_id, trips_id);
	if (existing) {
		const err = new Error("El usuario ya está registrado en el viaje");
		err.status = 409;
		throw err;
	}
	await insert({ users_id, trips_id, status });
	log("Trip member created", { users_id, trips_id });
	return getMember(users_id, trips_id);
};

const updateMember = async (usersId, tripsId, payload) => {
	log("Updating trip member", { usersId, tripsId });
	const fields = {};
	if (payload.status !== undefined) {
		if (!STATUS_VALUES.includes(payload.status)) {
			const err = new Error("status inválido");
			err.status = 400;
			throw err;
		}
		fields.status = payload.status;
	}
	if (!Object.keys(fields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(usersId, tripsId, fields);
	if (!affected) {
		const err = new Error("Participación no encontrada o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Trip member updated", { usersId, tripsId });
	return getMember(usersId, tripsId);
};

const deleteMember = async (usersId, tripsId) => {
	log("Deleting trip member", { usersId, tripsId });
	const affected = await remove(usersId, tripsId);
	if (!affected) {
		const err = new Error("Participación no encontrada");
		err.status = 404;
		throw err;
	}
	log("Trip member deleted", { usersId, tripsId });
	return { deleted: true };
};

module.exports = {
	listMembers,
	getMember,
	createMember,
	updateMember,
	deleteMember
};
