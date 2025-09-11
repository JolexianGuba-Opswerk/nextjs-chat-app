import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabaseServer";

export async function POST(req: NextRequest) {
  const { description, title } = await req.json();
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: groupData, error: groupError } = await supabase
    .from("Groups")
    .insert({
      created_by: user.id,
      description,
      title,
    })
    .select();

  const group = groupData && groupData[0];

  const { error: userGroupError } = await supabase.from("UserGroup").insert({
    group_id: group?.id,
    user_id: user.id,
  });

  if (groupError || userGroupError)
    return NextResponse.json(
      { error: "Error in creating group" },
      { status: 400 }
    );

  return NextResponse.json(
    { message: "Created Successfully" },
    { status: 200 }
  );
}
