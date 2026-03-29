const { query } = require("../utils/prisma");

// Get user's cart with product details and size
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT DISTINCT ON (c.id)
              c.id, c."productId", c."sizeId", c.quantity, p.name, p.price, i.url, 
              s.name as "sizeName", cat.name as category, cu.name as cuisine, k.name as kitchen
       FROM "Cart" c
       JOIN "Product" p ON c."productId" = p.id
       LEFT JOIN "Image" i ON p.id = i."productId"
       LEFT JOIN "Size" s ON c."sizeId" = s.id
       LEFT JOIN "Category" cat ON p."categoryId" = cat.id
       LEFT JOIN "Cuisine" cu ON p."cuisineId" = cu.id
       LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
       WHERE c."userId" = $1
       ORDER BY c.id, i.id`,
      [userId],
    );

    const items = result.rows;
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, sizeId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    // Check if product exists
    const productResult = await query(
      'SELECT id FROM "Product" WHERE id = $1',
      [productId],
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if size exists (if provided)
    if (sizeId) {
      const sizeResult = await query('SELECT id FROM "Size" WHERE id = $1', [
        sizeId,
      ]);
      if (sizeResult.rows.length === 0) {
        return res.status(404).json({ message: "Size not found" });
      }
    }

    // Check if item already exists (handles NULL sizeId correctly using IS NOT DISTINCT FROM)
    const existingResult = await query(
      `SELECT id FROM "Cart" WHERE "userId" = $1 AND "productId" = $2 AND "sizeId" IS NOT DISTINCT FROM $3`,
      [userId, productId, sizeId || null],
    );

    if (existingResult.rows.length > 0) {
      // Item exists - increment quantity
      await query(
        `UPDATE "Cart" SET quantity = quantity + $1, "updatedAt" = NOW() WHERE id = $2`,
        [quantity, existingResult.rows[0].id],
      );
    } else {
      // New item - insert it
      await query(
        `INSERT INTO "Cart" ("userId", "productId", "sizeId", quantity) VALUES ($1, $2, $3, $4)`,
        [userId, productId, sizeId || null, quantity],
      );
    }

    // Fetch and return full cart with all items
    const detailResult = await query(
      `SELECT DISTINCT ON (c.id)
              c.id, c."productId", c."sizeId", c.quantity, p.name, p.price, i.url, 
              s.name as "sizeName", cat.name as category, cu.name as cuisine, k.name as kitchen
       FROM "Cart" c
       JOIN "Product" p ON c."productId" = p.id
       LEFT JOIN "Image" i ON p.id = i."productId"
       LEFT JOIN "Size" s ON c."sizeId" = s.id
       LEFT JOIN "Category" cat ON p."categoryId" = cat.id
       LEFT JOIN "Cuisine" cu ON p."cuisineId" = cu.id
       LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
       WHERE c."userId" = $1
       ORDER BY c.id, i.id`,
      [userId],
    );

    res.status(201).json({ items: detailResult.rows || [] });
  } catch (err) {
    next(err);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const result = await query(
      'UPDATE "Cart" SET quantity = $1, "updatedAt" = NOW() WHERE id = $2 AND "userId" = $3 RETURNING *',
      [quantity, cartId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Fetch and return full cart with all items
    const detailResult = await query(
      `SELECT DISTINCT ON (c.id)
              c.id, c."productId", c."sizeId", c.quantity, p.name, p.price, i.url, 
              s.name as "sizeName", cat.name as category, cu.name as cuisine, k.name as kitchen
       FROM "Cart" c
       JOIN "Product" p ON c."productId" = p.id
       LEFT JOIN "Image" i ON p.id = i."productId"
       LEFT JOIN "Size" s ON c."sizeId" = s.id
       LEFT JOIN "Category" cat ON p."categoryId" = cat.id
       LEFT JOIN "Cuisine" cu ON p."cuisineId" = cu.id
       LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
       WHERE c."userId" = $1
       ORDER BY c.id, i.id`,
      [userId],
    );

    res.json({ items: detailResult.rows || [] });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;

    const result = await query(
      'DELETE FROM "Cart" WHERE id = $1 AND "userId" = $2 RETURNING id',
      [cartId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Fetch and return full cart with all items
    const detailResult = await query(
      `SELECT DISTINCT ON (c.id)
              c.id, c."productId", c."sizeId", c.quantity, p.name, p.price, i.url, 
              s.name as "sizeName", cat.name as category, cu.name as cuisine, k.name as kitchen
       FROM "Cart" c
       JOIN "Product" p ON c."productId" = p.id
       LEFT JOIN "Image" i ON p.id = i."productId"
       LEFT JOIN "Size" s ON c."sizeId" = s.id
       LEFT JOIN "Category" cat ON p."categoryId" = cat.id
       LEFT JOIN "Cuisine" cu ON p."cuisineId" = cu.id
       LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
       WHERE c."userId" = $1
       ORDER BY c.id, i.id`,
      [userId],
    );

    res.json({ items: detailResult.rows || [] });
  } catch (err) {
    next(err);
  }
};

// Clear entire cart
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await query('DELETE FROM "Cart" WHERE "userId" = $1', [userId]);

    res.json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
