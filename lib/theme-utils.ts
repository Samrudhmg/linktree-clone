import { AvatarStyle, LinkPage } from "./types";

/**
 * Calculates the perceived luminance of a hex color (0-1)
 */
export function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Checks if two colors have sufficient contrast (diff > 0.4)
 */
export function hasGoodContrast(hex1: string, hex2: string): boolean {
  return Math.abs(getLuminance(hex1) - getLuminance(hex2)) > 0.4;
}

/**
 * Calculates the perceptual distance between two colors
 */
export function colorDifference(c1: string, c2: string): number {
  return Math.abs(getLuminance(c1) - getLuminance(c2));
}

/**
 * Converts HSL values to a HEX string
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export type ThemeBackgroundConfig = {
  primary: string;
  secondary: string;
};

export type ThemeTextConfig = {
  primary: string;
  secondary: string;
};

export type ThemeLinkConfig = {
  style: "outline" | "flat" | "white" | "glass";
  radius: string; // e.g. "rounded-xl"
  shadow?: "none" | "soft" | "md" | "lg";
  padding?: string; // e.g. "p-4"
};

export type ThemeButtonConfig = {
  variant: "solid" | "gradient" | "minimal";
  accent: string;
};

export type ThemeTitleConfig = {
  color: string;
  fontSize: string;
  fontWeight: string;
};

export type ThemeBioConfig = {
  color: string;
  fontSize: string;
  fontWeight: string;
};

export type ThemeAvatarConfig = {
  style: AvatarStyle;
  size: number;
};

export type ThemeThumbnailConfig = {
  style: AvatarStyle;
  size: number;
};

export interface ThemeConfig {
  background: ThemeBackgroundConfig;
  text: ThemeTextConfig;
  links: ThemeLinkConfig;
  button: ThemeButtonConfig;
  title: ThemeTitleConfig;
  bio: ThemeBioConfig;
  avatar?: ThemeAvatarConfig;
  link_thumbnails?: ThemeThumbnailConfig;
}

export interface DBTheme {
  id: string;
  name: string;
  type: "default" | "user";
  user_id: string | null;
  page_id?: string | null;
  config: ThemeConfig;
  created_at: string;
  updated_at: string;
}


export function applyTheme(config: ThemeConfig) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Background - Reversed Mapping: Primary is main BG
  root.style.setProperty("--theme-bg-primary", config.background.primary);
  root.style.setProperty("--theme-bg-secondary", config.background.secondary);

  // Text - Mapping: Primary -> Title, Secondary -> Bio/Subtext
  root.style.setProperty("--theme-text-primary", config.text.primary);
  root.style.setProperty("--theme-text-secondary", config.text.secondary);

  // Accent
  root.style.setProperty("--theme-accent", config.button.accent);

  // Title Styling
  root.style.setProperty("--theme-title-color", config.title?.color || config.text.primary);
  root.style.setProperty("--theme-title-size", config.title?.fontSize || "1.5rem");
  root.style.setProperty("--theme-title-weight", config.title?.fontWeight || "700");

  // Bio Styling
  root.style.setProperty("--theme-bio-color", config.bio?.color || config.text.secondary);
  root.style.setProperty("--theme-bio-size", config.bio?.fontSize || "1rem");
  root.style.setProperty("--theme-bio-weight", config.bio?.fontWeight || "400");
}

export function getThemeStyles(config: ThemeConfig, page?: LinkPage | null): React.CSSProperties {
  const getBG = () => {
    if (page?.theme_id) return { primary: config.background.primary, secondary: config.background.secondary };
    if (page?.page_bg_type === 'color') return { primary: page.page_bg_color || config.background.primary, secondary: config.background.secondary };
    if (page?.page_bg_type === 'gradient') return { primary: page.page_bg_gradient_start || config.background.primary, secondary: page.page_bg_gradient_end || config.background.secondary };
    return { primary: config.background.primary, secondary: config.background.secondary };
  };

  const bg = getBG();

  return {
    "--theme-bg-primary": bg.primary,
    "--theme-bg-secondary": bg.secondary,
    "--theme-text-primary": config.text.primary,
    "--theme-text-secondary": config.text.secondary,
    "--theme-accent": page?.button_color || config.button.accent,
    "--theme-title-color": config.title?.color || config.text.primary,
    "--theme-title-size": config.title?.fontSize || "1.5rem",
    "--theme-title-weight": config.title?.fontWeight || "700",
    "--theme-bio-color": config.bio?.color || config.text.secondary,
    "--theme-bio-size": config.bio?.fontSize || "1rem",
    "--theme-bio-weight": config.bio?.fontWeight || "400",
  } as React.CSSProperties;
}

/**
 * Validates a theme based on contrast and uniqueness rules
 */
export function isValidTheme(config: ThemeConfig): boolean {
  const bg = config.background.primary;
  const cardBg = config.background.secondary;
  const text = config.text.primary;
  const links = config.button.accent;

  return (
    // No exact duplicates for major elements
    bg !== cardBg &&
    bg !== text &&
    bg !== links &&
    cardBg !== text &&

    // Contrast rules (readability)
    hasGoodContrast(bg, text) &&
    hasGoodContrast(bg, links) &&

    // Similarity rules (intentional layers)
    colorDifference(bg, cardBg) > 0.15 &&
    colorDifference(bg, text) > 0.4 &&
    colorDifference(bg, links) > 0.4
  );
}

/**
 * Generates a random theme config with smart constraints
 */
export function generateRandomThemeConfig(
  locks: Record<string, boolean> = {},
  prevConfig?: ThemeConfig
): ThemeConfig {
  let attempts = 0;
  let config: ThemeConfig;

  do {
    const baseHue = Math.floor(Math.random() * 360);
    const isDark = Math.random() > 0.5;

    // Backgrounds
    const bgPrimary = locks.bg && prevConfig 
      ? prevConfig.background.primary 
      : hslToHex(baseHue, isDark ? 30 : 20, isDark ? 10 : 95);
    
    const bgSecondary = locks.bg && prevConfig
      ? prevConfig.background.secondary
      : hslToHex(baseHue, isDark ? 20 : 15, isDark ? 15 : 90);

    // Text
    const textPrimary = locks.text && prevConfig
      ? prevConfig.text.primary
      : (isDark ? "#ffffff" : "#111827");
    
    const textSecondary = locks.text && prevConfig
      ? prevConfig.text.secondary
      : (isDark ? "#9ca3af" : "#4b5563");

    // Accents & Links (Shifted Hue)
    const accent = locks.links && prevConfig
      ? prevConfig.button.accent
      : hslToHex((baseHue + 40) % 360, 60, isDark ? 60 : 50);

    config = {
      background: { primary: bgPrimary, secondary: bgSecondary },
      text: { primary: textPrimary, secondary: textSecondary },
      links: {
        style: (locks.links && prevConfig ? prevConfig.links.style : ["outline", "flat", "white", "glass"][Math.floor(Math.random() * 4)]) as any,
        radius: (locks.links && prevConfig ? prevConfig.links.radius : ["rounded-none", "rounded-2xl", "rounded-full"][Math.floor(Math.random() * 3)]) as any,
      },
      button: { variant: "solid", accent },
      title: { 
        color: locks.text && prevConfig?.title?.color ? prevConfig.title.color : textPrimary, 
        fontSize: "1.5rem", 
        fontWeight: "700" 
      },
      bio: { 
        color: locks.text && prevConfig?.bio?.color ? prevConfig.bio.color : textSecondary, 
        fontSize: "1.1rem", 
        fontWeight: "400" 
      },
      avatar: { style: "circle", size: 80 },
      link_thumbnails: { style: "circle", size: 40 }
    };

    attempts++;
  } while (!isValidTheme(config) && attempts < 10);

  return config;
}
