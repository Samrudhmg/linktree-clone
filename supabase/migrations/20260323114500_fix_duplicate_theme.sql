-- Migration: Fix Duplicate Theme Constraint
-- Description: Drops the unique constraint that prevents multiple custom themes per page.
-- Date: 2026-03-23

-- Drop the constraint that is causing the "duplicate key" error
-- This allows a single page to have multiple custom theme options in its gallery.
ALTER TABLE themes DROP CONSTRAINT IF EXISTS unique_page_theme;

-- If you actually wanted ONLY one custom theme per page, 
-- then the frontend should be using UPSERT instead of INSERT. 
-- However, for a theme gallery, it is better to allow multiple custom themes.
