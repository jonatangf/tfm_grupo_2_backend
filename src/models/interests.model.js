const db = require("../config/db");

const selectAll = async () => {
	const [interests] = await db.query("SELECT * FROM interests");

	return interests;
};

module.exports = {
	selectAll
};