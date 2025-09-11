import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(req: NextRequest) {
  const { groupId, usernames } = await req.json();

  if (
    !groupId ||
    !usernames ||
    !Array.isArray(usernames) ||
    usernames.length === 0
  ) {
    return NextResponse.json(
      { error: "Group ID and usernames are required" },
      { status: 400 }
    );
  }

  const results: { username: string; status: string }[] = [];

  for (const username of usernames) {
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("id, username")
      .eq("username", username)
      .single();

    if (userError || !userData) {
      results.push({ username, status: "User not found" });
      continue;
    }

    const { data: memberData } = await supabase
      .from("UserGroup")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userData.id)
      .single();

    if (memberData) {
      results.push({ username, status: "Already a member" });
      continue;
    }

    const { error: addError } = await supabase.from("UserGroup").insert({
      group_id: groupId,
      user_id: userData.id,
    });

    if (addError) {
      results.push({ username, status: "Failed to add" });
    } else {
      results.push({ username, status: "Added" });
    }
  }

  return NextResponse.json({ results });
}
