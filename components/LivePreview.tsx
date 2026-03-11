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

  // Empty state - just show empty phone frame
  if (!hasContent) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
          <div className="relative w-full max-w-[320px] aspect-[9/19.5] flex items-center justify-start flex-col">
            <div
              className="absolute inset-[3%] z-10"
              style={{ borderRadius: '2rem' }}
            >
              <div
                className="w-full min-h-full rounded-2xl overflow-hidden"
                style={{
                  ...getPageBackground(),
                  boxShadow: "0 8px 30px -6px rgba(0, 0, 0, 0.4)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Phone Frame Layout */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
        {/* Core Screen Container - Represents the bright screen size */}
        <div className="relative w-full max-w-[320px] aspect-[9/19.5] flex items-center justify-start flex-col">

          {/* Screen Content - Behind the phone frame, filling the screen area */}
          <div
            className={`absolute inset-[3%] z-10 overflow-y-auto overflow-x-hidden flex flex-col justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${getFontClass()}`}
            style={{
              borderRadius: '2rem',
            }}
          >
            {/* Card / Box */}
            <div
              className="w-full min-h-full rounded-2xl overflow-hidden relative"
              style={{
                ...getPageBackground(),
                boxShadow: "0 8px 30px -6px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Overlay for image backgrounds */}
              {a.page_bg_type === "image" && a.page_bg_image && (
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                />
              )}

              <div className="relative z-10 p-3 text-center">
                {/* Avatar */}
                {page?.avatar_url && (
                  <div className="flex justify-center mb-3 mt-3">
                    <img
                      src={page.avatar_url}
                      alt={page?.display_name || "Profile"}
                      className={`w-14 h-14 object-cover border-2 border-white/20 ${a.avatar_shape === "square" ? "rounded-lg" : "rounded-full"}`}
                    />
                  </div>
                )}

                {/* Name */}
                {page?.display_name && page.display_name.trim() !== "" && (
                  <h2 className="text-white font-bold text-sm mb-1">
                    {page.display_name}
                  </h2>
                )}

                {/* Bio */}
                {page?.bio && page.bio.trim() !== "" && (
                  <p className="text-white/80 text-xs mb-3 px-1">
                    {page.bio}
                  </p>
                )}

                {/* Links */}
                <div className="space-y-2 px-1">
                  {(!links || links.length === 0) ? (
                    <p className="text-white/50 text-xs py-4">
                      Your links will appear here
                    </p>
                  ) : (
                    links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block py-2 px-2 ${getBorderRadiusClass()} transition-transform hover:scale-[1.02]`}
                        style={getCardStyle(link)}
                      >
                        <div className="flex items-center gap-1.5">
                          {/* Left Side: Thumbnail or Icon */}
                          {(link.thumbnail_url || link.icon) && (
                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                              {link.thumbnail_url ? (
                                <img
                                  src={link.thumbnail_url}
                                  alt=""
                                  className="w-5 h-5 rounded object-cover"
                                />
                              ) : link.icon ? (
                                <LinkIcon icon={link.icon} color={link.text_color || a.card_text_color} />
                              ) : null}
                            </div>
                          )}

                          {/* Center: Title */}
                          <span className="font-medium text-xs flex-1 text-center leading-tight">{link.title}</span>

                          {/* Right Side: Three dots menu */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShareLink(link);
                            }}
                            className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
      </div>

      {/* Share URL */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-gray-400 text-xs mb-1">Your page is live at:</p>
        <div className="flex items-center gap-2">
          <code className="text-green-400 text-xs flex-1 truncate">
            /{page?.slug || ""}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${page?.slug || ""}`)}
            className="text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
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



