import { Document } from "@/types/story";

export const parseDocumentContent = (content: string): string => {
  try {
    // Remove any special characters that might cause issues
    return content.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "");
  } catch (error) {
    console.error("Error parsing document content:", error);
    return "";
  }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedContent = parseDocumentContent(content);
        resolve(parsedContent);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const analyzeDocumentContent = (content: string) => {
  const wordCount = content.trim().split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  const averageSentenceLength = wordCount / sentences.length;
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
    hasMinimalContent: wordCount >= 100, // Arbitrary threshold for minimal content
  };
};