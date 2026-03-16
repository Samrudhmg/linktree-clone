"use client";

import Image from "next/image";
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
      <div className={`${size} relative shrink-0`}>
        <Image 
          src={thumbnailUrl} 
          alt="" 
          fill
          className={`rounded object-cover ${className}`} 
        />
      </div>
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
