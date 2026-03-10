// @ts-nocheck
// @ts-nocheck
"use client";

import { LinkPreviewItem } from "./LinkForm";
import { FONT_OPTIONS, BORDER_RADIUS_OPTIONS, CARD_STYLES } from "@/lib/themes";

// 'appearance' prop: live/unsaved appearance state from PageAppearance editor
// Falls back to 'page' (saved DB state), then to defaults
export default function LivePreview({ profile, page, links, appearance }) {
  // Merge: live appearance > saved page data > defaults
  const a = {
    page_bg_type: appearance?.page_bg_type ?? page?.page_bg_type ?? "gradient",
    page_bg_color: appearance?.page_bg_color ?? page?.page_bg_color ?? "#6366F1",
    page_bg_gradient_from: appearance?.page_bg_gradient_from ?? page?.page_bg_gradient_from ?? "#6366F1",
    page_bg_gradient_to: appearance?.page_bg_gradient_to ?? page?.page_bg_gradient_to ?? "#A855F7",
    page_bg_image: appearance?.page_bg_image ?? page?.page_bg_image ?? "",
    card_bg_color: appearance?.card_bg_color ?? page?.card_bg_color ?? "#FFFFFF",
    card_text_color: appearance?.card_text_color ?? page?.card_text_color ?? "#1F2937",
    card_border_radius: appearance?.card_border_radius ?? page?.card_border_radius ?? "rounded",
    card_style: appearance?.card_style ?? page?.card_style ?? "filled",
    page_font: appearance?.page_font ?? page?.page_font ?? "sans",
  };

  const getPageBackground = () => {
    if (a.page_bg_type === "image" && a.page_bg_image) {
      return { backgroundImage: `url(${a.page_bg_image})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (a.page_bg_type === "color") {
      return { backgroundColor: a.page_bg_color };
    }
    return {
      background: `linear-gradient(135deg, ${a.page_bg_gradient_from} 0%, ${a.page_bg_gradient_to} 100%)`
    };
  };

  const getCardStyle = (link) => {
    const bgColor = link?.bg_color || a.card_bg_color;
    const textColor = link?.text_color || a.card_text_color;
    const cardStyle = a.card_style;

    const baseStyle = { backgroundColor: bgColor, color: textColor };

    switch (cardStyle) {
      case "outline":
        return { ...baseStyle, backgroundColor: "transparent", border: `2px solid ${bgColor}`, color: bgColor };
      case "shadow":
        return { ...baseStyle, boxShadow: "0 4px 15px -3px rgba(0, 0, 0, 0.2)" };
      case "glass":
        return { ...baseStyle, backgroundColor: `${bgColor}CC`, backdropFilter: "blur(10px)" };
      default:
        return baseStyle;
    }
  };

  const getBorderRadiusClass = () => {
    return BORDER_RADIUS_OPTIONS.find(r => r.value === a.card_border_radius)?.class || "rounded-xl";
  };

  const getFontClass = () => {
    return FONT_OPTIONS.find(f => f.value === a.page_font)?.class || "font-sans";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Phone Frame */}
      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl flex flex-col max-h-[600px]">
        {/* Notch */}
        <div className="h-6 bg-gray-900 flex justify-center items-end pb-1">
          <div className="w-20 h-4 bg-gray-800 rounded-full" />
        </div>

        {/* Screen Content â€” Dark outer bg with card inside */}
        <div className={`flex-1 overflow-y-auto flex items-start justify-center p-3 ${getFontClass()}`} style={{ backgroundColor: "#0f0f1a" }}>
          {/* Card / Box */}
          <div
            className="w-full rounded-2xl overflow-hidden relative"
            style={{
              ...getPageBackground(),
              boxShadow: "0 8px 30px -6px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Overlay for image backgrounds */}
            {a.page_bg_type === "image" && a.page_bg_image && (
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                }}
              />
            )}

            <div className="relative z-10 p-4 text-center">
              {/* Name */}
              <h2 className="text-white font-bold text-sm mb-1">
                {profile?.display_name || "Your Name"}
              </h2>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-white/80 text-xs mb-3 px-2">
                  {profile.bio}
                </p>
              )}

              {/* Links */}
              <div className="space-y-2 px-1">
                {(!links || links.length === 0) ? (
                  <p className="text-white/50 text-xs py-6">
                    Your links will appear here
                  </p>
                ) : (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block py-2.5 px-3 ${getBorderRadiusClass()} transition-transform hover:scale-[1.02]`}
                      style={getCardStyle(link)}
                    >
                      <div className="relative flex items-center justify-center min-h-[36px] px-10">
                        {/* Left Side: Thumbnail or Icon */}
                        <div className="absolute left-0 pl-1 flex items-center justify-center pointer-events-none">
                          {link.thumbnail_url ? (
                            <img
                              src={link.thumbnail_url}
                              alt=""
                              className="w-8 h-8 rounded-md object-cover"
                            />
                          ) : link.icon ? (
                            <div className="w-8 h-8 flex items-center justify-center">
                              <LinkIcon icon={link.icon} color={link.text_color || a.card_text_color} />
                            </div>
                          ) : null}
                        </div>

                        {/* Center: Title */}
                        <span className="font-semibold text-xs text-center w-full leading-tight">{link.title}</span>

                        {/* Right Side: Share Button */}
                        <div className="absolute right-0 pr-1 flex items-center justify-center">
                          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="h-6 bg-gray-900 flex justify-center items-center">
          <div className="w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Share URL */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-gray-400 text-xs mb-1">Your page is live at:</p>
        <div className="flex items-center gap-2">
          <code className="text-green-400 text-xs flex-1 truncate">
            /{profile?.username || ""}/{page?.slug || ""}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${profile?.username || ""}/${page?.slug || ""}`)}
            className="text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Link Icon component for preview
function LinkIcon({ icon, color = "#1F2937" }) {
  const icons = {
    link: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    globe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth={2} /><circle cx="12" cy="12" r="4" strokeWidth={2} /></>,
  };

  return (
    <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
      {icons[icon] || icons.link}
    </svg>
  );
}

