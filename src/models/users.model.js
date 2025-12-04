const db = require("../config/db");

const userColumns = [
	"id",
	"username",
	"email",
	"countries_id",
	"avatar",
	"birthdate",
	"description",
	"telephone",
	"avg_rating",
	"created_at",
	"updated_at"
].join(", ");

const findAll = async ({ limit = 50, offset = 0 } = {}) => {
	const [rows] = await db.query(
		`SELECT ${userColumns}
     FROM users
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
		[Number(limit), Number(offset)]
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await db.query(
		`SELECT ${userColumns}
     FROM users WHERE id = ?`,
		[id]
	);
	return rows[0] || null;
};

const findByEmail = async (email) => {
	const [rows] = await db.query(`SELECT ${userColumns}, password FROM users WHERE email = ?`, [email]);
	return rows[0] || null;
};

const create = async (fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) {
		throw new Error("No fields provided to create user");
	}
	const columns = entries.map(([key]) => key);
	const values = entries.map(([, value]) => value);
	const placeholders = entries.map(() => "?").join(", ");
	const [res] = await db.query(
		`INSERT INTO users (${columns.join(", ")}) VALUES (${placeholders})`,
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

	const [res] = await db.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, params);
	return res.affectedRows;
};

const removeHard = async (id) => {
	const [res] = await db.query("DELETE FROM users WHERE id = ?", [id]);
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
