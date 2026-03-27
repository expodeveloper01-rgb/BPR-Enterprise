const express = require("express");
const riderAuth = require("../middleware/rider-auth.middleware");
const {
  registerRider,
  verifyRiderEmail,
  loginRider,
  getRiderProfile,
  getPendingDeliveries,
  getRiderDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getRiderHistory,
  getDeliveryById,
} = require("../controllers/rider.controller");

const router = express.Router();

// Public routes
router.post("/register", registerRider);
router.post("/verify", verifyRiderEmail);
router.post("/login", loginRider);

// Protected routes (require rider auth)
router.get("/profile", riderAuth, getRiderProfile);
router.get("/deliveries/pending", riderAuth, getPendingDeliveries);
router.get("/deliveries/active", riderAuth, getRiderDeliveries);
router.get("/deliveries/history", riderAuth, getRiderHistory);
router.get("/deliveries/:orderId", riderAuth, getDeliveryById);
router.post("/deliveries/:orderId/accept", riderAuth, acceptDelivery);
router.patch("/deliveries/:orderId/status", riderAuth, updateDeliveryStatus);

module.exports = router;
