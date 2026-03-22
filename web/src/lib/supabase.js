import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a File to the "product-images" Supabase Storage bucket
 * and returns the permanent public URL.
 */
export async function uploadProductImage(file) {
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return publicUrl;
}
