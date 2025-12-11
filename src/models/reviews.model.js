const db = require("../config/db");

const columns = [
	"users_id",
	"trips_id",
	"reviewed_user_id",
	"title",
	"review",
	"score",
	"created_at",
	"updated_at"
].join(", ");

// Whitelist of allowed fields for insert and update operations
const ALLOWED_INSERT_FIELDS = ["users_id", "trips_id", "reviewed_user_id", "title", "review", "score"];
const ALLOWED_UPDATE_FIELDS = ["title", "review", "score"];

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

const findByReviewedUserId = async (reviewedUserId) => {
	const [rows] = await db.query(
		`SELECT r.score, r.title, r.review as comment, u.username as from_user, r.users_id
     FROM reviews r
     INNER JOIN users u ON r.users_id = u.id
     WHERE r.reviewed_user_id = ?
     ORDER BY r.created_at DESC`,
		[reviewedUserId]
	);
	return rows;
};

const insert = async (fields) => {
	// Filter fields to only include whitelisted ones
	const entries = Object.entries(fields)
		.filter(([key, value]) => ALLOWED_INSERT_FIELDS.includes(key) && value !== undefined);

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
	// Filter fields to only include whitelisted ones
	const entries = Object.entries(fields)
		.filter(([key, value]) => ALLOWED_UPDATE_FIELDS.includes(key) && value !== undefined);

	if (!entries.length) return 0;
	const sets = entries.map(([key]) => `${key} = ?`);
	const params = entries.map(([, value]) => value);

	sets.push("updated_at = NOW()");
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
	findByReviewedUserId,
	insert,
	update,
	remove
};
