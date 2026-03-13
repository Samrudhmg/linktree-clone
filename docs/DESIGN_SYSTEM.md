# Design System

The Linktree Clone design system is built to be vibrant, expressive, and highly customizable. It balances a clean professional dashboard with colorful, dynamic public pages.


## Theming & Colors
All theme logic is centralized in `lib/themes.ts`.

### Dashboard Theme
- Uses `next-themes` for seamless light and dark mode switching.
- **Dark Mode**: High contrast with deep grays (`bg-gray-900`, `gray-800`) and purple accents.
- **Light Mode**: Clean white backgrounds with subtle borders (`bg-white`, `border-gray-200`).

### Public Page Presets
Users can choose from various preset themes:
- **Default**: Indigo to Purple gradient.
- **Sunset**: Orange to Pink gradient.
- **Emerald**: Green to Teal gradient.
- **Midnight**: Deep Slate background with glass-morphism cards.

## Typography
- **Primary Font**: Inter (via Next.js `next/font/google`).
- **Options**:
  - `font-sans`: Default for clarity.
  - `font-serif`: For a more classic, elegant look.
  - `font-mono`: For a technical or modern aesthetic.

## Components & Layout
- **Link Cards**: Standardized padding, border-radius (none, sm, rounded, full), and card styles (filled, outline, shadow, glass).
- **Icons**: Standardized use of **Lucide React** for all UI elements and social icons.
- **Avatars**: Support for multiple shapes (square, rounded, circle, banner) using utility functions in `lib/themes.ts`.
