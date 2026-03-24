/**
 * lib/link-utils.ts
 *
 * Pure utility functions for link and slug manipulation.
 * Extracted from dashboard business logic so they can be tested in isolation.
 */

import type { Link } from "./types";

// ---------------------------------------------------------------------------
// Slug sanitization
// ---------------------------------------------------------------------------

/**
 * Converts a raw user-typed string into a clean, URL-safe slug.
 *
 * Rules:
 *  - Lowercased
 *  - Any character that is NOT a-z, 0-9, or a hyphen is replaced with "-"
 *  - Leading / trailing hyphens are stripped
 *
 * @example
 *   sanitizeSlug("My Cool Page!") // "my-cool-page"
 *   sanitizeSlug("  hello world  ") // "hello-world"
 */
export function sanitizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns true when a slug is considered valid (at least 2 characters,
 * non-empty after sanitization).
 */
export function isValidSlug(slug: string): boolean {
  const clean = sanitizeSlug(slug);
  return clean.length >= 2;
}

// ---------------------------------------------------------------------------
// Link enabled normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes the `enabled` field coming from Supabase.
 *
 * Supabase can return `null` or `undefined` for boolean columns that have no
 * explicit value. We treat null/undefined as "enabled" (opt-out model).
 *
 * @example
 *   normalizeLinkEnabled(true)      // true
 *   normalizeLinkEnabled(false)     // false
 *   normalizeLinkEnabled(null)      // true
 *   normalizeLinkEnabled(undefined) // true
 */
export function normalizeLinkEnabled(value: boolean | null | undefined): boolean {
  return value === true || value === null || value === undefined;
}

/**
 * Applies `normalizeLinkEnabled` to every link in an array.
 */
export function normalizeLinks(links: Link[]): Link[] {
  return links.map((link) => ({
    ...link,
    enabled: normalizeLinkEnabled(link.enabled as boolean | null | undefined),
  }));
}

// ---------------------------------------------------------------------------
// Link filtering
// ---------------------------------------------------------------------------

/**
 * Returns only links that are enabled.
 */
export function filterEnabledLinks(links: Link[]): Link[] {
  return links.filter((l) => l.enabled !== false);
}

/**
 * Searches links by title or subtext, case-insensitively.
 * Returns all links when query is blank.
 */
export function searchLinks(links: Link[], query: string): Link[] {
  const q = query.trim().toLowerCase();
  if (!q) return links;
  return links.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      (l.subtext ?? "").toLowerCase().includes(q)
  );
}

// ---------------------------------------------------------------------------
// Click count helpers
// ---------------------------------------------------------------------------

/**
 * Returns the total click count for a single link, safely handling missing
 * `click_events` data returned by Supabase's count aggregation.
 */
export function getLinkClickCount(link: Link): number {
  return link.click_events?.[0]?.count ?? 0;
}

/**
 * Returns the total clicks across all links.
 */
export function getTotalClickCount(links: Link[]): number {
  return links.reduce((sum, l) => sum + getLinkClickCount(l), 0);
}
