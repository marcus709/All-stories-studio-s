import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  initialValue?: string;
}

export const MessageInput = ({ onSendMessage, initialValue }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (initialValue) {
      setNewMessage(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-100">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!newMessage.trim()}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};