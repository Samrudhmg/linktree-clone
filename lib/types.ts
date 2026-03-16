export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export interface LinkPage {
  id: string;
  user_id: string;
  slug: string;
  username?: string | null;
  title?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  avatar_shape?: string;
  page_bg_type?: string;
  page_bg_color?: string;
  page_bg_gradient_start?: string;
  page_bg_gradient_end?: string;
  page_bg_image?: string;
  card_bg_color?: string;
  card_text_color?: string;
  card_border_radius?: string;
  card_style?: string;
  page_font?: string;
  theme_preset?: string | null;
  button_color?: string;
  button_text_color?: string;
  button_radius?: string;
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
  click_events?: { count: number }[];
}

export interface Theme {
  id: string;
  name: string;
  preview_bg: string;
  preview_button: string;
  page_bg_type?: string;
  page_bg_color?: string;
  page_bg_gradient_start?: string;
  page_bg_gradient_end?: string;
  page_bg_image?: string;
  button_color?: string;
  button_text_color?: string;
  button_radius?: string;
  page_font?: string;
}
