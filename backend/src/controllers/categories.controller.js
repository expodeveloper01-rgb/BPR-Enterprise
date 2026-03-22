const prisma = require("../utils/prisma");

const getCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };
