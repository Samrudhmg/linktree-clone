// @ts-nocheck
"use client";

import { useState } from "react";
import { LinkIcon } from "./LinkForm";
import ShareModal from "./ShareModal";

export default function PublicLinkItem({ link, profile, borderRadiusClass = "rounded-xl" }) {
  const getFontClass = (fontValue) => {
    const fonts = {
      sans: "font-sans",
      serif: "font-serif",
      mono: "font-mono",
    };
    return fonts[fontValue] || "font-sans";
  };

  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show a toast notification
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-sm rounded-lg z-50";
    toast.textContent = "Link copied to clipboard!";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Get card style based on profile settings
  const getCardStyle = () => {
    const bgColor = link.bg_color || profile?.card_bg_color || "#FFFFFF";
    const textColor = link.text_color || profile?.card_text_color || "#1F2937";
    const cardStyle = profile?.card_style || "filled";

    // If link has a background image, use that
    if (link.bg_type === "image" && link.bg_image) {
      return {
        backgroundImage: `url(${link.bg_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: textColor,
      };
    }

    const baseStyle = { backgroundColor: bgColor, color: textColor };

    switch (cardStyle) {
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: `2px solid ${bgColor}`,
          color: bgColor
        };
      case "shadow":
        return {
          ...baseStyle,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
        };
      case "glass":
        return {
          ...baseStyle,
          backgroundColor: `${bgColor}CC`,
          backdropFilter: "blur(10px)"
        };
      default:
        return baseStyle;
    }
  };

  const cardStyle = getCardStyle();
  const hasThumbnail = link.thumbnail_url;

  return (
    <>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block py-3 px-4 ${borderRadiusClass} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${getFontClass(link.font || profile?.page_font)}`}
        style={cardStyle}
      >
        <div className="flex items-center gap-3">
          {/* Left Side: Thumbnail or Icon */}
          {(hasThumbnail || link.icon) && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              {hasThumbnail ? (
                <img
                  src={link.thumbnail_url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e: any) => e.target.style.display = 'none'}
                />
              ) : link.icon ? (
                <LinkIcon icon={link.icon} color={cardStyle.color} size="w-6 h-6" />
              ) : null}
            </div>
          )}

          {/* Center: Title */}
          <span className="font-semibold text-center break-words flex-1 text-[15px]">{link.title}</span>

          {/* Right Side: Three dots menu */}
          <button
            onClick={handleShare}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            title="More options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </a>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        link={link}
      />
    </>
  );
}
