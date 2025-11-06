const db = require("../config/db");

const selectAll = async () => {
	const [countries] = await db.query("SELECT * FROM countries");

	return countries;
};

module.exports = {
	selectAll
};