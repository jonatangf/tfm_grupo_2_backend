const {
	findAll,
	findById,
	findByName,
	create,
	update,
	remove
} = require("../models/interests.model");

const listInterests = async ({ limit, offset }) => findAll({ limit, offset });

const getInterest = async (id) => {
	const interest = await findById(id);
	if (!interest) {
		const err = new Error("Interés no encontrado");
		err.status = 404;
		throw err;
	}
	return interest;
};

const assertUniqueName = async (name, currentId) => {
	if (!name) return;
	const existing = await findByName(name);
	if (existing && existing.id !== currentId) {
		const err = new Error("El interés ya existe");
		err.status = 409;
		throw err;
	}
};

const createInterest = async ({ name }) => {
	await assertUniqueName(name);
	const id = await create({ name });
	return getInterest(id);
};

const updateInterest = async (id, payload) => {
	await assertUniqueName(payload.name, id);

	const allowedFields = {};
	if (payload.name !== undefined) {
		allowedFields.name = payload.name;
	}

	if (!Object.keys(allowedFields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}

	const affected = await update(id, allowedFields);
	if (!affected) {
		const err = new Error("Interés no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	return getInterest(id);
};

const deleteInterest = async (id) => {
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("Interés no encontrado");
		err.status = 404;
		throw err;
	}
	return { deleted: true };
};

module.exports = {
	listInterests,
	getInterest,
	createInterest,
	updateInterest,
	deleteInterest
};
