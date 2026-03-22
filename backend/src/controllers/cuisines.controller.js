const prisma = require("../utils/prisma");

const getCuisines = async (_req, res, next) => {
  try {
    const cuisines = await prisma.cuisine.findMany({ orderBy: { name: "asc" } });
    res.json(cuisines);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCuisines };
