const db = require("../config/db");

const columns = [
	"id",
	"message",
	"users_id",
	"trips_id",
	"messages_id",
	"created_at",
	"updated_at"
].join(", ");

const findAll = async () => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM messages
     ORDER BY id DESC`
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM messages
     WHERE id = ?`,
		[id]
	);
	return rows[0] || null;
};

const insert = async (fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) {
		throw new Error("No fields provided to create message");
	}
	const cols = entries.map(([key]) => key);
	const values = entries.map(([, value]) => value);
	const placeholders = entries.map(() => "?").join(", ");
	const [res] = await db.query(
		`INSERT INTO messages (${cols.join(", ")}) VALUES (${placeholders})`,
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
	const [res] = await db.query(`UPDATE messages SET ${sets.join(", ")} WHERE id = ?`, params);
	return res.affectedRows;
};

const remove = async (id) => {
	const [res] = await db.query("DELETE FROM messages WHERE id = ?", [id]);
	return res.affectedRows;
};

// Comments for trips (contract format)
const findCommentsByTripId = async (tripId) => {
	const [rows] = await db.query(
		`SELECT
			m.id as commentId,
			m.users_id as userId,
			u.username as user,
			m.message as title,
			m.message,
			m.messages_id as parentId
		FROM messages m
		INNER JOIN users u ON m.users_id = u.id
		WHERE m.trips_id = ? AND m.messages_id IS NULL
		ORDER BY m.created_at DESC`,
		[tripId]
	);
	return rows;
};

const findRepliesByCommentId = async (commentId) => {
	const [rows] = await db.query(
		`SELECT
			m.id as commentId,
			m.users_id as userId,
			u.username as user,
			m.message
		FROM messages m
		INNER JOIN users u ON m.users_id = u.id
		WHERE m.messages_id = ?
		ORDER BY m.created_at ASC`,
		[commentId]
	);
	return rows;
};

module.exports = {
	findAll,
	findById,
	insert,
	update,
	remove,
	findCommentsByTripId,
	findRepliesByCommentId
};
