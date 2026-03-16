# Architecture Overview

This project is a modern Linktree clone designed for scalability and performance. It leverages a serverless architecture with Next.js and Supabase.

## System Architecture

## Core Design Principles
1. **Modular Components**: Components are extracted and decoupled (e.g., `LinkCard` and `LinkIcon`) for better maintainability.
2. **Centralized Theming**: All styling logic is consolidated in `lib/themes.ts` to ensure consistency between the dashboard and the dynamic link pages.
3. **Optimized Data Fetching**: Server-side rendering (SSR) is utilized for public pages with optimized queries to minimize latency.
