export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    type: 'character_share' | 'document_share';
    character?: any;
    document?: {
      id: string;
      title: string;
      content: string;
    };
  };
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}