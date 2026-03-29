"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkIcon } from "./LinkIcon";
import LinkThumbnail from "./ui/LinkThumbnail";
import {
  getThemeStyles
} from "@/lib/theme-utils";
import type { DBTheme } from "@/lib/theme-utils";
import ShareModal from "./ShareModal";
import type { ShareLinkData } from "./ShareModal";
import { MoreVertical } from "lucide-react";
import { LinkPage, Link, Profile } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { AnimatedContainer } from "@/components/animated/AnimatedContainer";
import { motion, AnimatePresence } from "framer-motion";

export default function LivePreview({
  user,
  profile,
  page,
  links,
  theme,
  onLinkClick
}: {
  user?: User | null,
  profile?: Profile | null,
  page: LinkPage | null,
  links: Link[],
  theme: DBTheme | null,
  onLinkClick?: (link: Link) => void
}) {
  const [shareLink, setShareLink] = useState<ShareLinkData | null>(null);

  const themeStyles = theme ? getThemeStyles(theme.config) : {};

  // Combine theme styles with a global transition for background and color switches
  const dynamicStyles: React.CSSProperties = {
    ...themeStyles,
    ...(theme ? {
      backgroundColor: 'var(--theme-bg-primary)',
      color: 'var(--theme-text-primary)',
    } : {}),
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  // For avatar shapes and fonts, we can use simple defaults since they aren't fully migrated yet 
  // or we can remove them if they aren't part of the new Theme spec
  const avatarShapeClass = "rounded-full"; // Defaulting back to rounded full
  const fontClass = "font-sans"; // Defaulting back to sans until font integration is specified

  // Helper for component dynamic styles
  const getCardStyle = () => {
    if (!theme) return {};
    const style = theme.config.links.style;

    let baseStyle: React.CSSProperties = {};

    if (style === 'outline') {
      baseStyle = { backgroundColor: 'transparent', border: '2px solid var(--theme-text-primary)', color: 'var(--theme-text-primary)' };
    } else if (style === 'glass') {
      baseStyle = { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--theme-text-primary)' };
    } else if (style === 'white') {
      baseStyle = { 
        backgroundColor: '#ffffff', 
        color: '#000000',
        '--theme-link-text': '#000000',
        '--theme-link-subtext': '#666666'
      } as any;
    } else {
      // Simple robust accent style (Solid with subtle gradient for depth)
      baseStyle = {
        background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent))',
        color: 'var(--theme-link-text)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      };
    }

    return baseStyle;
  };

  const getCardClasses = () => {
    if (!theme) return "";
    return theme.config.links.radius === 'rounded-full' ? 'rounded-full' : theme.config.links.radius === 'rounded-none' ? 'rounded-none' : 'rounded-2xl';
  };

  const getCardContainerStyle = () => {
    if (!theme) return {};
    return {
      background: 'var(--theme-bg-secondary)',
    };
  };

  // Check if there's any meaningful content to display
  const hasContent = page?.avatar_url ||
    page?.display_name ||
    page?.title ||
    (page?.bio && page.bio !== "") ||
    (links && links.length > 0);

  // Empty state
  if (!hasContent) {
    return (
      <div>
        <div className="w-full flex justify-center">
          <div className="w-[280px] h-[580px] rounded-[2.5rem] p-2 shadow-2xl border-4 border-border-main relative" style={getCardContainerStyle()}>
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
        <div className="w-full flex justify-center py-8">
          {/* Mobile Frame Container - Refined Premium iPhone Design */}
          <div
            className="w-[310px] h-[590px] rounded-[3.2rem] p-1.5 shadow-xl border-[6px] border-[#111] ring-1 ring-white/10 relative bg-black transition-all duration-500 overflow-hidden"
          >
            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-24 h-6 bg-black rounded-full z-40 ring-1 ring-white/5" />

            {/* Content Area - Isolated with themeStyles */}
            <motion.div
              layout
              className={`w-full h-full rounded-[2.8rem] overflow-hidden flex flex-col relative ${fontClass}`}
              style={dynamicStyles}
            >
              <div className="flex-1 overflow-y-auto p-6 pt-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <AnimatePresence mode="popLayout" initial={false}>
                  {/* Avatar */}
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-center mb-3 mt-4"
                  >
                    <LinkThumbnail
                      thumbnailUrl={page?.avatar_url || profile?.avatar_url || user?.user_metadata?.picture || user?.user_metadata?.avatar_url || undefined}
                      shape={theme?.config.avatar?.style || page?.avatar_style || 'circle'}
                      pixels={theme?.config.avatar?.size || page?.avatar_size || 64}
                      className="border-2 border-white/20 shadow-sm"
                      fallback={(page?.display_name || page?.title || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "U")[0]?.toUpperCase() || "U"}
                    />
                  </motion.div>

                  {/* Name */}
                  <motion.h2
                    key="name"
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-1 text-center break-words px-4 leading-tight"
                    style={{
                      color: 'var(--theme-title-color)',
                      fontSize: 'var(--theme-title-size)',
                      fontWeight: 'var(--theme-title-weight)'
                    }}
                  >
                    {page?.display_name || page?.title || profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Your Name"}
                  </motion.h2>

                  {/* Bio */}
                  <motion.p
                    key="bio"
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-center px-4 break-words uppercase tracking-wide opacity-80 leading-snug"
                    style={{
                      color: 'var(--theme-bio-color)',
                      fontSize: 'calc(var(--theme-bio-size) * 0.75)',
                      fontWeight: 'var(--theme-bio-weight)'
                    }}
                  >
                    {page?.bio && page.bio.trim() !== "" ? page.bio : "Your bio will appear here"}
                  </motion.p>

                  {/* Links Container */}
                  <motion.div layout className="space-y-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {(!links || links.length === 0) ? (
                        <motion.p
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          className="text-white/50 text-sm py-4 text-center"
                        >
                          Your links will appear here
                        </motion.p>
                      ) : (
                        links.map((link) => (
                          <motion.a
                            key={link.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block py-3 px-3 transition-transform hover:scale-[1.02] ${getCardClasses()}`}
                            style={getCardStyle()}
                            onClick={(e) => {
                              if (onLinkClick) {
                                e.preventDefault();
                                onLinkClick(link);
                                window.open(link.url, "_blank");
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              {/* Left Side: Thumbnail, Icon, or Spacer */}
                              <LinkThumbnail
                                thumbnailUrl={link.thumbnail_url || undefined}
                                icon={link.icon || undefined}
                                color={link.text_color || (theme?.config.text.primary || '#ffffff')}
                                shape={link.thumbnail_style || theme?.config.link_thumbnails?.style || 'circle'}
                                pixels={link.thumbnail_size || theme?.config.link_thumbnails?.size || 24}
                              />

                              {/* Center: Title & Subtext */}
                              <div className="flex-1 text-center min-w-0 flex flex-col justify-center">
                                <span className="font-semibold text-sm block truncate" style={{ color: 'var(--theme-link-text)' }}>{link.title}</span>
                                {link.subtext && <span className="text-[10px] opacity-80 block truncate mt-0.5" style={{ color: 'var(--theme-link-subtext)' }}>{link.subtext}</span>}
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
                                className="shrink-0 w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                              >
                                <MoreVertical className="w-3.5 h-3.5 opacity-60" />
                              </button>
                            </div>
                          </motion.a>
                        ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
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



