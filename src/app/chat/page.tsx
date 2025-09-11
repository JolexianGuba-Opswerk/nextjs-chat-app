import GroupChatCard from "@/components/chat/group/GroupChatCards";

import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";

export default async function GroupChatPage() {
  const supabase = createBrowserSupabase();
  const { data: groupChats, error } = await supabase
    .from("Groups")
    .select(
      `*,
     created_by ( username )
     `
    )
    .order("created_at", { ascending: false });

  if (!groupChats || groupChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">
            No Group Chats Yet
          </h3>
          <p className="text-muted-foreground mt-2">
            There are no group chats available. Be the first to create one!
          </p>
        </div>
      </div>
    );
  }
  const groupsWithCounts = await Promise.all(
    groupChats.map(async (chat) => {
      const { count, error: countError } = await supabase
        .from("UserGroup")
        .select("*", { count: "exact", head: true })
        .eq("group_id", chat.id);

      if (countError) {
        console.error(
          `Error counting members for group ${chat.id}`,
          countError
        );
      }

      return {
        ...chat,
        members: count ?? 0,
      };
    })
  );

  if (error) {
    console.error("Error fetching group chats:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error Loading Groups
          </h3>
          <p className="text-muted-foreground mt-2">
            Unable to load group chats. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!groupChats || groupChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">
            No Group Chats Yet
          </h3>
          <p className="text-muted-foreground mt-2">
            There are no group chats available. Be the first to create one!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Group Chats
        </h2>
        <p className="text-muted-foreground">
          Browse and join available group chats
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groupsWithCounts.map((chat) => (
          <GroupChatCard
            id={chat.id}
            key={chat.id}
            title={chat.title}
            members={chat.members}
            description={chat.description}
            created_by={chat.created_by.username}
          />
        ))}
      </div>
    </div>
  );
}
