const router = require("express").Router();
const prisma = require("../utils/prisma");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

// GET /api/v1/admin/stats
router.get("/stats", protect, requireAdmin, async (req, res, next) => {
  try {
    const [totalProducts, featuredProducts, archivedProducts, totalOrders, recentOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isFeatured: true } }),
        prisma.product.count({ where: { isArchived: true } }),
        prisma.order.count(),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { orderItems: { include: { product: true } } },
        }),
      ]);

    res.json({ totalProducts, featuredProducts, archivedProducts, totalOrders, recentOrders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/orders — all orders with items
router.get("/orders", protect, requireAdmin, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/users — list all users
router.get("/users", protect, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/users/:id/role — promote or demote
router.patch("/users/:id/role", protect, requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'admin'" });
    }
    // Prevent self-demotion
    if (req.params.id === req.user.id && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/users/:id
router.delete("/users/:id", protect, requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
