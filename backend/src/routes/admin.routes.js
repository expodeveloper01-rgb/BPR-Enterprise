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
    const { kitchen } = req.query;
    const kitchenFilter = kitchen ? `WHERE "kitchenId" = $1` : "";
    const params = kitchen ? [kitchen] : [];

    const [
      totalProductsRes,
      featuredProductsRes,
      archivedProductsRes,
      totalOrdersRes,
      recentOrdersRes,
    ] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM "Product" ${kitchenFilter}`, params),
      query(
        `SELECT COUNT(*) as count FROM "Product" ${kitchenFilter ? kitchenFilter + " AND" : "WHERE"} "isFeatured" = true`,
        params,
      ),
      query(
        `SELECT COUNT(*) as count FROM "Product" ${kitchenFilter ? kitchenFilter + " AND" : "WHERE"} "isArchived" = true`,
        params,
      ),
      // Total orders (still global or filtered by kitchen products?)
      kitchen
        ? query(
            `SELECT COUNT(DISTINCT o.id) as count FROM "Order" o
             JOIN "OrderItem" oi ON oi."orderId" = o.id
             JOIN "Product" p ON oi."productId" = p.id
             WHERE p."kitchenId" = $1`,
            params,
          )
        : query('SELECT COUNT(*) as count FROM "Order"', []),
      // Recent orders with products
      kitchen
        ? query(
            `
              SELECT DISTINCT o.id, o."userId", o."isPaid", o.phone, o.address, o."order_status", o."createdAt",
                p.id AS p_id, p.name AS p_name, p.price AS p_price
              FROM "Order" o
              LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
              LEFT JOIN "Product" p ON oi."productId" = p.id
              WHERE p."kitchenId" = $1
              ORDER BY o."createdAt" DESC
              LIMIT 50
            `,
            params,
          )
        : query(
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
    const { kitchen } = req.query;
    const kitchenFilter = kitchen ? `WHERE p."kitchenId" = $1` : "";
    const params = kitchen ? [kitchen] : [];

    const result = await query(
      `
      SELECT DISTINCT o.id, o."userId", o."isPaid", o.phone, o.address, 
        o."paymentMethod", o."referenceNumber", o."order_status", o."statusMessage", o."statusHistory",
        o."riderId", o.delivery_status,
        o."createdAt", o."updatedAt",
        u.id AS u_id, u.name AS u_name, u.email AS u_email,
        r.id AS r_id, r.name AS r_name, r.email AS r_email, r.phone AS r_phone, r.rating AS r_rating,
        oi.id AS oi_id, oi.quantity, oi."productId", oi."sizeId",
        p.id AS p_id, p.name AS p_name, p.price AS p_price,
        s.id AS s_id, s.name AS s_name,
        img.id AS img_id, img.url AS img_url
      FROM "Order" o
      LEFT JOIN "User" u ON o."userId" = u.id
      LEFT JOIN "Rider" r ON o."riderId" = r.id
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "Product" p ON oi."productId" = p.id
      LEFT JOIN "Size" s ON oi."sizeId" = s.id
      LEFT JOIN "Image" img ON img."productId" = p.id AND img."createdAt" = (
        SELECT MIN("createdAt") FROM "Image" WHERE "productId" = p.id
      )
      ${kitchenFilter}
      ORDER BY o."createdAt" DESC
    `,
      params,
    );

    const ordersMap = new Map();
    for (const row of result.rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          userId: row.userId,
          isPaid: row.isPaid,
          order_status: row.order_status,
          statusMessage: row.statusMessage || "",
          statusHistory: row.statusHistory || [],
          phone: row.phone,
          address: row.address,
          paymentMethod: row.paymentMethod,
          referenceNumber: row.referenceNumber,
          delivery_status: row.delivery_status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          recipientName: row.u_name || "Guest",
          recipientPhone: row.phone,
          city: "",
          province: "",
          zipCode: "",
          shippingFee: 0,
          user: row.u_id
            ? { id: row.u_id, name: row.u_name, email: row.u_email }
            : null,
          rider: row.r_id
            ? {
                id: row.r_id,
                name: row.r_name,
                email: row.r_email,
                phone: row.r_phone,
                rating: row.r_rating,
              }
            : null,
          itemsMap: new Map(),
        });
      }
      if (row.oi_id) {
        const order = ordersMap.get(row.id);
        if (!order.itemsMap.has(row.oi_id)) {
          order.itemsMap.set(row.oi_id, {
            id: row.oi_id,
            quantity: row.quantity,
            product: row.p_id
              ? {
                  id: row.p_id,
                  name: row.p_name,
                  price: row.p_price,
                }
              : null,
            size: row.s_id ? { id: row.s_id, name: row.s_name } : null,
            images: [],
          });
        }
        if (row.img_id && row.oi_id) {
          const item = order.itemsMap.get(row.oi_id);
          if (!item.images.find((img) => img.id === row.img_id)) {
            item.images.push({
              id: row.img_id,
              url: row.img_url,
            });
          }
        }
      }
    }

    const orders = Array.from(ordersMap.values()).map((o) => ({
      ...o,
      orderItems: Array.from(o.itemsMap.values()),
      itemsMap: undefined,
    }));
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
