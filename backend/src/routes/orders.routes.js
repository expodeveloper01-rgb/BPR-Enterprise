const router = require("express").Router();
const {
  getOrders,
  updateOrderStatus,
} = require("../controllers/orders.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getOrders);
router.patch("/:id", protect, updateOrderStatus);

module.exports = router;
