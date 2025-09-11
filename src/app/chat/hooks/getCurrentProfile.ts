import { supabase } from "@/lib/supabase/supabaseClient";

export default async function getCurrentProfile(userId: string) {
  const { data } = await supabase
    .from("Users")
    .select("username, avatar_url")
    .eq("id", userId);
  if (!data) return null;

  return data[0];
}
