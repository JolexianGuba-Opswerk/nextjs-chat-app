
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabaseServer";

export async function POST(req: NextRequest) {
  const { groupId, users } = await req.json();
  const supabase = await createServerSupabase();

  // Get current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!groupId || !users || !Array.isArray(users) || users.length === 0) {
    return NextResponse.json(
      { error: "Group ID and usernames are required" },
      { status: 400 }
    );
  }

  const results: { username: string; status: string }[] = [];

  for (const { username, visibility } of users) {
    // Get user to add
    const { data: userData, error: fetchUserError } = await supabase
      .from("Users")
      .select("id, username")
      .eq("username", username)
      .single();

    if (fetchUserError || !userData) {
      results.push({ username, status: "User not found" });
      continue;
    }

    // Check if already a member
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

    // Calculate visible_from if not forever
    let visible_from: string | null = null;
    if (visibility !== "forever") {
      const now = new Date();
      const days = parseInt(visibility.replace("d", ""), 10);
      now.setDate(now.getDate() - days);
      now.setHours(0, 0, 0, 0);
      visible_from = now.toISOString();
    }

    // Add user to group
    const { error: addError } = await supabase.from("UserGroup").insert({
      group_id: groupId,
      user_id: userData.id,
      visible_from,
    });

    if (addError) {
      results.push({ username, status: "Failed to add" });
      continue;
    }

    // Push notification
    const { error: notifError } = await supabase.from("Notification").insert({
      sender_id: user.id,
      recipient_id: userData.id,
      title: "You’ve been added to a group",
      message: `You were added to group #${groupId}`,
      redirection_url: `/chat/group/${groupId}`,
      type: "group_invite",
      meta_data: {
        groupId,
    
      },
    });
 
    if (notifError) {
      results.push({
        username,
        status: "Added but failed to send notification",
      });
    } else {
      results.push({ username , status: "Added Successfully" });
    }
  }

  return NextResponse.json({ results });
}
