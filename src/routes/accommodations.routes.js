const express = require("express");
const accommodationsController = require("../controllers/accommodations.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	createAccommodationValidation,
	updateAccommodationValidation,
	idParamValidation
} = require("../validations/accommodations.validation");

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(accommodationsController.list));
router.get("/:id", authenticateToken, idParamValidation, asyncHandler(accommodationsController.get));
router.post("/", authenticateToken, createAccommodationValidation, asyncHandler(accommodationsController.create));
router.put("/:id", authenticateToken, updateAccommodationValidation, asyncHandler(accommodationsController.update));
router.patch("/:id", authenticateToken, updateAccommodationValidation, asyncHandler(accommodationsController.update));
router.delete("/:id", authenticateToken, idParamValidation, asyncHandler(accommodationsController.remove));

module.exports = router;
