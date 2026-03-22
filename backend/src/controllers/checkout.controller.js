const Stripe = require("stripe");
const prisma = require("../utils/prisma");

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
      cancel_url:  `${process.env.FRONTEND_URL}/cart?canceled=1`,
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
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, productIds } = session.metadata;
    const ids = productIds.split(",");

    await prisma.order.create({
      data: {
        isPaid: true,
        userId,
        orderItems: {
          create: ids.map((productId) => ({ product: { connect: { id: productId } } })),
        },
      },
    });
  }

  res.json({ received: true });
};

// Cash on Delivery
const createCODOrder = async (req, res, next) => {
  try {
    const { products, phone, address } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0)
      return res.status(400).json({ message: "No products provided" });
    if (!phone || !address)
      return res.status(400).json({ message: "Phone and address are required" });

    const order = await prisma.order.create({
      data: {
        isPaid: false,
        phone,
        address,
        paymentMethod: "cod",
        order_status: "Processing",
        userId,
        orderItems: {
          create: products.map((p) => ({ product: { connect: { id: p.id } } })),
        },
      },
    });

    res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
};

// Bank Transfer
const createBankTransferOrder = async (req, res, next) => {
  try {
    const { products, phone, address, referenceNumber } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0)
      return res.status(400).json({ message: "No products provided" });
    if (!phone || !address)
      return res.status(400).json({ message: "Phone and address are required" });
    if (!referenceNumber || !referenceNumber.trim())
      return res.status(400).json({ message: "Reference number is required" });

    const order = await prisma.order.create({
      data: {
        isPaid: false,
        phone,
        address,
        paymentMethod: "bank_transfer",
        referenceNumber: referenceNumber.trim(),
        order_status: "Pending Payment Verification",
        userId,
        orderItems: {
          create: products.map((p) => ({ product: { connect: { id: p.id } } })),
        },
      },
    });

    res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCheckout, handleWebhook, createCODOrder, createBankTransferOrder };
