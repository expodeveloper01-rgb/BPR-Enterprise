const { query } = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRiderVerificationEmail } = require("../utils/email");
const { getManilaTimeISO } = require("../utils/timezone");

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register rider
const registerRider = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if rider already exists
    const existingRider = await query(
      'SELECT id FROM "Rider" WHERE email = $1',
      [email],
    );

    if (existingRider.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Rider with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verifyCode = generateVerificationCode();
    const verifyCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create rider
    const result = await query(
      `INSERT INTO "Rider" (id, name, email, password, phone, "verifyCode", "verifyCodeExpires", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, name, email, phone, verified, status`,
      [name, email, hashedPassword, phone, verifyCode, verifyCodeExpires],
    );

    const rider = result.rows[0];

    // Send verification email
    await sendRiderVerificationEmail(email, name, verifyCode);

    res.status(201).json({
      message:
        "Rider account created. Please verify your email to complete registration.",
      rider: {
        id: rider.id,
        name: rider.name,
        email: rider.email,
        verified: rider.verified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Verify rider email
const verifyRiderEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required" });
    }

    // Get rider
    const result = await query('SELECT * FROM "Rider" WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Rider not found" });
    }

    const rider = result.rows[0];

    // Check if already verified
    if (rider.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check verification code
    if (rider.verifyCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Check if code expired
    if (new Date() > new Date(rider.verifyCodeExpires)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Update rider - mark as verified
    const updateResult = await query(
      'UPDATE "Rider" SET verified = true, "verifyCode" = NULL, "verifyCodeExpires" = NULL WHERE email = $1 RETURNING id, name, email, phone, verified, status',
      [email],
    );

    const verifiedRider = updateResult.rows[0];

    res.json({
      message: "Email verified successfully",
      rider: verifiedRider,
    });
  } catch (err) {
    next(err);
  }
};

// Login rider
const loginRider = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Get rider
    const result = await query('SELECT * FROM "Rider" WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const rider = result.rows[0];

    // Check if verified
    if (!rider.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        email: rider.email,
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, rider.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: rider.id, email: rider.email, role: "rider" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      rider: {
        id: rider.id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        verified: rider.verified,
        status: rider.status,
        rating: rider.rating,
        totalDeliveries: rider.totalDeliveries,
        earnings: rider.earnings,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Get rider profile
const getRiderProfile = async (req, res, next) => {
  try {
    const riderId = req.user.id;

    const result = await query(
      'SELECT id, name, email, phone, verified, status, rating, "totalDeliveries", earnings FROM "Rider" WHERE id = $1',
      [riderId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Rider not found" });
    }

    console.log("👤 getRiderProfile - Returning stats:", {
      name: result.rows[0].name,
      totalDeliveries: result.rows[0].totalDeliveries,
      earnings: result.rows[0].earnings,
    });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Get all pending deliveries
const getPendingDeliveries = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status,
        o."isPaid", o."paymentMethod", o."createdAt", o."updatedAt",
        u.name AS "userName", u.email AS "userEmail",
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o.delivery_status = 'pending' AND o."riderId" IS NULL AND o.order_status = 'confirmed'
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status, o."isPaid", o."paymentMethod", o."createdAt", o."updatedAt", u.id, u.name, u.email
       ORDER BY o."createdAt" DESC`,
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get rider's active deliveries
const getRiderDeliveries = async (req, res, next) => {
  try {
    const riderId = req.user.id;

    const result = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status,
        o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt",
        u.name AS "userName", u.email AS "userEmail",
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o."riderId" = $1 AND o.delivery_status != 'delivered'
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status, o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt", u.id, u.name, u.email
       ORDER BY o."createdAt" ASC`,
      [riderId],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Accept delivery (rider claims order)
const acceptDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { statusTitle = "Pickup Pending", statusMessage = "" } = req.body;
    const riderId = req.user.id;

    // Check if order exists and is still available
    const orderResult = await query(
      'SELECT "statusHistory" FROM "Order" WHERE id = $1 AND "riderId" IS NULL AND delivery_status = $2',
      [orderId, "pending"],
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Order is not available for pickup" });
    }

    // Add to status history
    const statusHistory = orderResult.rows[0].statusHistory || [];
    statusHistory.push({
      status: "pickup-pending",
      title: statusTitle,
      message: statusMessage,
      timestamp: getManilaTimeISO(),
    });

    // Assign order to rider
    const manilaTime = getManilaTimeISO();
    const result = await query(
      `UPDATE "Order" 
       SET "riderId" = $1, delivery_status = $2, order_status = $3, "statusHistory" = $4, "updatedAt" = $5 
       WHERE id = $6 
       RETURNING *`,
      [
        riderId,
        "pickup-pending",
        "Confirmed",
        JSON.stringify(statusHistory),
        manilaTime,
        orderId,
      ],
    );

    res.json({
      message: "Delivery accepted",
      order: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, statusTitle, statusMessage = "" } = req.body;
    const riderId = req.user.id;

    console.log("📦 updateDeliveryStatus called:", {
      orderId,
      status,
      riderId,
    });

    const validStatuses = [
      "pickup-pending",
      "in-transit",
      "delivered",
      "failed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if rider owns this delivery
    const orderResult = await query(
      'SELECT "statusHistory", "isPaid" FROM "Order" WHERE id = $1 AND "riderId" = $2',
      [orderId, riderId],
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this delivery" });
    }

    // Add to status history
    const statusHistory = orderResult.rows[0].statusHistory || [];
    statusHistory.push({
      status,
      title: statusTitle,
      message: statusMessage,
      timestamp: getManilaTimeISO(),
    });

    // Map delivery_status to order_status for seller/customer views
    const statusMap = {
      "pickup-pending": "Confirmed",
      "in-transit": "Dispatched",
      delivered: "Delivered",
      failed: "Cancelled",
    };

    let orderStatus = statusMap[status] || "Processing";
    let newIsPaid = orderResult.rows[0].isPaid || false; // keep existing isPaid value

    if (status === "delivered") {
      newIsPaid = true; // Set to paid when delivered
    }

    // Update status and sync order_status + payment
    const manilaTime = getManilaTimeISO();
    await query(
      `UPDATE "Order" 
       SET delivery_status = $1, order_status = $2, "statusHistory" = $3, "isPaid" = $4, "updatedAt" = $5 
       WHERE id = $6`,
      [
        status,
        orderStatus,
        JSON.stringify(statusHistory),
        newIsPaid,
        manilaTime,
        orderId,
      ],
    );

    // If delivery is complete, update rider stats
    if (status === "delivered") {
      try {
        console.log(
          "🎉 DELIVERY COMPLETED - Processing stats for rider:",
          riderId,
        );

        // Get order total and kitchen commission rate
        const orderTotalResult = await query(
          `SELECT 
            COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
            MAX(k."riderCommissionRate") AS "riderCommissionRate"
           FROM "OrderItem" oi
           LEFT JOIN "Product" p ON oi."productId" = p.id
           LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
           WHERE oi."orderId" = $1`,
          [orderId],
        );

        console.log("📦 Full query result:", orderTotalResult.rows);
        console.log("📦 Query result count:", orderTotalResult.rows.length);

        if (orderTotalResult.rows.length === 0) {
          console.error("❌ NO ORDER ITEMS FOUND for order:", orderId);
        }

        const orderTotal = parseFloat(orderTotalResult.rows[0]?.total) || 0;
        const commissionRate =
          parseFloat(orderTotalResult.rows[0]?.riderCommissionRate) || 15;
        const riderEarnings = (orderTotal * commissionRate) / 100;

        console.log("💰 Order total:", orderTotal);
        console.log("📊 Commission rate:", commissionRate + "%");
        console.log("💵 Rider earnings:", riderEarnings.toFixed(2));
        console.log("🆔 Rider ID for update:", riderId);

        // Update rider stats: increment totalDeliveries and add to earnings
        const updateResult = await query(
          `UPDATE "Rider"
           SET "totalDeliveries" = "totalDeliveries" + 1,
               "earnings" = "earnings" + $1,
               "updatedAt" = $2
           WHERE id = $3
           RETURNING "totalDeliveries", "earnings"`,
          [riderEarnings, manilaTime, riderId],
        );

        console.log("📤 Update result rows count:", updateResult.rows.length);
        console.log("✅ Rider stats updated:", updateResult.rows[0]);

        if (!updateResult.rows[0]) {
          console.error("❌ UPDATE returned no rows! Rider ID:", riderId);
          console.error(
            "   This means Rider with ID",
            riderId,
            "doesn't exist!",
          );
        }
      } catch (statsErr) {
        console.error("❌ Error updating rider stats:", statsErr);
        console.error("   Stack:", statsErr.stack);
      }
    }

    // Fetch updated delivery with all details (items, user info, etc.)
    const updatedDelivery = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status,
        o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt",
        u.name AS "userName", u.email AS "userEmail",
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o.id = $1 AND o."riderId" = $2
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status, o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt", u.id, u.name, u.email`,
      [orderId, riderId],
    );

    if (updatedDelivery.rows.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve updated delivery" });
    }

    res.json({
      message: "Delivery status updated",
      order: updatedDelivery.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// Get delivery history for rider
const getRiderHistory = async (req, res, next) => {
  try {
    const riderId = req.user.id;

    const result = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status,
        o."isPaid", o."paymentMethod", o."createdAt", o."updatedAt",
        u.name AS "userName",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o."riderId" = $1 AND o.delivery_status = 'delivered'
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status, o."isPaid", o."paymentMethod", o."createdAt", o."updatedAt", u.id, u.name
       ORDER BY o."createdAt" DESC
       LIMIT 50`,
      [riderId],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get a single delivery by ID (for viewing details, regardless of status)
const getDeliveryById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const riderId = req.user.id;

    const result = await query(
      `SELECT 
        o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status,
        o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt",
        u.name AS "userName", u.email AS "userEmail",
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total",
        json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'name', p.name,
          'price', p.price
        )) AS "items"
       FROM "Order" o
       JOIN "User" u ON o."userId" = u.id
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o.id = $1 AND o."riderId" = $2
       GROUP BY o.id, o."userId", o.phone, o.address, o.order_status, o.delivery_status, o."isPaid", o."paymentMethod", o."statusHistory", o."createdAt", o."updatedAt", u.id, u.name, u.email`,
      [orderId, riderId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerRider,
  verifyRiderEmail,
  loginRider,
  getRiderProfile,
  getPendingDeliveries,
  getRiderDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getRiderHistory,
  getDeliveryById,
};
