import { supabase } from "@/lib/supabase/supabaseClient";

export default async function getGlobalGroups(userId: string) {
  return await supabase
    .from("Groups")
    .select("*")
    .neq("created_by", userId)
    .order("created_at", { ascending: true });
}
