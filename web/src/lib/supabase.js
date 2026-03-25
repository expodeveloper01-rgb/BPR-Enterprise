import { createClient } from "@supabase/supabase-js";
import useAuth from "@/hooks/use-auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a File to the backend API which then uploads to Supabase
 * This bypasses client-side storage RLS issues
 */
export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Get token from Zustand auth store
    const { token } = useAuth.getState();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/upload/image`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}
