import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(req: NextRequest) {
  const { groupId, users } = await req.json();
  console.log(users)
  if (
    !groupId ||
    !users ||
    !Array.isArray(users) ||
    users.length === 0
  ) {
    return NextResponse.json(
      { error: "Group ID and usernames are required" },
      { status: 400 }
    );
  }

  const results: { username: string; status: string }[] = [];

  for (const {username, visibility} of users) {
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

    // Setting visible from, minus the current date
    let visibile_from: string | null =  null
    if(visibility !== 'forever'){
      const now = new Date();
      const days = parseInt(visibility.replace("d",""),10)
      now.setDate(now.getDate() - days)
      now.setHours(0, 0, 0, 0); 
      visibile_from = now.toISOString();
    }

    const { error: addError } = await supabase.from("UserGroup").insert({
      group_id: groupId,
      user_id: userData.id,
      visible_from:visibile_from

    });

    if (addError) {
      results.push({ username, status: "Failed to add" });
    } else {
      results.push({ username, status: "Added Successfully" });
    }
  }

  return NextResponse.json({ results });
}
