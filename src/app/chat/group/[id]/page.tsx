import { supabase } from "@/lib/supabase/supabaseClient";
import GroupChatClient from "./GroupChatClient";
import ProtectedGroup from "./ProtectedGroup";

interface Props {
  params: { id: number };
}

export default async function GroupChatPage({ params }: Props) {
  const { id: groupId } = await params;

  const { data: messages } = await supabase
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

  return (
    <ProtectedGroup>
      <div className="flex flex-col w-full ">
        <GroupChatClient groupId={groupId} initialMessages={messages ?? []} />
      </div>
    </ProtectedGroup>
  );
}
