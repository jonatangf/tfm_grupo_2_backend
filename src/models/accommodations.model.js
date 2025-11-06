const db = require("../config/db");

const selectAll = async () => {
	const [accommodations] = await db.query("SELECT * FROM accommodations");

	return accommodations;
};

module.exports = {
	selectAll
};