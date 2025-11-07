const express = require("express");
const countriesController = require("../controllers/countries.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const {
	createCountryValidation,
	updateCountryValidation,
	idParamValidation
} = require("../validations/countries.validation");

const router = express.Router();

router.get("/", asyncHandler(countriesController.list));
router.get("/:id", idParamValidation, asyncHandler(countriesController.get));
router.post("/", createCountryValidation, asyncHandler(countriesController.create));
router.put("/:id", updateCountryValidation, asyncHandler(countriesController.update));
router.patch("/:id", updateCountryValidation, asyncHandler(countriesController.update));
router.delete("/:id", idParamValidation, asyncHandler(countriesController.remove));

module.exports = router;
