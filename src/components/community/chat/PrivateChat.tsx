import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export const PrivateChat = () => {
  const { friendId } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friend, setFriend] = useState<any>(null);

  useEffect(() => {
    const fetchFriend = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", friendId)
        .single();

      if (error) {
        console.error("Error fetching friend:", error);
        toast({
          title: "Error",
          description: "Could not load friend details",
          variant: "destructive",
        });
        return;
      }

      setFriend(data);
    };

    fetchFriend();
  }, [friendId, toast]);

  useEffect(() => {
    fetchMessages();
    const channel = setupRealtimeSubscription();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [friendId, session?.user?.id]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("private_messages")
        .select(`
          *,
          profiles:sender_id(username, avatar_url)
        `)
        .or(`sender_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`)
        .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = data.map((msg: any) => ({
        ...msg,
        profiles: msg.profiles
      }));

      setMessages(formattedMessages);
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
      .channel("private_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `or(and(sender_id.eq.${session?.user?.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${session?.user?.id}))`,
        },
        async (payload) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage: Message = {
            ...(payload.new as Message),
            profiles: profileData || null
          };

          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe();

    return channel;
  };

  const handleSendMessage = async (content: string) => {
    try {
      const { error } = await supabase.from("private_messages").insert({
        content,
        sender_id: session?.user?.id,
        receiver_id: friendId,
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            {friend?.avatar_url ? (
              <img
                src={friend.avatar_url}
                alt={friend.username}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 text-sm font-medium">
                {friend?.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <span className="font-medium">@{friend?.username}</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4 border-t">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};