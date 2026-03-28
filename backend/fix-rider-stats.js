#!/usr/bin/env node

/**
 * Fix Rider Stats Script
 * Calculates totalDeliveries and earnings for existing delivered orders
 * Usage: npm run fix:rider-stats
 */

require("dotenv").config();
const { query } = require("./src/utils/prisma");

const main = async () => {
  try {
    console.log("\n🔧 Fixing Rider Stats for Existing Delivered Orders...\n");

    // Get all delivered orders grouped by rider
    const deliveredOrders = await query(
      `SELECT 
        o."riderId",
        COUNT(DISTINCT o.id) as delivery_count,
        COALESCE(SUM(p.price * oi.quantity * k."riderCommissionRate" / 100), 0) as total_earnings
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       LEFT JOIN "Product" p ON oi."productId" = p.id
       LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
       WHERE o.delivery_status = 'delivered' AND o."riderId" IS NOT NULL
       GROUP BY o."riderId"`,
    );

    console.log(
      `Found ${deliveredOrders.rows.length} riders with delivered orders\n`,
    );

    let updatedCount = 0;

    for (const row of deliveredOrders.rows) {
      const riderId = row.riderId;
      const deliveryCount = parseInt(row.delivery_count);
      const totalEarnings = parseFloat(row.total_earnings) || 0;

      // Get current rider stats
      const currentStats = await query(
        'SELECT "totalDeliveries", earnings FROM "Rider" WHERE id = $1',
        [riderId],
      );

      if (currentStats.rows.length === 0) {
        console.log(`⚠️  Rider not found: ${riderId}`);
        continue;
      }

      const current = currentStats.rows[0];
      console.log(`🚴 Rider ${riderId.slice(-8)}:`);
      console.log(
        `   Current: ${current.totalDeliveries} deliveries, ₱${current.earnings}`,
      );
      console.log(
        `   Should be: ${deliveryCount} deliveries, ₱${totalEarnings}`,
      );

      if (
        current.totalDeliveries !== deliveryCount ||
        parseFloat(current.earnings) !== totalEarnings
      ) {
        // Update to correct values
        await query(
          `UPDATE "Rider"
           SET "totalDeliveries" = $1, "earnings" = $2, "updatedAt" = NOW()
           WHERE id = $3`,
          [deliveryCount, totalEarnings, riderId],
        );

        console.log(
          `   ✅ FIXED to: ${deliveryCount} deliveries, ₱${totalEarnings}\n`,
        );
        updatedCount++;
      } else {
        console.log(`   ✅ Already correct\n`);
      }
    }

    console.log(`\n✅ Fixed ${updatedCount} riders\n`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

main();
