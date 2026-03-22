const router = require("express").Router();
const { getOrders } = require("../controllers/orders.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getOrders);

module.exports = router;
