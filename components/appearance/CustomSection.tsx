import { useState, useEffect } from "react";
import { Palette, Type, User as UserIcon, Upload, Loader2, X, LayoutGrid } from "lucide-react";
import ColorPicker from "../ui/ColorPicker";
import { FONT_OPTIONS, uploadLinkImage } from "@/lib/themes";
import { createClient } from "@/lib/supabase-browser";
import { LinkPage } from "@/lib/types";

interface CustomSectionProps {
  profile: LinkPage;
  updateProfile: (data: Partial<LinkPage>) => Promise<{ success?: boolean; error?: unknown }>;
}

export default function CustomSection({ profile, updateProfile }: CustomSectionProps) {
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const supabase = createClient();

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBg(true);
    try {
      const publicUrl = await uploadLinkImage(supabase, file);
      await updateProfile({
        page_bg_image: publicUrl,
        theme_preset: null
      });
    } catch (error: unknown) {
      console.error("BG Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  const [radius, setRadius] = useState(profile?.button_radius ?? "rounded");
  const [bgType, setBgType] = useState(profile?.page_bg_type ?? "color");
  const [avatarShape, setAvatarShape] = useState(profile?.avatar_shape ?? "circle");
  const [cardStyle, setCardStyle] = useState(profile?.card_style ?? "filled");
  const [font, setFont] = useState(profile?.page_font ?? "sans");
  const [cardBgColor, setCardBgColor] = useState(profile?.card_bg_color ?? profile?.button_color ?? "#FFFFFF");
  const [, setCardTextColor] = useState(profile?.card_text_color ?? profile?.button_text_color ?? "#1F2937");
  const [pageBgColor, setPageBgColor] = useState(profile?.page_bg_color ?? "#FFFFFF");
  const [pageBgGradStart, setPageBgGradStart] = useState(profile?.page_bg_gradient_start ?? "#FFFFFF");
  const [pageBgGradEnd, setPageBgGradEnd] = useState(profile?.page_bg_gradient_end ?? "#000000");

  // Sync local state when profile props change (e.g. theme selection)
  useEffect(() => {
    if (profile?.button_radius) setRadius(profile.button_radius);
    if (profile?.page_bg_type) setBgType(profile.page_bg_type);
    if (profile?.avatar_shape) setAvatarShape(profile.avatar_shape);
    if (profile?.card_style) setCardStyle(profile.card_style);
    if (profile?.page_font) setFont(profile.page_font);
    setCardBgColor(profile?.card_bg_color ?? profile?.button_color ?? "#FFFFFF");
    setCardTextColor(profile?.card_text_color ?? profile?.button_text_color ?? "#1F2937");
    setPageBgColor(profile?.page_bg_color ?? "#FFFFFF");
    setPageBgGradStart(profile?.page_bg_gradient_start ?? "#FFFFFF");
    setPageBgGradEnd(profile?.page_bg_gradient_end ?? "#000000");
  }, [profile]);

  return (
    <div className="bg-bg-main border border-border-main rounded-radius-main p-6 space-y-8 transition-colors shadow-main text-text-main">
      {/* Background Customization */}
      <section className="space-y-4">
        <h4 className="text-text-main font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4 text-text-secondary" />
          Background
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">Background Type</label>
            <div className="flex gap-2">
              {['color', 'gradient', 'image'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setBgType(type);
                    updateProfile({
                      page_bg_type: type,
                      theme_preset: null
                    });
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${bgType === type
                    ? 'bg-btn-bg border-text-secondary text-btn-text shadow-main'
                    : 'bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover hover:border-text-secondary'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-radius-main border border-border-main shadow-inner">
            {bgType === 'color' && (
              <ColorPicker
                label="Pick Background Color"
                value={pageBgColor}
                onChange={(val) => {
                  setPageBgColor(val);
                  updateProfile({
                    page_bg_color: val,
                    theme_preset: null
                  });
                }}
              />
            )}

            {bgType === 'gradient' && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Start Color"
                  value={pageBgGradStart}
                  onChange={(val) => {
                    setPageBgGradStart(val);
                    updateProfile({
                      page_bg_gradient_start: val,
                      theme_preset: null
                    });
                  }}
                />
                <ColorPicker
                  label="End Color"
                  value={pageBgGradEnd}
                  onChange={(val) => {
                    setPageBgGradEnd(val);
                    updateProfile({
                      page_bg_gradient_end: val,
                      theme_preset: null
                    });
                  }}
                />
              </div>
            )}

            {profile?.page_bg_type === 'image' && (
              <div className="space-y-3">
                <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider">Background Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <label className="flex-1 py-2.5 px-3 bg-btn-bg hover:bg-btn-hover text-btn-text border border-border-main rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-main">
                      {isUploadingBg ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      {isUploadingBg ? "Uploading..." : "Upload Image"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} disabled={isUploadingBg} />
                    </label>
                    {profile?.page_bg_image && (
                      <button
                        onClick={() => updateProfile({ page_bg_image: "" })}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-text-secondary">Or use a direct URL:</p>
                    <input
                      type="url"
                      value={profile?.page_bg_image || ""}
                      onChange={(e) => updateProfile({
                        page_bg_image: e.target.value,
                        theme_preset: null
                      })}
                      placeholder="https://..."
                      className="w-full bg-bg-main text-text-main px-3 py-1.5 rounded-xl border border-border-main text-xs focus:outline-none focus:border-text-secondary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Avatar Shape Customization */}
      <section className="space-y-4">
        <h4 className="text-text-main font-semibold flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-text-secondary" />
          Avatar Shape
        </h4>
        <div className="flex gap-2">
          {[
            { label: 'Circle', value: 'circle' },
            { label: 'Rounded', value: 'rounded' },
            { label: 'Square', value: 'square' },
            { label: 'Full', value: 'full' }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setAvatarShape(opt.value);
                updateProfile({
                  avatar_shape: opt.value,
                  theme_preset: null
                });
              }}
              className={`flex-1 py-2 px-1 rounded-xl border text-[10px] font-semibold transition-all ${avatarShape === opt.value
                ? 'bg-btn-bg border-text-secondary text-btn-text shadow-main'
                : 'bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover hover:border-text-secondary'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Link Customization */}
      <section className="space-y-4">
        <h4 className="text-text-main font-semibold flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-text-secondary" />
          Link Design
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Outline', style: 'outline', bg: pageBgColor, text: pageBgColor },
                { label: 'Flat White', style: 'filled', bg: '#FFFFFF', text: '#1F2937' },
                { label: 'Glass', style: 'glass', bg: '#FFFFFF', text: '#FFFFFF' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setCardStyle(opt.style);
                    setCardBgColor(opt.bg);
                    setCardTextColor(opt.text);
                    updateProfile({
                      card_style: opt.style,
                      card_bg_color: opt.bg,
                      card_text_color: opt.text,
                      theme_preset: null
                    });
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${cardStyle === opt.style && (opt.style === 'glass' || cardBgColor === opt.bg)
                    ? 'bg-btn-bg border-text-secondary text-btn-text shadow-main'
                    : 'bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover hover:border-text-secondary'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
              Corner Radius
            </label>

            <div className="flex gap-2">
              {[
                { label: "Square", value: "none" },
                { label: "Rounded", value: "rounded" },
                { label: "Full", value: "full" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setRadius(opt.value);
                    updateProfile({
                      button_radius: opt.value,
                      theme_preset: null
                    });
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${radius === opt.value
                    ? "bg-btn-bg border-text-secondary text-btn-text shadow-main"
                    : "bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover hover:border-text-secondary"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Font Selection */}
      <section className="space-y-4">
        <h4 className="text-text-main font-semibold flex items-center gap-2">
          <Type className="w-4 h-4 text-text-secondary" />
          Fonts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFont(opt.value);
                updateProfile({
                  page_font: opt.value,
                  theme_preset: null
                });
              }}
              className={`p-4 rounded-radius-main border-2 transition-all flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${font === opt.value
                ? 'bg-btn-bg border-text-secondary text-btn-text shadow-main'
                : 'bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover hover:border-text-secondary'
                }`}
            >
              <span className={`text-xl font-bold ${opt.class}`}>Aa</span>
              <span className="text-[10px] uppercase tracking-widest font-medium opacity-80">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
