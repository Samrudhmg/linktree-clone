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

export interface ThemeConfig {
  background: ThemeBackgroundConfig;
  text: ThemeTextConfig;
  links: ThemeLinkConfig;
  button: ThemeButtonConfig;
  title: ThemeTitleConfig;
  bio: ThemeBioConfig;
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
  root.style.setProperty("--theme-title-weight", config.title?.fontWeight || "bold");

  // Bio Styling
  root.style.setProperty("--theme-bio-color", config.bio?.color || config.text.secondary);
  root.style.setProperty("--theme-bio-size", config.bio?.fontSize || "1rem");
  root.style.setProperty("--theme-bio-weight", config.bio?.fontWeight || "normal");
}

export function getThemeStyles(config: ThemeConfig): React.CSSProperties {
  return {
    "--theme-bg-primary": config.background.primary,
    "--theme-bg-secondary": config.background.secondary,
    "--theme-text-primary": config.text.primary,
    "--theme-text-secondary": config.text.secondary,
    "--theme-accent": config.button.accent,
    "--theme-title-color": config.title?.color || config.text.primary,
    "--theme-title-size": config.title?.fontSize || "1.5rem",
    "--theme-title-weight": config.title?.fontWeight || "bold",
    "--theme-bio-color": config.bio?.color || config.text.secondary,
    "--theme-bio-size": config.bio?.fontSize || "1rem",
    "--theme-bio-weight": config.bio?.fontWeight || "normal",
  } as React.CSSProperties;
}
