const { query } = require("./src/utils/prisma");

const main = async () => {
  try {
    console.log("\n📊 Checking Rider Stats and Order Items...\n");

    // Get all riders with deliveries
    const ridersResult = await query(
      `SELECT id, name, "totalDeliveries", earnings FROM "Rider" LIMIT 5`,
    );

    console.log("🚴 Riders:", ridersResult.rows);

    // Get all delivered orders and check if they have items
    const ordersResult = await query(
      `SELECT 
        o.id, o."userId", o.delivery_status, o.order_status, o."riderId",
        COUNT(oi.id) AS item_count,
        COALESCE(SUM(p.price * oi.quantity), 0) AS "total"
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       WHERE o.delivery_status = 'delivered'
       GROUP BY o.id
       LIMIT 10`,
    );

    console.log("\n📦 Delivered Orders and their items:\n");
    ordersResult.rows.forEach((order) => {
      console.log(`Order ${order.id.slice(-8)}:`);
      console.log(`  - Rider: ${order.riderId}`);
      console.log(`  - Status: ${order.delivery_status}`);
      console.log(`  - Items: ${order.item_count}`);
      console.log(`  - Total: ₱${order.total}`);
      console.log("");
    });

    // Check rider-order relationship
    const riderDeliveriesResult = await query(
      `SELECT 
        r.id, r.name, r."totalDeliveries", r.earnings,
        COUNT(DISTINCT o.id) as actual_delivered_count,
        COALESCE(SUM(p.price * oi.quantity), 0) as calculated_earnings
       FROM "Rider" r
       LEFT JOIN "Order" o ON r.id = o."riderId" AND o.delivery_status = 'delivered'
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       GROUP BY r.id, r.name, r."totalDeliveries", r.earnings`,
    );

    console.log("\n🔍 Rider Stats Analysis:\n");
    riderDeliveriesResult.rows.forEach((rider) => {
      console.log(`Rider: ${rider.name} (${rider.id.slice(-8)})`);
      console.log(`  - Recorded deliveries: ${rider.totalDeliveries}`);
      console.log(`  - Recorded earnings: ₱${rider.earnings}`);
      console.log(
        `  - Actual delivered orders: ${rider.actual_delivered_count}`,
      );
      console.log(`  - Should be earning: ₱${rider.calculated_earnings}`);
      if (rider.totalDeliveries !== parseInt(rider.actual_delivered_count)) {
        console.log(
          `  ⚠️  MISMATCH: Recorded ${rider.totalDeliveries} but has ${rider.actual_delivered_count} delivered`,
        );
      }
      console.log("");
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

main();
