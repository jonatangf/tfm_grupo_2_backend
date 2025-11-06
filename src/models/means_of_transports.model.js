const db = require("../config/db");

const selectAll = async () => {
	const [meansOfTransports] = await db.query("SELECT * FROM means_of_transports");

	return meansOfTransports;
};

module.exports = {
	selectAll
};