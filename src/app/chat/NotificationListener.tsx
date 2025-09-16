"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";
import getCurrentSession from "@/lib/supabase/getCurrentSession";
import { realtimeStatusHandler } from "@/lib/supabase/realtimeStatusHandler";

export type NotificationRow = {
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

export default function NotificationListener() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  useEffect(() => {
    let subscription: ReturnType<
      ReturnType<typeof createBrowserSupabase>["channel"]
    > | null = null;

    const setupNotificationListener = async () => {
      try {
        const session = await getCurrentSession();
        if (!session) return;

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user:", userError);
          return;
        }

        if (!user) return;

        const channelName = `notifications:${user.id}`;

        subscription = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "Notification",
              filter: `recipient_id=eq.${user.id}`,
            },
            (payload) => {
              // Validate payload structure
              if (!payload.new || typeof payload.new !== "object") {
                console.error("Invalid notification payload:", payload);
                return;
              }

              const notification = payload.new as NotificationRow;

              // Validate required fields
              if (!notification.title || !notification.message) {
                console.error(
                  "Notification missing required fields:",
                  notification
                );
                return;
              }

              toast(notification.title, {
                description: notification.message,
                action: notification.redirection_url
                  ? {
                      label: "View",
                      onClick: () => router.push(notification.redirection_url!),
                    }
                  : undefined,
                duration: 10000,
              });
            }
          )
          .subscribe((status) => {
            realtimeStatusHandler(
              status,
              subscription,
              setupNotificationListener
            );
          });
      } catch (error) {
        console.error("Error setting up notification listener:", error);
      }
    };

    setupNotificationListener();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, supabase]);

  return null;
}
