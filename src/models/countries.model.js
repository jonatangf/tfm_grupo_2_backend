const db = require("../config/db");

const columns = ["id", "name"].join(", ");

const findAll = async () => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM countries
     ORDER BY name ASC`
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM countries
     WHERE id = ?`,
		[id]
	);
	return rows[0] || null;
};

const findByName = async (name) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM countries
     WHERE name = ?`,
		[name]
	);
	return rows[0] || null;
};

const create = async ({ name }) => {
	const [res] = await db.query("INSERT INTO countries (name) VALUES (?)", [name]);
	return res.insertId;
};

const update = async (id, fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) return 0;
	const sets = entries.map(([key]) => `${key} = ?`);
	const params = entries.map(([, value]) => value);
	params.push(id);
	const [res] = await db.query(`UPDATE countries SET ${sets.join(", ")} WHERE id = ?`, params);
	return res.affectedRows;
};

const remove = async (id) => {
	const [res] = await db.query("DELETE FROM countries WHERE id = ?", [id]);
	return res.affectedRows;
};

module.exports = {
	findAll,
	findById,
	findByName,
	create,
	update,
	remove
};
