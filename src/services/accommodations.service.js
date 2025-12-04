const {
	findAll,
	findById,
	findByName,
	create,
	update,
	remove
} = require("../models/accommodations.model");

const log = (...args) => console.log("[AccommodationsService]", ...args);

const listAccommodations = async () => {
	log("Listing accommodations");
	const data = await findAll();
	log("Accommodations listed", { count: data.length });
	return data;
};

const getAccommodation = async (id) => {
	log("Fetching accommodation", { id });
	const accommodation = await findById(id);
	if (!accommodation) {
		const err = new Error("Alojamiento no encontrado");
		err.status = 404;
		throw err;
	}
	return accommodation;
};

const assertUniqueName = async (name, currentId) => {
	if (!name) return;
	const existing = await findByName(name);
	if (existing && existing.id !== currentId) {
		const err = new Error("El alojamiento ya existe");
		err.status = 409;
		throw err;
	}
};

const createAccommodation = async ({ name }) => {
	log("Creating accommodation", { name });
	await assertUniqueName(name);
	const id = await create({ name });
	log("Accommodation created", { id });
	return getAccommodation(id);
};

const updateAccommodation = async (id, payload) => {
	log("Updating accommodation", { id });
	await assertUniqueName(payload.name, id);
	const allowed = {};
	if (payload.name !== undefined) {
		allowed.name = payload.name;
	}
	if (!Object.keys(allowed).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(id, allowed);
	if (!affected) {
		const err = new Error("Alojamiento no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Accommodation updated", { id });
	return getAccommodation(id);
};

const deleteAccommodation = async (id) => {
	log("Deleting accommodation", { id });
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("Alojamiento no encontrado");
		err.status = 404;
		throw err;
	}
	log("Accommodation deleted", { id });
	return { deleted: true };
};

module.exports = {
	listAccommodations,
	getAccommodation,
	createAccommodation,
	updateAccommodation,
	deleteAccommodation
};
