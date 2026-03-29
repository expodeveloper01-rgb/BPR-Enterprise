const { query } = require("../utils/prisma");

const getOrders = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT
        o.id AS "orderId", o."userId", o."isPaid", o.phone, o.address, o.order_status, o."statusMessage", o."statusHistory", o."delivery_status", o."riderId", o."createdAt", o."updatedAt",
        oi.id AS "oi_id", oi.quantity, oi."sizeId",
        p.id AS "p_id", p.name AS "p_name", p.price AS "p_price", p."kitchenId",
        s.id AS "s_id", s.name AS "s_name",
        r.id AS "r_id", r.name AS "r_name", r.email AS "r_email", r.phone AS "r_phone", r.rating AS "r_rating",
        img.id AS "img_id", img.url AS "img_url"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "Product" p ON oi."productId" = p.id
      LEFT JOIN "Size" s ON oi."sizeId" = s.id
      LEFT JOIN "Rider" r ON o."riderId" = r.id
      LEFT JOIN "Image" img ON img."productId" = p.id AND img."createdAt" = (
        SELECT MIN("createdAt") FROM "Image" WHERE "productId" = p.id
      )
      WHERE o."userId" = $1
      ORDER BY o."createdAt" DESC
    `,
      [req.user.id],
    );

    const ordersMap = new Map();
    for (const row of result.rows) {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          isPaid: row.isPaid,
          phone: row.phone,
          address: row.address,
          order_status: row.order_status,
          statusMessage: row.statusMessage,
          statusHistory: row.statusHistory || [],
          delivery_status: row.delivery_status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          userId: row.userId,
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
      const order = ordersMap.get(row.orderId);
      if (row.oi_id && !order.itemsMap.has(row.oi_id)) {
        order.itemsMap.set(row.oi_id, {
          id: row.oi_id,
          quantity: row.quantity,
          product: {
            id: row.p_id,
            name: row.p_name,
            price: row.p_price,
          },
          kitchenId: row.kitchenId,
          size: row.s_id
            ? {
                id: row.s_id,
                name: row.s_name,
              }
            : null,
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

    const formatted = Array.from(ordersMap.values()).map((o) => {
      // Convert timestamps to ISO format with explicit UTC 'Z' marker
      const createdAt = o.createdAt
        ? new Date(o.createdAt).toISOString()
        : null;
      const updatedAt = o.updatedAt
        ? new Date(o.updatedAt).toISOString()
        : null;

      return {
        id: o.id,
        isPaid: o.isPaid,
        phone: o.phone,
        address: o.address,
        order_status: o.order_status,
        statusMessage: o.statusMessage,
        statusHistory: Array.isArray(o.statusHistory)
          ? o.statusHistory
          : typeof o.statusHistory === "string"
            ? JSON.parse(o.statusHistory)
            : [],
        delivery_status: o.delivery_status,
        createdAt: createdAt,
        updatedAt: updatedAt,
        userId: o.userId,
        rider: o.rider,
        orderItems: Array.from(o.itemsMap.values()),
      };
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, statusMessage } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get current order to fetch statusHistory and paymentMethod
    const currentOrder = await query(
      `SELECT "statusHistory", "paymentMethod" FROM "Order" WHERE id = $1`,
      [id],
    );

    if (currentOrder.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Build new history entry
    const history = currentOrder.rows[0].statusHistory || [];
    const newEntry = {
      status: status,
      message: statusMessage || "",
      timestamp: new Date().toISOString(),
    };

    history.push(newEntry);

    // Auto-mark COD orders as paid when delivered
    const shouldMarkPaid =
      status === "delivered" && currentOrder.rows[0].paymentMethod === "cod";

    // Update order with new status and history
    const result = await query(
      `UPDATE "Order" SET "order_status" = $1, "statusMessage" = $2, "statusHistory" = $3, "isPaid" = $5, "updatedAt" = NOW() WHERE id = $4 RETURNING *`,
      [
        status,
        statusMessage || "",
        JSON.stringify(history),
        id,
        shouldMarkPaid,
      ],
    );

    res.json({
      message: "Order status updated",
      order: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, updateOrderStatus };
