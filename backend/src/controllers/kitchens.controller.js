const { query } = require("../utils/prisma");

const getKitchens = async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Kitchen" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getKitchens };
