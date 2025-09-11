import { supabase } from "@/lib/supabase/supabaseClient";

export default async function getMyGroups(userId: string) {
  return await supabase
    .from("Groups")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: true });
}
