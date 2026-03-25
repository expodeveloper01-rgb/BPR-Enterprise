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

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error("Error:", error.message);
    if (error.detail) console.error("Detail:", error.detail);
    if (error.hint) console.error("Hint:", error.hint);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
