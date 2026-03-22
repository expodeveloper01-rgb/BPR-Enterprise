const prisma = require("../utils/prisma");

const getSizes = async (_req, res, next) => {
  try {
    const sizes = await prisma.size.findMany({ orderBy: { name: "asc" } });
    res.json(sizes);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSizes };
