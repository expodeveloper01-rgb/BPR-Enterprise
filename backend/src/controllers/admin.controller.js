const { query } = require("../utils/prisma");

// ============ CATEGORIES ============

const getCategories = async (req, res, next) => {
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

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Category" (id, name, description, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING *',
      [name, description || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Category" SET name = $1, description = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
      [name, description || null, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Category" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ SIZES ============

const getSizes = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Size" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createSize = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Size" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Size" SET name = $1, description = $2, value = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [name, description || null, name, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM "Size" WHERE id = $1 RETURNING *', [
      id,
    ]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json({ message: "Size deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ KITCHENS ============

const getKitchens = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Kitchen" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createKitchen = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Kitchen" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateKitchen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Kitchen" SET name = $1, description = $2, value = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [name, description || null, name, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Kitchen not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteKitchen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Kitchen" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Kitchen not found" });
    }
    res.json({ message: "Kitchen deleted" });
  } catch (err) {
    next(err);
  }
};

// ============ CUISINES ============

const getCuisines = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "Cuisine" ORDER BY name ASC', []);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createCuisine = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await query(
      'INSERT INTO "Cuisine" (id, name, description, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, description || null, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateCuisine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE "Cuisine" SET name = $1, description = $2, value = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [name, description || null, name, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Cuisine not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteCuisine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM "Cuisine" WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Cuisine not found" });
    }
    res.json({ message: "Cuisine deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSizes,
  createSize,
  updateSize,
  deleteSize,
  getKitchens,
  createKitchen,
  updateKitchen,
  deleteKitchen,
  getCuisines,
  createCuisine,
  updateCuisine,
  deleteCuisine,
};
