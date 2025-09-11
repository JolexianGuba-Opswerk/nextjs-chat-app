"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import useAddMembers from "../../hooks/useAddMember";
import useUpdateGroup from "../../hooks/useUpdateGroup";

type Props = {
  groupId: string;
  currentTitle: string;
  currentDescription: string;
};
type AddMemberResult = {
  username: string;
  status: string;
};

export default function AddMemberDialog({
  groupId,
  currentTitle,
  currentDescription,
}: Props) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [usernames, setUsernames] = useState("");
  const { addMembers, isLoading } = useAddMembers();
  const { updateGroup, isLoading: updateIsLoading } = useUpdateGroup();
  const handleAddMembers = async () => {
    const usernamesList = usernames
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (usernamesList.length === 0)
      return toast.error("Add at least one email");

    const result = await addMembers(groupId, usernamesList);

    if (result.error) {
      toast.error(result.error);
    } else {
      result.results.forEach((r: AddMemberResult) => {
        toast.success(`${r.status}`);
      });
      setUsernames("");
    }
  };

  const handleUpdateGroup = async () => {
    if (!title.trim() || !description.trim())
      return toast.error("Title and Description required");
    const updateResult = await updateGroup(groupId, title, description);

    if (!updateResult.error) {
      toast.success(updateResult.message);
      setTitle("");
      setDescription("");
    } else {
      toast.error(updateResult.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Group Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>
            Update group details or add members by email.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <input
              id="title"
              className="col-span-3 border rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="usernames" className="text-right">
              Add Members
            </Label>
            <div className="col-span-3 flex gap-2">
              <Textarea
                id="usernames"
                placeholder="Enter username separated by commas"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddMembers} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdateGroup} disabled={updateIsLoading}>
            {updateIsLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
