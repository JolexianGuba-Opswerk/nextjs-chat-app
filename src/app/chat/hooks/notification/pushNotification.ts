import { createServerSupabase } from "@/lib/supabase/supabaseServer";
import { PushNotification } from "../../../../../types/notification/notification";

export default async function pushNotification(notification: PushNotification) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("Notification").insert(notification);

  if (error) return error;
}
