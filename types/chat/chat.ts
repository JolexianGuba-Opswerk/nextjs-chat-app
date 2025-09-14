export type GroupChatCardProps = {
  id: number;
  title: string;
  description: string;
  created_by: string;
  members: string;
};
export type GroupsType = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  created_by: string;
  password: string;
};

export type CreateGroupProps = {
  description: string;
  title: string;
};

export type Message = {
  id: number;
  content: string;
  sender_id: string | null;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string | null;
  } | null;
};
