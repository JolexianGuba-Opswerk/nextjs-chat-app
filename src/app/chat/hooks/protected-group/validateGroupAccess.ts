export default async function validateGroupAccess(
  groupId: string,
  signal: AbortSignal
) {
  const res = await fetch("/api/chat/validate-access", {
    method: "POST",
    body: JSON.stringify({
      groupId,
    }),
    credentials: "include",
    signal,
  });
  const result = await res.json();
  return result;
}
