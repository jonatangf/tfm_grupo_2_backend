const express = require("express");
const reviewsController = require("../controllers/reviews.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createReviewValidation,
	updateReviewValidation,
	idParamsValidation
} = require("../validations/reviews.validation");

const router = express.Router();

router.get("/", asyncHandler(reviewsController.list));
router.get("/:usersId/:tripsId/:reviewedUserId", idParamsValidation, asyncHandler(reviewsController.get));
router.post("/", createReviewValidation, asyncHandler(reviewsController.create));
router.put("/:usersId/:tripsId/:reviewedUserId", updateReviewValidation, asyncHandler(reviewsController.update));
router.patch("/:usersId/:tripsId/:reviewedUserId", updateReviewValidation, asyncHandler(reviewsController.update));
router.delete("/:usersId/:tripsId/:reviewedUserId", idParamsValidation, asyncHandler(reviewsController.remove));

module.exports = router;
