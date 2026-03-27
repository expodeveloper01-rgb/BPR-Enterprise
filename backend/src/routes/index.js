const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./products.routes"));
router.use("/categories", require("./categories.routes"));
router.use("/sizes", require("./sizes.routes"));
router.use("/kitchens", require("./kitchens.routes"));
router.use("/cuisines", require("./cuisines.routes"));
router.use("/orders", require("./orders.routes"));
router.use("/checkout", require("./checkout.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/upload", require("./upload.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/rider", require("./rider.routes"));

module.exports = router;
