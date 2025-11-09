const express = require("express");
const usersController = require("../controllers/users.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	updateUserValidation,
	idParamValidation
} = require("../validations/users.validation");

const router = express.Router();

router.get("/:id/score", idParamValidation, asyncHandler(usersController.getScore));
router.get("/:id", idParamValidation, asyncHandler(usersController.get));
router.put("/:id", updateUserValidation, asyncHandler(usersController.update));
router.patch("/:id", updateUserValidation, asyncHandler(usersController.update));

module.exports = router;
