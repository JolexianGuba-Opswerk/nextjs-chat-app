import { createBrowserSupabase } from "./supabaseBrowserClient";
export default async function getCurrentSession() {
  const supabase = createBrowserSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }

  if (user) {
    return user;
  } else {
    return null;
  }
}
