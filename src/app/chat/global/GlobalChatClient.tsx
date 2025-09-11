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
    Map<string, { username: string; avatar_url?: string }>
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
              profile = await getCurrentProfile(newMessage.sender_id);
              if (profile)
                profilesCache.current.set(newMessage.sender_id, profile);
            }

            setMessages((prev) => [...prev, { ...newMessage, profile }]);
          }
        )
        .subscribe((status) => {
          console.log("subscription status:", status);
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

  if (loadingUser) {
    return <LoadingChatSkeleton />;
  }

  return (
    <div className="w-full h-[90vh]">
      <ChatWindow
        messages={messages}
        senderId={senderId as string}
        onSend={handleSend}
      />
    </div>
  );
}
