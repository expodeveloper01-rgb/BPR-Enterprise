const { query } = require("../utils/prisma");

// Get user's cart with product details
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT c.id, c."productId", c.quantity, p.name, p.price, i.url
       FROM "Cart" c
       JOIN "Product" p ON c."productId" = p.id
       LEFT JOIN "Image" i ON p.id = i."productId"
       WHERE c."userId" = $1
       ORDER BY c."createdAt" DESC`,
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
    const { productId, quantity = 1 } = req.body;

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

    // Add or update cart item
    const result = await query(
      `INSERT INTO "Cart" ("userId", "productId", quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT ("userId", "productId")
       DO UPDATE SET quantity = "Cart".quantity + $3, "updatedAt" = NOW()
       RETURNING *`,
      [userId, productId, quantity],
    );

    res.status(201).json({ item: result.rows[0] });
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
