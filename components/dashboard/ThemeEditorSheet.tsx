"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeConfig, DBTheme } from "@/lib/theme-utils";
import ColorPicker from "@/components/ui/ColorPicker";
import { createClient } from "@/lib/supabase-browser";
import { Copy, Save, Smartphone, Palette, Check, Loader2, ClipboardCopy, ClipboardPaste, FileText, Lock, Unlock, Shuffle } from "lucide-react";
import { cn } from "@/utils/cn";
import { LinkPage, AvatarStyle } from "@/lib/types";
import { generateRandomThemeConfig } from "@/lib/theme-utils";
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
  title: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "700" },
  bio: { color: "#a1a1aa", fontSize: "1.1rem", fontWeight: "400" },
  avatar: { style: "full", size: 80 },
  link_thumbnails: { style: "circle", size: 40 }
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
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({
    bg: false,
    text: false,
    links: false
  });
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

  const handleGenerateTheme = () => {
    const newConfig = generateRandomThemeConfig(lockedFields, config);
    setConfig(newConfig);
  };

  const toggleLock = (field: string) => {
    setLockedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showOverlay={false} className="w-full sm:max-w-2xl lg:left-[calc(50%-72px)] lg:translate-x-[-50%] max-h-[96vh] sm:max-h-[90vh] overflow-y-auto pb-0 p-0 bg-muted border-border-main text-text-main rounded-radius-main shadow-main overflow-hidden group">
        {/* Grain Overlay for Dialog */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

        <div className="relative z-10 flex flex-col h-full max-h-[96vh] sm:max-h-[90vh] bg-muted/50">
          <DialogHeader className="p-4 sm:p-6 sm:pb-4 border-b border-border-main bg-muted/30 backdrop-blur-md sticky top-0 z-20">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <DialogTitle className="text-text-main text-xl font-bold tracking-tight">
                {isDefaultTheme ? "Customize Theme" : editingTheme ? "Edit Theme" : "Create Custom Theme"}
              </DialogTitle>

              <div className="flex flex-wrap gap-2 items-center">

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateTheme}
                  className="h-9 px-4 text-xs gap-2 font-bold uppercase tracking-widest text-white btn-running-border rounded-full shadow-sm"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Generate Theme
                </Button>

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
            {/* {!editingTheme && hasCopiedStyles && (
              <p className="text-[10px] font-bold text-green-500/70 uppercase tracking-widest mt-1 ml-1 animate-pulse">
                Copied theme ready to paste
              </p>
            )} */}
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
                  <div className="flex items-center justify-between text-text-main">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-border-main" style={{ background: config.background.primary }} />
                      <h3 className="font-bold text-sm tracking-wide uppercase">Core Colors</h3>
                    </div>
                    <button
                      onClick={() => toggleLock('bg')}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all border",
                        lockedFields.bg ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-bg-main border-border-main text-text-secondary hover:text-text-main"
                      )}
                    >
                      {lockedFields.bg ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {lockedFields.bg ? "Locked" : "Lock BG"}
                    </button>
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
                  <div className="flex items-center justify-between text-text-main">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-text-secondary" />
                      <h3 className="font-bold text-sm tracking-wide uppercase">Button Styling</h3>
                    </div>
                    <button
                      onClick={() => toggleLock('links')}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all border",
                        lockedFields.links ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-bg-main border-border-main text-text-secondary hover:text-text-main"
                      )}
                    >
                      {lockedFields.links ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {lockedFields.links ? "Locked" : "Lock Links"}
                    </button>
                  </div>
                  <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    <ColorPicker label="Accent Color" value={config.button.accent} onChange={(c) => updateConfig("button", "accent", c)} />

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-text-secondary uppercase">Link Visual Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Full', value: 'flat' },
                          { label: 'White', value: 'white' },
                          { label: 'Outline', value: 'outline' },
                          { label: 'Glass', value: 'glass' },
                        ].map(style => (
                          <Button
                            key={style.value}
                            variant={config.links.style === style.value ? "default" : "outline"}
                            onClick={() => updateConfig("links", "style", style.value)}
                            className={`h-11 text-[10px] uppercase font-bold border-2 transition-all rounded-xl ${config.links.style === style.value
                              ? 'border-text-main bg-btn-bg text-btn-text shadow-main'
                              : 'border-border-main bg-bg-main text-text-secondary hover:border-text-secondary'
                              }`}
                          >
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-text-secondary uppercase">Link Corner Style</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
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
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-text-main">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-text-secondary" />
                      <h3 className="font-bold text-sm tracking-wide uppercase">Typography</h3>
                    </div>
                    <button
                      onClick={() => toggleLock('text')}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all border",
                        lockedFields.text ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-bg-main border-border-main text-text-secondary hover:text-text-main"
                      )}
                    >
                      {lockedFields.text ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {lockedFields.text ? "Locked" : "Lock Text"}
                    </button>
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
                            {[
                              { label: 'N', value: '400', title: 'Normal' },
                              { label: 'S', value: '600', title: 'Semi' },
                              { label: 'B', value: '700', title: 'Bold' },
                              { label: 'X', value: '800', title: 'Extra' },
                            ].map(w => (
                              <button
                                key={w.value}
                                onClick={() => updateConfig("title", "fontWeight", w.value)}
                                className={cn(
                                  "flex-1 h-8 flex items-center justify-center text-[10px] uppercase font-bold rounded transition-all",
                                  (config.title?.fontWeight || '700') === w.value
                                    ? 'bg-text-main text-bg-main shadow-sm'
                                    : 'text-text-secondary hover:text-text-main hover:bg-btn-hover'
                                )}
                                style={{ fontWeight: w.value }}
                                title={w.title}
                              >
                                {w.label}
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
                            {[
                              { label: 'L', value: '300', title: 'Light' },
                              { label: 'N', value: '400', title: 'Normal' },
                              { label: 'M', value: '500', title: 'Medium' },
                              { label: 'S', value: '600', title: 'Semi' },
                            ].map(w => (
                              <button
                                key={w.value}
                                onClick={() => updateConfig("bio", "fontWeight", w.value)}
                                className={cn(
                                  "flex-1 h-8 flex items-center justify-center text-[10px] uppercase font-bold rounded transition-all",
                                  (config.bio?.fontWeight || '400') === w.value
                                    ? 'bg-text-main text-bg-main shadow-sm'
                                    : 'text-text-secondary hover:text-text-main hover:bg-btn-hover'
                                )}
                                style={{ fontWeight: w.value }}
                                title={w.title}
                              >
                                {w.label}
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
                    <h3 className="font-bold text-sm tracking-wide uppercase">Avatar & Thumbnails</h3>
                  </div>
                  <div className="space-y-6 bg-muted/30 p-4 rounded-2xl border border-border-main/50">
                    {/* Profile Avatar Defaults */}
                    <div className="space-y-4">
                      <Label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Profile Avatar Style</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['circle', 'rounded', 'square', 'full'] as const).map(style => (
                          <Button
                            key={style}
                            variant={config.avatar?.style === style ? "default" : "outline"}
                            onClick={() => setConfig(prev => ({
                              ...prev,
                              avatar: { ...prev.avatar!, style }
                            }))}
                            className={`h-11 text-[9px] uppercase font-bold border-2 transition-all rounded-xl ${config.avatar?.style === style
                              ? 'border-text-main bg-btn-bg text-btn-text shadow-main'
                              : 'border-border-main bg-bg-main text-text-secondary hover:border-text-secondary'
                              }`}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-3 px-1">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-bold text-text-secondary uppercase">Scale</Label>
                          <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded border border-border-main">{config.avatar?.size || 80}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="160"
                          step="4"
                          value={config.avatar?.size || 80}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            avatar: { ...prev.avatar!, size: parseInt(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-border-main rounded-lg appearance-none cursor-pointer accent-text-main"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border-main/10" />

                    {/* Link Thumbnail Defaults */}
                    <div className="space-y-4">
                      <Label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Link Thumbnail Style</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['circle', 'rounded', 'square', 'full'] as const).map(style => (
                          <Button
                            key={style}
                            variant={config.link_thumbnails?.style === style ? "default" : "outline"}
                            onClick={() => setConfig(prev => ({
                              ...prev,
                              link_thumbnails: { ...prev.link_thumbnails!, style }
                            }))}
                            className={`h-11 text-[9px] uppercase font-bold border-2 transition-all rounded-xl ${config.link_thumbnails?.style === style
                              ? 'border-text-main bg-btn-bg text-btn-text shadow-main'
                              : 'border-border-main bg-bg-main text-text-secondary hover:border-text-secondary'
                              }`}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-3 px-1">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-bold text-text-secondary uppercase">Scale</Label>
                          <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded border border-border-main">{config.link_thumbnails?.size || 40}px</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          step="2"
                          value={config.link_thumbnails?.size || 40}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            link_thumbnails: { ...prev.link_thumbnails!, size: parseInt(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-border-main rounded-lg appearance-none cursor-pointer accent-text-main"
                        />
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>

          <DialogFooter className="p-4 sm:p-5 border-t border-border-main bg-muted/30 backdrop-blur-md sticky bottom-0 z-20 flex flex-row gap-3 justify-end items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-5 text-sm rounded-full border-border-main bg-bg-main text-text-secondary hover:bg-btn-hover hover:text-btn-text transition-all font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 text-sm bg-btn-bg hover:bg-btn-hover text-btn-text shadow-main rounded-full border border-border-main gap-2 font-bold transition-all"
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
