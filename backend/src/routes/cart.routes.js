const router = require("express").Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:cartId", protect, updateCartItem);
router.delete("/:cartId", protect, removeFromCart);
router.delete("/", protect, clearCart);

module.exports = router;
