import { supabase } from "@/lib/supabase/supabaseClient";
import ChatClient from "./GlobalChatClient";
import { Message } from "../../../../types/chat/chat";

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

  const formattedMessages: Message[] = messages.map((m) => ({
    id: m.id,
    content: m.content,
    created_at: m.created_at,
    sender_id: m.sender_id,
    profile: {
      username: m.profile?.username ?? "Unknown",
      avatar_url: m.profile?.avatar_url ?? "",
    },
  }));

  return (
    <div className="flex flex-col w-full pt-20">
      <ChatClient initialMessages={formattedMessages ?? []} />
    </div>
  );
}
