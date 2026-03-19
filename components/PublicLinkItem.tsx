"use client";

import { useState } from "react";
import { DBTheme } from "@/lib/theme-utils";
import { MoreVertical } from "lucide-react";
import LinkThumbnail from "./ui/LinkThumbnail";
import ShareModal from "./ShareModal";
import { Link, LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function PublicLinkItem({ 
  link, 
  theme
}: { 
  link: Link; 
  theme: DBTheme | null;
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && navigator.sendBeacon) {
      const data = JSON.stringify({ linkId: link.id });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("/api/track-click", blob);
    }
  };

  const getCardStyle = () => {
    if (!theme) return {};
    const style = theme.config.links.style;
    
    // Default Tailwind handles background colors and borders via CSS variables now
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
    if (!theme) return "rounded-xl";
    return theme.config.links.radius === 'rounded-full' ? 'rounded-full' : theme.config.links.radius === 'rounded-none' ? 'rounded-none' : 'rounded-2xl';
  };

  const cardStyle = getCardStyle();

  // For typography we can stick with standard sans unless DBTheme extends it later
  const fontClass = "font-sans";

  return (
    <>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`block py-3 px-4 ${getCardClasses()} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${fontClass}`}
        style={cardStyle}
      >
        <div className="flex items-center gap-3">
          <LinkThumbnail 
            thumbnailUrl={link.thumbnail_url || undefined} 
            icon={link.icon || undefined} 
            color={cardStyle.color} 
            size="w-10 h-10" 
          />

          {/* Center: Title & Subtext */}
          <div className="flex-1 text-center min-w-0">
            <span className="font-semibold wrap-break-word whitespace-normal block text-[15px] leading-tight">{link.title}</span>
            {link.subtext && <span className="text-xs opacity-70 wrap-break-word whitespace-normal block mt-0.5">{link.subtext}</span>}
          </div>

          {/* Right Side: Three dots menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="shrink-0 w-10 h-10 hover:bg-black/10 rounded-full transition-colors text-inherit focus:ring-0"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
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
