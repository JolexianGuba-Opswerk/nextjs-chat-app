"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import createMyGroup from "../../hooks/createMyGroups";
import { toast } from "sonner";

export default function CreateGroupDialog() {
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDescription, setNewGroupDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    setIsLoading(true);
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (!newGroupDescription.trim()) {
      toast.error("Group description is required");
      return;
    }

    const result = await createMyGroup({
      description: newGroupDescription,
      title: newGroupName,
    });
    if (!result.error) {
      setNewGroupName("");
      setNewGroupDescription("");
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group chat for people to join.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Group Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="col-span-3"
              placeholder="Group name"
              required={true}
            />
          </div>

          {/* Group Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="col-span-3"
              required={true}
              placeholder="Group description"
            />
          </div>
        </div>

        <DialogFooter>
          {isLoading ? (
            <Button
              type="submit"
              onClick={handleCreateGroup}
              className="text-muted-foreground "
            >
              Creating
            </Button>
          ) : (
            <Button type="submit" onClick={handleCreateGroup}>
              Create Group
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
