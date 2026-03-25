const { query } = require("../utils/prisma");

const getCuisines = async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Cuisine" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCuisines };
