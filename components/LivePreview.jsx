"use client";

import { LinkPreviewItem } from "./LinkForm";
import { FONT_OPTIONS, BORDER_RADIUS_OPTIONS, CARD_STYLES } from "@/lib/themes";

export default function LivePreview({ profile, links }) {
  const getPageBackground = () => {
    const bgType = profile?.page_bg_type || "gradient";
    if (bgType === "image" && profile?.page_bg_image) {
      return { backgroundImage: `url(${profile.page_bg_image})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (bgType === "color") {
      return { backgroundColor: profile?.page_bg_color || "#6366F1" };
    }
    return { 
      background: `linear-gradient(135deg, ${profile?.page_bg_gradient_from || "#6366F1"} 0%, ${profile?.page_bg_gradient_to || "#A855F7"} 100%)` 
    };
  };

  const getCardStyle = (link) => {
    // Use link-specific styles if available, otherwise use profile defaults
    const bgColor = link?.bg_color || profile?.card_bg_color || "#FFFFFF";
    const textColor = link?.text_color || profile?.card_text_color || "#1F2937";
    const cardStyle = profile?.card_style || "filled";
    
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
    return BORDER_RADIUS_OPTIONS.find(r => r.value === (profile?.card_border_radius || "rounded"))?.class || "rounded-xl";
  };

  const getFontClass = () => {
    return FONT_OPTIONS.find(f => f.value === (profile?.page_font || "sans"))?.class || "font-sans";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Phone Frame */}
      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl flex flex-col max-h-[600px]">
        {/* Notch */}
        <div className="h-6 bg-gray-900 flex justify-center items-end pb-1">
          <div className="w-20 h-4 bg-gray-800 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className={`flex-1 overflow-y-auto ${getFontClass()}`} style={getPageBackground()}>
          <div className="p-4 text-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center text-2xl text-white">
              {profile?.display_name?.[0]?.toUpperCase() || "@"}
            </div>

            {/* Name */}
            <h2 className="text-white font-bold text-sm mb-1">
              {profile?.display_name || "Your Name"}
            </h2>
            <p className="text-white/70 text-xs mb-4">
              @{profile?.username || "username"}
            </p>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-white/80 text-xs mb-4 px-2">
                {profile.bio}
              </p>
            )}

            {/* Links */}
            <div className="space-y-2 px-2">
              {links.length === 0 ? (
                <p className="text-white/50 text-xs py-8">
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
                    <div className="flex items-center gap-2">
                      {link.thumbnail_url && (
                        <img 
                          src={link.thumbnail_url} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      {link.icon && !link.thumbnail_url && (
                        <LinkIcon icon={link.icon} color={link.text_color || profile?.card_text_color || "#1F2937"} />
                      )}
                      <span className="font-medium text-xs flex-1 text-left">{link.title}</span>
                      <button className="p-1 rounded-full hover:bg-black/10">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </a>
                ))
              )}
            </div>

            {/* Footer */}
            <p className="mt-6 text-white/40 text-[10px]">
              ELTLINKTREE
            </p>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="h-6 bg-gray-900 flex justify-center items-center">
          <div className="w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Share URL */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-gray-400 text-xs mb-1">Your ELTLINKTREE is live:</p>
        <div className="flex items-center gap-2">
          <code className="text-green-400 text-xs flex-1 truncate">
            eltlinktree/{profile?.username || "username"}
          </code>
          <button 
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${profile?.username || "username"}`)}
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
