import { NextRequest, NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/supabaseServer";

export async function POST(req: NextRequest) {
  const { groupId } = await req.json();
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!groupId) {
    return NextResponse.json(
      {
        error: "Missing Parameters",
      },
      { status: 400 }
    );
  }

  const { data: group, error: groupError } = await supabase
    .from("Groups")
    .select("id, title, created_by")
    .eq("id", groupId)
    .single();

  if (groupError || !group) {
    return NextResponse.json(
      {
        error: "Group not found",
      },
      { status: 400 }
    );
  }
  const isOwner = group.created_by === user.id;
  if (isOwner)
    return NextResponse.json(
      { message: "User is authorized", isOwner: true },
      { status: 200 }
    );

  const { data: isMember } = await supabase
    .from("UserGroup")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if (!isMember) {
    return NextResponse.json(
      {
        error: "Please ask permission to owner",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ message: "User is authorized" }, { status: 200 });
}
