const {
	findAll,
	findById,
	insert,
	update,
	remove
} = require("../models/messages.model");

const log = (...args) => console.log("[MessagesService]", ...args);

const REQUIRED_FIELDS = ["message", "users_id", "trips_id"];
const MUTABLE_FIELDS = ["message", "users_id", "trips_id", "messages_id"];

const pickFields = (payload, keys) => {
	const result = {};
	for (const key of keys) {
		if (payload[key] !== undefined) {
			result[key] = payload[key];
		}
	}
	return result;
};

const listMessages = async () => {
	log("Listing messages");
	const data = await findAll();
	log("Messages listed", { count: data.length });
	return data;
};

const getMessage = async (id) => {
	log("Fetching message", { id });
	const message = await findById(id);
	if (!message) {
		const err = new Error("Mensaje no encontrado");
		err.status = 404;
		throw err;
	}
	return message;
};

const createMessage = async (payload) => {
	log("Creating message", { user: payload.users_id, trip: payload.trips_id });
	const missing = REQUIRED_FIELDS.filter((field) => payload[field] === undefined);
	if (missing.length) {
		const err = new Error(`Campos obligatorios faltantes: ${missing.join(", ")}`);
		err.status = 400;
		throw err;
	}
	const fields = pickFields(payload, [...REQUIRED_FIELDS, "messages_id"]);
	const id = await insert(fields);
	log("Message created", { id });
	return getMessage(id);
};

const updateMessage = async (id, payload) => {
	log("Updating message", { id });
	const fields = pickFields(payload, MUTABLE_FIELDS);
	if (!Object.keys(fields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(id, fields);
	if (!affected) {
		const err = new Error("Mensaje no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Message updated", { id });
	return getMessage(id);
};

const deleteMessage = async (id) => {
	log("Deleting message", { id });
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("Mensaje no encontrado");
		err.status = 404;
		throw err;
	}
	log("Message deleted", { id });
	return { deleted: true };
};

module.exports = {
	listMessages,
	getMessage,
	createMessage,
	updateMessage,
	deleteMessage
};
