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
        async (payload) => {
          // Fetch the profile information for the new message
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          setMessages((current) => [
            ...current,
            { ...payload.new, profiles: profileData },
          ]);
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
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
      <GroupHeader groupName={group.name} onBack={onBack} />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <div className="sticky bottom-0 bg-white border-t p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};