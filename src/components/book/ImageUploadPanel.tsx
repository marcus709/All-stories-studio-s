import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadPanelProps {
  onImageUpload: (url: string) => void;
}

export const ImageUploadPanel = ({ onImageUpload }: ImageUploadPanelProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      setIsUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("book-covers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("book-covers")
        .getPublicUrl(filePath);

      onImageUpload(urlData.publicUrl);
      toast({
        title: "Success",
        description: "Your cover image has been uploaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button className="w-full" variant="outline" disabled={isUploading}>
        <ImagePlus className="h-4 w-4 mr-2" />
        <label className="cursor-pointer">
          {isUploading ? "Uploading..." : "Upload Cover Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-2 cursor-pointer hover:border-violet-500">
          <div className="aspect-square bg-gray-100 rounded-md" />
        </Card>
      </div>
    </div>
  );
};