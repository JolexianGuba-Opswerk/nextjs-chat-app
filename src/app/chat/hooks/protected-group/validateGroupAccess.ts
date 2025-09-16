export default async function validateGroupAccess(
  groupId: number,
) {
  const res = await fetch("/api/chat/validate-access", {
    method: "POST",
    body: JSON.stringify({
      groupId,
    }),
    credentials: "include",
   
  });
  const result = await res.json();
  return result;
}
