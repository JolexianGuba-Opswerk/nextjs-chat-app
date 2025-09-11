import { useState } from "react";

export default function useUpdateGroup() {
  const [isLoading, setIsLoading] = useState(false);

  const updateGroup = async (
    groupId: string,
    title: string,
    description: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/group/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      setIsLoading(false);
      const data = await res.json();
      return data;
    } catch (e) {
      setIsLoading(false);
      return { error: "Something went wrong" };
    }
  };

  return { updateGroup, isLoading };
}
