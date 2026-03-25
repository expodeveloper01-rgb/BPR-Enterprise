const { verifyToken } = require("../utils/jwt");
const { query } = require("../utils/prisma");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const result = await query('SELECT * FROM "User" WHERE id = $1', [
      decoded.id,
    ]);
    if (!result.rows.length)
      return res.status(401).json({ message: "User not found" });

    req.user = result.rows[0];
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: admin access required" });
  }
  next();
};

module.exports = { protect, requireAdmin };
