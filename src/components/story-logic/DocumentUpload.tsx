import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";

interface DocumentUploadProps {
  storyId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ storyId, onUploadComplete }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const session = useSession();
  const { uploadDocument, isUploading } = useDocuments(storyId);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !storyId || !session?.user?.id) return;

    uploadDocument(
      { file: selectedFile, storyId },
      {
        onSuccess: () => {
          setSelectedFile(null);
          onUploadComplete();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Drag and drop your document here, or{" "}
              <label className="text-purple-600 hover:text-purple-500 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports .txt, .doc, .docx, and .pdf files up to 10MB
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-4"
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      )}
    </div>
  );
};