const db = require("../config/db");

const columns = [
	"id",
	"name",
	"description",
	"destiny_country_id",
	"destiny_place",
	"destiny_image",
	"itinerary",
	"means_of_transports_id",
	"start_date",
	"end_date",
	"creator_id",
	"accommodations_id",
	"cost_per_person",
	"min_participants",
	"status",
	"created_at",
	"updated_at"
].join(", ");

const findAll = async (filters = {}) => {
	const conditions = [];
	const params = [];

	if (filters.destination) {
		conditions.push("destiny_place LIKE ?");
		params.push(`%${filters.destination}%`);
	}

	if (filters.startDate) {
		conditions.push("start_date >= ?");
		params.push(filters.startDate);
	}

	if (filters.endDate) {
		conditions.push("end_date <= ?");
		params.push(filters.endDate);
	}

	if (filters.price) {
		conditions.push("cost_per_person <= ?");
		params.push(filters.price);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const [rows] = await db.query(
		`SELECT ${columns}
     FROM trips
     ${whereClause}
     ORDER BY id DESC`,
		params
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM trips
     WHERE id = ?`,
		[id]
	);
	return rows[0] || null;
};

const insert = async (fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) {
		throw new Error("No fields provided to create trip");
	}
	const cols = entries.map(([key]) => key);
	const values = entries.map(([, value]) => value);
	const placeholders = entries.map(() => "?").join(", ");
	const [res] = await db.query(
		`INSERT INTO trips (${cols.join(", ")}) VALUES (${placeholders})`,
		values
	);
	return res.insertId;
};

const update = async (id, fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) return 0;
	const sets = entries.map(([key]) => `${key} = ?`);
	const params = entries.map(([, value]) => value);
	params.push(id);
	const [res] = await db.query(`UPDATE trips SET ${sets.join(", ")} WHERE id = ?`, params);
	return res.affectedRows;
};

const remove = async (id) => {
	const [res] = await db.query("DELETE FROM trips WHERE id = ?", [id]);
	return res.affectedRows;
};

module.exports = {
	findAll,
	findById,
	insert,
	update,
	remove
};
