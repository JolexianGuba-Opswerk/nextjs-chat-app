"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddMembersSection({
  onAddMembers,
  isLoading,
}: {
  onAddMembers: (usernames: string, visibility: string) => void;
  isLoading: boolean;
}) {
  const [newUsernames, setNewUsernames] = useState("");
  const [visibility, setVisibility] = useState("forever");

  const handleAdd = () => {
    if (!newUsernames.trim()) return;
    onAddMembers(newUsernames, visibility);

    setNewUsernames("");
  };

  return (
    <div className="space-y-3 mb-6">
      <Label>Add Members</Label>
      <Textarea
        placeholder="Enter usernames separated by commas"
        value={newUsernames}
        onChange={(e) => setNewUsernames(e.target.value)}
      />
      <Select value={visibility} onValueChange={setVisibility}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1d</SelectItem>
          <SelectItem value="4">4d</SelectItem>
          <SelectItem value="8">8d</SelectItem>
          <SelectItem value="30">30d</SelectItem>
          <SelectItem value="forever">Forever</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleAdd} disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </div>
  );
}
