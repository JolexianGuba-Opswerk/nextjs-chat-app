"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member } from "./ManageGroupMemberDialog";

export default function EditMemberCard({
  member,
  onKick,
  onVisibilityChange,
}: {
  member: Member;
  onKick: (userId: string) => void;
  onVisibilityChange: (userId: string, visibility: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar_url || ""} alt={member.username} />
          <AvatarFallback className="text-xs">
            {member.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{member.username}</span>
      </div>

      <div className="flex gap-2 items-center">
        <Select onValueChange={(val) => onVisibilityChange(member.id, val)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue
              placeholder={member.visible_from ? "Custom" : "forever"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1d</SelectItem>
            <SelectItem value="4">4d</SelectItem>
            <SelectItem value="8">8d</SelectItem>
            <SelectItem value="30">30d</SelectItem>
            <SelectItem value="forever">Forever</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="destructive" onClick={() => onKick(member.id)}>
          Kick
        </Button>
      </div>
    </div>
  );
}
