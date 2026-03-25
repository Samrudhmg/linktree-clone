import { ThemeConfig, DBTheme } from "@/lib/theme-utils";
import { LinkPage, Link } from "@/lib/types";

export const MOCK_USER_ID = "user_123";

export const THEME_DEFAULT: ThemeConfig = {
  background: { primary: "#ffffff", secondary: "#f9fafb" },
  text: { primary: "#111827", secondary: "#4b5563" },
  links: { style: "flat", radius: "rounded-xl", shadow: "soft" },
  button: { variant: "solid", accent: "#3b82f6" },
  title: { color: "#111827", fontSize: "1.5rem", fontWeight: "bold" },
  bio: { color: "#4b5563", fontSize: "1.1rem", fontWeight: "normal" },
  avatar: { style: "circle" }
};

export const THEME_DARK: ThemeConfig = {
  background: { primary: "#0a0a0a", secondary: "#171717" },
  text: { primary: "#ffffff", secondary: "#a1a1aa" },
  links: { style: "glass", radius: "rounded-2xl", shadow: "soft" },
  button: { variant: "solid", accent: "#3b82f6" },
  title: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" },
  bio: { color: "#a1a1aa", fontSize: "1.1rem", fontWeight: "normal" },
  avatar: { style: "rounded" }
};

export const THEME_PASTEL: ThemeConfig = {
  background: { primary: "#fdf2f8", secondary: "#fce7f3" },
  text: { primary: "#831843", secondary: "#9d174d" },
  links: { style: "white", radius: "rounded-full", shadow: "soft" },
  button: { variant: "solid", accent: "#ec4899" },
  title: { color: "#831843", fontSize: "1.8rem", fontWeight: "bold" },
  bio: { color: "#9d174d", fontSize: "1.2rem", fontWeight: "medium" },
  avatar: { style: "circle" }
};

export const THEME_HIGH_CONTRAST: ThemeConfig = {
  background: { primary: "#000000", secondary: "#111111" },
  text: { primary: "#ffffff", secondary: "#ffffff" },
  links: { style: "outline", radius: "rounded-none", shadow: "none" },
  button: { variant: "solid", accent: "#ffffff" },
  title: { color: "#ffffff", fontSize: "2.2rem", fontWeight: "extrabold" },
  bio: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" },
  avatar: { style: "square" }
};

export const MOCK_THEMES: Record<string, DBTheme> = {
  default: {
    id: "theme_default",
    name: "Default Light",
    type: "default",
    user_id: null,
    config: THEME_DEFAULT,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  dark: {
    id: "theme_dark",
    name: "Premium Dark",
    type: "user",
    user_id: MOCK_USER_ID,
    config: THEME_DARK,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  pastel: {
    id: "theme_pastel",
    name: "Soft Pastel",
    type: "user",
    user_id: MOCK_USER_ID,
    config: THEME_PASTEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  highContrast: {
    id: "theme_hc",
    name: "Accessibility First",
    type: "user",
    user_id: MOCK_USER_ID,
    config: THEME_HIGH_CONTRAST,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

export const MOCK_PAGE: LinkPage = {
  id: "page_123",
  user_id: MOCK_USER_ID,
  slug: "johndoe",
  display_name: "John Doe",
  bio: "Fullstack Developer & UI Enthusiast. Building the future of personal landing pages.",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  theme_id: "theme_dark",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const MOCK_LINKS: Link[] = [
  {
    id: "link_1",
    user_id: MOCK_USER_ID,
    page_id: "page_123",
    title: "My Portfolio",
    url: "https://example.com/portfolio",
    subtext: "Check out my latest projects and case studies.",
    icon: "Globe",
    is_active: true,
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "link_2",
    user_id: MOCK_USER_ID,
    page_id: "page_123",
    title: "Twitter / X",
    url: "https://twitter.com/example",
    subtext: "Follow me for daily coding tips.",
    icon: "Twitter",
    is_active: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "link_3",
    user_id: MOCK_USER_ID,
    page_id: "page_123",
    title: "GitHub",
    url: "https://github.com/example",
    icon: "Github",
    is_active: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
