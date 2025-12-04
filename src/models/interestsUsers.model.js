const db = require("../config/db");

const buildInClause = (ids) => ids.map(() => "?").join(", ");

const findInterestsByUserIds = async (userIds = []) => {
	if (!userIds.length) return new Map();
	const [rows] = await db.query(
		`SELECT iu.users_id, i.id, i.name
     FROM interests_users iu
     INNER JOIN interests i ON i.id = iu.interests_id
     WHERE iu.users_id IN (${buildInClause(userIds)})
     ORDER BY iu.users_id, i.name`,
		userIds
	);
	const map = new Map();
	for (const row of rows) {
		if (!map.has(row.users_id)) {
			map.set(row.users_id, []);
		}
		map.get(row.users_id).push({ id: row.id, name: row.name });
	}
	return map;
};

const findInterestsByUserId = async (userId) => {
	const [rows] = await db.query(
		`SELECT i.id, i.name
     FROM interests_users iu
     INNER JOIN interests i ON i.id = iu.interests_id
     WHERE iu.users_id = ?
     ORDER BY i.name`,
		[userId]
	);
	return rows;
};

const findUsersByInterestIds = async (interestIds = []) => {
	if (!interestIds.length) return new Map();
	const [rows] = await db.query(
		`SELECT iu.interests_id, u.id, u.username AS name
     FROM interests_users iu
     INNER JOIN users u ON u.id = iu.users_id
     WHERE iu.interests_id IN (${buildInClause(interestIds)})
     ORDER BY iu.interests_id, u.username`,
		interestIds
	);
	const map = new Map();
	for (const row of rows) {
		if (!map.has(row.interests_id)) {
			map.set(row.interests_id, []);
		}
		map.get(row.interests_id).push({
			id: row.id,
			name: row.name			
		});
	}
	return map;
};

const replaceUserInterests = async (userId, interestIds = []) => {
	await db.query("DELETE FROM interests_users WHERE users_id = ?", [userId]);
	if (!interestIds.length) return;

	const values = interestIds.map((interestId) => [interestId, userId]);
	const placeholders = values.map(() => "(?, ?)").join(", ");
	const params = values.flat();

	await db.query(
		`INSERT INTO interests_users (interests_id, users_id) VALUES ${placeholders}`,
		params
	);
};

module.exports = {
	findInterestsByUserIds,
	findInterestsByUserId,
	findUsersByInterestIds,
	replaceUserInterests
};
