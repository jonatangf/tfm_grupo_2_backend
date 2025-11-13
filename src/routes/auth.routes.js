const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../validations/auth.validation");
const { asyncHandler } = require("../middlewares/asyncHandler");

router.post("/register", registerValidation, asyncHandler(authController.register));
router.post("/login", loginValidation, asyncHandler(authController.login));

module.exports = router;