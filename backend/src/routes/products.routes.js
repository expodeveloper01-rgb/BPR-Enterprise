const router = require("express").Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/products.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, requireAdmin, createProduct);
router.patch("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
