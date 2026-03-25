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

    // Add or update cart item
    const result = await query(
      `INSERT INTO "Cart" ("userId", "productId", "sizeId", quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("userId", "productId", "sizeId")
       DO UPDATE SET quantity = "Cart".quantity + $4, "updatedAt" = NOW()
       RETURNING *`,
      [userId, productId, sizeId || null, quantity],
    );

    const cartItem = result.rows[0];

    // Fetch full details with product info
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
       WHERE c.id = $1
       ORDER BY c.id, i.id`,
      [cartItem.id],
    );

    res.status(201).json({ item: detailResult.rows[0] || cartItem });
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

    res.json({ item: result.rows[0] });
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

    res.json({ message: "Item removed from cart" });
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
