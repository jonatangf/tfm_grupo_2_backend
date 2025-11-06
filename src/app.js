// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const countriesRoutes = require("./routes/countries.routes");
const interestsRoutes = require("./routes/interests.routes");
const usersRoutes = require("./routes/users.routes");
const accommodationsRoutes = require("./routes/accommodations.routes");
const meansOfTransportsRoutes = require("./routes/means_of_transports.routes");
const tripsRoutes = require("./routes/trips.routes");
const messagesRoutes = require("./routes/messages.routes");
const reviewsRoutes = require("./routes/reviews.routes");

const app = express();
app.use(express.json());
app.use(cors());

// Route configuration
// Ex.
// app.use('/api', require('./routes/api.routes'));
app.use("/countries", countriesRoutes);
app.use("/interests", interestsRoutes);
app.use("/users", usersRoutes);
app.use("/accommodations", accommodationsRoutes);
app.use("/means_of_transports", meansOfTransportsRoutes);
app.use("/trips", tripsRoutes);
app.use("/messages", messagesRoutes);
app.use("/reviews", reviewsRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;