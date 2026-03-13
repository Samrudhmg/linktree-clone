"use client";

import { useState } from "react";
import { 
    getCardStyle, 
    getFontClass 
} from "@/lib/themes";
import { MoreVertical } from "lucide-react";
import LinkThumbnail from "./ui/LinkThumbnail";
import ShareModal from "./ShareModal";
import { Link, LinkPage } from "@/lib/types";

export default function PublicLinkItem({ 
  link, 
  profile, 
  borderRadiusClass = "rounded-xl" 
}: { 
  link: Link; 
  profile: LinkPage; 
  borderRadiusClass?: string;
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const cardStyle = getCardStyle(profile, link);

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
          <LinkThumbnail 
            thumbnailUrl={link.thumbnail_url || undefined} 
            icon={link.icon || undefined} 
            color={cardStyle.color} 
            size="w-10 h-10" 
          />

          {/* Center: Title & Subtext */}
          <div className="flex-1 text-center min-w-0">
            <span className="font-semibold break-words whitespace-normal block text-[15px] leading-tight">{link.title}</span>
            {link.subtext && <span className="text-xs opacity-70 break-words whitespace-normal block mt-0.5">{link.subtext}</span>}
          </div>

          {/* Right Side: Three dots menu */}
          <button
            onClick={handleShare}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
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
