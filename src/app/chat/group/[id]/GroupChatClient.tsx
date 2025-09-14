"use client";

import ChatWindow from "@/components/chat/global/ChatWindow";
import { useEffect, useState, useRef } from "react";
import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";
import getCurrentSession from "@/lib/supabase/getCurrentSession";
import getCurrentProfile from "@/app/chat/hooks/getCurrentProfile";
import { Message } from "../../../../../types/chat/chat";
import { RealtimeChannel } from "@supabase/supabase-js";
import LoadingChatSkeleton from "@/components/LoadingChatSkeleton";

type GroupChatClientProps = {
  groupId: number;
  initialMessages: Message[];
};

export default function GroupChatClient({
  groupId,
  initialMessages,
}: GroupChatClientProps) {
  console.log("3");
  const supabase = createBrowserSupabase();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profilesCache = useRef<
    Map<string, { username: string; avatar_url: string | null }>
  >(new Map());

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchUser = async () => {
      const user = await getCurrentSession();
      if (!user) return;

      setSenderId(user.id);
      setIsLoading(false);

      channel = supabase
        .channel(`group-messages-${groupId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "GroupMessage",
            filter: `group_id=eq.${groupId}`,
          },
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
            setIsLoading(true);
          }
          console.log("Subscription Status", status);
        });
    };
    fetchUser();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const handleSend = async (text: string) => {
    if (!senderId) return;

    await supabase.from("GroupMessage").insert({
      content: text,
      sender_id: senderId,
      group_id: groupId,
    });
  };

  return (
    <div className="w-full h-[100vh]">
      {!messages || isLoading || !senderId ? (
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
