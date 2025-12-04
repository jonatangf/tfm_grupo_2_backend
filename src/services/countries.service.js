const {
	findAll,
	findById,
	findByName,
	create,
	update,
	remove
} = require("../models/countries.model");

const log = (...args) => console.log("[CountriesService]", ...args);

const listCountries = async () => {
	log("Listing countries");
	const countries = await findAll();
	log("Countries listed", { count: countries.length });
	return countries;
};

const getCountry = async (id) => {
	log("Fetching country", { id });
	const country = await findById(id);
	if (!country) {
		const err = new Error("País no encontrado");
		err.status = 404;
		throw err;
	}
	return country;
};

const assertUniqueName = async (name, currentId) => {
	if (!name) return;
	const existing = await findByName(name);
	if (existing && existing.id !== currentId) {
		const err = new Error("El país ya existe");
		err.status = 409;
		throw err;
	}
};

const createCountry = async ({ name }) => {
	log("Creating country", { name });
	await assertUniqueName(name);
	const id = await create({ name });
	log("Country created", { id });
	return getCountry(id);
};

const updateCountry = async (id, payload) => {
	log("Updating country", { id });
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
		const err = new Error("País no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Country updated", { id });
	return getCountry(id);
};

const deleteCountry = async (id) => {
	log("Deleting country", { id });
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("País no encontrado");
		err.status = 404;
		throw err;
	}
	log("Country deleted", { id });
	return { deleted: true };
};

module.exports = {
	listCountries,
	getCountry,
	createCountry,
	updateCountry,
	deleteCountry
};
