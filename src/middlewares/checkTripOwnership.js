const { getTrip } = require("../services/trips.service");

const log = (...args) => console.log("[CheckTripOwnership]", ...args);

/**
 * Middleware to verify that the authenticated user is the creator of the trip
 * Must be used after authenticateToken middleware
 */
const checkTripOwnership = async (req, res, next) => {
	try {
		const tripId = Number(req.params.tripId);
		const userId = req.user?.userId;

		if (!userId) {
			log("No user found in request");
			return res.status(401).json({ error: "Usuario no autenticado" });
		}

		log("Checking ownership", { tripId, userId });

		// Fetch the trip to verify ownership
		const trip = await getTrip(tripId);

		if (trip.creator_id !== userId) {
			log("Ownership denied", { tripId, userId, creatorId: trip.creator_id });
			return res.status(403).json({ 
				error: "No tienes permisos para modificar este viaje. Solo el creador puede modificarlo." 
			});
		}

		log("Ownership verified", { tripId, userId });
		next();
	} catch (error) {
		// If trip not found, let the controller handle it
		if (error.status === 404) {
			return next();
		}
		next(error);
	}
};

module.exports = checkTripOwnership;
