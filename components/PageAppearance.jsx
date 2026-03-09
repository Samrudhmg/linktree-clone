"use client";

import { useState } from "react";
import { THEME_PRESETS, COLOR_PALETTES, FONT_OPTIONS, CARD_STYLES, BORDER_RADIUS_OPTIONS } from "@/lib/themes";

export default function PageAppearance({ profile, updateProfile }) {
  const [activeSection, setActiveSection] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme_preset || "default");
  
  // Page background
  const [bgType, setBgType] = useState(profile?.page_bg_type || "gradient");
  const [bgColor, setBgColor] = useState(profile?.page_bg_color || "#6366F1");
  const [gradientFrom, setGradientFrom] = useState(profile?.page_bg_gradient_from || "#6366F1");
  const [gradientTo, setGradientTo] = useState(profile?.page_bg_gradient_to || "#A855F7");
  const [bgImage, setBgImage] = useState(profile?.page_bg_image || "");
  
  // Card styles
  const [cardBgColor, setCardBgColor] = useState(profile?.card_bg_color || "#FFFFFF");
  const [cardTextColor, setCardTextColor] = useState(profile?.card_text_color || "#1F2937");
  const [cardStyle, setCardStyle] = useState(profile?.card_style || "filled");
  const [borderRadius, setBorderRadius] = useState(profile?.card_border_radius || "rounded");
  
  // Font
  const [pageFont, setPageFont] = useState(profile?.page_font || "sans");

  const [saving, setSaving] = useState(false);

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
      await updateProfile({
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
      });
    } finally {
      setSaving(false);
    }
  };

  const getPageBackground = () => {
    if (bgType === "image" && bgImage) {
      return { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (bgType === "color") {
      return { backgroundColor: bgColor };
    }
    return { background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` };
  };

  const getCardStyle = () => {
    const baseStyle = { backgroundColor: cardBgColor, color: cardTextColor };
    
    switch (cardStyle) {
      case "outline":
        return { ...baseStyle, backgroundColor: "transparent", border: `2px solid ${cardBgColor}`, color: cardBgColor };
      case "shadow":
        return { ...baseStyle, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" };
      case "glass":
        return { ...baseStyle, backgroundColor: `${cardBgColor}CC`, backdropFilter: "blur(10px)" };
      default:
        return baseStyle;
    }
  };

  const getBorderRadiusClass = () => {
    return BORDER_RADIUS_OPTIONS.find(r => r.value === borderRadius)?.class || "rounded-xl";
  };

  return (
    <div className="space-y-6">
      {/* Mini Preview */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </h3>
        <div 
          className="h-48 rounded-xl p-4 flex flex-col items-center justify-center"
          style={getPageBackground()}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-2 flex items-center justify-center text-white text-lg">
            {profile?.display_name?.[0]?.toUpperCase() || "U"}
          </div>
          <p className={`text-white text-sm font-medium mb-3 ${FONT_OPTIONS.find(f => f.value === pageFont)?.class}`}>
            {profile?.display_name || "Your Name"}
          </p>
          <div 
            className={`w-full max-w-[200px] py-2 px-4 text-center text-sm ${getBorderRadiusClass()} ${FONT_OPTIONS.find(f => f.value === pageFont)?.class}`}
            style={getCardStyle()}
          >
            Sample Link
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "themes", label: "Themes" },
          { id: "background", label: "Background" },
          { id: "cards", label: "Cards" },
          { id: "fonts", label: "Fonts" },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === section.id
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Themes Section */}
      {activeSection === "themes" && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
          <h3 className="text-white font-semibold text-lg">Theme Presets</h3>
          <p className="text-gray-400 text-sm">Choose a pre-designed theme or customize your own</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-purple-500 ring-2 ring-purple-500/30"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2"
                  style={{ background: theme.preview }}
                />
                <p className="text-white text-xs font-medium truncate">{theme.name}</p>
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
          <h3 className="text-white font-semibold text-lg">Page Background</h3>
          
          {/* Background Type */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Background Type</label>
            <div className="flex gap-2">
              {[
                { value: "gradient", label: "Gradient" },
                { value: "color", label: "Solid Color" },
                { value: "image", label: "Image" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setBgType(type.value); setSelectedTheme("custom"); }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                    bgType === type.value
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
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Gradient Start Color</label>
                <ColorPicker 
                  value={gradientFrom} 
                  onChange={(c) => { setGradientFrom(c); setSelectedTheme("custom"); }} 
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Gradient End Color</label>
                <ColorPicker 
                  value={gradientTo} 
                  onChange={(c) => { setGradientTo(c); setSelectedTheme("custom"); }} 
                />
              </div>
            </div>
          )}

          {/* Solid Color */}
          {bgType === "color" && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Background Color</label>
              <ColorPicker 
                value={bgColor} 
                onChange={(c) => { setBgColor(c); setSelectedTheme("custom"); }} 
              />
            </div>
          )}

          {/* Background Image */}
          {bgType === "image" && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Background Image URL</label>
              <input
                type="url"
                value={bgImage}
                onChange={(e) => { setBgImage(e.target.value); setSelectedTheme("custom"); }}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Cards Section */}
      {activeSection === "cards" && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
          <h3 className="text-white font-semibold text-lg">Card Appearance</h3>
          
          {/* Card Style */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Card Style</label>
            <div className="grid grid-cols-2 gap-2">
              {CARD_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => { setCardStyle(style.value); setSelectedTheme("custom"); }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    cardStyle === style.value
                      ? "bg-purple-600/20 border-purple-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <p className="font-medium text-sm">{style.label}</p>
                  <p className="text-xs text-gray-400">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Background Color */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Card Background Color</label>
            <ColorPicker 
              value={cardBgColor} 
              onChange={(c) => { setCardBgColor(c); setSelectedTheme("custom"); }} 
            />
          </div>

          {/* Card Text Color */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Card Text Color</label>
            <ColorPicker 
              value={cardTextColor} 
              onChange={(c) => { setCardTextColor(c); setSelectedTheme("custom"); }} 
            />
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Corner Style</label>
            <div className="flex gap-2">
              {BORDER_RADIUS_OPTIONS.map((radius) => (
                <button
                  key={radius.value}
                  onClick={() => { setBorderRadius(radius.value); setSelectedTheme("custom"); }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                    borderRadius === radius.value
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
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
          <h3 className="text-white font-semibold text-lg">Typography</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => { setPageFont(font.value); setSelectedTheme("custom"); }}
                className={`p-4 rounded-xl border transition-all ${
                  pageFont === font.value
                    ? "bg-purple-600/20 border-purple-500"
                    : "bg-gray-700 border-gray-600 hover:border-gray-500"
                }`}
              >
                <span className={`text-3xl text-white block mb-2 ${font.class}`}>{font.preview}</span>
                <span className="text-sm text-gray-300">{font.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Appearance
          </>
        )}
      </button>
    </div>
  );
}

// Color Picker Component with Palettes
function ColorPicker({ value, onChange }) {
  return (
    <div className="space-y-3">
      {/* Color Palettes */}
      {COLOR_PALETTES.map((palette) => (
        <div key={palette.name}>
          <p className="text-gray-500 text-xs mb-1.5">{palette.name}</p>
          <div className="flex flex-wrap gap-1.5">
            {palette.colors.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${
                  value === color ? "border-purple-500 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Custom Color Input */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}
