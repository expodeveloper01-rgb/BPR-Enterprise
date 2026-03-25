const Stripe = require("stripe");
const { query } = require("../utils/prisma");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res, next) => {
  try {
    const { products } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const lineItems = products.map((item) => ({
      price_data: {
        currency: "php",
        product_data: {
          name: item.name,
          images: item.images?.length ? [item.images[0].url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=1`,
      metadata: {
        userId,
        productIds: products.map((p) => p.id).join(","),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, productIds } = session.metadata;
    const ids = productIds.split(",");

    try {
      // Create order
      const orderResult = await query(
        `INSERT INTO "Order" (id, "userId", "isPaid", "order_status", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, true, 'Processing', NOW(), NOW())
         RETURNING id`,
        [userId],
      );

      const orderId = orderResult.rows[0].id;

      // Create order items
      for (const productId of ids) {
        await query(
          `INSERT INTO "OrderItem" (id, "orderId", "productId", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
          [orderId, productId],
        );
      }
    } catch (err) {
      console.error("Error creating order from webhook:", err);
    }
  }

  res.json({ received: true });
};

// Cash on Delivery
const createCODOrder = async (req, res, next) => {
  try {
    const { phone, address } = req.body;
    const userId = req.user.id;

    if (!phone || !address)
      return res
        .status(400)
        .json({ message: "Phone and address are required" });

    // Get cart items from database
    const cartResult = await query(
      'SELECT "productId", "sizeId", quantity FROM "Cart" WHERE "userId" = $1',
      [userId],
    );

    if (cartResult.rows.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Create order
    const orderResult = await query(
      `INSERT INTO "Order" (id, "userId", "isPaid", phone, address, "paymentMethod", "order_status", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, false, $2, $3, 'cod', 'Processing', NOW(), NOW())
       RETURNING id`,
      [userId, phone, address],
    );

    const orderId = orderResult.rows[0].id;

    // Create order items with quantities and sizes
    for (const cartItem of cartResult.rows) {
      await query(
        `INSERT INTO "OrderItem" (id, "orderId", "productId", "sizeId", quantity, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        [
          orderId,
          cartItem.productId,
          cartItem.sizeId || null,
          cartItem.quantity,
        ],
      );
    }

    // Clear cart after successful order
    await query('DELETE FROM "Cart" WHERE "userId" = $1', [userId]);

    res.status(201).json({ orderId });
  } catch (err) {
    next(err);
  }
};

// Bank Transfer
const createBankTransferOrder = async (req, res, next) => {
  try {
    const { phone, address, referenceNumber } = req.body;
    const userId = req.user.id;

    if (!phone || !address)
      return res
        .status(400)
        .json({ message: "Phone and address are required" });
    if (!referenceNumber || !referenceNumber.trim())
      return res.status(400).json({ message: "Reference number is required" });

    // Get cart items from database
    const cartResult = await query(
      'SELECT "productId", "sizeId", quantity FROM "Cart" WHERE "userId" = $1',
      [userId],
    );

    if (cartResult.rows.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Create order
    const orderResult = await query(
      `INSERT INTO "Order" (id, "userId", "isPaid", phone, address, "paymentMethod", "referenceNumber", "order_status", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, false, $2, $3, 'bank_transfer', $4, 'Pending Payment Verification', NOW(), NOW())
       RETURNING id`,
      [userId, phone, address, referenceNumber.trim()],
    );

    const orderId = orderResult.rows[0].id;

    // Create order items with quantities and sizes
    for (const cartItem of cartResult.rows) {
      await query(
        `INSERT INTO "OrderItem" (id, "orderId", "productId", "sizeId", quantity, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        [
          orderId,
          cartItem.productId,
          cartItem.sizeId || null,
          cartItem.quantity,
        ],
      );
    }

    // Clear cart after successful order
    await query('DELETE FROM "Cart" WHERE "userId" = $1', [userId]);

    res.status(201).json({ orderId });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCheckout,
  handleWebhook,
  createCODOrder,
  createBankTransferOrder,
};
