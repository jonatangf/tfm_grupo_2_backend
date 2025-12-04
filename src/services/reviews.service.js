const {
	findAll,
	findByIds,
	findByReviewedUserId,
	insert,
	update,
	remove
} = require("../models/reviews.model");
const { findById: findTripById } = require("../models/trips.model");
const { findById: findUserById } = require("../models/users.model");

const log = (...args) => console.log("[ReviewsService]", ...args);

const REQUIRED_FIELDS = ["users_id", "trips_id", "reviewed_user_id", "title", "review", "score"];
const MUTABLE_FIELDS = ["title", "review", "score"];

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

	// Validate that trip exists
	const trip = await findTripById(payload.trips_id);
	if (!trip) {
		const err = new Error("El viaje especificado no existe");
		err.status = 404;
		throw err;
	}

	// Validate that the user creating the review exists
	const user = await findUserById(payload.users_id);
	if (!user) {
		const err = new Error("El usuario no existe");
		err.status = 404;
		throw err;
	}

	// Validate that the reviewed user exists
	const reviewedUser = await findUserById(payload.reviewed_user_id);
	if (!reviewedUser) {
		const err = new Error("El usuario a valorar no existe");
		err.status = 404;
		throw err;
	}

	// Prevent self-review
	if (payload.users_id === payload.reviewed_user_id) {
		const err = new Error("No puedes valorarte a ti mismo");
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

const getUserReviews = async (userId) => {
	log("Fetching reviews for user", { userId });
	const reviews = await findByReviewedUserId(userId);
	log("Reviews fetched", { count: reviews.length });
	return reviews;
};

module.exports = {
	listReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview,
	getUserReviews
};
