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
  if (loading) return <p>Loading...</p>;
  if (members.length === 0)
    return <p className="text-gray-500">No members found.</p>;

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
