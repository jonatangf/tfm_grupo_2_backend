const express = require("express");
const countriesController = require("../controllers/countries.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const {
	createCountryValidation,
	updateCountryValidation,
	idParamValidation
} = require("../validations/countries.validation");

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(countriesController.list));
router.get("/:id", authenticateToken, idParamValidation, asyncHandler(countriesController.get));
router.post("/", authenticateToken, createCountryValidation, asyncHandler(countriesController.create));
router.put("/:id", authenticateToken, updateCountryValidation, asyncHandler(countriesController.update));
router.patch("/:id", authenticateToken, updateCountryValidation, asyncHandler(countriesController.update));
router.delete("/:id", authenticateToken, idParamValidation, asyncHandler(countriesController.remove));

module.exports = router;
