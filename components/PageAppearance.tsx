// @ts-nocheck
// @ts-nocheck
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { THEME_PRESETS, FONT_OPTIONS, CARD_STYLES, BORDER_RADIUS_OPTIONS } from "@/lib/themes";

export default function PageAppearance({ page, updatePage, onAppearanceChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState(page?.theme_preset || "default");

  // Page background
  const [bgType, setBgType] = useState(page?.page_bg_type || "gradient");
  const [bgColor, setBgColor] = useState(page?.page_bg_color || "#6366F1");
  const [gradientFrom, setGradientFrom] = useState(page?.page_bg_gradient_from || "#6366F1");
  const [gradientTo, setGradientTo] = useState(page?.page_bg_gradient_to || "#A855F7");
  const [bgImage, setBgImage] = useState(page?.page_bg_image || "");

  // Card styles
  const [cardBgColor, setCardBgColor] = useState(page?.card_bg_color || "#FFFFFF");
  const [cardTextColor, setCardTextColor] = useState(page?.card_text_color || "#1F2937");
  const [cardStyle, setCardStyle] = useState(page?.card_style || "filled");
  const [borderRadius, setBorderRadius] = useState(page?.card_border_radius || "rounded");

  // Font
  const [pageFont, setPageFont] = useState(page?.page_font || "sans");

  // Avatar shape
  const [avatarShape, setAvatarShape] = useState(page?.avatar_shape || "rounded");

  const [saving, setSaving] = useState(false);
  const [uploadingBgImage, setUploadingBgImage] = useState(false);
  const bgImageInputRef = useRef(null);

  // Handle background image file upload
  const handleBgImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBgImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setBgImage(dataUrl);
      setSelectedTheme("custom");
      setUploadingBgImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Build current appearance state
  const getCurrentAppearance = useCallback(() => ({
    theme_preset: selectedTheme,
    page_bg_type: bgType,
    page_bg_color: bgColor,
    page_bg_gradient_from: gradientFrom,
    page_bg_gradient_to: gradientTo,
    page_bg_image: bgImage,
    card_bg_color: cardBgColor,
    card_text_color: cardTextColor,
    card_style: cardStyle,
    card_border_radius: borderRadius,
    page_font: pageFont,
    avatar_shape: avatarShape,
  }), [selectedTheme, bgType, bgColor, gradientFrom, gradientTo, bgImage, cardBgColor, cardTextColor, cardStyle, borderRadius, pageFont, avatarShape]);

  // Notify parent of appearance changes for real-time preview
  useEffect(() => {
    if (onAppearanceChange) {
      onAppearanceChange(getCurrentAppearance());
    }
  }, [getCurrentAppearance, onAppearanceChange]);

  // When page changes, reset local state
  useEffect(() => {
    if (page) {
      setSelectedTheme(page.theme_preset || "default");
      setBgType(page.page_bg_type || "gradient");
      setBgColor(page.page_bg_color || "#6366F1");
      setGradientFrom(page.page_bg_gradient_from || "#6366F1");
      setGradientTo(page.page_bg_gradient_to || "#A855F7");
      setBgImage(page.page_bg_image || "");
      setCardBgColor(page.card_bg_color || "#FFFFFF");
      setCardTextColor(page.card_text_color || "#1F2937");
      setCardStyle(page.card_style || "filled");
      setBorderRadius(page.card_border_radius || "rounded");
      setPageFont(page.page_font || "sans");
      setAvatarShape(page.avatar_shape || "rounded");
    }
  }, [page?.id]);

  const applyTheme = (theme) => {
    setSelectedTheme(theme.id);
    if (theme.id !== "custom") {
      setBgType(theme.page_bg_type);
      if (theme.page_bg_type === "color") {
        setBgColor(theme.page_bg_color);
      }
      setGradientFrom(theme.page_bg_gradient_from);
      setGradientTo(theme.page_bg_gradient_to);
      setCardBgColor(theme.card_bg_color);
      setCardTextColor(theme.card_text_color);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage(getCurrentAppearance());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl mb-6 overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="text-white font-semibold text-lg">Page Appearance</span>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "themes", label: "Themes" },
              { id: "background", label: "Box BG" },
              { id: "cards", label: "Cards" },
              { id: "fonts", label: "Fonts" },
              { id: "avatar", label: "Avatar" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeSection === section.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Themes Section */}
          {activeSection === "themes" && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Choose a pre-designed theme for your box</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {THEME_PRESETS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme)}
                    className={`relative p-2 rounded-lg border-2 transition-all ${selectedTheme === theme.id
                      ? "border-purple-500 ring-1 ring-purple-500/30"
                      : "border-gray-700 hover:border-gray-600"
                      }`}
                  >
                    <div
                      className="w-full h-10 rounded mb-1"
                      style={{ background: theme.preview }}
                    />
                    <p className="text-white text-[10px] font-medium truncate">{theme.name}</p>
                    {selectedTheme === theme.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Section */}
          {activeSection === "background" && (
            <div className="space-y-3">
              {/* Background Type */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Box Background Type</label>
                <div className="flex gap-1.5">
                  {[
                    { value: "gradient", label: "Gradient" },
                    { value: "color", label: "Solid" },
                    { value: "image", label: "Image" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => { setBgType(type.value); setSelectedTheme("custom"); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs transition-all ${bgType === type.value
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient Colors */}
              {bgType === "gradient" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Start Color</label>
                    <CompactColorPicker
                      value={gradientFrom}
                      onChange={(c) => { setGradientFrom(c); setSelectedTheme("custom"); }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">End Color</label>
                    <CompactColorPicker
                      value={gradientTo}
                      onChange={(c) => { setGradientTo(c); setSelectedTheme("custom"); }}
                    />
                  </div>
                </div>
              )}

              {/* Solid Color */}
              {bgType === "color" && (
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Color</label>
                  <CompactColorPicker
                    value={bgColor}
                    onChange={(c) => { setBgColor(c); setSelectedTheme("custom"); }}
                  />
                </div>
              )}

              {/* Background Image */}
              {bgType === "image" && (
                <div className="space-y-3">
                  {/* Upload Button */}
                  <button
                    onClick={() => bgImageInputRef.current?.click()}
                    disabled={uploadingBgImage}
                    className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {uploadingBgImage ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Image
                      </>
                    )}
                  </button>
                  <input
                    ref={bgImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBgImageUpload}
                    className="hidden"
                  />

                  {/* Or URL Input */}
                  <div className="space-y-1.5">
                    <label className="block text-gray-400 text-xs">Or paste Image URL:</label>
                    <input
                      type="url"
                      value={bgImage}
                      onChange={(e) => { setBgImage(e.target.value); setSelectedTheme("custom"); }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  {/* Preview */}
                  {bgImage && (
                    <div className="space-y-1.5">
                      <label className="block text-gray-400 text-xs">Preview:</label>
                      <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-700">
                        <img src={bgImage} alt="Background preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => { setBgImage(""); setSelectedTheme("custom"); }}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cards Section */}
          {activeSection === "cards" && (
            <div className="space-y-3">
              {/* Card Style */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Style</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CARD_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => { setCardStyle(style.value); setSelectedTheme("custom"); }}
                      className={`p-2 rounded-lg border text-left transition-all ${cardStyle === style.value
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                    >
                      <p className="font-medium text-xs">{style.label}</p>
                      <p className="text-[10px] text-gray-400">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Colors */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Card Background</label>
                <CompactColorPicker
                  value={cardBgColor}
                  onChange={(c) => { setCardBgColor(c); setSelectedTheme("custom"); }}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Card Text</label>
                <CompactColorPicker
                  value={cardTextColor}
                  onChange={(c) => { setCardTextColor(c); setSelectedTheme("custom"); }}
                />
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Corners</label>
                <div className="flex gap-1.5">
                  {BORDER_RADIUS_OPTIONS.map((radius) => (
                    <button
                      key={radius.value}
                      onClick={() => { setBorderRadius(radius.value); setSelectedTheme("custom"); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs transition-all ${borderRadius === radius.value
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                    >
                      {radius.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fonts Section */}
          {activeSection === "fonts" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => { setPageFont(font.value); setSelectedTheme("custom"); }}
                    className={`p-3 rounded-lg border transition-all ${pageFont === font.value
                      ? "bg-purple-600/20 border-purple-500"
                      : "bg-gray-700 border-gray-600 hover:border-gray-500"
                      }`}
                  >
                    <span className={`text-2xl text-white block mb-1 ${font.class}`}>{font.preview}</span>
                    <span className="text-xs text-gray-300">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Avatar Section */}
          {activeSection === "avatar" && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Choose the shape for your profile avatar</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAvatarShape("rounded"); setSelectedTheme("custom"); }}
                  className={`flex-1 p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${avatarShape === "rounded"
                    ? "bg-purple-600/20 border-purple-500"
                    : "bg-gray-700 border-gray-600 hover:border-gray-500"
                    }`}
                >
                  <div className="w-12 h-12 bg-gray-500 rounded-full" />
                  <span className="text-xs text-gray-300">Rounded</span>
                </button>
                <button
                  onClick={() => { setAvatarShape("square"); setSelectedTheme("custom"); }}
                  className={`flex-1 p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${avatarShape === "square"
                    ? "bg-purple-600/20 border-purple-500"
                    : "bg-gray-700 border-gray-600 hover:border-gray-500"
                    }`}
                >
                  <div className="w-12 h-12 bg-gray-500 rounded-lg" />
                  <span className="text-xs text-gray-300">Square</span>
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 text-sm"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Appearance
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Compact Color Picker â€” just native picker + hex input
function CompactColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-xs"
        placeholder="#FFFFFF"
      />
    </div>
  );
}

