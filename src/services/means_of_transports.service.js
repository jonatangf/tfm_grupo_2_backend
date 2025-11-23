const {
	findAll,
	findById,
	findByName,
	create,
	update,
	remove
} = require("../models/means_of_transports.model");

const log = (...args) => console.log("[means_of_transports]", ...args);

const listMeansOfTransports = async () => {
	log("Listing transports");
	const data = await findAll();
	log("Transports listed", { count: data.length });
	return data;
};

const getMeansOfTransport = async (id) => {
	log("Fetching transport", { id });
	const transport = await findById(id);
	if (!transport) {
		const err = new Error("Medio de transporte no encontrado");
		err.status = 404;
		throw err;
	}
	return transport;
};

const assertUniqueName = async (name, currentId) => {
	if (!name) return;
	const existing = await findByName(name);
	if (existing && existing.id !== currentId) {
		const err = new Error("El medio de transporte ya existe");
		err.status = 409;
		throw err;
	}
};

const createMeansOfTransport = async ({ name }) => {
	log("Creating transport", { name });
	await assertUniqueName(name);
	const id = await create({ name });
	log("Transport created", { id });
	return getMeansOfTransport(id);
};

const updateMeansOfTransport = async (id, payload) => {
	log("Updating transport", { id });
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
		const err = new Error("Medio de transporte no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Transport updated", { id });
	return getMeansOfTransport(id);
};

const deleteMeansOfTransport = async (id) => {
	log("Deleting transport", { id });
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("Medio de transporte no encontrado");
		err.status = 404;
		throw err;
	}
	log("Transport deleted", { id });
	return { deleted: true };
};

module.exports = {
	listMeansOfTransports,
	getMeansOfTransport,
	createMeansOfTransport,
	updateMeansOfTransport,
	deleteMeansOfTransport
};
