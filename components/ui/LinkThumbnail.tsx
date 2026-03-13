"use client";

import { LinkIcon } from "../LinkIcon";

interface LinkThumbnailProps {
  thumbnailUrl?: string;
  icon?: string;
  color?: string;
  size?: string;
  className?: string;
}

export default function LinkThumbnail({ 
  thumbnailUrl, 
  icon, 
  color = "#9CA3AF", 
  size = "w-6 h-6",
  className = ""
}: LinkThumbnailProps) {
  if (thumbnailUrl) {
    return (
      <img 
        src={thumbnailUrl} 
        alt="" 
        className={`${size} rounded object-cover shrink-0 ${className}`} 
      />
    );
  }

  if (icon) {
    return (
      <LinkIcon 
        icon={icon} 
        color={color} 
        size={size} 
        className={className}
      />
    );
  }

  return null;
}
