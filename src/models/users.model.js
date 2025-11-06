const db = require("../config/db");

const selectAll = async () => {
	const [users] = await db.query("SELECT * FROM users");

	return users;
};

const selectById = async id => {
	const [user] = await db.query("SELECT * FROM users WHERE id=?", [id]);

	return user;
};

const create = async () => {
	// return user;
};

const updateById = async (id, user) => {
	// return user;
};

const deleteById = async (id) => {
	// return user;
};

module.exports = {
	selectAll,
	selectById
};