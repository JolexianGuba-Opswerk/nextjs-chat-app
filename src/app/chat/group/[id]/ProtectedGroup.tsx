"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import validateGroupAccess from "../../hooks/protected-group/validateGroupAccess";
import LoadingChatSkeleton from "@/components/LoadingChatSkeleton";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedGroup({ children }: Props) {
  const { id: groupId } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!groupId) return;
    let isMounted = true;

    async function validateAccess() {
      setLoading(true);
      const result = await validateGroupAccess(groupId as string, signal);

      if (!isMounted) return;
      if (result.error) {
        toast.error(result.error);
        router.replace("/chat/");
        return;
      }
      setLoading(false);
    }
    validateAccess();
    return () => {
      isMounted = false;
      controller.abort("Component unmounted");
    };
  }, []);

  if (loading) return <LoadingChatSkeleton />;

  return <>{children}</>;
}
