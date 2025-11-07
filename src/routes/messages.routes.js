const express = require("express");
const messagesController = require("../controllers/messages.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createMessageValidation,
	updateMessageValidation,
	idParamValidation
} = require("../validations/messages.validation");

const router = express.Router();

router.get("/", asyncHandler(messagesController.list));
router.get("/:id", idParamValidation, asyncHandler(messagesController.get));
router.post("/", createMessageValidation, asyncHandler(messagesController.create));
router.put("/:id", updateMessageValidation, asyncHandler(messagesController.update));
router.patch("/:id", updateMessageValidation, asyncHandler(messagesController.update));
router.delete("/:id", idParamValidation, asyncHandler(messagesController.remove));

module.exports = router;
