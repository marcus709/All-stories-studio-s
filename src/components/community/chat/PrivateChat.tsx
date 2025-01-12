import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Character } from "@/integrations/supabase/types/tables.types";
import { PrivateChatHeader } from "./PrivateChatHeader";
import { Message } from "./types";
import { useMessageSending } from "./hooks/useMessageSending";
import { UserProfileView } from "./UserProfileView";

export const PrivateChat = () => {
  const { friendId } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friend, setFriend] = useState<any>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const {
    sharedCharacter,
    setSharedCharacter,
    sharedDocument,
    setSharedDocument,
    draftMessage,
    setDraftMessage,
    handleSendMessage
  } = useMessageSending({ friendId, isFriend });

  useEffect(() => {
    if (location.state?.sharedCharacter) {
      setSharedCharacter(location.state.sharedCharacter);
      setDraftMessage("I'd like to share a character with you:");
    } else if (location.state?.sharedDocument) {
      setSharedDocument(location.state.sharedDocument);
      setDraftMessage("I'd like to share a document with you:");
    }
  }, [location.state]);

  useEffect(() => {
    const checkFriendship = async () => {
      if (!session?.user?.id || !friendId) return;

      const { data, error } = await supabase
        .from("friendships")
        .select("status")
        .or(`and(user_id.eq.${session.user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${session.user.id})`)
        .eq("status", "accepted")
        .single();

      if (error) {
        console.error("Error checking friendship:", error);
        toast({
          title: "Error",
          description: "Could not verify friendship status",
          variant: "destructive",
        });
        navigate("/community");
        return;
      }

      setIsFriend(!!data);
      if (!data) {
        toast({
          title: "Access Denied",
          description: "You can only chat with your friends",
          variant: "destructive",
        });
        navigate("/community");
      }
    };

    checkFriendship();
  }, [session?.user?.id, friendId, navigate, toast]);

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
    if (isFriend) {
      fetchMessages();
      const channel = setupRealtimeSubscription();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [friendId, session?.user?.id, isFriend]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("private_messages")
        .select(`
          *,
          profiles!private_messages_sender_id_fkey_profiles(username, avatar_url)
        `)
        .or(
          `and(sender_id.eq.${session?.user?.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${session?.user?.id})`
        )
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

  if (!isFriend) {
    return null;
  }

  if (showProfile && friend) {
    return (
      <UserProfileView 
        user={friend}
        onClose={() => setShowProfile(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <PrivateChatHeader 
        friend={friend} 
        onBack={() => navigate("/community")}
        onProfileClick={() => setShowProfile(true)}
      />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4 border-t">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          initialValue={draftMessage}
        />
      </div>
    </div>
  );
};