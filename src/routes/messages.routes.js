const express = require("express");
const messagesController = require("../controllers/messages.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	createMessageValidation,
	updateMessageValidation,
	idParamValidation
} = require("../validations/messages.validation");

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(messagesController.list));
router.get("/:id", authenticateToken, idParamValidation, asyncHandler(messagesController.get));
router.post("/", authenticateToken, createMessageValidation, asyncHandler(messagesController.create));
router.put("/:id", authenticateToken, updateMessageValidation, asyncHandler(messagesController.update));
router.patch("/:id", authenticateToken, updateMessageValidation, asyncHandler(messagesController.update));
router.delete("/:id", authenticateToken, idParamValidation, asyncHandler(messagesController.remove));

module.exports = router;
