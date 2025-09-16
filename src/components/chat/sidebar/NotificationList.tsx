"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/timeAgo";

type Notification = {
  created_at: string;
  id: number;
  is_read: boolean;
  message: string;

  recipient_id: string | null;
  redirection_url: string | null;
  sender_id: string;
  title: string;
  type: string | null;
};

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathName = usePathname();
  const supabase = createBrowserSupabase();

  const fetchNotifications = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Notification")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);

    if (!error && data) setNotifications(data);
    setLoading(false);
  };

  const markAllAsRead = async () => {
    const recipientId = notifications[0]?.recipient_id;
    if (!recipientId) return;

    const { error } = await supabase
      .from("Notification")
      .update({ is_read: true })
      .eq("recipient_id", recipientId)
      .neq("is_read", true);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const handleClick = async (notification: Notification) => {
    if (
      notification.redirection_url &&
      pathName !== notification.redirection_url
    ) {
      router.push(notification.redirection_url);

      // mark as read only if navigating
      await supabase
        .from("Notification")
        .update({ is_read: true })
        .eq("id", notification.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 border border-gray-700 text-white"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="text-gray-300">
            Notifications
          </DropdownMenuLabel>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />

        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="max-h-80 overflow-y-auto ">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex flex-col items-start space-y-1 cursor-pointer px-3 py-2 rounded-md m-2 ${
                  n.is_read
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-gray-400">{n.message}</p>
                <span className="text-[10px] text-gray-500 mt-1">
                  {timeAgo(n.created_at)}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm py-3">
            No notifications
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
