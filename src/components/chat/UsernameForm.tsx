"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface UsernameFormProps {
  setUsername: (username: string) => void;
}

export default function UsernameForm({ setUsername }: UsernameFormProps) {
  const [username, setUsernameInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!username.trim) return;
    setUsername(trimmedUsername);
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Enter your username</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Type your username..."
            />
          </CardContent>
          <CardFooter className="flex justify-end mt-3">
            <Button type="submit">Join Chat</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
