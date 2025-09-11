"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import GroupChatClient from "./GroupChatClient";
import { Message } from "../../../../../types/chat/chat";
import { useParams } from "next/navigation";
import ProtectedGroup from "./ProtectedGroup";
import LoadingChatSkeleton from "@/components/LoadingChatSkeleton";

export default function GroupChatPage() {
  const { id: groupId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!groupId) return;
    async function fetchGroupData() {
      setIsLoading(true);
      const { data: messagesData } = await supabase
        .from("GroupMessage")
        .select(
          `id,
             content,
             created_at,
             sender_id,
             profile: sender_id (username, avatar_url)`
        )
        .eq("group_id", groupId)
        .order("created_at", { ascending: true });

      const formattedMessages: Message[] =
        messagesData?.map((m) => ({
          id: m.id,
          content: m.content,
          created_at: m.created_at,
          sender_id: m.sender_id,
          profile: {
            username: m.profile?.username ?? "Unknown",
            avatar_url: m.profile?.avatar_url ?? "",
          },
        })) ?? [];

      setMessages(formattedMessages);
      setIsLoading(false);
    }
    fetchGroupData();
  }, [groupId]);

  if (isLoading) return <LoadingChatSkeleton />;
  return (
    <ProtectedGroup>
      <div className="flex flex-col w-full pt-20">
        <GroupChatClient
          groupId={groupId as string}
          initialMessages={messages}
        />
      </div>
    </ProtectedGroup>
  );
}
