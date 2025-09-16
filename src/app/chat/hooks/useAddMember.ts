import { useState } from "react";

export default function useAddMembers() {
  const [isLoading, setIsLoading] = useState(false);

  const addMembers = async (groupId: string, users:{username:string, visibility:string}[]) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/group/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, users }),
        credentials: "include",
      });

      const data = await res.json();
      setIsLoading(false);
      return data;
    } catch (e) {
      setIsLoading(false);
      return { error: "Something went wrong" };
    }
  };

  return { addMembers, isLoading };
}
