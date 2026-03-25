const { query } = require("../utils/prisma");

const getSizes = async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Size" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSizes };
