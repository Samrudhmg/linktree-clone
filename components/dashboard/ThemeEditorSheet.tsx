"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeConfig, DBTheme } from "@/lib/theme-utils";
import ColorPicker from "@/components/ui/ColorPicker";
import { createClient } from "@/lib/supabase-browser";
import { Copy, Save, Smartphone, Palette, Check, Loader2, ClipboardCopy, ClipboardPaste, FileText } from "lucide-react";
import { cn } from "@/utils/cn";
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
  const isDefaultTheme = editingTheme?.type === "default";
  const isUpdating = editingTheme && !isDefaultTheme;
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


      if (isUpdating) {
        // Update existing custom theme
        result = await supabase
          .from("themes")
          .update({ name, config })
          .eq("id", editingTheme.id)
          .select()
          .maybeSingle();
      } else {
        // Insert new theme (or clone of a default theme)
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
          .maybeSingle();
      }

      if (result.error) throw result.error;

      if (!result.data) {
        throw new Error(isUpdating ? "Theme not found or you don't have permission to edit it." : "Failed to create theme.");
      }

      onSuccess(result.data as DBTheme);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Save error:", err);
      // Simplify the error message for the user if it's the JSON coercion or PGRST116
      const errorObj = err as { message?: string; code?: string; error_description?: string };
      const message = errorObj?.message?.includes("coerce") || errorObj?.code === "PGRST116"
        ? "Database error: Could not save theme securely. Please try cloning instead."
        : errorObj?.message || errorObj?.error_description || "Failed to save theme";
      setError(message);
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
        .maybeSingle();

      if (dbError) throw dbError;
      if (!data) throw new Error("Failed to clone theme.");
      onSuccess(data as DBTheme);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Copy error:", err);
      const errorObj = err as { message?: string; code?: string; error_description?: string };
      setError(errorObj?.message || errorObj?.error_description || "Failed to copy theme");
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
          if (!configData.background || !configData.text) {
            configData = null;
          }
        } catch {
          // Fallback to localStorage
        }
      }

      if (!configData) {
        const saved = localStorage.getItem("copied_theme_config");
        if (saved) {
          configData = JSON.parse(saved);
        }
      }

      if (configData) {
        // ONLY carry styles (colors/fonts), preserve existing links/layout config
        setConfig(prev => ({
          ...configData,
          links: prev.links
        }));
        alert("Styles pasted successfully (Colors & Fonts only)!");
      } else {
        alert("No valid theme styles found to paste.");
      }
    } catch (err) {
      console.error("Failed to paste styles:", err);
      alert("Failed to paste styles. Check your clipboard.");
    }
  };

  const updateConfig = (section: keyof ThemeConfig, key: string, value: string | number | boolean) => {
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
      <DialogContent showOverlay={false} className="w-full sm:max-w-2xl lg:left-[calc(50%-72px)] lg:translate-x-[-50%] max-h-[90vh] overflow-y-auto pb-0 p-0 bg-muted border-border-main text-text-main rounded-radius-main shadow-main overflow-hidden group">
        {/* Grain Overlay for Dialog */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

        <div className="relative z-10 flex flex-col h-full max-h-[90vh] bg-muted/50">
          <DialogHeader className="p-6 pb-4 border-b border-border-main bg-muted/30 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-text-main text-xl font-bold tracking-tight">
                {isDefaultTheme ? "Customize Theme" : editingTheme ? "Edit Theme" : "Create Custom Theme"}
              </DialogTitle>

              <div className="flex gap-2 items-center">
                {editingTheme && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-9 px-3 text-xs gap-1.5 border-border-main bg-bg-main hover:bg-btn-hover hover:text-btn-text transition-all rounded-full"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Clone
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyStyles}
                      title="Copy theme styles to clipboard"
                      className={`h-9 px-3 text-xs gap-1.5 transition-all rounded-full bg-bg-main ${copySuccess ? 'border-green-500 text-green-500' : 'border-border-main hover:bg-btn-hover hover:text-btn-text'}`}
                    >
                      {copySuccess ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                      {copySuccess ? "Copied!" : "Copy Styles"}
                    </Button>
                  </>
                )}

                {hasCopiedStyles && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePasteStyles}
                    title="Paste colors and fonts from clipboard"
                    className="h-9 px-3 text-xs gap-1.5 text-text-main border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all rounded-full animate-in fade-in zoom-in duration-300"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 text-green-500" />
                    Paste Styles
                  </Button>
                )}
              </div>
            </div>
            {!editingTheme && hasCopiedStyles && (
              <p className="text-[10px] font-bold text-green-500/70 uppercase tracking-widest mt-1 ml-1 animate-pulse">
                Copied theme ready to paste
              </p>
            )}
            <DialogDescription className="text-text-secondary mt-1">
              {isDefaultTheme
                ? "This is a preset theme. Saving will create a custom copy for your page."
                : editingTheme
                  ? "Modify the styles for this theme. Changes will reflect on all pages using it."
                  : "Design your own complete page aesthetic. This will be saved to your private themes."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-border-main">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: General & Colors */}
              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-text-main">
                    <Palette className="w-4 h-4 text-text-secondary" />
                    <h3 className="font-bold text-sm tracking-wide uppercase">General Settings</h3>
                  </div>
                  <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    <Label className="text-xs font-bold text-text-secondary uppercase">Theme Name</Label>
                    <Input
                      placeholder="E.g. My Dark Mode"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 bg-bg-main border-border-main rounded-xl"
                    />
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-border-main/50">
                  <div className="flex items-center gap-2 text-text-main">
                    <div className="w-4 h-4 rounded-full border border-border-main" style={{ background: config.background.primary }} />
                    <h3 className="font-bold text-sm tracking-wide uppercase">Core Colors</h3>
                  </div>
                  <div className="flex flex-col gap-6 bg-muted/30 p-5 rounded-2xl border border-border-main/50">
                    <ColorPicker
                      label="Primary Background"
                      value={config.background.primary}
                      onChange={(c) => updateConfig("background", "primary", c)}
                    />
                    <ColorPicker
                      label="Secondary Background"
                      value={config.background.secondary}
                      onChange={(c) => updateConfig("background", "secondary", c)}
                    />
                    <div className="pt-2 border-t border-border-main/20" />
                    <ColorPicker
                      label="Primary Text Color"
                      value={config.text.primary}
                      onChange={(c) => updateConfig("text", "primary", c)}
                    />
                    <ColorPicker
                      label="Secondary Text Color"
                      value={config.text.secondary}
                      onChange={(c) => updateConfig("text", "secondary", c)}
                    />
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-border-main/50">
                  <div className="flex items-center gap-2 text-text-main">
                    <Smartphone className="w-4 h-4 text-text-secondary" />
                    <h3 className="font-bold text-sm tracking-wide uppercase">Button Styling</h3>
                  </div>
                  <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    <ColorPicker label="Accent Color" value={config.button.accent} onChange={(c) => updateConfig("button", "accent", c)} />
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-text-secondary uppercase">Link Corner Style</Label>
                      <div className="flex gap-2">
                        {(['rounded-none', 'rounded-2xl', 'rounded-full'] as const).map(radius => (
                          <Button
                            key={radius}
                            variant={config.links.radius === radius ? "default" : "outline"}
                            onClick={() => updateConfig("links", "radius", radius)}
                            className={`flex-1 h-14 flex flex-col gap-1 items-center justify-center border-2 transition-all rounded-xl ${config.links.radius === radius ? 'border-text-main bg-btn-bg text-btn-text shadow-main' : 'border-border-main bg-bg-main text-text-secondary'}`}
                          >
                            <div className={cn("w-6 h-3 border-2 border-current", radius)} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                              {radius === 'rounded-none' ? 'Sharp' : radius === 'rounded-2xl' ? 'Soft' : 'Pill'}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Typography & Style */}
              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-text-main">
                    <FileText className="w-4 h-4 text-text-secondary" />
                    <h3 className="font-bold text-sm tracking-wide uppercase">Typography</h3>
                  </div>
                  <div className="space-y-6 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    {/* Title Settings */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-text-secondary uppercase flex justify-between items-center">
                        Title Text
                        <span className="text-[10px] font-mono opacity-50 bg-bg-main px-1.5 py-0.5 rounded border border-border-main/30">
                          {config.title?.fontSize || "1.5rem"}
                        </span>
                      </Label>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'S', value: '1.2rem', title: 'Small' },
                          { label: 'M', value: '1.5rem', title: 'Regular' },
                          { label: 'L', value: '1.8rem', title: 'Large' },
                          { label: 'XL', value: '2.2rem', title: 'Extra' },
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => updateConfig("title", "fontSize", size.value)}
                            className={cn(
                              "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all border",
                              (config.title?.fontSize || "1.5rem") === size.value
                                ? "bg-btn-bg text-btn-text border-text-secondary shadow-main"
                                : "bg-bg-main text-text-secondary border-border-main hover:bg-btn-hover"
                            )}
                            title={size.title}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <ColorPicker
                          label="Title Color"
                          hideLabel
                          value={config.title?.color || config.text.primary}
                          onChange={(c) => updateConfig("title", "color", c)}
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Weight</label>
                          <div className="flex gap-1 bg-bg-main/50 p-1 rounded-lg border border-border-main/30">
                            {['normal', 'semibold', 'bold', 'extrabold'].map(w => (
                              <button
                                key={w}
                                onClick={() => updateConfig("title", "fontWeight", w)}
                                className={cn(
                                  "flex-1 h-8 flex items-center justify-center text-[10px] uppercase font-bold rounded transition-all",
                                  (config.title?.fontWeight || 'bold') === w
                                    ? 'bg-text-main text-bg-main shadow-sm'
                                    : 'text-text-secondary hover:text-text-main hover:bg-btn-hover'
                                )}
                                style={{ fontWeight: w }}
                                title={w}
                              >
                                {w === 'normal' ? 'N' : w === 'semibold' ? 'S' : w === 'bold' ? 'B' : 'X'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Settings */}
                    <div className="space-y-3 pt-4 border-t border-border-main/20">
                      <Label className="text-xs font-bold text-text-secondary uppercase flex justify-between items-center">
                        Bio Text
                        <span className="text-[10px] font-mono opacity-50 bg-bg-main px-1.5 py-0.5 rounded border border-border-main/30">
                          {config.bio?.fontSize || "1.1rem"}
                        </span>
                      </Label>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'S', value: '0.9rem', title: 'Small' },
                          { label: 'M', value: '1.1rem', title: 'Regular' },
                          { label: 'L', value: '1.3rem', title: 'Large' },
                          { label: 'XL', value: '1.5rem', title: 'Extra' },
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => updateConfig("bio", "fontSize", size.value)}
                            className={cn(
                              "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all border",
                              (config.bio?.fontSize || "1.1rem") === size.value
                                ? "bg-btn-bg text-btn-text border-text-secondary shadow-main"
                                : "bg-bg-main text-text-secondary border-border-main hover:bg-btn-hover"
                            )}
                            title={size.title}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <ColorPicker
                          label="Bio Color"
                          hideLabel
                          value={config.bio?.color || config.text.secondary}
                          onChange={(c) => updateConfig("bio", "color", c)}
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Weight</label>
                          <div className="flex gap-1 bg-bg-main/50 p-1 rounded-lg border border-border-main/30">
                            {['light', 'normal', 'medium', 'semibold'].map(w => (
                              <button
                                key={w}
                                onClick={() => updateConfig("bio", "fontWeight", w)}
                                className={cn(
                                  "flex-1 h-8 flex items-center justify-center text-[10px] uppercase font-bold rounded transition-all",
                                  (config.bio?.fontWeight || 'normal') === w
                                    ? 'bg-text-main text-bg-main shadow-sm'
                                    : 'text-text-secondary hover:text-text-main hover:bg-btn-hover'
                                )}
                                style={{ fontWeight: w }}
                                title={w}
                              >
                                {w === 'light' ? 'L' : w === 'normal' ? 'N' : w === 'medium' ? 'M' : 'S'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-border-main/50">
                  <div className="flex items-center gap-2 text-text-main">
                    <Smartphone className="w-4 h-4 text-text-secondary" />
                    <h3 className="font-bold text-sm tracking-wide uppercase">Link Aesthetics</h3>
                  </div>
                  <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    <div className="grid grid-cols-2 gap-2">
                      {(['outline', 'flat', 'white', 'glass'] as const).map(style => (
                        <Button
                          key={style}
                          variant={config.links.style === style ? "default" : "outline"}
                          onClick={() => updateConfig("links", "style", style)}
                          className={`capitalize h-11 text-xs rounded-xl border-2 transition-all ${config.links.style === style
                            ? 'border-text-main bg-btn-bg text-btn-text shadow-main'
                            : 'border-border-main bg-bg-main text-text-secondary'
                            }`}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-border-main bg-muted/30 backdrop-blur-md sticky bottom-0 z-20 flex flex-row gap-3 sm:justify-end items-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none h-11 px-8 rounded-full border-border-main bg-bg-main text-text-secondary hover:bg-btn-hover hover:text-btn-text transition-all font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none bg-btn-bg hover:bg-btn-hover text-btn-text shadow-main rounded-full border border-border-main gap-2 h-11 px-8 font-bold transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isUpdating ? "Update Theme" : "Save as New"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
