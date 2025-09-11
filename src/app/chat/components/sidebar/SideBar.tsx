"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabase } from "@/lib/supabase/supabaseBrowserClient";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Search,
  Users,
  Globe,
  Shield,
  Network,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import getMyGroups from "../../hooks/getMyGroups";
import getCurrentSession from "@/lib/supabase/getCurrentSession";
import { GroupsType } from "../../../../../types/chat/chat";
import { toast } from "sonner";
import CreateGroupDialog from "./CreateGroupDialog";
import getGlobalGroups from "../../hooks/getGlobalGroups";
import updateOnlineStatus from "../../hooks/updateOnlineStatus";

type GroupItem = {
  id: string;
};

function SideBar() {
  const currentPath = usePathname();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupsType[] | null>(null);
  const [globalGroups, setGlobalGroups] = useState<GroupsType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    myGroups: true,
    globalGroups: true,
    globalChat: true,
  });

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        const currentUser = await getCurrentSession();
        if (!currentUser) return;

        const [{ data: groups }, { data: globalGroups }] = await Promise.all([
          getMyGroups(currentUser.id),
          getGlobalGroups(currentUser.id),
        ]);

        setGroups(groups);
        setGlobalGroups(globalGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGroupClick = (group: GroupItem) => {
    router.push(`/chat/group/${group.id}`);
  };

  const handleOwnGroupClick = (group: GroupItem) => {
    router.push(`/chat/group/${group.id}`);
  };

  const [search, setSearch] = useState("");

  const filteredMyGroups = groups?.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlobalGroups = globalGroups?.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    const supabase = createBrowserSupabase();
    await updateOnlineStatus({ event: "LOGOUT" });
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Error in logging out");
    } else {
      router.push("/login");
    }
  };

  const GroupSkeleton = () => (
    <div className="flex items-center p-2">
      <Skeleton className="h-4 w-32 rounded-md" />
    </div>
  );

  return (
    <div className="w-72 h-screen text-white flex flex-col border-r ">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1
          className="text-lg font-bold"
          onClick={() => router.replace("/chat/")}
        >
          ChatApp
        </h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 pointer"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 border-gray-700 text-white"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search groups..."
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Create New Group */}
      <div className="p-4 border-b border-gray-700">
        <CreateGroupDialog />
      </div>

      {/* My Groups */}
      <div className="border-b border-gray-700">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800"
          onClick={() => toggleSection("myGroups")}
        >
          <h2 className="font-semibold text-sm text-gray-400 flex items-center">
            <Users className="mr-2 h-4 w-4" /> My Groups
          </h2>
          {expandedSections.myGroups ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.myGroups && (
          <div className="px-4 pb-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <GroupSkeleton key={i} />
                ))}
              </div>
            ) : filteredMyGroups?.length ? (
              <div className="space-y-1">
                {filteredMyGroups.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleOwnGroupClick(g)}
                  >
                    <span className="text-sm">#{g.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No groups available.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Global Groups */}
      <div className="border-b border-gray-700">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800"
          onClick={() => toggleSection("globalGroups")}
        >
          <h2 className="font-semibold text-sm text-gray-400 flex items-center">
            <Network className="mr-2 h-4 w-4" /> Global Groups
          </h2>
          {expandedSections.globalGroups ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.globalGroups && (
          <div className="px-4 pb-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <GroupSkeleton key={i} />
                ))}
              </div>
            ) : filteredGlobalGroups?.length ? (
              <div className="space-y-1">
                {filteredGlobalGroups.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleGroupClick(g)}
                  >
                    <span className="text-sm">#{g.title}</span>
                    <Shield className="h-3 w-3 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No global groups available.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Global Chat */}
      <div>
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800"
          onClick={() => toggleSection("globalChat")}
        >
          <h2 className="font-semibold text-sm text-gray-400 flex items-center">
            <Globe className="mr-2 h-4 w-4" /> Global Chat
          </h2>
          {expandedSections.globalChat ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.globalChat && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors">
              <span className="text-sm">#Global Chat</span>
              {currentPath === "/chat/global" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="text-xs h-7"
                >
                  Joined
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.replace("/chat/global")}
                  className="text-xs h-7 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
                >
                  Join
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(SideBar);
