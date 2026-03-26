const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log("🔄 Starting database migration...");

    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = fs.readFileSync(migrationPath, "utf-8");

      console.log(`📄 Running ${file}...`);
      await pool.query(migration);
      console.log(`✅ ${file} completed`);
    }

    console.log("\n✅ All migrations completed successfully!");
    console.log("📊 Tables created/updated:");
    console.log("   - User");
    console.log("   - Category");
    console.log("   - Size");
    console.log("   - Kitchen");
    console.log("   - Cuisine");
    console.log("   - Product");
    console.log("   - Image");
    console.log("   - Order");
    console.log("   - OrderItem");

    // Run seed after migrations
    await runSeed();

    process.exit(0);
  } catch (error) {
    console.error("❌ Operation failed:");
    console.error("Error:", error.message);
    if (error.detail) console.error("Detail:", error.detail);
    if (error.hint) console.error("Hint:", error.hint);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function runSeed() {
  try {
    // Import Prisma after migrations are done to ensure module is available
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    console.log(
      "🌱 Seeding database with categories, sizes, kitchens, and cuisines...\n",
    );

    // Seed categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: "cat-drinks" },
        update: {},
        create: {
          id: "cat-drinks",
          name: "Drinks",
          billboardLabel: "Refreshing Drinks",
        },
      }),
      prisma.category.upsert({
        where: { id: "cat-food" },
        update: {},
        create: {
          id: "cat-food",
          name: "Food",
          billboardLabel: "Delicious Food",
        },
      }),
      prisma.category.upsert({
        where: { id: "cat-pastry" },
        update: {},
        create: {
          id: "cat-pastry",
          name: "Pastry",
          billboardLabel: "Fresh Pastries",
        },
      }),
    ]);
    console.log(`✅ ${categories.length} categories seeded`);

    // Seed sizes
    const sizes = await Promise.all([
      prisma.size.upsert({
        where: { id: "sz-small" },
        update: {},
        create: { id: "sz-small", name: "Small", value: "S" },
      }),
      prisma.size.upsert({
        where: { id: "sz-medium" },
        update: {},
        create: { id: "sz-medium", name: "Medium", value: "M" },
      }),
      prisma.size.upsert({
        where: { id: "sz-large" },
        update: {},
        create: { id: "sz-large", name: "Large", value: "L" },
      }),
    ]);
    console.log(`✅ ${sizes.length} sizes seeded`);

    // Seed kitchens
    const kitchens = await Promise.all([
      prisma.kitchen.upsert({
        where: { id: "kt-uncle-brew" },
        update: {},
        create: {
          id: "kt-uncle-brew",
          name: "Uncle Brew",
          value: "uncle-brew",
        },
      }),
      prisma.kitchen.upsert({
        where: { id: "kt-diomedes" },
        update: {},
        create: { id: "kt-diomedes", name: "Diomedes", value: "diomedes" },
      }),
    ]);
    console.log(`✅ ${kitchens.length} store kitchens seeded`);

    // Seed cuisines
    const cuisines = await Promise.all([
      prisma.cuisine.upsert({
        where: { id: "cu-filipino" },
        update: {},
        create: { id: "cu-filipino", name: "Filipino", value: "filipino" },
      }),
      prisma.cuisine.upsert({
        where: { id: "cu-american" },
        update: {},
        create: { id: "cu-american", name: "American", value: "american" },
      }),
    ]);
    console.log(`✅ ${cuisines.length} cuisines seeded`);

    console.log("\n✅ Database seeding completed!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    throw error;
  }
}

runMigration();
