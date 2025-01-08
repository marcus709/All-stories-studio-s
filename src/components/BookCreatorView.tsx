import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const BookCreatorView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState({ title: "", content: "" });
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const { data: bookStructures } = useQuery({
    queryKey: ["bookStructures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_structures")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Virtual Book Creator</h1>
          <p className="text-gray-500">Design and structure your book</p>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </Button>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-xl p-6 shadow-sm min-h-[calc(100vh-16rem)]">
          <div className="text-center text-gray-500">
            Ready to create your new book layout
          </div>
        </div>
      </div>
    </div>
  );
};