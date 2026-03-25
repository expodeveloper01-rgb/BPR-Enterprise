const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// POST /api/v1/upload/image
router.post("/image", protect, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const ext = req.file.originalname.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    res.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
