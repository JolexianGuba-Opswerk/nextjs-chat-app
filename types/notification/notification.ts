export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type PushNotification = {
  
  title: string;
  message: string;
  meta_data: Json | null;
  sender_id: string;
  recipient_id: string;
  type: string;
  redirection_url: string | null;
};
