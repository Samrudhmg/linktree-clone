"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeConfig, DBTheme } from "@/lib/theme-utils";
import ColorPicker from "@/components/ui/ColorPicker";
import { createClient } from "@/lib/supabase-browser";
import { Loader2 } from "lucide-react";

interface ThemeEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess: () => void;
  onPreviewChange?: (theme: DBTheme | null) => void;
}

const DEFAULT_CONFIG: ThemeConfig = {
  background: { primary: "#0a0a0a", secondary: "#171717" },
  text: { primary: "#ffffff", secondary: "#a1a1aa" },
  links: { style: "flat", radius: "rounded-xl", shadow: "soft" },
  button: { variant: "solid", accent: "#3b82f6" },
  card: { style: "flat", border: "subtle" }
};

export default function ThemeEditorSheet({ open, onOpenChange, userId, onSuccess, onPreviewChange }: ThemeEditorSheetProps) {
  const [name, setName] = useState("");
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  // Sync preview up to top level when open or config changes
  useEffect(() => {
    if (onPreviewChange && open) {
      onPreviewChange({
        id: "preview",
        name: name || "Preview Theme",
        type: "user",
        user_id: userId,
        config: config,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else if (onPreviewChange && !open) {
      onPreviewChange(null);
    }
  }, [config, name, open, onPreviewChange, userId]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Theme name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: dbError } = await supabase.from("themes").insert([{
        name,
        type: "user",
        user_id: userId,
        config
      }]);

      if (dbError) throw dbError;

      onSuccess();
      onOpenChange(false);
      setName("");
      setConfig(DEFAULT_CONFIG);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateConfig = (section: keyof ThemeConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ThemeConfig],
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showOverlay={false} className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto pb-6 bg-white dark:bg-[#101828] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
        <DialogHeader className="mb-6 mt-4">
          <DialogTitle className="text-gray-900 dark:text-white">Create Custom Theme</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Design your own complete page aesthetic. This will be saved to your private themes.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">General</h3>
            <div className="space-y-2">
              <Label>Theme Name</Label>
              <Input placeholder="E.g. My Dark Mode" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Background Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Primary Bg" value={config.background.primary} onChange={(c) => updateConfig("background", "primary", c)} />
              <ColorPicker label="Secondary Bg" value={config.background.secondary} onChange={(c) => updateConfig("background", "secondary", c)} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Text Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Primary Text" value={config.text.primary} onChange={(c) => updateConfig("text", "primary", c)} />
              <ColorPicker label="Secondary Text" value={config.text.secondary} onChange={(c) => updateConfig("text", "secondary", c)} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm flex justify-between">
              Link Style
              <span className="text-xs text-muted-foreground font-normal">{config.links.style}</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {(['outline', 'flat', 'white', 'glass'] as const).map(style => (
                <Button key={style} variant={config.links.style === style ? "default" : "outline"} onClick={() => updateConfig("links", "style", style)} className="w-full capitalize h-9 text-xs">{style}</Button>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <Label className="text-xs text-muted-foreground">Border Radius ({config.links.radius})</Label>
              <div className="flex gap-2">
                <Button variant={config.links.radius === 'rounded-none' ? "default" : "outline"} onClick={() => updateConfig("links", "radius", "rounded-none")} className="flex-1 h-8 text-xs">Square</Button>
                <Button variant={config.links.radius === 'rounded-2xl' ? "default" : "outline"} onClick={() => updateConfig("links", "radius", "rounded-2xl")} className="flex-1 h-8 text-xs">Rounded</Button>
                <Button variant={config.links.radius === 'rounded-full' ? "default" : "outline"} onClick={() => updateConfig("links", "radius", "rounded-full")} className="flex-1 h-8 text-xs">Pill</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm flex justify-between">
              Button & Accent
              <span className="text-xs text-muted-foreground font-normal">{config.button.variant}</span>
            </h3>
            <ColorPicker label="Accent Color" value={config.button.accent} onChange={(c) => updateConfig("button", "accent", c)} />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['solid', 'gradient', 'minimal'].map(style => (
                <Button key={style} variant={config.button.variant === style ? "default" : "outline"} onClick={() => updateConfig("button", "variant", style)} className="w-full capitalize h-9 text-xs">{style}</Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm flex justify-between">
              Card Style
              <span className="text-xs text-muted-foreground font-normal">{config.card.style}</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['flat', 'glass', 'bordered'].map(style => (
                <Button key={style} variant={config.card.style === style ? "default" : "outline"} onClick={() => updateConfig("card", "style", style)} className="w-full capitalize h-9 text-xs">{style}</Button>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-row gap-3 sm:justify-end items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white shadow-sm border-0">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
