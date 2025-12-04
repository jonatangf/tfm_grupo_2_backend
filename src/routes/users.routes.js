const express = require("express");
const usersController = require("../controllers/users.controller");
const reviewsController = require("../controllers/reviews.controller");
const tripsMembersController = require("../controllers/trips_members.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	updateUserValidation,
	idParamValidation,
	avatarValidation
} = require("../validations/users.validation");
const { getUserReviewsValidation } = require("../validations/reviews.validation");

const router = express.Router();

// Public routes
router.get("/:userId/reviews", getUserReviewsValidation, asyncHandler(reviewsController.getUserReviewsList));
router.get("/:userId/score", idParamValidation, asyncHandler(usersController.getScore));
router.get("/:userId", idParamValidation, asyncHandler(usersController.get));

// Protected routes (require authentication)
router.get("/me/trip-requests", authenticateToken, asyncHandler(tripsMembersController.listUserTripRequests));
router.put("/:userId", authenticateToken, updateUserValidation, asyncHandler(usersController.update));
router.patch("/:userId", authenticateToken, updateUserValidation, asyncHandler(usersController.update));
router.post("/:userId/avatar", authenticateToken, avatarValidation, asyncHandler(usersController.updateAvatar));

module.exports = router;
