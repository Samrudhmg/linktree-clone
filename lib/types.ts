export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export type AvatarStyle = 'full' | 'square' | 'circle' | 'rounded';

export interface LinkPage {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_default?: boolean;
  theme_id?: string | null;
  avatar_style?: AvatarStyle;
  avatar_size?: number;
  // Legacy styling (to be moved to themes/config)
  theme_preset?: string | null;
  page_bg_type?: string;
  page_bg_color?: string;
  page_bg_gradient_start?: string;
  page_bg_gradient_end?: string;
  page_bg_image?: string;
  button_color?: string;
  button_text_color?: string;
  button_radius?: string;
  card_bg_color?: string;
  card_text_color?: string;
  card_style?: string;
  page_font?: string;
  created_at?: string;
  updated_at?: string;
  // Joined/Virtual data
  theme?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Link {
  id: string;
  user_id: string;
  page_id: string;
  title: string;
  url: string;
  subtext?: string | null;
  icon?: string | null;
  thumbnail_url?: string | null;
  enabled: boolean;
  position: number;
  bg_type?: string;
  bg_color?: string;
  bg_image?: string | null;
  text_color?: string;
  font?: string;
  thumbnail_style?: AvatarStyle;
  thumbnail_size?: number;
  click_events?: { count: number }[];
  created_at?: string;
  updated_at?: string;
}

export interface Theme {
  id: string;
  name: string;
  type: "default" | "user";
  user_id?: string | null;
  page_id?: string | null;
  config: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  created_at: string;
  updated_at: string;
}
