// Theme presets and color palettes for the Linktree clone
import type { SupabaseClient } from "@supabase/supabase-js";
import { LinkPage, Link } from "./types";

export const THEMES = [
  {
    id: "default",
    name: "Default Purple",
    preview_bg: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
    preview_button: "#FFFFFF",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#6366F1",
    page_bg_gradient_end: "#A855F7",
    button_color: "#FFFFFF",
    button_text_color: "#1F2937",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    preview_bg: "linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)",
    preview_button: "#1E293B",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#1E3A8A",
    page_bg_gradient_end: "#312E81",
    button_color: "#1E293B",
    button_text_color: "#F1F5F9",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    preview_bg: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
    preview_button: "#FFFFFF",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#F97316",
    page_bg_gradient_end: "#EC4899",
    button_color: "#FFFFFF",
    button_text_color: "#1F2937",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "forest",
    name: "Forest Green",
    preview_bg: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
    preview_button: "#ECFDF5",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#059669",
    page_bg_gradient_end: "#0D9488",
    button_color: "#ECFDF5",
    button_text_color: "#064E3B",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    preview_bg: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
    preview_button: "#F0F9FF",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#0EA5E9",
    page_bg_gradient_end: "#06B6D4",
    button_color: "#F0F9FF",
    button_text_color: "#0C4A6E",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "rose",
    name: "Rose Pink",
    preview_bg: "linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)",
    preview_button: "#FFF1F2",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#F43F5E",
    page_bg_gradient_end: "#EC4899",
    button_color: "#FFF1F2",
    button_text_color: "#881337",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "dark",
    name: "Dark Mode",
    preview_bg: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
    preview_button: "#3F3F46",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#18181B",
    page_bg_gradient_end: "#27272A",
    button_color: "#3F3F46",
    button_text_color: "#FAFAFA",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "lavender",
    name: "Lavender Dream",
    preview_bg: "linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)",
    preview_button: "#F5F3FF",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#A78BFA",
    page_bg_gradient_end: "#C4B5FD",
    button_color: "#F5F3FF",
    button_text_color: "#4C1D95",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "neon",
    name: "Neon Nights",
    preview_bg: "linear-gradient(135deg, #7C3AED 0%, #F472B6 100%)",
    preview_button: "#1F1F1F",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#7C3AED",
    page_bg_gradient_end: "#F472B6",
    button_color: "#1F1F1F",
    button_text_color: "#F472B6",
    button_radius: "rounded",
    page_font: "sans"
  },
  {
    id: "autumn",
    name: "Autumn Warmth",
    preview_bg: "linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)",
    preview_button: "#FFFBEB",
    page_bg_type: "gradient",
    page_bg_gradient_start: "#DC2626",
    page_bg_gradient_end: "#F59E0B",
    button_color: "#FFFBEB",
    button_text_color: "#78350F",
    button_radius: "rounded",
    page_font: "sans"
  },
];

export const COLOR_PALETTES = [
  {
    name: "Basic",
    colors: ["#000000", "#FFFFFF", "#F3F4F6", "#E5E7EB", "#9CA3AF", "#6B7280", "#4B5563", "#374151", "#1F2937", "#111827"],
  },
  {
    name: "Vibrant",
    colors: ["#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9"],
  },
  {
    name: "Cool",
    colors: ["#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#0891B2", "#0D9488", "#059669"],
  },
  {
    name: "Pastel",
    colors: ["#FEE2E2", "#FFEDD5", "#FEF3C7", "#FEF9C3", "#ECFCCB", "#D1FAE5", "#CCFBF1", "#CFFAFE", "#DBEAFE", "#E0E7FF"],
  },
  {
    name: "Dark",
    colors: ["#18181B", "#27272A", "#3F3F46", "#52525B", "#71717A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8"],
  },
];

export const FONT_OPTIONS = [
  { value: "sans", label: "Sans Serif", class: "font-sans", preview: "Aa" },
  { value: "serif", label: "Serif", class: "font-serif", preview: "Aa" },
  { value: "mono", label: "Monospace", class: "font-mono", preview: "Aa" },
];

export const CARD_STYLES = [
  { value: "filled", label: "Filled", description: "Solid background color" },
  { value: "outline", label: "Outline", description: "Transparent with border" },
  { value: "shadow", label: "Shadow", description: "Elevated with shadow" },
  { value: "glass", label: "Glass", description: "Frosted glass effect" },
];

export const BORDER_RADIUS_OPTIONS = [
  { value: "none", label: "Square", class: "rounded-none" },
  { value: "sm", label: "Slight", class: "rounded-lg" },
  { value: "rounded", label: "Rounded", class: "rounded-xl" },
  { value: "full", label: "Pill", class: "rounded-full" },
];

export const ICON_OPTIONS = [
  { value: "", label: "No Icon" },
  { value: "link", label: "Link" },
  { value: "globe", label: "Globe" },
  { value: "mail", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "spotify", label: "Spotify" },
  { value: "discord", label: "Discord" },
  { value: "twitch", label: "Twitch" },
  { value: "shopping", label: "Shopping" },
  { value: "document", label: "Document" },
  { value: "calendar", label: "Calendar" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "music", label: "Music" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "facebook", label: "Facebook" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
];
export const AVATAR_SHAPE_OPTIONS = [
  { value: "circle", label: "Circle", class: "rounded-full" },
  { value: "rounded", label: "Rounded", class: "rounded-2xl" },
  { value: "square", label: "Square", class: "rounded-none" },
  { value: "full", label: "Full Width", class: "w-full rounded-none" },
];

export const getPageBackgroundStyle = (config: Partial<LinkPage>) => {
  const {
    page_bg_type = "gradient",
    page_bg_color = "#6366F1",
    page_bg_gradient_start = "#6366F1",
    page_bg_gradient_end = "#A855F7",
    page_bg_image = ""
  } = config;

  if (page_bg_type === "image" && page_bg_image) {
    return {
      backgroundImage: `url(${page_bg_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (page_bg_type === "color") {
    return { backgroundColor: page_bg_color };
  }
  return {
    background: `linear-gradient(135deg, ${page_bg_gradient_start} 0%, ${page_bg_gradient_end} 100%)`,
  };
};

export const getCardStyle = (config: Partial<LinkPage>, linkOverlay?: Partial<Link>) => {
  const bgColor = linkOverlay?.bg_color || config.card_bg_color || config.button_color || "#FFFFFF";
  const textColor = linkOverlay?.text_color || config.card_text_color || config.button_text_color || "#1F2937";
  const cardStyle = config.card_style || "filled";

  const baseStyle = { backgroundColor: bgColor, color: textColor };

  switch (cardStyle) {
    case "outline":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        border: `2px solid ${bgColor}`,
        color: bgColor,
      };
    case "shadow":
      return {
        ...baseStyle,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      };
    case "glass":
      return {
        ...baseStyle,
        backgroundColor: `${bgColor}CC`,
        backdropFilter: "blur(12px)",
        border: `1px solid ${bgColor}33`,
      };
    default:
      return baseStyle;
  }
};

export const getFontClass = (fontValue?: string) => {
  return FONT_OPTIONS.find((f) => f.value === fontValue)?.class || "font-sans";
};

export const getBorderRadiusClass = (radiusValue?: string) => {
  return BORDER_RADIUS_OPTIONS.find((r) => r.value === radiusValue)?.class || "rounded-xl";
};


export const getAvatarShapeClass = (shapeValue?: string) => {
  return AVATAR_SHAPE_OPTIONS.find((s) => s.value === shapeValue)?.class || "rounded-full";
};

/**
 * Shared utility for uploading images to Supabase storage
 */
export const uploadLinkImage = async (supabase: SupabaseClient, file: File, bucket = "link_images") => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be less than 5MB");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file);
  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};
