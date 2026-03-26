"use client";

import Image from "next/image";
import { LinkIcon } from "../LinkIcon";
import { AvatarStyle } from "@/lib/types";

interface LinkThumbnailProps {
  thumbnailUrl?: string;
  icon?: string;
  color?: string;
  size?: string; // Tailwind class fallback
  pixels?: number; // Custom pixel size
  shape?: AvatarStyle;
  className?: string;
}

export default function LinkThumbnail({ 
  thumbnailUrl, 
  icon, 
  color = "#9CA3AF", 
  size = "w-6 h-6",
  pixels,
  shape = 'circle',
  className = ""
}: LinkThumbnailProps) {
  const getRadiusClass = (s: AvatarStyle) => {
    switch (s) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-lg';
      case 'square': return 'rounded-none';
      case 'full': return 'rounded-none w-full h-auto';
      default: return 'rounded-full';
    }
  };

  const containerStyle = pixels ? { width: `${pixels}px`, height: `${pixels}px` } : {};
  const finalSizeClass = pixels ? "" : size;
  const radiusClass = getRadiusClass(shape);

  if (thumbnailUrl) {
    return (
      <div 
        className={`${finalSizeClass} relative shrink-0 overflow-hidden ${radiusClass} ${className}`}
        style={containerStyle}
      >
        <Image 
          src={thumbnailUrl} 
          alt="" 
          fill
          className="object-cover" 
        />
      </div>
    );
  }

  if (icon) {
    return (
      <div 
        className={`${finalSizeClass} flex items-center justify-center shrink-0 ${radiusClass} ${className}`}
        style={containerStyle}
      >
        <LinkIcon 
          icon={icon} 
          color={color} 
          size={pixels ? `w-full h-full` : size} 
        />
      </div>
    );
  }

  return null;
}
