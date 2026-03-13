# Architecture Overview

This project is a modern Linktree clone designed for scalability and performance. It leverages a serverless architecture with Next.js and Supabase.

## System Architecture

## Core Design Principles
1. **Modular Components**: Components are extracted and decoupled (e.g., `LinkCard` and `LinkIcon`) for better maintainability.
2. **Centralized Theming**: All styling logic is consolidated in `lib/themes.ts` to ensure consistency between the dashboard and the dynamic link pages.
3. **Optimized Data Fetching**: Server-side rendering (SSR) is utilized for public pages with optimized queries to minimize latency.


## Supabase Data Format

Testing query for slug: eeee
Query Success: {
  id: '37cf339e-d308-4131-ab8a-098553049b49',
  user_id: '45b63750-9844-4f05-827c-389360829871',
  slug: 'eeee',
  display_name: 'eeee',
  bio: '',
  avatar_url: '',
  avatar_shape: 'circle',
  page_bg_type: 'color',
  page_bg_color: '#000000',
  page_bg_gradient_start: '#000000',
  page_bg_gradient_end: '#000000',
  page_bg_image: '',
  card_bg_color: '#ffffff',
  card_text_color: '#000000',
  card_border_radius: '12px',
  card_style: 'glass',
  page_font: 'mono'
}