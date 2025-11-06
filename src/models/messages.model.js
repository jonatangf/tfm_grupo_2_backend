const db = require("../config/db");

const selectAll = async () => {
	const [messages] = await db.query("SELECT * FROM messages");

	return messages;
};

const selectById = async id => {
	const [message] = await db.query("SELECT * FROM messages WHERE id=?", [id]);

	return message;
};

const create = async () => {
	// return message;
};

const updateById = async (id, message) => {
	// return message;
};

const deleteById = async (id) => {
	// return message;
};

module.exports = {
	selectAll,
	selectById
};