const db = require("../config/db");

const findAll = async ({ limit = 50, offset = 0 } = {}) => {
	const [rows] = await db.query(
		`SELECT user_id, email, display_name, is_active, created_at, updated_at
     FROM users
     ORDER BY user_id DESC
     LIMIT ? OFFSET ?`,
		[Number(limit), Number(offset)]
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await db.query(
		`SELECT user_id, email, display_name, is_active, created_at, updated_at
     FROM users WHERE user_id = ?`,
		[id]
	);
	return rows[0] || null;
};

const findByEmail = async (email) => {
	const [rows] = await db.query(
		`SELECT * FROM users WHERE email = ?`,
		[email]
	);
	return rows[0] || null;
};

const create = async ({ email, password_hash, display_name }) => {
	const [res] = await db.query(
		`INSERT INTO users (email, password_hash, display_name)
     VALUES (?, ?, ?)`,
		[email, password_hash, display_name]
	);
	return res.insertId;
};

const update = async (id, fields) => {
	const sets = [];
	const params = [];
	for (const [k, v] of Object.entries(fields)) {
		sets.push(`${k} = ?`);
		params.push(v);
	}
	if (!sets.length) return 0;
	params.push(id);

	const [res] = await db.query(
		`UPDATE users SET ${sets.join(", ")} WHERE user_id = ?`,
		params
	);
	return res.affectedRows;
};

const removeHard = async (id) => {
	const [res] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
	return res.affectedRows;
};

module.exports = {
	findAll,
	findById,
	findByEmail,
	create,
	update,
	removeHard
};
