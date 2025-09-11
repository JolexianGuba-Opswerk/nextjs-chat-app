export type GroupChatCardProps = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  members: string;
};
export type GroupsType = {
  id: string;
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
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
};
