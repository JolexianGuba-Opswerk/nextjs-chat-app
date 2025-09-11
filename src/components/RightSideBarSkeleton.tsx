"use client";

import { Users, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RightSideBarSkeleton() {
  return (
    <div className="w-70 border-l p-4 flex flex-col animate-pulse">
      {/* Group Header */}
      <div className="mb-6 space-y-2">
        <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-600 rounded"></div>
      </div>

      {/* Group Info */}
      <Card className="mb-6">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-1">
            <Users className="h-4 w-4" />{" "}
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="h-3 w-full bg-gray-600 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-600 rounded"></div>
          <div className="h-8 w-full bg-gray-700 rounded mt-2"></div>
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card className="mb-6 flex-1">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-1">
            <User className="h-4 w-4" />{" "}
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <div className="h-4 w-24 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Leave Group */}
      <div className="h-10 w-full bg-gray-700 rounded mt-auto"></div>
    </div>
  );
}
