const express = require("express");
const meansOfTransportsController = require("../controllers/means_of_transports.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	createMeansOfTransportValidation,
	updateMeansOfTransportValidation,
	idParamValidation
} = require("../validations/means_of_transports.validation");

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(meansOfTransportsController.list));
router.get("/:id", authenticateToken, idParamValidation, asyncHandler(meansOfTransportsController.get));
router.post("/", authenticateToken, createMeansOfTransportValidation, asyncHandler(meansOfTransportsController.create));
router.put("/:id", authenticateToken, updateMeansOfTransportValidation, asyncHandler(meansOfTransportsController.update));
router.patch("/:id", authenticateToken, updateMeansOfTransportValidation, asyncHandler(meansOfTransportsController.update));
router.delete("/:id", authenticateToken, idParamValidation, asyncHandler(meansOfTransportsController.remove));

module.exports = router;
