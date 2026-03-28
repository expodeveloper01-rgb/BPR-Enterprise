#!/usr/bin/env node

/**
 * Fix Order Timestamps Script
 * Corrects order timestamps that were stored with incorrect timezone conversion
 * Usage: node fix-timestamps.js
 */

require("dotenv").config();
const { query } = require("./src/utils/prisma");

const fixTimestamps = async () => {
  console.log("🔍 Checking for orders with incorrect timestamps...\n");

  try {
    // Step 1: Check for orders with suspicious timestamps (early morning hours)
    const checkResult = await query(
      `SELECT id, "createdAt", EXTRACT(HOUR FROM "createdAt"::time) as hour
       FROM "Order"
       WHERE EXTRACT(HOUR FROM "createdAt"::time) < 12
       AND "createdAt" < NOW() - INTERVAL '5 minutes'
       ORDER BY "createdAt" DESC
       LIMIT 20`,
      [],
    );

    if (checkResult.rows.length === 0) {
      console.log(
        "✅ No orders found with potentially incorrect timestamps.\n",
      );
      return;
    }

    console.log(
      `Found ${checkResult.rows.length} orders with early-morning timestamps:\n`,
    );
    checkResult.rows.forEach((row) => {
      console.log(`  Order ${row.id}: ${row.createdAt} (Hour: ${row.hour})`);
    });

    console.log("\n⚠️  These will be corrected by adding 8 hours...\n");

    // Step 2: Apply the fix
    const fixResult = await query(
      `UPDATE "Order"
       SET "createdAt" = "createdAt" + INTERVAL '8 hours',
           "updatedAt" = CASE 
             WHEN ("updatedAt" - "createdAt") < INTERVAL '1 hour' THEN "updatedAt" + INTERVAL '8 hours'
             ELSE "updatedAt"
           END
       WHERE EXTRACT(HOUR FROM "createdAt"::time) < 12
       AND "createdAt" < NOW() - INTERVAL '5 minutes'
       RETURNING id, "createdAt"`,
      [],
    );

    console.log(`✅ Fixed ${fixResult.rows.length} Order records\n`);

    // Step 3: Also fix OrderItem timestamps
    const fixOrderItems = await query(
      `UPDATE "OrderItem" oi
       SET "createdAt" = oi."createdAt" + INTERVAL '8 hours',
           "updatedAt" = CASE 
             WHEN (oi."updatedAt" - oi."createdAt") < INTERVAL '1 hour' THEN oi."updatedAt" + INTERVAL '8 hours'
             ELSE oi."updatedAt"
           END
       FROM "Order" o
       WHERE oi."orderId" = o.id
       AND EXTRACT(HOUR FROM oi."createdAt"::time) < 12
       AND oi."createdAt" < NOW() - INTERVAL '5 minutes'
       RETURNING oi.id`,
      [],
    );

    console.log(`✅ Fixed ${fixOrderItems.rows.length} OrderItem records\n`);

    // Step 4: Verify the fix
    console.log("🔍 Verifying fixes...\n");

    if (fixResult.rows.length > 0) {
      const verifyResult = await query(
        `SELECT id, "createdAt", EXTRACT(HOUR FROM "createdAt"::time) as hour
         FROM "Order"
         WHERE id = ANY($1)
         ORDER BY "createdAt" DESC`,
        [fixResult.rows.map((r) => r.id)],
      );

      console.log("Updated Order timestamps:\n");
      verifyResult.rows.forEach((row) => {
        console.log(`  Order ${row.id}: ${row.createdAt} (Hour: ${row.hour})`);
      });
    }

    console.log("\n✅ Timestamp correction completed successfully!\n");
  } catch (err) {
    console.error("❌ Error during timestamp fix:", err);
    process.exit(1);
  }
};

// Run the fix
fixTimestamps().then(() => {
  console.log("Done!\n");
  process.exit(0);
});
