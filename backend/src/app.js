require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));

// Stripe webhook needs raw body — must be before express.json()
app.use("/api/v1/checkout/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware for /upload routes
app.use("/api/v1/upload", upload.single("file"));

// Routes
app.use("/api/v1", routes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use(errorHandler);

module.exports = app;
