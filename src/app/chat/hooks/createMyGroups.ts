import { CreateGroupProps } from "../../../../types/chat/chat";
import { toast } from "sonner";

export default async function createMyGroup({
  description,
  title,
}: CreateGroupProps) {
  const res = await fetch("/api/chat/group/", {
    method: "POST",
    body: JSON.stringify({
      description,
      title,
    }),
    credentials: "include",
  });
  const result = await res.json();
  if (result.error) {
    toast.error(result.error);
    return result;
  }
  toast.success(result.message);
  return result;
}
