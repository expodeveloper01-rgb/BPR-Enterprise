const { query } = require("../utils/prisma");
const { getManilaTimeISO } = require("../utils/timezone");

// ============ CATEGORIES ============

const getCategories = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM "Category" ORDER BY name ASC',
      [],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Category" (id, name, description, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING *',
      [name, description || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Category" SET name = $1, description = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
      [name, description || null, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Category" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ SIZES ============

const getSizes = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Size" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createSize = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Size" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Size" SET name = $1, description = $2, value = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [name, description || null, name, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM "Size" WHERE id = $1 RETURNING *', [
      id,
    ]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json({ message: "Size deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ KITCHENS ============

const getKitchens = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Kitchen" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createKitchen = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Kitchen" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateKitchen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, minOrderAmount, riderCommissionRate } = req.body;

    // Validate commission rate if provided
    if (riderCommissionRate !== undefined) {
      const rate = parseFloat(riderCommissionRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        return res.status(400).json({
          message: "Rider commission rate must be between 0 and 100",
        });
      }
    }

    const result = await query(
      `UPDATE "Kitchen" 
       SET name = $1, description = $2, value = $3, "minOrderAmount" = $4, "riderCommissionRate" = $5, "updatedAt" = NOW() 
       WHERE id = $6 
       RETURNING *`,
      [
        name,
        description || null,
        name,
        minOrderAmount !== undefined ? minOrderAmount : null,
        riderCommissionRate !== undefined ? riderCommissionRate : 15,
        id,
      ],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Kitchen not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteKitchen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Kitchen" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Kitchen not found" });
    }
    res.json({ message: "Kitchen deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ CUISINES ============

const getCuisines = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Cuisine" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createCuisine = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Cuisine" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateCuisine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Cuisine" SET name = $1, description = $2, value = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [name, description || null, name, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Cuisine not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteCuisine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Cuisine" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Cuisine not found" });
    }
    res.json({ message: "Cuisine deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ ORDER CONFIRMATION ============

// Get pending confirmation orders
const getPendingConfirmationOrders = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;

    let whereClause = "WHERE o.order_status = 'pending_confirmation'";
    const params = [];

    if (kitchenId) {
      whereClause += ' AND p."kitchenId" = $1';
      params.push(kitchenId);
    }

    const result = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, 
        o."isPaid", o."createdAt", o."updatedAt",
        u.name AS "userName", u.email AS "userEmail",
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price,
          'productId', p.id,
          'kitchenId', p."kitchenId",
          'image', CASE WHEN img.id IS NOT NULL THEN json_build_object('id', img.id, 'url', img.url) ELSE NULL END
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       LEFT JOIN "Image" img ON img."productId" = p.id AND img."createdAt" = (
         SELECT MIN("createdAt") FROM "Image" WHERE "productId" = p.id
       )
       ${whereClause}
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o."isPaid", o."createdAt", o."updatedAt", u.id, u.name, u.email
       ORDER BY o."createdAt" ASC`,
      params,
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Confirm order (seller accepts)
const confirmOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { confirmationNote = "", confirmationMessage = "" } = req.body;

    // Check if order exists and is pending confirmation
    const orderCheck = await query(
      'SELECT id, order_status, "statusHistory" FROM "Order" WHERE id = $1',
      [orderId],
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderCheck.rows[0].order_status !== "pending_confirmation") {
      return res
        .status(400)
        .json({ message: "Order is not pending confirmation" });
    }

    // Add confirmation to status history
    const statusHistory = orderCheck.rows[0].statusHistory || [];
    const manilaTime = getManilaTimeISO();
    statusHistory.push({
      status: "confirmed",
      title: "Order Confirmed",
      message: confirmationMessage || "Order has been confirmed by the seller",
      timestamp: manilaTime,
    });

    // Update order status to confirmed
    const result = await query(
      `UPDATE "Order" 
       SET order_status = $1, "sellerConfirmedAt" = $2, "sellerConfirmationNote" = $3, "statusHistory" = $4, "updatedAt" = $2 
       WHERE id = $5 
       RETURNING *`,
      [
        "confirmed",
        manilaTime,
        confirmationNote,
        JSON.stringify(statusHistory),
        orderId,
      ],
    );

    res.json({
      message: "Order confirmed successfully",
      order: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// Reject order (seller declines)
const rejectOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { reason = "" } = req.body;

    // Check if order exists and is pending confirmation
    const orderCheck = await query(
      'SELECT id, order_status FROM "Order" WHERE id = $1',
      [orderId],
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderCheck.rows[0].order_status !== "pending_confirmation") {
      return res
        .status(400)
        .json({ message: "Order is not pending confirmation" });
    }

    // Update order status to rejected with reason in sellerConfirmationNote
    const result = await query(
      `UPDATE "Order" 
       SET order_status = $1, "sellerConfirmedAt" = NOW(), "sellerConfirmationNote" = $2, "updatedAt" = NOW() 
       WHERE id = $3 
       RETURNING *`,
      ["rejected", reason, orderId],
    );

    res.json({
      message: "Order rejected successfully",
      order: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
  getPendingConfirmationOrders,
  confirmOrder,
  rejectOrder,
};
