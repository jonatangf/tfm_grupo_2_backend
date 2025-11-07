const express = require("express");
const meansOfTransportsController = require("../controllers/means_of_transports.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createMeansOfTransportValidation,
	updateMeansOfTransportValidation,
	idParamValidation
} = require("../validations/means_of_transports.validation");

const router = express.Router();

router.get("/", asyncHandler(meansOfTransportsController.list));
router.get("/:id", idParamValidation, asyncHandler(meansOfTransportsController.get));
router.post("/", createMeansOfTransportValidation, asyncHandler(meansOfTransportsController.create));
router.put("/:id", updateMeansOfTransportValidation, asyncHandler(meansOfTransportsController.update));
router.patch("/:id", updateMeansOfTransportValidation, asyncHandler(meansOfTransportsController.update));
router.delete("/:id", idParamValidation, asyncHandler(meansOfTransportsController.remove));

module.exports = router;
