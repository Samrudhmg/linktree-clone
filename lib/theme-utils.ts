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

export type ThemeCardConfig = {
  style: "flat" | "glass" | "bordered";
  border: "none" | "subtle" | "strong";
};

export interface ThemeConfig {
  background: ThemeBackgroundConfig;
  text: ThemeTextConfig;
  links: ThemeLinkConfig;
  button: ThemeButtonConfig;
  card: ThemeCardConfig;
}

export interface DBTheme {
  id: string;
  name: string;
  type: "default" | "user";
  user_id: string | null;
  config: ThemeConfig;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  user_id: string;
  selected_theme_id: string | null;
}

export function applyTheme(config: ThemeConfig) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Background
  root.style.setProperty("--theme-bg-primary", config.background.primary);
  root.style.setProperty("--theme-bg-secondary", config.background.secondary);

  // Text
  root.style.setProperty("--theme-text-primary", config.text.primary);
  root.style.setProperty("--theme-text-secondary", config.text.secondary);

  // Accent
  root.style.setProperty("--theme-accent", config.button.accent);
}

export function getThemeStyles(config: ThemeConfig): React.CSSProperties {
  return {
    "--theme-bg-primary": config.background.primary,
    "--theme-bg-secondary": config.background.secondary,
    "--theme-text-primary": config.text.primary,
    "--theme-text-secondary": config.text.secondary,
    "--theme-accent": config.button.accent,
  } as React.CSSProperties;
}
