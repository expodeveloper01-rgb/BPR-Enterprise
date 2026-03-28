const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

module.exports = {
  query,
  pool,
};
