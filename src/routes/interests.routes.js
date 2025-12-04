const express = require("express");
const interestsController = require("../controllers/interests.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	createInterestValidation,
	updateInterestValidation,
	idParamValidation,
	userIdParamValidation,
	setUserInterestsValidation
} = require("../validations/interests.validation");

const router = express.Router();

router.get("/user/:userId", authenticateToken, userIdParamValidation, asyncHandler(interestsController.getUserInterests));
router.post("/user/:userId", authenticateToken, setUserInterestsValidation, asyncHandler(interestsController.setUserInterests));

router.get("/", authenticateToken, asyncHandler(interestsController.list));
router.get("/:id", authenticateToken, idParamValidation, asyncHandler(interestsController.get));
router.post("/", authenticateToken, createInterestValidation, asyncHandler(interestsController.create));
router.put("/:id", authenticateToken, updateInterestValidation, asyncHandler(interestsController.update));
router.patch("/:id", authenticateToken, updateInterestValidation, asyncHandler(interestsController.update));
router.delete("/:id", authenticateToken, idParamValidation, asyncHandler(interestsController.remove));

module.exports = router;
