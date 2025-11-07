const express = require("express");
const interestsController = require("../controllers/interests.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createInterestValidation,
	updateInterestValidation,
	idParamValidation
} = require("../validations/interests.validation");

const router = express.Router();

router.get("/", asyncHandler(interestsController.list));
router.get("/:id", idParamValidation, asyncHandler(interestsController.get));
router.post("/", createInterestValidation, asyncHandler(interestsController.create));
router.put("/:id", updateInterestValidation, asyncHandler(interestsController.update));
router.patch("/:id", updateInterestValidation, asyncHandler(interestsController.update));
router.delete("/:id", idParamValidation, asyncHandler(interestsController.remove));

module.exports = router;
