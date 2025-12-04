const {
	findAll,
	findById,
	insert,
	update,
	remove
} = require("../models/trips.model");
const {
	findParticipantIdsByTripId,
	findParticipantIdsByTripIds
} = require("../models/trips_members.model");

const log = (...args) => console.log("[TripsService]", ...args);

const pickFields = (payload, keys) => {
	const result = {};
	for (const key of keys) {
		if (payload[key] !== undefined) {
			result[key] = payload[key];
		}
	}
	return result;
};

const CREATE_FIELDS = [
	"name",
	"description",
	"destiny_country_id",
	"destiny_place",
	"destiny_image",
	"itinerary",
	"means_of_transports_id",
	"start_date",
	"end_date",
	"creator_id",
	"accommodations_id",
	"cost_per_person",
	"min_participants",
	"status"
];

const MUTABLE_FIELDS = [
	"name",
	"description",
	"destiny_country_id",
	"destiny_place",
	"destiny_image",
	"itinerary",
	"means_of_transports_id",
	"start_date",
	"end_date",
	"creator_id",
	"accommodations_id",
	"cost_per_person",
	"min_participants",
	"status"
];

const listTrips = async (filters = {}) => {
	log("Listing trips", { filters });
	const trips = await findAll(filters);

	const tripIds = trips.map(t => t.id);
	const participantsMap = await findParticipantIdsByTripIds(tripIds);
	const tripsWithParticipants = trips.map(trip => ({
		...trip,
		participants_id: participantsMap[trip.id] || []
	}));

	log("Trips listed", { count: trips.length });
	return tripsWithParticipants;
};

const getTrip = async (id) => {
	log("Fetching trip", { id });
	const trip = await findById(id);
	if (!trip) {
		const err = new Error("Viaje no encontrado");
		err.status = 404;
		throw err;
	}

	const participantsId = await findParticipantIdsByTripId(id);
	return { ...trip, participants_id: participantsId };
};

const createTrip = async (payload) => {
	log("Creating trip", { destiny_place: payload.destiny_place, creator_id: payload.creator_id });
	const fields = pickFields(payload, CREATE_FIELDS);
	if (!fields.destiny_place || !fields.creator_id || !fields.min_participants) {
		const err = new Error("destiny_place, creator_id y min_participants son obligatorios");
		err.status = 400;
		throw err;
	}
	if (!fields.status) {
		fields.status = "open";
	}
	const id = await insert(fields);
	log("Trip created", { id });
	return getTrip(id);
};

const updateTrip = async (id, payload) => {
	log("Updating trip", { id });
	const fields = pickFields(payload, MUTABLE_FIELDS);
	if (!Object.keys(fields).length) {
		const err = new Error("No hay campos para actualizar");
		err.status = 400;
		throw err;
	}
	const affected = await update(id, fields);
	if (!affected) {
		const err = new Error("Viaje no encontrado o sin cambios");
		err.status = 404;
		throw err;
	}
	log("Trip updated", { id });
	return getTrip(id);
};

const deleteTrip = async (id) => {
	log("Deleting trip", { id });
	const affected = await remove(id);
	if (!affected) {
		const err = new Error("Viaje no encontrado");
		err.status = 404;
		throw err;
	}
	log("Trip deleted", { id });
	return { deleted: true };
};

module.exports = {
	listTrips,
	getTrip,
	createTrip,
	updateTrip,
	deleteTrip
};
