const db = require("../config/db");

const selectAll = async () => {
	const [trips] = await db.query("SELECT * FROM trips");

	return trips;
};

const selectById = async id => {
	const [trip] = await db.query("SELECT * FROM trips WHERE id=?", [id]);

	return trip;
};

const create = async () => {
	// return trip;
};

const updateById = async (id, trip) => {
	// return trip;
};

const deleteById = async (id) => {
	// return trip;
};

module.exports = {
	selectAll,
	selectById
};