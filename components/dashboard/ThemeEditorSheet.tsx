"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeConfig, DBTheme } from "@/lib/theme-utils";
import ColorPicker from "@/components/ui/ColorPicker";
import { createClient } from "@/lib/supabase-browser";
import { Copy, Save, Smartphone, Palette, Check, Loader2, ClipboardCopy, ClipboardPaste } from "lucide-react";
import { LinkPage } from "@/lib/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  editingTheme?: DBTheme | null;
  pages?: LinkPage[];
  onSuccess: (theme?: DBTheme) => void;
  onPreviewChange?: (theme: DBTheme | null) => void;
  pageId?: string;
}

const DEFAULT_CONFIG: ThemeConfig = {
  background: { primary: "#0a0a0a", secondary: "#171717" },
  text: { primary: "#ffffff", secondary: "#a1a1aa" },
  links: { style: "flat", radius: "rounded-xl", shadow: "soft" },
  button: { variant: "solid", accent: "#3b82f6" },
  title: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" },
  bio: { color: "#a1a1aa", fontSize: "1.1rem", fontWeight: "normal" }
};

export default function ThemeEditorSheet({ open, onOpenChange, userId, editingTheme, pages, onSuccess, onPreviewChange, pageId }: ThemeEditorSheetProps) {
  const [name, setName] = useState("");
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasCopiedStyles, setHasCopiedStyles] = useState(false);
  const supabase = createClient();

  // Load editing theme
  useEffect(() => {
    if (editingTheme && open) {
      setName(editingTheme.name);
      setConfig(editingTheme.config);
    } else if (!editingTheme && open) {
      setName("");
      setConfig(DEFAULT_CONFIG);
    }
    
    // Check if styles exist in local storage on open
    if (open) {
      setHasCopiedStyles(!!localStorage.getItem("copied_theme_config"));
    }
  }, [editingTheme, open]);

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
      let result;
      
      if (editingTheme) {
        // Update existing theme
        result = await supabase
          .from("themes")
          .update({ name, config })
          .eq("id", editingTheme.id)
          .select()
          .single();
      } else {
        // Insert new theme
        result = await supabase
          .from("themes")
          .insert([{
            name,
            type: "user",
            user_id: userId,
            page_id: pageId,
            config
          }])
          .select()
          .single();
      }
      
      if (result.error) throw result.error;

      onSuccess(result.data as DBTheme);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err?.message || err?.error_description || "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!name.trim()) {
      setError("Theme name is required to copy");
      return;
    }

    setSaving(true);
    try {
      const { data, error: dbError } = await supabase
        .from("themes")
        .insert([{
          name: `${name} (Copy)`,
          type: "user",
          user_id: userId,
          page_id: pageId,
          config
        }])
        .select()
        .single();
      
      if (dbError) throw dbError;
      onSuccess(data as DBTheme);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Copy error:", err);
      setError(err?.message || err?.error_description || "Failed to copy theme");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyStyles = async () => {
    try {
      const configStr = JSON.stringify(config);
      localStorage.setItem("copied_theme_config", configStr);
      
      // Copy to system clipboard as well
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(configStr);
      }
      
      setHasCopiedStyles(true);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      // Give the requested alert
      alert("Theme styles copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy styles:", err);
      alert("Failed to copy styles.");
    }
  };

  const handlePasteStyles = async () => {
    try {
      let configData = null;
      
      // Try system clipboard first
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        try {
          configData = JSON.parse(text);
          // Simple validation: check if it has background and text keys
          if (!configData.background || !configData.text) {
             configData = null;
          }
        } catch (e) {
          // Not valid JSON in clipboard, fallback to localStorage
        }
      }
      
      if (!configData) {
        const saved = localStorage.getItem("copied_theme_config");
        if (saved) {
          configData = JSON.parse(saved);
        }
      }
      
      if (configData) {
        setConfig(configData);
        alert("Styles pasted successfully!");
      } else {
        alert("No valid theme styles found to paste.");
      }
    } catch (err) {
      console.error("Failed to paste styles:", err);
      alert("Failed to paste styles. Check your clipboard.");
    }
  };

  const handleAssignToPage = async (pageId: string) => {
    if (!editingTheme) return;
    
    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from("link_pages")
        .update({ theme_id: editingTheme.id })
        .eq("id", pageId);
      
      if (updateError) throw updateError;
      onSuccess(editingTheme);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to assign theme");
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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingTheme ? "Edit Theme" : "Create Custom Theme"}
            </DialogTitle>
            
            {editingTheme && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  className="h-8 px-2 text-xs gap-1.5 border-gray-200 dark:border-gray-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Clone
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyStyles}
                  title="Copy theme styles to clipboard"
                  className={`h-8 px-2 text-xs gap-1.5 transition-all ${copySuccess ? 'border-green-500 text-green-500' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                  {copySuccess ? "Copied!" : "Copy Styles"}
                </Button>

                {hasCopiedStyles && (
                   <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePasteStyles}
                    title="Paste styles from clipboard"
                    className="h-8 px-2 text-xs gap-1.5 text-purple-500 border-purple-200 dark:border-purple-900/30"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    Paste Styles
                  </Button>
                )}

                {pages && pages.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5 border-gray-200 dark:border-gray-800">
                        <Smartphone className="w-3.5 h-3.5" />
                        Apply to...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#101828] border-gray-200 dark:border-gray-800">
                      <DropdownMenuLabel className="text-xs">Select Page</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {pages.map(p => (
                        <DropdownMenuItem 
                          key={p.id} 
                          onClick={() => handleAssignToPage(p.id)}
                          className="text-xs flex items-center justify-between"
                        >
                          {p.display_name || p.slug}
                          {p.theme_id === editingTheme.id && <Check className="w-3 h-3 text-purple-500" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {editingTheme 
              ? "Modify the styles for this theme. Changes will reflect on all pages using it."
              : "Design your own complete page aesthetic. This will be saved to your private themes."}
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
            <h3 className="font-semibold text-sm">Title Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Title Color" value={config.title?.color || config.text.primary} onChange={(c) => updateConfig("title", "color", c)} />
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <Input 
                  type="text" 
                  value={config.title?.fontSize || "1.5rem"} 
                  onChange={(e) => updateConfig("title", "fontSize", e.target.value)} 
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Font Weight</Label>
              <div className="flex gap-2">
                {['normal', 'semibold', 'bold', 'extrabold'].map(w => (
                  <Button 
                    key={w} 
                    variant={(config.title?.fontWeight || 'bold') === w ? "default" : "outline"} 
                    onClick={() => updateConfig("title", "fontWeight", w)} 
                    className="flex-1 h-10 px-0 flex flex-col items-center justify-center gap-0.5"
                    style={{ fontWeight: w }}
                  >
                    <span className="text-[10px] opacity-70 font-normal uppercase tracking-wider">Aa</span>
                    <span className="text-xs capitalize">{w}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Bio Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Bio Color" value={config.bio?.color || config.text.secondary} onChange={(c) => updateConfig("bio", "color", c)} />
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <Input 
                  type="text" 
                  value={config.bio?.fontSize || "1.1rem"} 
                  onChange={(e) => updateConfig("bio", "fontSize", e.target.value)} 
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Font Weight</Label>
              <div className="flex gap-2">
                {['light', 'normal', 'medium', 'semibold'].map(w => (
                  <Button 
                    key={w} 
                    variant={(config.bio?.fontWeight || 'normal') === w ? "default" : "outline"} 
                    onClick={() => updateConfig("bio", "fontWeight", w)} 
                    className="flex-1 h-10 px-0 flex flex-col items-center justify-center gap-0.5"
                    style={{ fontWeight: w }}
                  >
                    <span className="text-[10px] opacity-70 font-normal uppercase tracking-wider">Aa</span>
                    <span className="text-xs capitalize">{w}</span>
                  </Button>
                ))}
              </div>
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
              <Label className="text-xs text-muted-foreground">Border Radius</Label>
              <div className="flex gap-2">
                <Button 
                    variant={config.links.radius === 'rounded-none' ? "default" : "outline"} 
                    onClick={() => updateConfig("links", "radius", "rounded-none")} 
                    className={`flex-1 h-12 flex flex-col gap-1 items-center justify-center border-2 transition-all ${config.links.radius === 'rounded-none' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                >
                    <div className="w-6 h-4 border-2 border-current rounded-none" />
                    <span className="text-[10px] font-medium">Square</span>
                </Button>
                <Button 
                    variant={config.links.radius === 'rounded-2xl' ? "default" : "outline"} 
                    onClick={() => updateConfig("links", "radius", "rounded-2xl")} 
                    className={`flex-1 h-12 flex flex-col gap-1 items-center justify-center border-2 transition-all ${config.links.radius === 'rounded-2xl' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                >
                    <div className="w-6 h-4 border-2 border-current rounded-md" />
                    <span className="text-[10px] font-medium">Rounded</span>
                </Button>
                <Button 
                    variant={config.links.radius === 'rounded-full' ? "default" : "outline"} 
                    onClick={() => updateConfig("links", "radius", "rounded-full")} 
                    className={`flex-1 h-12 flex flex-col gap-1 items-center justify-center border-2 transition-all ${config.links.radius === 'rounded-full' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                >
                    <div className="w-6 h-4 border-2 border-current rounded-full" />
                    <span className="text-[10px] font-medium">Pill</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Button & Accent</h3>
            <ColorPicker label="Accent Color" value={config.button.accent} onChange={(c) => updateConfig("button", "accent", c)} />
          </div>
        </div>

        <DialogFooter className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-row gap-3 sm:justify-end items-center">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1 sm:flex-none border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white shadow-sm border-0 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editingTheme ? "Update Theme" : "Save Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
