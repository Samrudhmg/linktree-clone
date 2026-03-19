"use client";

import { useState, useRef } from "react";
import { Palette, ChevronDown, Check, Loader2, Plus } from "lucide-react";
import ThemeSection from "./appearance/ThemeSection";
import { LinkPage } from "@/lib/types";
import { DBTheme } from "@/lib/theme-utils";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { AnimatedPanel } from "@/components/animated/interaction";
import ThemeEditorSheet from "./dashboard/ThemeEditorSheet";

interface PageAppearanceProps {
  page: LinkPage;
  updatePage: (data: Partial<LinkPage>) => Promise<{ success?: boolean; error?: unknown }>;
  onAppearanceChange: (data: LinkPage) => void;
  themes: DBTheme[];
  user: User | null;
  refreshThemes: () => Promise<void>;
  onPreviewChange?: (theme: DBTheme | null) => void;
}

export default function PageAppearance({ page, updatePage, onAppearanceChange, themes, user, refreshThemes, onPreviewChange }: PageAppearanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdate = async (data: Partial<LinkPage>): Promise<{ success?: boolean; error?: unknown }> => {
    if (!updatePage) return { error: "No update function" };

    // Call onAppearanceChange immediately for instant preview performance
    if (onAppearanceChange) {
      onAppearanceChange({ ...page, ...data });
    }

    // Debounced auto-save
    setAutoSaveStatus("saving");

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    return new Promise<{ success?: boolean; error?: unknown }>((resolve) => {
      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await updatePage(data);
          if (result?.error) {
            setAutoSaveStatus("idle");
            resolve({ error: result.error });
          } else {
            setAutoSaveStatus("saved");
            setTimeout(() => setAutoSaveStatus("idle"), 2000);
            resolve({ success: true });
          }
        } catch (error) {
          console.error("Auto-save error:", error);
          setAutoSaveStatus("idle");
          resolve({ error });
        }
      }, 400); // Reduced from 800ms to 400ms for faster feel
    });
  };

  return (
    <>
    <Card className="mb-6 overflow-hidden transition-colors border-0 dark:border-gray-800 shadow-sm">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          <span className="text-gray-900 dark:text-white font-semibold text-lg">Page Appearance</span>
        </div>
        <div className="flex items-center gap-3">
          {autoSaveStatus === "saving" && (
            <div className="flex items-center gap-1.5 text-purple-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </div>
          )}
          {autoSaveStatus === "saved" && (
            <div className="flex items-center gap-1.5 text-green-400 text-xs">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Saved</span>
            </div>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatedPanel open={isExpanded}>
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-6">
          <ThemeSection
            currentTheme={page?.theme_preset}
            themes={themes}
            onThemeSelect={(theme: DBTheme) => handleUpdate({
              theme_preset: theme.id,
            })}
            onAddTheme={() => setIsEditorOpen(true)}
          />
        </div>
      </AnimatedPanel>
    </Card>
    
    {user && (
      <ThemeEditorSheet
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        userId={user.id}
        onSuccess={refreshThemes}
        onPreviewChange={onPreviewChange}
      />
    )}
    </>
  );
}
