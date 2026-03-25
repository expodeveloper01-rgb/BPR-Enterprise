const { query } = require("../utils/prisma");

const PRODUCT_JOIN_SQL = `
  SELECT
    p.id, p.name, p.description, p.price, p."isFeatured", p."isArchived",
    p."createdAt", p."updatedAt", p."categoryId", p."sizeId", p."kitchenId", p."cuisineId",
    cat.id AS "cat_id", cat.name AS "cat_name", cat."billboardLabel",
    s.id AS "size_id", s.name AS "size_name", s.value AS "size_value",
    k.id AS "kitchen_id", k.name AS "kitchen_name", k.value AS "kitchen_value",
    cu.id AS "cuisine_id", cu.name AS "cuisine_name", cu.value AS "cuisine_value",
    img.id AS "img_id", img.url AS "img_url",
    img."createdAt" AS "img_createdAt", img."updatedAt" AS "img_updatedAt"
  FROM "Product" p
  LEFT JOIN "Category" cat ON p."categoryId" = cat.id
  LEFT JOIN "Size" s ON p."sizeId" = s.id
  LEFT JOIN "Kitchen" k ON p."kitchenId" = k.id
  LEFT JOIN "Cuisine" cu ON p."cuisineId" = cu.id
  LEFT JOIN "Image" img ON img."productId" = p.id
`;

function rowsToProducts(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        isFeatured: row.isFeatured,
        isArchived: row.isArchived,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        categoryId: row.categoryId,
        sizeId: row.sizeId,
        kitchenId: row.kitchenId,
        cuisineId: row.cuisineId,
        images: [],
        category: row.cat_id
          ? {
              id: row.cat_id,
              name: row.cat_name,
              billboardLabel: row.billboardLabel,
            }
          : null,
        size: row.size_id
          ? { id: row.size_id, name: row.size_name, value: row.size_value }
          : null,
        kitchen: row.kitchen_id
          ? {
              id: row.kitchen_id,
              name: row.kitchen_name,
              value: row.kitchen_value,
            }
          : null,
        cuisine: row.cuisine_id
          ? {
              id: row.cuisine_id,
              name: row.cuisine_name,
              value: row.cuisine_value,
            }
          : null,
      });
    }
    if (row.img_id) {
      map.get(row.id).images.push({
        id: row.img_id,
        url: row.img_url,
        createdAt: row.img_createdAt,
        updatedAt: row.img_updatedAt,
      });
    }
  }
  return Array.from(map.values());
}

const getProducts = async (req, res, next) => {
  try {
    const { size, isFeatured, cuisine, category, kitchen, includeArchived } =
      req.query;

    const conditions = [];
    const params = [];
    let i = 1;

    if (!includeArchived) conditions.push(`p."isArchived" = false`);
    if (isFeatured !== undefined) {
      conditions.push(`p."isFeatured" = $${i++}`);
      params.push(isFeatured === "true");
    }
    if (category) {
      conditions.push(`LOWER(cat.name) = LOWER($${i++})`);
      params.push(category);
    }
    if (size) {
      conditions.push(`LOWER(s.name) = LOWER($${i++})`);
      params.push(size);
    }
    if (kitchen) {
      conditions.push(`LOWER(k.name) = LOWER($${i++})`);
      params.push(kitchen);
    }
    if (cuisine) {
      conditions.push(`LOWER(cu.name) = LOWER($${i++})`);
      params.push(cuisine);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await query(
      `${PRODUCT_JOIN_SQL} ${where} ORDER BY p."createdAt" DESC`,
      params,
    );

    res.json(rowsToProducts(result.rows).map(formatProduct));
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const result = await query(`${PRODUCT_JOIN_SQL} WHERE p.id = $1`, [
      req.params.id,
    ]);

    if (!result.rows.length)
      return res.status(404).json({ message: "Product not found" });

    res.json(formatProduct(rowsToProducts(result.rows)[0]));
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      kitchenId,
      cuisineId,
      images,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" });
    }

    // Insert product
    const productResult = await query(
      `INSERT INTO "Product" (id, name, description, price, "isFeatured", "isArchived", "categoryId", "sizeId", "kitchenId", "cuisineId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING id`,
      [
        name,
        description ?? "",
        parseFloat(price),
        !!isFeatured,
        !!isArchived,
        categoryId || null,
        sizeId || null,
        kitchenId || null,
        cuisineId || null,
      ],
    );

    const productId = productResult.rows[0].id;

    // Insert images
    if (images && images.length > 0) {
      for (const url of images) {
        await query(
          `INSERT INTO "Image" (id, url, "productId", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
          [url, productId],
        );
      }
    }

    // Fetch the complete product
    const result = await query(`${PRODUCT_JOIN_SQL} WHERE p.id = $1`, [
      productId,
    ]);

    res.status(201).json(formatProduct(rowsToProducts(result.rows)[0]));
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      kitchenId,
      cuisineId,
      images,
    } = req.body;

    const existingResult = await query(
      'SELECT id FROM "Product" WHERE id = $1',
      [req.params.id],
    );

    if (!existingResult.rows.length)
      return res.status(404).json({ message: "Product not found" });

    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      params.push(parseFloat(price));
    }
    if (isFeatured !== undefined) {
      updates.push(`"isFeatured" = $${paramIndex++}`);
      params.push(!!isFeatured);
    }
    if (isArchived !== undefined) {
      updates.push(`"isArchived" = $${paramIndex++}`);
      params.push(!!isArchived);
    }
    if (categoryId !== undefined) {
      updates.push(`"categoryId" = $${paramIndex++}`);
      params.push(categoryId || null);
    }
    if (sizeId !== undefined) {
      updates.push(`"sizeId" = $${paramIndex++}`);
      params.push(sizeId || null);
    }
    if (kitchenId !== undefined) {
      updates.push(`"kitchenId" = $${paramIndex++}`);
      params.push(kitchenId || null);
    }
    if (cuisineId !== undefined) {
      updates.push(`"cuisineId" = $${paramIndex++}`);
      params.push(cuisineId || null);
    }

    updates.push(`"updatedAt" = NOW()`);
    params.push(req.params.id);

    if (updates.length > 1) {
      const updateQuery = `UPDATE "Product" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id`;
      await query(updateQuery, params);
    }

    // Delete and recreate images if provided
    if (images !== undefined) {
      await query('DELETE FROM "Image" WHERE "productId" = $1', [
        req.params.id,
      ]);
      if (images.length > 0) {
        for (const url of images) {
          await query(
            `INSERT INTO "Image" (id, url, "productId", "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
            [url, req.params.id],
          );
        }
      }
    }

    // Fetch the complete product
    const result = await query(`${PRODUCT_JOIN_SQL} WHERE p.id = $1`, [
      req.params.id,
    ]);

    res.json(formatProduct(rowsToProducts(result.rows)[0]));
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const existingResult = await query(
      'SELECT id FROM "Product" WHERE id = $1',
      [req.params.id],
    );

    if (!existingResult.rows.length)
      return res.status(404).json({ message: "Product not found" });

    await query('DELETE FROM "Product" WHERE id = $1', [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

const formatProduct = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description ?? "",
  price: p.price,
  isFeatured: p.isFeatured,
  isArchived: p.isArchived,
  images: p.images,
  category: p.category?.name ?? null,
  categoryId: p.categoryId ?? null,
  size: p.size?.name ?? null,
  sizeId: p.sizeId ?? null,
  kitchen: p.kitchen?.name ?? null,
  kitchenId: p.kitchenId ?? null,
  cuisine: p.cuisine?.name ?? null,
  cuisineId: p.cuisineId ?? null,
  createdAt: p.createdAt,
  qty: 1,
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
