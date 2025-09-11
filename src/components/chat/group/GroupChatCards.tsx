"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, User } from "lucide-react";
import { GroupChatCardProps } from "../../../../types/chat/chat";

import { useRouter } from "next/navigation";

export default function GroupChatCard({
  id,
  title,
  description,
  created_by,
  members,
}: GroupChatCardProps) {
  const router = useRouter();
  const handleJoin = () => {
    router.replace(`/chat/group/${id}`);
  };

  return (
    <Card
      className="w-full max-w-[400px] p-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-border/60"
      onClick={handleJoin}
    >
      <CardHeader className="p-2 space-y-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold leading-tight truncate text-foreground max-w-[180px]">
            #{title}
          </CardTitle>
          <div className="flex items-center text-xs text-muted-foreground ml-2 shrink-0">
            <Users className="h-3.5 w-3.5 mr-1" />
            {members}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground line-clamp-2">
          {description || "No description provided."}
        </CardDescription>
        <div className="flex justify-between items-center text-xs text-muted-foreground/70">
          <div className="flex items-center truncate max-w-[120px]">
            <User className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span className="font-medium truncate">{created_by}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
