"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkIcon } from "./LinkIcon";
import {
  getThemeStyles
} from "@/lib/theme-utils";
import type { DBTheme } from "@/lib/theme-utils";
import ShareModal from "./ShareModal";
import type { ShareLinkData } from "./ShareModal";
import { MoreVertical } from "lucide-react";
import { LinkPage, Link } from "@/lib/types";
import { AnimatedContainer } from "@/components/animated/AnimatedContainer";

export default function LivePreview({
  page,
  links,
  theme,
  onLinkClick
}: {
  page: LinkPage | null,
  links: Link[],
  theme: DBTheme | null,
  onLinkClick?: (link: Link) => void
}) {
  const [shareLink, setShareLink] = useState<ShareLinkData | null>(null);

  const themeStyles = theme ? getThemeStyles(theme.config) : {};

  // For avatar shapes and fonts, we can use simple defaults since they aren't fully migrated yet 
  // or we can remove them if they aren't part of the new Theme spec
  const avatarShapeClass = "rounded-full"; // Defaulting back to rounded full
  const fontClass = "font-sans"; // Defaulting back to sans until font integration is specified

  // Helper for component dynamic styles
  const getCardStyle = (linkOverlay?: Partial<Link>) => {
    if (!theme) return {};
    const style = theme.config.links.style;
    const isTranslucent = style === 'glass' || style === 'outline';
    
    // We can just rely on the CSS variables since we inject `themeStyles` at the root
    if (style === 'outline') {
      return { backgroundColor: 'transparent', border: '2px solid var(--theme-text-primary)' };
    } else if (style === 'glass') {
      return { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' };
    } else if (style === 'white') {
      return { backgroundColor: '#ffffff', color: '#000000' };
    }
    // flat
    return { backgroundColor: 'var(--theme-accent)', color: 'var(--theme-text-primary)' }; 
  };

  const getCardClasses = () => {
    if (!theme) return "";
    return theme.config.links.radius === 'rounded-full' ? 'rounded-full' : theme.config.links.radius === 'rounded-none' ? 'rounded-none' : 'rounded-2xl';
  };

  const getCardContainerStyle = () => {
    if (!theme) return {};
    const style = theme.config.card.style;
    if (style === 'glass') {
        return {
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)'
        };
    } else if (style === 'bordered') {
        return {
            backgroundColor: 'transparent',
            border: '1px solid var(--theme-bg-secondary)'
        };
    }
    // flat
    return {
        backgroundColor: 'var(--theme-bg-secondary)',
    };
  };

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
          <div className="w-[280px] h-[580px] rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-700 relative" style={getCardContainerStyle()}>
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-5 bg-gray-900 rounded-full z-20" />
            <div className={`w-full h-full rounded-[2rem] overflow-hidden ${fontClass}`} style={{ ...themeStyles, backgroundColor: 'var(--theme-bg-primary)', color: 'var(--theme-text-primary)' }}>
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
      <AnimatedContainer>
        <div className="w-full flex justify-center">
        <div className="w-[280px] h-[580px] rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-700 relative" style={getCardContainerStyle()}>
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-5 bg-gray-900 rounded-full z-20" />
          <div className={`w-full h-full rounded-[2rem] overflow-hidden flex flex-col ${fontClass}`} style={{ ...themeStyles, backgroundColor: 'var(--theme-bg-primary)', color: 'var(--theme-text-primary)' }}>
            <div className="flex-1 overflow-y-auto p-4 pt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Avatar */}
              {page?.avatar_url && (
                <div
                  className="flex justify-center mb-3 mt-4"
                >
                    <div className="relative w-16 h-16">
                      <Image
                        src={page.avatar_url}
                        alt={page?.display_name || "Profile"}
                        fill
                        className={`object-cover ${avatarShapeClass} border-2 border-white/20`}
                      />
                    </div>
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
                      className={`block py-3 px-3 transition-transform hover:scale-[1.02] ${getCardClasses()}`}
                      style={getCardStyle(link)}
                      onClick={(e) => {
                        if (onLinkClick) {
                          e.preventDefault();
                          onLinkClick(link);
                          window.open(link.url, "_blank");
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {/* Left Side: Thumbnail or Icon */}
                        {(link.thumbnail_url || link.icon) && (
                          <div className="shrink-0 w-6 h-6 flex items-center justify-center relative">
                            {link.thumbnail_url ? (
                              <Image
                                src={link.thumbnail_url}
                                alt=""
                                fill
                                className="rounded object-cover"
                              />
                            ) : link.icon ? (
                              <LinkIcon icon={link.icon} color={link.text_color || (theme?.config.text.primary || '#ffffff')} />
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
      </AnimatedContainer>

      <ShareModal
        isOpen={!!shareLink}
        onClose={() => setShareLink(null)}
        link={shareLink}
      />
    </div>
  );
}



