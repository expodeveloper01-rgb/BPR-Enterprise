const { query } = require("../utils/prisma");

const getCategories = async (_req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM "Category" ORDER BY name ASC',
      [],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };
