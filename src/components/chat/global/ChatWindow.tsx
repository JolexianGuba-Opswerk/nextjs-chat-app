"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useEffect, useRef } from "react";
import { formatDate } from "@/lib/formatDate";
import { Message } from "../../../../types/chat/chat";

interface ChatWindowProps {
  messages: Message[];
  senderId: string;
  onSend: (text: string) => void;
}

export default function ChatWindow({
  messages,
  senderId,
  onSend,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (new FormData(e.currentTarget).get("message") as string) || "";
    if (text.trim()) onSend(text);
    e.currentTarget.reset();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({});
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full shadow-lg ">
      <ScrollArea className="overflow-y-auto h-full p-4 flex-1">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center align-middle   mt-20">
            No group chats available.
          </p>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender_id === senderId;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 mb-4 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } items-end`}
              >
                {!isCurrentUser && (
                  <Avatar>
                    <AvatarImage src={msg?.profile?.avatar_url ?? undefined} />
                    <AvatarFallback>{msg?.profile?.username[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col max-w-xs">
                  <div
                    className={`text-sm p-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-600 text-white self-end"
                        : "bg-muted text-black dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-right m-1 text-gray-600 dark:text-gray-400">
                    <strong> {msg?.profile?.username} </strong>•{" "}
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                {isCurrentUser && (
                  <Avatar>
                    <AvatarImage src={msg?.profile?.avatar_url ?? undefined} />
                    <AvatarFallback>{msg.profile?.username[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}

        <div ref={scrollRef}></div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t">
        <Input name="message" placeholder="Type a message..." />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
