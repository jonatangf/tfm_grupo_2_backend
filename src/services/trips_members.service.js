const {
	findAll,
	findByIds,
	findRequestsByTripId,
	findAcceptedMembersByTripId,
	findByUserId,
	insert,
	update,
	remove
} = require("../models/trips_members.model");
const { findById: findTripById } = require("../models/trips.model");
const { findById: findUserById } = require("../models/users.model");
const { sendTripAcceptedEmail } = require("./email.service");

const STATUS_VALUES = ["pending", "accepted", "rejected"];

const log = (...args) => console.log("[TripsMembersService]", ...args);

const listMembers = async ({ limit, offset }) => {
	log("Listing trip members", { limit, offset });
	const data = await findAll({ limit, offset });
	log("Trip members listed", { count: data.length });
	return data;
};

const getMember = async (usersId, tripsId) => {
	log("Fetching trip member", { usersId, tripsId });
	const member = await findByIds(usersId, tripsId);
	if (!member) {
		const err = new Error("Participación no encontrada");
		err.status = 404;
		throw err;
	}
	return member;
};

const createMember = async ({ users_id, trips_id, status = "pending" }) => {
	log("Creating trip member", { users_id, trips_id });
	if (!STATUS_VALUES.includes(status)) {
		const err = new Error("status inválido");
		err.status = 400;
		throw err;
	}
	const existing = await findByIds(users_id, trips_id);
	if (existing) {
		const err = new Error("El usuario ya está registrado en el viaje");
		err.status = 409;
		throw err;
	}
	await insert({ users_id, trips_id, status });
	log("Trip member created", { users_id, trips_id });
	return getMember(users_id, trips_id);
};

const updateMember = async (usersId, tripsId, payload) => {
	log("Updating trip member", { usersId, tripsId });
	const fields = {};
	if (payload.status !== undefined) {
		if (!STATUS_VALUES.includes(payload.status)) {
			const err = new Error("status inválido");
			err.status = 400;
			throw err;
		}
		fields.status = payload.status;
	}
	if (!Object.keys(fields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(usersId, tripsId, fields);
	if (!affected) {
		const err = new Error("Participación no encontrada o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Trip member updated", { usersId, tripsId });
	return getMember(usersId, tripsId);
};

const deleteMember = async (usersId, tripsId) => {
	log("Deleting trip member", { usersId, tripsId });
	const affected = await remove(usersId, tripsId);
	if (!affected) {
		const err = new Error("Participación no encontrada");
		err.status = 404;
		throw err;
	}
	log("Trip member deleted", { usersId, tripsId });
	return { deleted: true };
};

const createJoinRequest = async (userId, tripId) => {
	log("Creating join request", { userId, tripId });

	const trip = await findTripById(tripId);
	if (!trip) {
		const err = new Error("El viaje no existe");
		err.status = 404;
		throw err;
	}

	const existing = await findByIds(userId, tripId);
	if (existing) {
		if (existing.status === "accepted") {
			const err = new Error("Ya eres miembro de este viaje");
			err.status = 409;
			throw err;
		}
		if (existing.status === "pending") {
			const err = new Error("Ya tienes una solicitud pendiente para este viaje");
			err.status = 409;
			throw err;
		}
		// If rejected, allow to request again by updating the status
		if (existing.status === "rejected") {
			await update(userId, tripId, { status: "pending" });
			log("Join request recreated after rejection", { userId, tripId });
			return { success: true, requestId: userId };
		}
	}

	await insert({ users_id: userId, trips_id: tripId, status: "pending" });
	log("Join request created", { userId, tripId });

	return { success: true, requestId: userId };
};

const getTripRequests = async (tripId) => {
	log("Fetching trip requests", { tripId });
	const requests = await findRequestsByTripId(tripId);
	log("Trip requests fetched", { count: requests.length });
	return requests;
};

const formatDate = (date) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
};

const acceptRequest = async (tripId, requestId) => {
	log("Accepting request", { tripId, requestId });
	const affected = await update(requestId, tripId, { status: "accepted" });
	if (!affected) {
		const err = new Error("Solicitud no encontrada");
		err.status = 404;
		throw err;
	}
	log("Request accepted", { tripId, requestId });

	const user = await findUserById(requestId);
	const trip = await findTripById(tripId);

	if (user && trip) {
		sendTripAcceptedEmail(user.email, {
			userName: user.username,
			tripName: trip.name,
			startDate: formatDate(trip.start_date),
			endDate: formatDate(trip.end_date),
			destination: trip.destiny_place
		}).catch((err) => {
			log("Failed to send trip accepted email", { email: user.email, error: err.message });
		});
	}

	return { success: true };
};

const rejectRequest = async (tripId, requestId) => {
	log("Rejecting request", { tripId, requestId });
	const affected = await update(requestId, tripId, { status: "rejected" });
	if (!affected) {
		const err = new Error("Solicitud no encontrada");
		err.status = 404;
		throw err;
	}
	log("Request rejected", { tripId, requestId });
	return { success: true };
};

const getTripMembers = async (tripId) => {
	log("Fetching trip members", { tripId });
	const members = await findAcceptedMembersByTripId(tripId);
	log("Trip members fetched", { count: members.length });
	return members;
};

const getUserTripRequests = async (userId) => {
	log("Fetching user trip requests", { userId });
	const requests = await findByUserId(userId);
	log("User trip requests fetched", { count: requests.length });
	return requests;
};

module.exports = {
	listMembers,
	getMember,
	createMember,
	updateMember,
	deleteMember,
	createJoinRequest,
	getTripRequests,
	acceptRequest,
	rejectRequest,
	getTripMembers,
	getUserTripRequests
};
