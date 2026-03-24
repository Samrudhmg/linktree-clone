import { describe, it, expect } from "vitest";
import {
  sanitizeSlug,
  isValidSlug,
  normalizeLinkEnabled,
  normalizeLinks,
  filterEnabledLinks,
  searchLinks,
  getLinkClickCount,
  getTotalClickCount,
} from "./link-utils";
import type { Link } from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeLink(overrides: Partial<Link> = {}): Link {
  return {
    id: "1",
    user_id: "u1",
    page_id: "p1",
    title: "Test Link",
    url: "https://example.com",
    position: 0,
    enabled: true,
    ...overrides,
  };
}

// ── sanitizeSlug ───────────────────────────────────────────────────────────

describe("sanitizeSlug()", () => {
  it("lowercases the input", () => {
    expect(sanitizeSlug("Hello")).toBe("hello");
  });

  it("replaces spaces with hyphens", () => {
    expect(sanitizeSlug("my cool page")).toBe("my-cool-page");
  });

  it("strips special characters", () => {
    expect(sanitizeSlug("page@#!name")).toBe("page-name");
  });

  it("collapses multiple separators into one hyphen", () => {
    expect(sanitizeSlug("hello   world")).toBe("hello-world");
  });

  it("strips leading and trailing hyphens", () => {
    expect(sanitizeSlug("  -hello world-  ")).toBe("hello-world");
  });

  it("returns empty string for an all-special input", () => {
    expect(sanitizeSlug("!!!")).toBe("");
  });

  it("preserves numbers", () => {
    expect(sanitizeSlug("page123")).toBe("page123");
  });

  it("preserves existing hyphens", () => {
    expect(sanitizeSlug("my-page")).toBe("my-page");
  });
});

// ── isValidSlug ────────────────────────────────────────────────────────────

describe("isValidSlug()", () => {
  it("returns true for a valid slug", () => {
    expect(isValidSlug("my-page")).toBe(true);
  });

  it("returns false for a 1-character slug", () => {
    expect(isValidSlug("a")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });

  it("returns false for all-special characters that sanitize to empty", () => {
    expect(isValidSlug("!@#")).toBe(false);
  });

  it("returns true for a slug that needs sanitizing but is still valid", () => {
    expect(isValidSlug("MY PAGE")).toBe(true); // "my-page" → valid
  });
});

// ── normalizeLinkEnabled ───────────────────────────────────────────────────

describe("normalizeLinkEnabled()", () => {
  it("returns true when value is true", () => {
    expect(normalizeLinkEnabled(true)).toBe(true);
  });

  it("returns false when value is false", () => {
    expect(normalizeLinkEnabled(false)).toBe(false);
  });

  it("returns true when value is null (opt-out model)", () => {
    expect(normalizeLinkEnabled(null)).toBe(true);
  });

  it("returns true when value is undefined", () => {
    expect(normalizeLinkEnabled(undefined)).toBe(true);
  });
});

// ── normalizeLinks ─────────────────────────────────────────────────────────

describe("normalizeLinks()", () => {
  it("returns an empty array unchanged", () => {
    expect(normalizeLinks([])).toEqual([]);
  });

  it("sets enabled=true for links where enabled is null", () => {
    const link = makeLink({ enabled: null as unknown as boolean });
    const [result] = normalizeLinks([link]);
    expect(result.enabled).toBe(true);
  });

  it("preserves enabled=false for explicitly disabled links", () => {
    const link = makeLink({ enabled: false });
    const [result] = normalizeLinks([link]);
    expect(result.enabled).toBe(false);
  });

  it("does not mutate the original array", () => {
    const links = [makeLink()];
    normalizeLinks(links);
    expect(links[0].enabled).toBe(true); // unchanged
  });
});

// ── filterEnabledLinks ─────────────────────────────────────────────────────

describe("filterEnabledLinks()", () => {
  it("returns all links when all are enabled", () => {
    const links = [makeLink(), makeLink({ id: "2", enabled: true })];
    expect(filterEnabledLinks(links)).toHaveLength(2);
  });

  it("excludes links where enabled is false", () => {
    const links = [makeLink(), makeLink({ id: "2", enabled: false })];
    const result = filterEnabledLinks(links);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("returns empty array when all links are disabled", () => {
    const links = [makeLink({ enabled: false }), makeLink({ id: "2", enabled: false })];
    expect(filterEnabledLinks(links)).toHaveLength(0);
  });

  it("returns empty array for empty input", () => {
    expect(filterEnabledLinks([])).toEqual([]);
  });
});

// ── searchLinks ────────────────────────────────────────────────────────────

describe("searchLinks()", () => {
  const links = [
    makeLink({ id: "1", title: "GitHub Profile", subtext: "My code" }),
    makeLink({ id: "2", title: "Portfolio", subtext: "Design work" }),
    makeLink({ id: "3", title: "Twitter", subtext: null }),
  ];

  it("returns all links when query is empty", () => {
    expect(searchLinks(links, "")).toHaveLength(3);
  });

  it("returns all links when query is only whitespace", () => {
    expect(searchLinks(links, "   ")).toHaveLength(3);
  });

  it("filters by title (case insensitive)", () => {
    const result = searchLinks(links, "github");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by subtext", () => {
    const result = searchLinks(links, "design");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("handles null subtext without crashing", () => {
    const result = searchLinks(links, "twitter");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("returns empty array when no links match", () => {
    expect(searchLinks(links, "nonexistent-xyz")).toHaveLength(0);
  });
});

// ── getLinkClickCount ──────────────────────────────────────────────────────

describe("getLinkClickCount()", () => {
  it("returns 0 when click_events is undefined", () => {
    expect(getLinkClickCount(makeLink())).toBe(0);
  });

  it("returns 0 when click_events array is empty", () => {
    const link = makeLink({ click_events: [] });
    expect(getLinkClickCount(link)).toBe(0);
  });

  it("returns the count from the first click_events entry", () => {
    const link = makeLink({ click_events: [{ count: 42 }] });
    expect(getLinkClickCount(link)).toBe(42);
  });
});

// ── getTotalClickCount ─────────────────────────────────────────────────────

describe("getTotalClickCount()", () => {
  it("returns 0 for an empty array", () => {
    expect(getTotalClickCount([])).toBe(0);
  });

  it("returns 0 when all links have no click events", () => {
    const links = [makeLink(), makeLink({ id: "2" })];
    expect(getTotalClickCount(links)).toBe(0);
  });

  it("sums click counts across all links", () => {
    const links = [
      makeLink({ click_events: [{ count: 5 }] }),
      makeLink({ id: "2", click_events: [{ count: 10 }] }),
      makeLink({ id: "3" }),
    ];
    expect(getTotalClickCount(links)).toBe(15);
  });
});
