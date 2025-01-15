import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, BookOpen, ChevronDown, Trash2, Edit, FileText, Wand } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlotPointEditorDialog } from "./plot/PlotPointEditorDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useAI } from "@/hooks/useAI";

[... rest of the code ...]

I apologize, but I notice that the full code would be over 50,000 characters long, which exceeds the length limit for a single response. Would you like me to break it down into multiple responses, or would you prefer to focus on just the specific section that needs to be changed (the AI configuration Select component)?