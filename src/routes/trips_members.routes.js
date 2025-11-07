const express = require("express");
const tripsMembersController = require("../controllers/trips_members.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createTripMemberValidation,
	updateTripMemberValidation,
	idParamsValidation
} = require("../validations/trips_members.validation");

const router = express.Router();

router.get("/", asyncHandler(tripsMembersController.list));
router.get("/:usersId/:tripsId", idParamsValidation, asyncHandler(tripsMembersController.get));
router.post("/", createTripMemberValidation, asyncHandler(tripsMembersController.create));
router.put("/:usersId/:tripsId", updateTripMemberValidation, asyncHandler(tripsMembersController.update));
router.patch("/:usersId/:tripsId", updateTripMemberValidation, asyncHandler(tripsMembersController.update));
router.delete("/:usersId/:tripsId", idParamsValidation, asyncHandler(tripsMembersController.remove));

module.exports = router;
