const express = require("express");
const tripsController = require("../controllers/trips.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const checkTripOwnership = require("../middlewares/checkTripOwnership");
const {
	createTripValidation,
	updateTripValidation,
	idParamValidation
} = require("../validations/trips.validation");

const router = express.Router();

router.get("/", asyncHandler(tripsController.list));
router.get("/:id", idParamValidation, asyncHandler(tripsController.get));
router.post("/", createTripValidation, asyncHandler(tripsController.create));
router.put("/:id", checkTripOwnership, updateTripValidation, asyncHandler(tripsController.update));
router.patch("/:id", checkTripOwnership, updateTripValidation, asyncHandler(tripsController.update));
router.delete("/:id", checkTripOwnership, idParamValidation, asyncHandler(tripsController.remove));

module.exports = router;
