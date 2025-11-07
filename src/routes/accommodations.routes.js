const express = require("express");
const accommodationsController = require("../controllers/accommodations.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createAccommodationValidation,
	updateAccommodationValidation,
	idParamValidation
} = require("../validations/accommodations.validation");

const router = express.Router();

router.get("/", asyncHandler(accommodationsController.list));
router.get("/:id", idParamValidation, asyncHandler(accommodationsController.get));
router.post("/", createAccommodationValidation, asyncHandler(accommodationsController.create));
router.put("/:id", updateAccommodationValidation, asyncHandler(accommodationsController.update));
router.patch("/:id", updateAccommodationValidation, asyncHandler(accommodationsController.update));
router.delete("/:id", idParamValidation, asyncHandler(accommodationsController.remove));

module.exports = router;
