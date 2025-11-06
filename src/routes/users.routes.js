const express = require("express");
const usersController = require("../controllers/users.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createUserValidation,
	updateUserValidation,
	idParamValidation
} = require("../validations/users.validation");

const router = express.Router();

router.get("/", asyncHandler(usersController.list));
router.get("/:id", idParamValidation, asyncHandler(usersController.get));
router.post("/", createUserValidation, asyncHandler(usersController.create));
router.put("/:id", updateUserValidation, asyncHandler(usersController.update));
router.patch("/:id", updateUserValidation, asyncHandler(usersController.update));
router.delete("/:id", idParamValidation, asyncHandler(usersController.remove));

module.exports = router;
