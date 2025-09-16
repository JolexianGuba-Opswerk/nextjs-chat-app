import GroupChatClient from "./GroupChatClient";
import ProtectedGroup from "./ProtectedGroup";
import { getAllMessages } from "../../hooks/message/getAllMessages";

interface Props {
  params: { id: number };
}

export default async function GroupChatPage({ params }: Props) {
  const { id: groupId } = await params;
  const res = await getAllMessages(groupId);
  if (res.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm text-muted-foreground">
          Error in getting all the messages [{res.error}]
        </span>
      </div>
    );
  }
  return (
    <ProtectedGroup>
      <div className="flex flex-col w-full ">
        <GroupChatClient
          groupId={groupId}
          initialMessages={res.messages ?? []}
        />
      </div>
    </ProtectedGroup>
  );
}
