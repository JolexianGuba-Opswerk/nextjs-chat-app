"use client";

import { Shield, Users, User, LogOut } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import useRightSidebar from "../../../app/chat/hooks/useRightSidebarHooks";
import { useParams, usePathname } from "next/navigation";
import RightSideBarSkeleton from "@/components/RightSideBarSkeleton";
import GroupSettingsDialog from "./ManageGroupSettingsDialog";
import ManageGroupMemberDialog from "./ManageGroupMemberDialog";

export default function RightSideBar() {
  const pathname = usePathname();
  const { id } = useParams();
  const groupId = Array.isArray(id) ? id[0] : id;

  const { currentGroup, onlineUsers, loading, error } =
    useRightSidebar(groupId);

  if (!pathname.startsWith("/chat/group")) return null;

  if (loading) return <RightSideBarSkeleton />;

  if (!currentGroup || error) {
    return (
      <div className="w-64 border-l p-4 flex items-center justify-center text-muted-foreground">
        Error loading group
      </div>
    );
  }

  return (
    <div className="w-72 border-l p-4 flex flex-col gap-6">
      {/* Group Header */}
      <div>
        <h3 className="font-bold text-lg flex items-center">
          #{currentGroup.name}
          {currentGroup.isPrivate && (
            <Shield className="ml-1 h-4 w-4 text-muted-foreground" />
          )}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentGroup.description}
        </p>
      </div>

      {/* Group Info */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center">
            <Users className="mr-1 h-4 w-4" /> GROUP INFO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created by</span>
            <span className="font-medium">{currentGroup.createdBy}</span>
          </div>
          <div className="flex justify-between">
            <span>Members</span>
            <span className="font-medium">{currentGroup.members}</span>
          </div>
          <div className="flex justify-between">
            <span>Privacy</span>
            <span className="font-medium">
              {currentGroup.isPrivate ? "Private" : "Public"}
            </span>
          </div>
        </CardContent>

        {currentGroup.isOwner && (
          <CardFooter className="p-4 pt-2">
            <GroupSettingsDialog
              groupId={parseInt(currentGroup.id)}
              currentDescription={currentGroup.description}
              currentTitle={currentGroup.name}
            />
          </CardFooter>
        )}
      </Card>

      {/* Online Users */}
      <Card className="flex-1 flex flex-col ">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center">
            <User className="mr-1 h-4 w-4" /> ONLINE MEMBERS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {onlineUsers.length > 0 ? (
                onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No online users yet
                </span>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {currentGroup.isOwner && (
          <CardFooter className="p-4">
            <ManageGroupMemberDialog groupId={currentGroup.id} />
          </CardFooter>
        )}
      </Card>

      {/* Leave Group */}
      {!currentGroup.isOwner && (
        <Button variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> Leave Group
        </Button>
      )}
    </div>
  );
}
