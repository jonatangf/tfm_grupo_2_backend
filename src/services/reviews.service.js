const {
	findAll,
	findByIds,
	insert,
	update,
	remove
} = require("../models/reviews.model");

const log = (...args) => console.log("[ReviewsService]", ...args);

const REQUIRED_FIELDS = ["users_id", "trips_id", "reviewed_user_id", "review", "score"];
const MUTABLE_FIELDS = ["review", "score"];

const pickFields = (payload, keys) => {
	const result = {};
	for (const key of keys) {
		if (payload[key] !== undefined) {
			result[key] = payload[key];
		}
	}
	return result;
};

const listReviews = async ({ limit, offset }) => {
	log("Listing reviews", { limit, offset });
	const data = await findAll({ limit, offset });
	log("Reviews listed", { count: data.length });
	return data;
};

const getReview = async (usersId, tripsId, reviewedUserId) => {
	log("Fetching review", { usersId, tripsId, reviewedUserId });
	const review = await findByIds(usersId, tripsId, reviewedUserId);
	if (!review) {
		const err = new Error("Reseña no encontrada");
		err.status = 404;
		throw err;
	}
	return review;
};

const createReview = async (payload) => {
	log("Creating review", {
		users_id: payload.users_id,
		trips_id: payload.trips_id,
		reviewed_user_id: payload.reviewed_user_id
	});
	const missing = REQUIRED_FIELDS.filter((field) => payload[field] === undefined);
	if (missing.length) {
		const err = new Error(`Campos obligatorios faltantes: ${missing.join(", ")}`);
		err.status = 400;
		throw err;
	}
	const existing = await findByIds(payload.users_id, payload.trips_id, payload.reviewed_user_id);
	if (existing) {
		const err = new Error("La reseña ya existe");
		err.status = 409;
		throw err;
	}
	const fields = pickFields(payload, REQUIRED_FIELDS);
	await insert(fields);
	log("Review created", {
		users_id: payload.users_id,
		trips_id: payload.trips_id,
		reviewed_user_id: payload.reviewed_user_id
	});
	return getReview(payload.users_id, payload.trips_id, payload.reviewed_user_id);
};

const updateReview = async (usersId, tripsId, reviewedUserId, payload) => {
	log("Updating review", { usersId, tripsId, reviewedUserId });
	const fields = pickFields(payload, MUTABLE_FIELDS);
	if (!Object.keys(fields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(usersId, tripsId, reviewedUserId, fields);
	if (!affected) {
		const err = new Error("Reseña no encontrada o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Review updated", { usersId, tripsId, reviewedUserId });
	return getReview(usersId, tripsId, reviewedUserId);
};

const deleteReview = async (usersId, tripsId, reviewedUserId) => {
	log("Deleting review", { usersId, tripsId, reviewedUserId });
	const affected = await remove(usersId, tripsId, reviewedUserId);
	if (!affected) {
		const err = new Error("Reseña no encontrada");
		err.status = 404;
		throw err;
	}
	log("Review deleted", { usersId, tripsId, reviewedUserId });
	return { deleted: true };
};

module.exports = {
	listReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview
};
