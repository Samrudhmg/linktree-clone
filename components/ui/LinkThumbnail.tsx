"use client";

import { useState, useEffect } from "react";
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
  fallback?: string;
}

export default function LinkThumbnail({ 
  thumbnailUrl, 
  icon, 
  color = "#9CA3AF", 
  size = "w-6 h-6",
  pixels,
  shape = 'circle',
  className = "",
  fallback
}: LinkThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  // Reset error state when URL changes to allow retrying/instantly showing new uploads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageError(false);
  }, [thumbnailUrl]);

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

  const isUrlValid = (url: string | undefined): boolean => {
    if (!url) return false;
    // Allow local paths and data URIs
    if (url.startsWith('/')) return true;
    if (url.startsWith('data:')) return true;
    
    // Check if it's a valid remote URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (isUrlValid(thumbnailUrl) && !imageError && thumbnailUrl) {
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
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  if (fallback) {
    return (
      <div 
        className={`${finalSizeClass} flex items-center justify-center shrink-0 bg-muted text-text-main font-bold ${radiusClass} ${className}`}
        style={{ ...containerStyle, fontSize: pixels ? `${pixels * 0.4}px` : undefined }}
      >
        {fallback}
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
