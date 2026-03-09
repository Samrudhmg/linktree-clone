"use client";

import { LinkIcon } from "./LinkForm";

export default function PublicLinkItem({ link, profile, borderRadiusClass = "rounded-xl" }) {
  const getFontClass = (fontValue) => {
    const fonts = {
      sans: "font-sans",
      serif: "font-serif", 
      mono: "font-mono",
    };
    return fonts[fontValue] || "font-sans";
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: link.title,
          url: link.url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard(link.url);
        }
      }
    } else {
      copyToClipboard(link.url);
    }
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
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block p-3 sm:p-4 ${borderRadiusClass} text-sm sm:text-base hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${getFontClass(link.font || profile?.page_font)}`}
      style={cardStyle}
    >
      {/* Thumbnail Image (if has one, show it prominently) */}
      {hasThumbnail && (
        <div className="mb-3 -mx-1 -mt-1">
          <img 
            src={link.thumbnail_url} 
            alt="" 
            className={`w-full h-32 sm:h-40 object-cover ${borderRadiusClass}`}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {/* Icon (show only if no thumbnail) */}
        {link.icon && !hasThumbnail && (
          <LinkIcon icon={link.icon} color={cardStyle.color} size="w-5 h-5 sm:w-6 sm:h-6" />
        )}
        <span className="font-medium flex-1">{link.title}</span>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-black/10 transition-colors"
          title="Share link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </a>
  );
}
