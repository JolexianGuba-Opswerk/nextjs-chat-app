import { NextRequest, NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/supabaseServer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId;
  const { title, description } = await req.json();
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

  const { error: groupError } = await supabase
    .from("Groups")
    .update({ title, description })
    .eq("created_by", user.id)
    .eq("id", groupId);

  if (groupError) {
    return NextResponse.json(
      {
        error: "Error in updating group",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Updated Successfully" },
    { status: 200 }
  );
}
