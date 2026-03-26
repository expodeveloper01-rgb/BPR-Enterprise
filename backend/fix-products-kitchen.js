require("dotenv").config();
const { query } = require("./src/utils/prisma");

async function fixProductsWithoutKitchen() {
  try {
    console.log("🔍 Checking products without kitchen...");

    // Find products with NULL kitchenId
    const result = await query(
      'SELECT id, name, "kitchenId" FROM "Product" WHERE "kitchenId" IS NULL OR "kitchenId" = \'\'',
      [],
    );

    if (result.rows.length === 0) {
      console.log("✅ All products have a kitchen assigned!");
      process.exit(0);
    }

    console.log(`❌ Found ${result.rows.length} products without kitchen:`);
    result.rows.forEach((p) => {
      console.log(`   - ${p.name} (${p.id})`);
    });

    // Get Uncle Brew kitchen ID
    const kitchenResult = await query(
      "SELECT id FROM \"Kitchen\" WHERE name = 'Uncle Brew' LIMIT 1",
      [],
    );

    if (kitchenResult.rows.length === 0) {
      console.error("❌ Uncle Brew kitchen not found!");
      process.exit(1);
    }

    const uncleBrewId = kitchenResult.rows[0].id;
    console.log(`\n📍 Assigning to Uncle Brew (${uncleBrewId})...`);

    // Update products to assign to Uncle Brew
    const updateResult = await query(
      'UPDATE "Product" SET "kitchenId" = $1, "updatedAt" = NOW() WHERE "kitchenId" IS NULL OR "kitchenId" = \'\'',
      [uncleBrewId],
    );

    console.log(`✅ Updated ${updateResult.rowCount} products`);
    console.log(
      "\nℹ️  These products will now show in Uncle Brew seller panel",
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

fixProductsWithoutKitchen();
