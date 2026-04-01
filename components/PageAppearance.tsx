"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, ChevronDown, Check, Loader2 } from "lucide-react";
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
  pages: LinkPage[];
  user: User | null;
  refreshThemes: () => Promise<void>;
  onPreviewChange?: (theme: DBTheme | null) => void;
}

export default function PageAppearance({ page, updatePage, onAppearanceChange, themes, pages, user, refreshThemes, onPreviewChange }: PageAppearanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<DBTheme | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [optimisticThemeId, setOptimisticThemeId] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync optimistic state when page.theme_id updates from DB
  useEffect(() => {
    if (page?.theme_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptimisticThemeId(page.theme_id);
    }
  }, [page?.theme_id]);

  const handleUpdate = async (data: Partial<LinkPage>): Promise<{ success?: boolean; error?: unknown }> => {
    if (!updatePage) return { error: "No update function" };

    // Update optimistic state for instant UI feedback
    if (data.theme_id) {
      setOptimisticThemeId(data.theme_id);
    }

    // Call onAppearanceChange immediately for instant preview performance
    if (onAppearanceChange) {
      onAppearanceChange({ ...page, ...data });
    }
// ... (rest of the handleUpdate function follows correctly)

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
      <Card className="mb-6 overflow-hidden transition-colors border border-border-main shadow-main bg-bg-main rounded-radius-main">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-btn-hover transition-colors"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-text-secondary" />
            <span className="text-text-main font-semibold text-lg">Page Appearance</span>
          </div>
          <div className="flex items-center gap-3">
            {autoSaveStatus === "saving" && (
              <div className="flex items-center gap-1.5 text-text-secondary text-xs font-medium">
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
            <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Expandable Content */}
        <AnimatedPanel open={isExpanded}>
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-6">
            <ThemeSection
              currentThemeId={optimisticThemeId}
              themes={themes}
              onThemeSelect={(theme: DBTheme) => handleUpdate({
                theme_id: theme.id,
                theme: theme, // Pass the full theme object for immediate preview
              })}
              onEditTheme={(theme: DBTheme) => {
                setEditingTheme(theme);
                setIsEditorOpen(true);
              }}
              onAddTheme={() => {
                setEditingTheme(null);
                setIsEditorOpen(true);
              }}
            />

          </div>
        </AnimatedPanel>
      </Card>

      {user && (
        <ThemeEditorSheet
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          userId={user.id}
          editingTheme={editingTheme}
          pages={pages}
          onSuccess={async (newTheme) => {
            await refreshThemes();
            // If we created a new theme (either from scratch or by customizing a default)
            // we want to automatically apply it to the page.
            if (newTheme && (!editingTheme || newTheme.id !== editingTheme.id)) {
              handleUpdate({ theme_id: newTheme.id, theme: newTheme });
            }
          }}
          onPreviewChange={onPreviewChange}
          pageId={page.id}
        />
      )}
    </>
  );
}
