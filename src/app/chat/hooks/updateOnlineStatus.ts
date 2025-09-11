import getCurrentSession from "@/lib/supabase/getCurrentSession";
import { supabase } from "@/lib/supabase/supabaseClient";

type onlineStatus = {
  event: "LOGIN" | "LOGOUT";
};
export default async function updateOnlineStatus({ event }: onlineStatus) {
  const user = await getCurrentSession();
  if (!user) {
    throw new Error("No user session found.");
  }
  const status = event === "LOGIN";
  const { data, error } = await supabase
    .from("Users")
    .update({ is_online: status })
    .eq("id", user.id);
  if (error) throw error;
  return data;
}
