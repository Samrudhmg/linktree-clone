// @ts-nocheck
// @ts-nocheck
"use client";

import { useState } from "react";
import { LinkPreviewItem, LinkIcon } from "./LinkForm";
import { FONT_OPTIONS, BORDER_RADIUS_OPTIONS, CARD_STYLES } from "@/lib/themes";
import ShareModal from "./ShareModal";

// 'appearance' prop: live/unsaved appearance state from PageAppearance editor
// Falls back to 'page' (saved DB state), then to defaults
export default function LivePreview({ profile, page, links, appearance }) {
  const [shareLink, setShareLink] = useState(null);

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
    avatar_shape: appearance?.avatar_shape ?? page?.avatar_shape ?? "rounded",
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

  // Check if there's any meaningful content to display
  const hasContent = (page?.avatar_url && page.avatar_url !== "") || 
                     (page?.display_name && page.display_name !== "") || 
                     (page?.bio && page.bio !== "") || 
                     (links && links.length > 0);

  const pageBackground = getPageBackground();
  const fontClass = getFontClass();

  // Empty state
  if (!hasContent) {
    return (
      <div className="py-4">
        <div className="w-full flex justify-center">
          <div className="w-[280px] h-[580px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-700 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-5 bg-gray-900 rounded-full z-20" />
            <div className={`w-full h-full rounded-[2rem] overflow-hidden ${fontClass}`} style={pageBackground}>
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50 text-sm">Add content to see preview</p>
              </div>
            </div>
          </div>
        </div>
        <ShareModal
          isOpen={!!shareLink}
          onClose={() => setShareLink(null)}
          link={shareLink}
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="w-full flex justify-center">
        <div className="w-[280px] h-[580px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-700 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-5 bg-gray-900 rounded-full z-20" />
          <div className={`w-full h-full rounded-[2rem] overflow-hidden ${fontClass}`} style={pageBackground}>
            <div className="h-full overflow-y-auto p-4 pt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Avatar */}
              {page?.avatar_url && (
                <div className="flex justify-center mb-3 mt-4">
                  <img
                    src={page.avatar_url}
                    alt={page?.display_name || "Profile"}
                    className={`w-16 h-16 object-cover border-2 border-white/20 ${a.avatar_shape === "square" ? "rounded-lg" : "rounded-full"}`}
                  />
                </div>
              )}

              {/* Name */}
              {page?.display_name && page.display_name.trim() !== "" && (
                <h2 className="text-white font-bold text-base mb-1 text-center">
                  {page.display_name}
                </h2>
              )}

              {/* Bio */}
              {page?.bio && page.bio.trim() !== "" && (
                <p className="text-white/80 text-sm mb-4 text-center px-2">
                  {page.bio}
                </p>
              )}

              {/* Links */}
              <div className="space-y-2">
                {(!links || links.length === 0) ? (
                  <p className="text-white/50 text-sm py-4 text-center">
                    Your links will appear here
                  </p>
                ) : (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block py-3 px-3 ${getBorderRadiusClass()} transition-transform hover:scale-[1.02]`}
                      style={getCardStyle(link)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Left Side: Thumbnail or Icon */}
                        {(link.thumbnail_url || link.icon) && (
                          <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                            {link.thumbnail_url ? (
                              <img
                                src={link.thumbnail_url}
                                alt=""
                                className="w-6 h-6 rounded object-cover"
                              />
                            ) : link.icon ? (
                              <LinkIcon icon={link.icon} color={link.text_color || a.card_text_color} />
                            ) : null}
                          </div>
                        )}

                        {/* Center: Title */}
                        <span className="font-medium text-sm flex-1 text-center truncate max-w-[160px]">{link.title}</span>

                        {/* Right Side: Three dots menu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShareLink(link);
                          }}
                          className="shrink-0 w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={!!shareLink}
        onClose={() => setShareLink(null)}
        link={shareLink}
      />
    </div>
  );
}



