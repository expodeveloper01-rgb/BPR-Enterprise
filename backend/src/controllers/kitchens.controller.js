const prisma = require("../utils/prisma");

const getKitchens = async (_req, res, next) => {
  try {
    const kitchens = await prisma.kitchen.findMany({ orderBy: { name: "asc" } });
    res.json(kitchens);
  } catch (err) {
    next(err);
  }
};

module.exports = { getKitchens };
