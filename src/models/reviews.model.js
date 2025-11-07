const db = require("../config/db");

const columns = [
	"users_id",
	"trips_id",
	"reviewed_user_id",
	"review",
	"score",
	"created_at",
	"updated_at"
].join(", ");

const findAll = async ({ limit = 50, offset = 0 } = {}) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM reviews
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
		[Number(limit), Number(offset)]
	);
	return rows;
};

const findByIds = async (usersId, tripsId, reviewedUserId) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM reviews
     WHERE users_id = ? AND trips_id = ? AND reviewed_user_id = ?`,
		[usersId, tripsId, reviewedUserId]
	);
	return rows[0] || null;
};

const insert = async (fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) {
		throw new Error("No fields provided to create review");
	}
	const cols = entries.map(([key]) => key);
	const values = entries.map(([, value]) => value);
	const placeholders = entries.map(() => "?").join(", ");
	await db.query(
		`INSERT INTO reviews (${cols.join(", ")}) VALUES (${placeholders})`,
		values
	);
	return {
		users_id: fields.users_id,
		trips_id: fields.trips_id,
		reviewed_user_id: fields.reviewed_user_id
	};
};

const update = async (usersId, tripsId, reviewedUserId, fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) return 0;
	const sets = entries.map(([key]) => `${key} = ?`);
	const params = entries.map(([, value]) => value);
	params.push(usersId, tripsId, reviewedUserId);
	const [res] = await db.query(
		`UPDATE reviews
     SET ${sets.join(", ")}
     WHERE users_id = ? AND trips_id = ? AND reviewed_user_id = ?`,
		params
	);
	return res.affectedRows;
};

const remove = async (usersId, tripsId, reviewedUserId) => {
	const [res] = await db.query(
		`DELETE FROM reviews
     WHERE users_id = ? AND trips_id = ? AND reviewed_user_id = ?`,
		[usersId, tripsId, reviewedUserId]
	);
	return res.affectedRows;
};

module.exports = {
	findAll,
	findByIds,
	insert,
	update,
	remove
};
