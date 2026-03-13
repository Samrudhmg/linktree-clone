"use client";

import { useState } from "react";
import { LinkIcon } from "./LinkIcon";
import {
  getPageBackgroundStyle,
  getCardStyle,
  getFontClass,
  getBorderRadiusClass,
  getAvatarShapeClass
} from "@/lib/themes";
import ShareModal from "./ShareModal";
import type { ShareLinkData } from "./ShareModal";
import { MoreVertical } from "lucide-react";
import { LinkPage, Link } from "@/lib/types";

// 'appearance' prop: live/unsaved appearance state from PageAppearance editor
// Falls back to 'page' (saved DB state), then to defaults
export default function LivePreview({ page, links, appearance }: { page: LinkPage | null, links: Link[], appearance: LinkPage | null }) {
  const [shareLink, setShareLink] = useState<ShareLinkData | null>(null);

  // Merge: live appearance > saved page data > defaults
  const a = {
    page_bg_type: appearance?.page_bg_type ?? page?.page_bg_type ?? "gradient",
    page_bg_color: appearance?.page_bg_color ?? page?.page_bg_color ?? "#6366F1",
    page_bg_gradient_start: appearance?.page_bg_gradient_start ?? page?.page_bg_gradient_start ?? "#6366F1",
    page_bg_gradient_end: appearance?.page_bg_gradient_end ?? page?.page_bg_gradient_end ?? "#A855F7",
    page_bg_image: appearance?.page_bg_image ?? page?.page_bg_image ?? "",
    card_bg_color: appearance?.card_bg_color ?? page?.card_bg_color ?? "#FFFFFF",
    card_text_color: appearance?.card_text_color ?? page?.card_text_color ?? "#1F2937",
    button_radius: appearance?.button_radius ?? page?.button_radius ?? "rounded",
    card_style: appearance?.card_style ?? page?.card_style ?? "filled",
    page_font: appearance?.page_font ?? page?.page_font ?? "sans",
    avatar_shape: appearance?.avatar_shape ?? page?.avatar_shape ?? "rounded",
  };

  const pageBackground = getPageBackgroundStyle(a);
  const fontClass = getFontClass(a.page_font);
  const borderRadiusClass = getBorderRadiusClass(a.button_radius);
  const avatarShapeClass = getAvatarShapeClass(a.avatar_shape);

  // Check if there's any meaningful content to display
  const hasContent = (page?.avatar_url && page.avatar_url !== "") ||
    (page?.display_name && page.display_name !== "") ||
    (page?.bio && page.bio !== "") ||
    (links && links.length > 0);

  // Empty state
  if (!hasContent) {
    return (
      <div>
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
    <div>
      <div className="w-full flex justify-center">
        <div className="w-[280px] h-[580px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-700 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-5 bg-gray-900 rounded-full z-20" />
          <div className={`w-full h-full rounded-[2rem] overflow-hidden ${fontClass}`} style={pageBackground}>
            <div className="h-full overflow-y-auto p-4 pt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Avatar */}
              {page?.avatar_url && (
                <div
                  className={`${a.avatar_shape === "full"
                    ? "-mx-4 -mt-8 mb-4 border-b border-white/10"
                    : "flex justify-center mb-3 mt-4"
                    }`}
                >
                  {a.avatar_shape === "full" ? (
                    <div className="w-50 h-10 mx-auto mt-20 overflow-hidden">
                      <img
                        src={page.avatar_url}
                        alt={page?.display_name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src={page.avatar_url}
                      alt={page?.display_name || "Profile"}
                      className={`object-cover ${avatarShapeClass} ${a.avatar_shape === "full" ? "w-full" : "w-16 h-16"} border-2 border-white/20`}
                    />
                  )}
                </div>
              )}

              {/* Name */}
              {page?.display_name && page.display_name.trim() !== "" && (
                <h2 className="text-white font-bold text-base mb-1 text-center break-words">
                  {page.display_name}
                </h2>
              )}

              {/* Bio */}
              {page?.bio && page.bio.trim() !== "" && (
                <p className="text-white/80 text-sm mb-4 text-center px-2 break-words">
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
                      className={`block py-3 px-3 ${borderRadiusClass} transition-transform hover:scale-[1.02]`}
                      style={getCardStyle(a, link)}
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

                        {/* Center: Title & Subtext */}
                        <div className="flex-1 text-center min-w-0">
                          <span className="font-medium text-sm block truncate max-w-[160px] mx-auto">{link.title}</span>
                          {link.subtext && <span className="text-xs opacity-70 block truncate max-w-[160px] mx-auto">{link.subtext}</span>}
                        </div>

                        {/* Right Side: Three dots menu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShareLink({
                              url: link.url,
                              title: link.title,
                              thumbnail_url: link.thumbnail_url ?? undefined,
                              icon: link.icon ?? undefined,
                            });
                          }}
                          className="shrink-0 w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
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



