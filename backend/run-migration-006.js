const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log("🔄 Running migration 006...");

    const migrationPath = path.join(
      __dirname,
      "prisma/migrations/006_add_multiselect_columns.sql",
    );
    const migration = fs.readFileSync(migrationPath, "utf-8");

    console.log("📄 Executing 006_add_multiselect_columns.sql...");
    await pool.query(migration);
    console.log("✅ Migration 006 completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
