const { query } = require("../utils/prisma");

const getOrders = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT
        o.id AS "orderId", o."isPaid", o.phone, o.address, o.order_status, o."userId",
        p.id AS "p_id", p.name AS "p_name", p.price AS "p_price",
        img.id AS "img_id", img.url AS "img_url",
        img."createdAt" AS "img_createdAt", img."updatedAt" AS "img_updatedAt"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "Product" p ON oi."productId" = p.id
      LEFT JOIN "Image" img ON img."productId" = p.id
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
          userId: row.userId,
          itemsMap: new Map(),
        });
      }
      const order = ordersMap.get(row.orderId);
      if (row.p_id && !order.itemsMap.has(row.p_id)) {
        order.itemsMap.set(row.p_id, {
          id: row.p_id,
          name: row.p_name,
          price: row.p_price,
          images: [],
        });
      }
      if (row.img_id && row.p_id) {
        order.itemsMap.get(row.p_id).images.push({
          id: row.img_id,
          url: row.img_url,
          createdAt: row.img_createdAt,
          updatedAt: row.img_updatedAt,
        });
      }
    }

    const formatted = Array.from(ordersMap.values()).map((o) => ({
      id: o.id,
      isPaid: o.isPaid,
      phone: o.phone,
      address: o.address,
      order_status: o.order_status,
      userId: o.userId,
      orderItems: Array.from(o.itemsMap.values()),
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders };
