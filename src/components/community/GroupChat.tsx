import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GroupHeader } from "./chat/GroupHeader";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";

interface GroupChatProps {
  group: any;
  onBack: () => void;
}

export const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    const channel = setupRealtimeSubscription();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [group.id]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("group_messages")
        .select(`
          *,
          profiles:profiles!group_messages_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("group_id", group.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("group_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${group.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return channel;
  };

  const handleSendMessage = async (content: string) => {
    try {
      const { error } = await supabase.from("group_messages").insert({
        content,
        group_id: group.id,
        user_id: session?.user?.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <GroupHeader groupName={group.name} onBack={onBack} />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};