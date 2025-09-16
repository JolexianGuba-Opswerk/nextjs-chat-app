"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import useAddMembers from "@/app/chat/hooks/useAddMember";
import AddMembersSection from "./AddMemberSection";
import MemberList from "./MemberListSection";

export type Member = {
  id: string;
  username: string;
  avatar_url?: string | null;
  visible_from: string | null;
};

type Props = {
  groupId: string;
};

export default function ManageGroupMemberDialog({ groupId }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { addMembers, isLoading: adding } = useAddMembers();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("UserGroup")
        .select(
          `
          id,
          visible_from,
          user: user_id (
            id,
            username,
            avatar_url
          )
        `
        )
        .eq("group_id", parseInt(groupId));

      if (error) throw error;

      setMembers(
        (data || []).map(
          (m: {
            user: { id: string; username: string; avatar_url?: string | null };
            visible_from: string | null;
          }) => ({
            id: m.user.id,
            username: m.user.username,
            avatar_url: m.user.avatar_url,
            visible_from: m.visible_from,
          })
        )
      );
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mode === "edit") fetchMembers();
  }, [isOpen, mode]);

  const handleKick = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("UserGroup")
        .delete()
        .eq("group_id", parseInt(groupId))
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("Member removed");
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch {
      toast.error("Failed to kick member");
    }
  };

  const handleVisibilityChange = async (userId: string, visibility: string) => {
    try {
      let visible_from: string | null = null;

      if (visibility !== "forever") {
        const now = new Date();
        const days = parseInt(visibility, 10);
        now.setDate(now.getDate() - days);
        now.setHours(0, 0, 0, 0);
        visible_from = now.toISOString();
      }

      const { error } = await supabase
        .from("UserGroup")
        .update({ visible_from })
        .eq("group_id", parseInt(groupId))
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Visibility updated");
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, visible_from } : m))
      );
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleAddMembers = async (usernames: string, visibility: string) => {
    const usernamesList = usernames
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    if (usernamesList.length === 0) {
      return toast.error("Add at least one username");
    }

    const users = usernamesList.map((username) => ({
      username: username,
      visibility,
    }));
    const response = await addMembers(groupId, users);
    const resultArray = response?.results;

    if (!Array.isArray(resultArray)) {
      toast.error(response?.error || "Something went wrong");
      return;
    }

    resultArray.forEach((item) => {
      if (item.status === "User not found" || item.status === "Failed to add") {
        toast.error(` ${item.status}`);
      } else {
        toast.success(`${item.username} - ${item.status}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Members</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
          <DialogDescription>
            Add, edit visibility, or remove members from this group.
          </DialogDescription>
        </DialogHeader>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "add" ? "default" : "outline"}
            onClick={() => setMode("add")}
          >
            Add Members
          </Button>
          <Button
            variant={mode === "edit" ? "default" : "outline"}
            onClick={() => setMode("edit")}
          >
            Edit Members
          </Button>
        </div>

        {mode === "add" ? (
          <AddMembersSection
            onAddMembers={handleAddMembers}
            isLoading={adding}
          />
        ) : (
          <MemberList
            members={members}
            loading={loading}
            onKick={handleKick}
            onVisibilityChange={handleVisibilityChange}
          />
        )}

        <DialogFooter>
          {mode === "edit" && <Button onClick={fetchMembers}>Refresh</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
