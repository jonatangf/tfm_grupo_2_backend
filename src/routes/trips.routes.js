const express = require("express");
const tripsController = require("../controllers/trips.controller");
const reviewsController = require("../controllers/reviews.controller");
const tripsMembersController = require("../controllers/trips_members.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const checkTripOwnership = require("../middlewares/checkTripOwnership");
const {
	createTripValidation,
	updateTripValidation,
	idParamValidation
} = require("../validations/trips.validation");
const { createReviewForTripValidation } = require("../validations/reviews.validation");
const {
	joinRequestValidation,
	listRequestsValidation,
	acceptRequestValidation,
	rejectRequestValidation,
	listMembersValidation
} = require("../validations/trips_members.validation");

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(tripsController.list));
router.get("/:tripId", authenticateToken, idParamValidation, asyncHandler(tripsController.get));
router.post("/", authenticateToken, createTripValidation, asyncHandler(tripsController.create));
router.put("/:tripId", authenticateToken, checkTripOwnership, updateTripValidation, asyncHandler(tripsController.update));
router.patch("/:tripId", authenticateToken, checkTripOwnership, updateTripValidation, asyncHandler(tripsController.update));
router.delete("/:tripId", authenticateToken, checkTripOwnership, idParamValidation, asyncHandler(tripsController.remove));

router.post("/:tripId/join-request", authenticateToken, joinRequestValidation, asyncHandler(tripsMembersController.createJoinRequestHandler));
router.get("/:tripId/requests", authenticateToken, checkTripOwnership, listRequestsValidation, asyncHandler(tripsMembersController.listRequests));
router.post("/:tripId/requests/:requestId/accept", authenticateToken, checkTripOwnership, acceptRequestValidation, asyncHandler(tripsMembersController.acceptRequestHandler));
router.post("/:tripId/requests/:requestId/reject", authenticateToken, checkTripOwnership, rejectRequestValidation, asyncHandler(tripsMembersController.rejectRequestHandler));
router.get("/:tripId/members", authenticateToken, listMembersValidation, asyncHandler(tripsMembersController.listMembers));

router.post("/:tripId/reviews", authenticateToken, createReviewForTripValidation, asyncHandler(reviewsController.createForTrip));

module.exports = router;
