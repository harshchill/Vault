import { createClient } from "@supabase/supabase-js";

export const SUPABASE_STORAGE_BUCKET = "Vault";

export const getSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABSE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

export const deleteSupabaseFile = async (storageFileName) => {
  if (!storageFileName) {
    return { success: false, error: "Storage filename missing." };
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .remove([storageFileName]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
