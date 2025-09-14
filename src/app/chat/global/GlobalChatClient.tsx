"use client";

import ChatWindow from "@/components/chat/global/ChatWindow";
import { useEffect, useState, useRef } from "react";
import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";
import getCurrentSession from "@/lib/supabase/getCurrentSession";
import getCurrentProfile from "../hooks/getCurrentProfile";
import { Message } from "../../../../types/chat/chat";
import LoadingChatSkeleton from "@/components/LoadingChatSkeleton";
import { RealtimeChannel } from "@supabase/supabase-js";

type ChatClientProps = {
  initialMessages: Message[];
};

export default function GlobalChatClient({ initialMessages }: ChatClientProps) {
  const supabase = createBrowserSupabase();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const profilesCache = useRef<
    Map<string, { username: string; avatar_url: string | null }>
  >(new Map());

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchUser = async () => {
      const user = await getCurrentSession();
      if (!user) return;

      setSenderId(user.id);
      setLoadingUser(false);

      channel = supabase
        .channel("messages-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "GlobalMessage" },
          async (payload) => {
            const newMessage = payload.new;
            let profile = profilesCache.current.get(newMessage.sender_id);
            if (!profile) {
              const fetchedProfile = await getCurrentProfile(
                newMessage.sender_id
              );
              profile = fetchedProfile || undefined;
              if (profile)
                profilesCache.current.set(newMessage.sender_id, profile);
            }
            const normalizedProfile = {
              username: profile?.username ?? "Unknown",
              avatar_url: profile?.avatar_url ?? null,
            };
            const formattedMessage: Message = {
              id: newMessage.id,
              content: newMessage.content,
              created_at: newMessage.created_at,
              sender_id: newMessage.sender_id,
              profile: normalizedProfile,
            };

            setMessages((prev) => [...prev, formattedMessage]);
          }
        )
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") {
            setLoadingUser(true);
          }
        });
    };

    fetchUser();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [supabase]);

  const handleSend = async (text: string) => {
    if (!senderId) return;

    await supabase.from("GlobalMessage").insert({
      content: text,
      sender_id: senderId,
      is_global: true,
    });
  };

  return (
    <div className="w-full h-[100vh]">
      {loadingUser ? (
        <LoadingChatSkeleton />
      ) : (
        <ChatWindow
          messages={messages}
          senderId={senderId as string}
          onSend={handleSend}
        />
      )}
    </div>
  );
}
