const db = require("../config/db");

const selectAll = async () => {
	const [reviews] = await db.query("SELECT * FROM reviews");

	return reviews;
};

module.exports = {
	selectAll
};