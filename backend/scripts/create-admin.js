const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser() {
  const adminName = "Admin";
  const adminEmail = "admin@unclebrew.com";
  const adminPassword = "Admin1234";

  try {
    console.log("🔄 Creating admin user...");

    // Check if admin already exists
    const existingResult = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [adminEmail],
    );

    if (existingResult.rows.length > 0) {
      console.log("⚠️  Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const result = await pool.query(
      `INSERT INTO "User" (id, name, email, password, role, "emailVerified", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'admin', true, NOW(), NOW())
       RETURNING id, name, email, role`,
      [adminName, adminEmail, hashedPassword],
    );

    const admin = result.rows[0];

    console.log("✅ Admin user created successfully!");
    console.log("");
    console.log("📋 Admin Credentials:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("");
    console.log("⚠️  IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin user:");
    console.error("Error:", error.message);
    if (error.detail) console.error("Detail:", error.detail);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdminUser();
