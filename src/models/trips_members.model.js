const db = require("../config/db");

const columns = ["users_id", "trips_id", "status", "created_at", "updated_at"].join(", ");

const findAll = async ({ limit = 50, offset = 0 } = {}) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM trips_members
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
		[Number(limit), Number(offset)]
	);
	return rows;
};

const findByIds = async (usersId, tripsId) => {
	const [rows] = await db.query(
		`SELECT ${columns}
     FROM trips_members
     WHERE users_id = ? AND trips_id = ?`,
		[usersId, tripsId]
	);
	return rows[0] || null;
};

const findRequestsByTripId = async (tripId) => {
	const [rows] = await db.query(
		`SELECT
			tm.users_id as requestId,
			tm.users_id as userId,
			u.username as name,
			tm.status
		FROM trips_members tm
		INNER JOIN users u ON tm.users_id = u.id
		WHERE tm.trips_id = ?
		ORDER BY tm.created_at DESC`,
		[tripId]
	);
	return rows;
};

const findAcceptedMembersByTripId = async (tripId) => {
	const [rows] = await db.query(
		`SELECT
			tm.users_id as userId,
			u.username as name,
			u.email
		FROM trips_members tm
		INNER JOIN users u ON tm.users_id = u.id
		WHERE tm.trips_id = ? AND tm.status = 'accepted'
		ORDER BY tm.created_at ASC`,
		[tripId]
	);
	return rows;
};

const findByUserId = async (userId) => {
	const [rows] = await db.query(
		`SELECT
			tm.trips_id as tripId,
			t.name as tripName,
			t.destiny_place as destination,
			t.destiny_country_id as destinyCountryId,
			t.start_date as startDate,
			t.end_date as endDate,
			tm.status,
			tm.created_at as requestedAt
		FROM trips_members tm
		INNER JOIN trips t ON tm.trips_id = t.id
		WHERE tm.users_id = ?
		ORDER BY tm.created_at DESC`,
		[userId]
	);
	return rows;
};

const insert = async ({ users_id, trips_id, status = "pending" }) => {
	await db.query(
		"INSERT INTO trips_members (users_id, trips_id, status) VALUES (?, ?, ?)",
		[users_id, trips_id, status]
	);
	return { users_id, trips_id };
};

const update = async (usersId, tripsId, fields) => {
	const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
	if (!entries.length) return 0;
	const sets = entries.map(([key]) => `${key} = ?`);
	const params = entries.map(([, value]) => value);
	params.push(usersId, tripsId);
	const [res] = await db.query(
		`UPDATE trips_members SET ${sets.join(", ")} WHERE users_id = ? AND trips_id = ?`,
		params
	);
	return res.affectedRows;
};

const remove = async (usersId, tripsId) => {
	const [res] = await db.query(
		"DELETE FROM trips_members WHERE users_id = ? AND trips_id = ?",
		[usersId, tripsId]
	);
	return res.affectedRows;
};

module.exports = {
	findAll,
	findByIds,
	findRequestsByTripId,
	findAcceptedMembersByTripId,
	findByUserId,
	insert,
	update,
	remove
};
