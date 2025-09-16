"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Props = {
  groupId: number;
  currentTitle: string;
  currentDescription: string;
};

export default function ManageGroupSettingsDialog({
  groupId,
  currentTitle,
  currentDescription,
}: Props) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [loading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("Groups")
      .update({
        title,
        description,
      })
      .eq("id", groupId);

    if (error) {
      toast.error("Failed to update settings");
    } else {
      toast.success("Group settings updated");
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Group Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>
            Update group name, description, and privacy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSave}>
            <span className="text-sm text-muted-foreground">
              {" "}
              {loading ? "Saving..." : "Save"}
            </span>
            ;
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
