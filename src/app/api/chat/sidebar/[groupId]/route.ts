import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabaseServer";

export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId;
  const supabase = await createServerSupabase();
  if (!groupId) {
    return NextResponse.json(
      { error: "Group ID is required" },
      { status: 400 }
    );
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: groupData, error: groupError } = await supabase
      .from("Groups")
      .select("id, title, description, created_by(id,username)")
      .eq("id", groupId)
      .single();

    if (groupError || !groupData) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    const isOwner = user.id === groupData.created_by.id;
    // Count group members
    const { count: membersCount } = await supabase
      .from("UserGroup")
      .select("id", { count: "exact", head: true })
      .eq("group_id", groupId);

    // Fetch online users
    const { data: usersData, error: usersError } = await supabase
      .from("Users")
      .select("id, username, is_online, UserGroup!inner(Groups!inner(id))")
      .eq("UserGroup.Groups.id", groupId)
      .eq("is_online", true);

    if (usersError) console.error("Supabase error:", usersError);

    const onlineUsers =
      usersData?.map((u) => ({
        id: u.id,
        name: u.username,
        status: u.is_online,
      })) ?? [];

    return NextResponse.json({
      group: {
        id: groupData.id.toString(),
        name: groupData.title,
        description: groupData.description,
        members: membersCount ?? 0,
        isPrivate: true,
        createdBy: groupData.created_by?.username ?? "Unknown",
        isOwner: isOwner,
      },
      onlineUsers,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
