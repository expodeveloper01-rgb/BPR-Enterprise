const router = require("express").Router();
const { createCheckout, handleWebhook, createCODOrder, createBankTransferOrder } = require("../controllers/checkout.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createCheckout);
router.post("/cod", protect, createCODOrder);
router.post("/bank-transfer", protect, createBankTransferOrder);
router.post("/webhook", handleWebhook);

module.exports = router;
