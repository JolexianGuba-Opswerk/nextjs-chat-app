"use client";

import { useState, useEffect } from "react";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  unread?: number;
  isPrivate: boolean;
  createdBy: string;
  isOwner: boolean;
}

export interface UserType {
  id: string;
  name: string;
  status: boolean;
}

export default function useRightSidebar(groupId: string | undefined) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat/sidebar/${groupId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch group data");
        const data = await res.json();

        setCurrentGroup(data.group);
        setOnlineUsers(data.onlineUsers);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  return { currentGroup, onlineUsers, loading, error };
}
