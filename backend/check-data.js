require("dotenv").config();
const { query } = require("./src/utils/prisma");

async function checkDataConsistency() {
  try {
    console.log("📊 === UNCLE BREW DATA CONSISTENCY CHECK ===\n");

    // 1. Check kitchens
    console.log("🏪 KITCHENS:");
    const kitchensResult = await query(
      'SELECT id, name FROM "Kitchen" ORDER BY name',
      [],
    );
    const kitchens = kitchensResult.rows;
    kitchens.forEach((k) => console.log(`   ✅ ${k.name} (${k.id})`));

    // Get Uncle Brew ID
    const uncleBrew = kitchens.find((k) => k.name === "Uncle Brew");
    if (!uncleBrew) {
      console.error("   ❌ Uncle Brew kitchen not found!");
      process.exit(1);
    }

    // 2. Check products by kitchen
    console.log(`\n📦 PRODUCTS BY KITCHEN:`);
    for (const kitchen of kitchens) {
      const productsResult = await query(
        'SELECT id, name, "kitchenId" FROM "Product" WHERE "kitchenId" = $1 ORDER BY "createdAt" DESC',
        [kitchen.id],
      );
      const count = productsResult.rows.length;
      console.log(
        `   ${kitchen.name}: ${count} product${count !== 1 ? "s" : ""}`,
      );
      productsResult.rows.forEach((p) => {
        console.log(`      - ${p.name}`);
      });
    }

    // 3. Check products WITHOUT kitchen
    console.log(`\n⚠️  PRODUCTS WITHOUT KITCHEN:`);
    const orphanResult = await query(
      'SELECT id, name, "kitchenId" FROM "Product" WHERE "kitchenId" IS NULL OR "kitchenId" = \'\'',
      [],
    );
    if (orphanResult.rows.length === 0) {
      console.log("   ✅ All products have a kitchen assigned!");
    } else {
      console.log(`   ❌ Found ${orphanResult.rows.length} orphaned products:`);
      orphanResult.rows.forEach((p) => {
        console.log(`      - ${p.name} (ID: ${p.id})`);
      });
      console.log(`\n   💡 Fix with: npm run fix:kitchen`);
    }

    // 4. Check total stats
    console.log(`\n📈 SUMMARY:`);
    const totalResult = await query(
      'SELECT COUNT(*) as count FROM "Product"',
      [],
    );
    const totalProducts = parseInt(totalResult.rows[0].count);
    const assignedCount = kitchensResult.rows.reduce((sum, k) => {
      const count = kitchens.find((kt) => kt.id === k.id)
        ? parseInt(
            (
              kitchensResult.rows.find((r) => r.id === k.id)?.count || 0
            ).toString(),
          )
        : 0;
      return sum + count;
    }, 0);

    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   With Kitchen: ${totalProducts - orphanResult.rows.length}`);
    console.log(`   Without Kitchen: ${orphanResult.rows.length}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

checkDataConsistency();
