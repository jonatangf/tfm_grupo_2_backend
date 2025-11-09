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
const reviewsRoutes = require("./reviews.routes");
const tripsMembersRoutes = require("./trips_members.routes");
const authenticateToken = require("../middlewares/authenticateToken");

// Public routes (no authentication required)
router.use("/auth", authRoutes);

// Protected routes (authentication required)
router.use("/countries", authenticateToken, countriesRoutes);
router.use("/interests", authenticateToken, interestsRoutes);
router.use("/users", authenticateToken, usersRoutes);
router.use("/accommodations", authenticateToken, accommodationsRoutes);
router.use("/means_of_transports", authenticateToken, meansOfTransportsRoutes);
router.use("/trips", authenticateToken, tripsRoutes);
router.use("/messages", authenticateToken, messagesRoutes);
router.use("/reviews", authenticateToken, reviewsRoutes);
router.use("/trips_members", authenticateToken, tripsMembersRoutes);

module.exports = router;