"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingChatSkeleton() {
  return (
    <div className="flex flex-col h-full shadow-lg">
      <ScrollArea className="overflow-y-auto h-full p-4 flex-1">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex gap-2 mb-4 ${
                idx % 2 === 0 ? "justify-start" : "justify-end"
              } items-end`}
            >
              {idx % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}

              <div className="flex flex-col max-w-xs">
                <Skeleton
                  className={`h-6 w-48 rounded-lg ${
                    idx % 2 === 0 ? "" : "ml-auto"
                  }`}
                />
                <Skeleton
                  className={`h-4 w-32 mt-1 ${idx % 2 === 0 ? "" : "ml-auto"}`}
                />
              </div>

              {idx % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 p-2 border-t">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  );
}
