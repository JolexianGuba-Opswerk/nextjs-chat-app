import { supabase } from "@/lib/supabase/supabaseClient";
import ChatClient from "./GlobalChatClient";

export default async function GlobalChatPage() {
  const { data: messages } = await supabase
    .from("GlobalMessage")
    .select(
      `   id,
      content,
      created_at,
      sender_id,
      profile: sender_id (username, avatar_url)`
    )
    .eq("is_global", true)
    .order("created_at", { ascending: true });

  if (!messages) {
    return (
      <p className="text-muted-foreground text-sm text-center align-middle   mt-20">
        No chats available.
      </p>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <ChatClient initialMessages={messages ?? []} />
    </div>
  );
}
