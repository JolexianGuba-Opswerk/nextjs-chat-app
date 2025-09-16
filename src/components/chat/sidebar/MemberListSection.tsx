"use client";

import EditMemberCard from "./EditMemberCard";
import { Member } from "./ManageGroupMemberDialog";

export default function MemberList({
  members,
  loading,
  onKick,
  onVisibilityChange,
}: {
  members: Member[];
  loading: boolean;
  onKick: (userId: string) => void;
  onVisibilityChange: (userId: string, visibility: string) => void;
}) {
  if (loading)
    return <span className="text-sm text-muted-foreground">Loading...</span>;
  if (members.length === 0)
    return (
      <span className="text-sm text-muted-foreground">No members found.</span>
    );

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {members.map((member) => (
        <EditMemberCard
          key={member.id}
          member={member}
          onKick={onKick}
          onVisibilityChange={onVisibilityChange}
        />
      ))}
    </div>
  );
}
