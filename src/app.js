// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api.routes");

const app = express();
app.use(express.json());
app.use(cors());

// API routes
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

module.exports = app;
