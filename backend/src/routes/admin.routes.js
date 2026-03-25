const router = require("express").Router();
const { query } = require("../utils/prisma");
const { protect, requireAdmin } = require("../middleware/auth.middleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSizes,
  createSize,
  updateSize,
  deleteSize,
  getKitchens,
  createKitchen,
  updateKitchen,
  deleteKitchen,
  getCuisines,
  createCuisine,
  updateCuisine,
  deleteCuisine,
} = require("../controllers/admin.controller");

// GET /api/v1/admin/stats
router.get("/stats", protect, requireAdmin, async (req, res, next) => {
  try {
    const [
      totalProductsRes,
      featuredProductsRes,
      archivedProductsRes,
      totalOrdersRes,
      recentOrdersRes,
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM "Product"', []),
      query(
        'SELECT COUNT(*) as count FROM "Product" WHERE "isFeatured" = true',
        [],
      ),
      query(
        'SELECT COUNT(*) as count FROM "Product" WHERE "isArchived" = true',
        [],
      ),
      query('SELECT COUNT(*) as count FROM "Order"', []),
      query(
        `
          SELECT o.id, o."userId", o."isPaid", o.phone, o.address, o."order_status", o."createdAt",
            p.id AS p_id, p.name AS p_name, p.price AS p_price
          FROM "Order" o
          LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
          LEFT JOIN "Product" p ON oi."productId" = p.id
          ORDER BY o."createdAt" DESC
          LIMIT 50
        `,
        [],
      ),
    ]);

    const totalProducts = parseInt(totalProductsRes.rows[0].count);
    const featuredProducts = parseInt(featuredProductsRes.rows[0].count);
    const archivedProducts = parseInt(archivedProductsRes.rows[0].count);
    const totalOrders = parseInt(totalOrdersRes.rows[0].count);

    // Format recent orders
    const recentOrdersMap = new Map();
    for (const row of recentOrdersRes.rows) {
      if (!recentOrdersMap.has(row.id)) {
        recentOrdersMap.set(row.id, {
          id: row.id,
          userId: row.userId,
          isPaid: row.isPaid,
          phone: row.phone,
          address: row.address,
          order_status: row.order_status,
          createdAt: row.createdAt,
          orderItems: [],
        });
      }
      if (row.p_id) {
        recentOrdersMap.get(row.id).orderItems.push({
          productId: row.p_id,
          name: row.p_name,
          price: row.p_price,
        });
      }
    }

    const recentOrders = Array.from(recentOrdersMap.values());

    res.json({
      totalProducts,
      featuredProducts,
      archivedProducts,
      totalOrders,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/orders — all orders with items
router.get("/orders", protect, requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT o.id, o."userId", o."isPaid", o.phone, o.address, o."order_status", o."createdAt",
        u.id AS u_id, u.name AS u_name, u.email AS u_email,
        p.id AS p_id, p.name AS p_name, p.price AS p_price
      FROM "Order" o
      LEFT JOIN "User" u ON o."userId" = u.id
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "Product" p ON oi."productId" = p.id
      ORDER BY o."createdAt" DESC
    `,
      [],
    );

    const ordersMap = new Map();
    for (const row of result.rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          userId: row.userId,
          isPaid: row.isPaid,
          phone: row.phone,
          address: row.address,
          order_status: row.order_status,
          createdAt: row.createdAt,
          user: row.u_id
            ? { id: row.u_id, name: row.u_name, email: row.u_email }
            : null,
          orderItems: [],
        });
      }
      if (row.p_id) {
        ordersMap.get(row.id).orderItems.push({
          productId: row.p_id,
          name: row.p_name,
          price: row.p_price,
        });
      }
    }

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/users — list all users
router.get("/users", protect, requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, "createdAt" FROM "User" ORDER BY "createdAt" DESC',
      [],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/users/:id/role — promote or demote
router.patch(
  "/users/:id/role",
  protect,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!["user", "admin"].includes(role)) {
        return res
          .status(400)
          .json({ message: "role must be 'user' or 'admin'" });
      }
      // Prevent self-demotion
      if (req.params.id === req.user.id && role !== "admin") {
        return res
          .status(400)
          .json({ message: "You cannot remove your own admin role" });
      }
      const result = await query(
        'UPDATE "User" SET role = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, name, email, role, "createdAt"',
        [role, req.params.id],
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /api/v1/admin/users/:id
router.delete("/users/:id", protect, requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }
    await query('DELETE FROM "User" WHERE id = $1', [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

// ============ CATEGORIES ============
router.get("/categories", protect, requireAdmin, getCategories);
router.post("/categories", protect, requireAdmin, createCategory);
router.put("/categories/:id", protect, requireAdmin, updateCategory);
router.delete("/categories/:id", protect, requireAdmin, deleteCategory);

// ============ SIZES ============
router.get("/sizes", protect, requireAdmin, getSizes);
router.post("/sizes", protect, requireAdmin, createSize);
router.put("/sizes/:id", protect, requireAdmin, updateSize);
router.delete("/sizes/:id", protect, requireAdmin, deleteSize);

// ============ KITCHENS ============
router.get("/kitchens", protect, requireAdmin, getKitchens);
router.post("/kitchens", protect, requireAdmin, createKitchen);
router.put("/kitchens/:id", protect, requireAdmin, updateKitchen);
router.delete("/kitchens/:id", protect, requireAdmin, deleteKitchen);

// ============ CUISINES ============
router.get("/cuisines", protect, requireAdmin, getCuisines);
router.post("/cuisines", protect, requireAdmin, createCuisine);
router.put("/cuisines/:id", protect, requireAdmin, updateCuisine);
router.delete("/cuisines/:id", protect, requireAdmin, deleteCuisine);

module.exports = router;
