const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const countriesRoutes = require("./countries.routes");
const interestsRoutes = require("./interests.routes");
const usersRoutes = require("./users.routes");
const accommodationsRoutes = require("./accommodations.routes");
const meansOfTransportsRoutes = require("./means_of_transports.routes");
const tripsRoutes = require("./trips.routes");
const messagesRoutes = require("./messages.routes");

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/countries", countriesRoutes);
router.use("/interests", interestsRoutes);
router.use("/accommodations", accommodationsRoutes);
router.use("/means_of_transports", meansOfTransportsRoutes);
router.use("/trips", tripsRoutes);
router.use("/messages", messagesRoutes);

module.exports = router;