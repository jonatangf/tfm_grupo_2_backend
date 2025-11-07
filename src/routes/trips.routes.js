const express = require("express");
const tripsController = require("../controllers/trips.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createTripValidation,
	updateTripValidation,
	idParamValidation
} = require("../validations/trips.validation");

const router = express.Router();

router.get("/", asyncHandler(tripsController.list));
router.get("/:id", idParamValidation, asyncHandler(tripsController.get));
router.post("/", createTripValidation, asyncHandler(tripsController.create));
router.put("/:id", updateTripValidation, asyncHandler(tripsController.update));
router.patch("/:id", updateTripValidation, asyncHandler(tripsController.update));
router.delete("/:id", idParamValidation, asyncHandler(tripsController.remove));

module.exports = router;
