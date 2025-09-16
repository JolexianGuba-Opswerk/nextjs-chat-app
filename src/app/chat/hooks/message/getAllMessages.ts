import { createServerSupabase } from "@/lib/supabase/supabaseServer";
import { Message } from "../../../../../types/chat/chat";
type GetAllMessagesResult = {
     error?: string;
     messages?: Message[]
};

export async function getAllMessages(groupId: number):Promise<GetAllMessagesResult> {
     const supabase = await createServerSupabase();
     const {
       data: { user },
     } = await supabase.auth.getUser();
   
     if (!user) return {error:"Unauthorized"};
     if (!groupId) return {error: "Missing Parameters"}

     const {data:visibility} = await supabase
     .from("UserGroup")
     .select( `visible_from`)
     .eq("user_id", user.id)
     .eq("group_id", groupId)
     .order("created_at", { ascending: true })
     .single();
   
     const messageQuery = supabase
       .from("GroupMessage")
       .select( `id,
         content,
         created_at,
         sender_id,
         profile: sender_id (username, avatar_url)`
       )
       .eq("group_id", groupId) 
       .order("created_at", { ascending: true });

       if (visibility?.visible_from){
         messageQuery.gte("created_at",visibility.visible_from)
       }
       const { data: messages, error: messagesError } = await messageQuery

       if(messagesError) return {error:"Error in getting all the messages"}

       return {messages: messages ?? []} ;
   }