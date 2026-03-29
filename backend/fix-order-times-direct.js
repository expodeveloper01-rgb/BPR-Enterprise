#!/usr/bin/env node

/**
 * Fix Order Timestamps - Direct SQL Approach
 * Adds 8 hours to all order createdAt timestamps to correct the offset
 * Usage: node fix-order-times-direct.js
 */

require("dotenv").config();
const { query } = require("./src/utils/prisma");

const fixOrderTimestamps = async () => {
  console.log("🔍 Fixing all order timestamps by adding 8 hours...\n");

  try {
    // Update all Order records - add 8 hours to createdAt
    const updateOrders = await query(
      `UPDATE "Order"
       SET "createdAt" = "createdAt" + INTERVAL '8 hours',
           "updatedAt" = "updatedAt" + INTERVAL '8 hours'
       RETURNING id, "createdAt", "updatedAt"`,
      [],
    );

    console.log(`✅ Fixed ${updateOrders.rows.length} Order records\n`);

    if (updateOrders.rows.length > 0) {
      console.log("Sample of fixed orders:");
      updateOrders.rows.slice(0, 3).forEach((row) => {
        console.log(`  Order ${row.id}: createdAt = ${row.createdAt}`);
      });
    }

    // Also fix OrderItem timestamps if they exist
    const updateOrderItems = await query(
      `UPDATE "OrderItem"
       SET "createdAt" = "createdAt" + INTERVAL '8 hours',
           "updatedAt" = "updatedAt" + INTERVAL '8 hours'
       RETURNING id`,
      [],
    );

    console.log(`✅ Fixed ${updateOrderItems.rows.length} OrderItem records\n`);

    console.log("✅ Timestamp correction completed successfully!\n");
  } catch (err) {
    console.error("❌ Error during timestamp fix:", err);
    process.exit(1);
  }
};

// Run the fix
fixOrderTimestamps().then(() => {
  console.log("Done!\n");
  process.exit(0);
});
