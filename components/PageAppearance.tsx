"use client";

import { useState, useRef } from "react";
import { Palette, ChevronDown, Check, Loader2 } from "lucide-react";
import ThemeSection from "./appearance/ThemeSection";
import CustomSection from "./appearance/CustomSection";
import { LinkPage, Theme } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedPanel } from "@/components/animated/interaction";

interface PageAppearanceProps {
  page: LinkPage;
  updatePage: (data: Partial<LinkPage>) => Promise<{ success?: boolean; error?: unknown }>;
  onAppearanceChange: (data: LinkPage) => void;
}

export default function PageAppearance({ page, updatePage, onAppearanceChange }: PageAppearanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("themes");
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
          {/* Section Tabs */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-muted h-11 p-1 rounded-xl">
              <TabsTrigger value="themes" className="rounded-lg">Themes</TabsTrigger>
              <TabsTrigger value="custom" className="rounded-lg">Custom</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="themes" className="m-0">
                <ThemeSection
                  currentTheme={page?.theme_preset}
                  onThemeSelect={(theme: Theme) => handleUpdate({
                    theme_preset: theme.id,
                    page_bg_type: theme.page_bg_type,
                    page_bg_color: theme.page_bg_color,
                    page_bg_gradient_start: theme.page_bg_gradient_start,
                    page_bg_gradient_end: theme.page_bg_gradient_end,
                    page_bg_image: theme.page_bg_image || "",
                    card_bg_color: theme.button_color,
                    card_text_color: theme.button_text_color,
                    card_border_radius: theme.button_radius,
                    card_style: "filled",
                    page_font: theme.page_font
                  })}
                />
              </TabsContent>

              <TabsContent value="custom" className="m-0">
                <CustomSection
                  profile={page}
                  updateProfile={handleUpdate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </AnimatedPanel>
    </Card>
  );
}
