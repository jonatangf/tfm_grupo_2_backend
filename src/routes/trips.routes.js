const express = require("express");
const tripsController = require("../controllers/trips.controller");
const reviewsController = require("../controllers/reviews.controller");
const tripsMembersController = require("../controllers/trips_members.controller");
const commentsController = require("../controllers/comments.controller");
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
const {
	tripIdParamValidation,
	createCommentValidation,
	replyCommentValidation,
	listRepliesValidation
} = require("../validations/comments.validation");

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

router.post("/:tripId/comments", authenticateToken, createCommentValidation, asyncHandler(commentsController.create));
router.get("/:tripId/comments", authenticateToken, tripIdParamValidation, asyncHandler(commentsController.list));
router.post("/:tripId/comments/:commentId/reply", authenticateToken, replyCommentValidation, asyncHandler(commentsController.reply));
router.get("/:tripId/comments/:commentId/replies", authenticateToken, listRepliesValidation, asyncHandler(commentsController.listReplies));

module.exports = router;
