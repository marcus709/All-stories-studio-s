import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/types/book";
import { IText } from "fabric";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { 
  Globe2,
  Type,
  Layout,
  Palette,
  BookOpen,
  AlignLeft,
  List,
  Settings,
  BookMarked,
  FileText,
  PenTool,
  Baseline
} from "lucide-react";

export const FormattingView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [previewScene, setPreviewScene] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverTexts, setCoverTexts] = useState<Array<{ text: string; font: string; size: number; x: number; y: number }>>([]);
  const [selectedText, setSelectedText] = useState<IText | null>(null);
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleResetDesign = () => {
    setSelectedTemplate(null);
    setCoverImage(null);
  };

  const handleSaveDesign = () => {
    // Implementation for saving the design will be added later
  };

  const handleImageUpload = (url: string) => {
    setCoverImage(url);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTextUpdate = (texts: Array<{ text: string; font: string; size: number; x: number; y: number }>) => {
    setCoverTexts(texts);
  };

  const handleTextSelect = (text: IText | null) => {
    setSelectedText(text);
  };

  const sidebarSections = [
    {
      title: "Templates",
      icon: Layout,
      items: ["Basic", "Modern", "Classic", "Custom"]
    },
    {
      title: "Design",
      icon: Palette,
      items: ["Colors", "Spacing", "Borders"]
    },
    {
      title: "Typography",
      icon: Type,
      items: ["Headings", "Body", "Lists", "Links"]
    },
    {
      title: "Page Format",
      icon: FileText,
      items: ["Size", "Margins", "Headers", "Footers"]
    },
    {
      title: "Book Elements",
      icon: BookOpen,
      items: ["Chapters", "Sections", "Notes"]
    },
    {
      title: "Text Formatting",
      icon: AlignLeft,
      items: ["Alignment", "Indentation", "Line Height"]
    },
    {
      title: "Lists & Tables",
      icon: List,
      items: ["Bullet Lists", "Numbered Lists", "Tables"]
    },
    {
      title: "Settings",
      icon: Settings,
      items: ["General", "Export", "Preview"]
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar className="bg-zinc-900 text-zinc-100 border-r border-zinc-800 w-64">
          <SidebarHeader className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Book Formatting
            </h2>
          </SidebarHeader>
          <SidebarContent className="p-2">
            {sidebarSections.map((section, index) => (
              <div key={section.title} className="mb-1">
                <button
                  className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => setActiveTab(section.title.toLowerCase())}
                >
                  <section.icon className="h-4 w-4 text-zinc-400" />
                  <span>{section.title}</span>
                </button>
                {section.items && (
                  <div className="ml-9 mt-1 space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item}
                        className="w-full px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors text-left"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          {/* Main content area - we'll add this in the next iterations */}
        </div>
      </div>
    </SidebarProvider>
  );
};
