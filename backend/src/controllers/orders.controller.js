const { query } = require("../utils/prisma");

const getOrders = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT
        o.id AS "orderId", o."isPaid", o.phone, o.address, o.order_status, o."statusMessage", o."statusHistory", o."createdAt", o."updatedAt", o."userId",
        oi.id AS "oi_id", oi.quantity, oi."sizeId",
        p.id AS "p_id", p.name AS "p_name", p.price AS "p_price",
        s.id AS "s_id", s.name AS "s_name",
        img.id AS "img_id", img.url AS "img_url"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "Product" p ON oi."productId" = p.id
      LEFT JOIN "Size" s ON oi."sizeId" = s.id
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
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          userId: row.userId,
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

    const formatted = Array.from(ordersMap.values()).map((o) => ({
      id: o.id,
      isPaid: o.isPaid,
      phone: o.phone,
      address: o.address,
      order_status: o.order_status,
      statusMessage: o.statusMessage,
      statusHistory: o.statusHistory,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      userId: o.userId,
      orderItems: Array.from(o.itemsMap.values()),
    }));

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

    // Get current order to fetch statusHistory
    const currentOrder = await query(
      `SELECT "statusHistory" FROM "Order" WHERE id = $1`,
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

    // Update order with new status and history
    const result = await query(
      `UPDATE "Order" SET "order_status" = $1, "statusMessage" = $2, "statusHistory" = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *`,
      [status, statusMessage || "", JSON.stringify(history), id],
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
