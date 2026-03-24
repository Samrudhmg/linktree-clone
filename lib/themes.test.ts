import { describe, it, expect } from "vitest";
import {
  getPageBackgroundStyle,
  getCardStyle,
  getFontClass,
  getBorderRadiusClass,
} from "./themes";
import type { LinkPage, Link } from "./types";

// ---------------------------------------------------------------------------
// getPageBackgroundStyle
// ---------------------------------------------------------------------------
describe("getPageBackgroundStyle()", () => {
  it("returns a gradient background by default", () => {
    const config: Partial<LinkPage> = {};
    const style = getPageBackgroundStyle(config);
    expect(style).toHaveProperty("background");
    expect((style as unknown as Record<string, string>).background).toMatch(/linear-gradient/);
  });

  it("returns a solid color background when type is 'color'", () => {
    const config: Partial<LinkPage> = {
      page_bg_type: "color",
      page_bg_color: "#FF0000",
    };
    const style = getPageBackgroundStyle(config) as React.CSSProperties;
    expect(style.backgroundColor).toBe("#FF0000");
  });

  it("returns an image background when type is 'image' and image is provided", () => {
    const config: Partial<LinkPage> = {
      page_bg_type: "image",
      page_bg_image: "https://example.com/bg.jpg",
    };
    const style = getPageBackgroundStyle(config) as React.CSSProperties;
    expect(style.backgroundImage).toBe("url(https://example.com/bg.jpg)");
  });

  it("falls back to gradient when type is 'image' but no image is set", () => {
    const config: Partial<LinkPage> = {
      page_bg_type: "image",
      page_bg_image: "",
    };
    const style = getPageBackgroundStyle(config);
    expect((style as unknown as Record<string, string>).background).toMatch(/linear-gradient/);
  });
});

// ---------------------------------------------------------------------------
// getCardStyle
// ---------------------------------------------------------------------------
describe("getCardStyle()", () => {
  const baseConfig: Partial<LinkPage> = {
    card_style: "filled",
    button_color: "#6366F1",
    button_text_color: "#ffffff",
  };

  it("returns a solid background for 'filled' style", () => {
    const style = getCardStyle(baseConfig) as React.CSSProperties;
    expect(style.backgroundColor).toBe("#6366F1");
    expect(style.color).toBe("#ffffff");
  });

  it("returns transparent bg and border for 'outline' style", () => {
    const config = { ...baseConfig, card_style: "outline" as const };
    const style = getCardStyle(config) as React.CSSProperties;
    expect(style.backgroundColor).toBe("transparent");
    expect(style.border).toMatch(/#6366F1/);
  });

  it("returns a boxShadow for 'shadow' style", () => {
    const config = { ...baseConfig, card_style: "shadow" as const };
    const style = getCardStyle(config) as React.CSSProperties;
    expect(style.boxShadow).toBeTruthy();
  });

  it("returns backdropFilter for 'glass' style", () => {
    const config = { ...baseConfig, card_style: "glass" as const };
    const style = getCardStyle(config) as React.CSSProperties;
    expect(style.backdropFilter).toBe("blur(16px)");
  });

  it("link overlay color takes precedence over page config", () => {
    const link: Partial<Link> = { bg_color: "#FF0000", text_color: "#00FF00" };
    const style = getCardStyle(baseConfig, link) as React.CSSProperties;
    expect(style.backgroundColor).toBe("#FF0000");
    expect(style.color).toBe("#00FF00");
  });
});

// ---------------------------------------------------------------------------
// getFontClass
// ---------------------------------------------------------------------------
describe("getFontClass()", () => {
  it("returns font-sans for 'sans'", () => {
    expect(getFontClass("sans")).toBe("font-sans");
  });

  it("returns font-serif for 'serif'", () => {
    expect(getFontClass("serif")).toBe("font-serif");
  });

  it("returns font-mono for 'mono'", () => {
    expect(getFontClass("mono")).toBe("font-mono");
  });

  it("falls back to font-sans for unknown value", () => {
    expect(getFontClass("unknown")).toBe("font-sans");
  });

  it("falls back to font-sans when called with no argument", () => {
    expect(getFontClass()).toBe("font-sans");
  });
});

// ---------------------------------------------------------------------------
// getBorderRadiusClass
// ---------------------------------------------------------------------------
describe("getBorderRadiusClass()", () => {
  it("returns rounded-none for 'none'", () => {
    expect(getBorderRadiusClass("none")).toBe("rounded-none");
  });

  it("returns rounded-xl for 'rounded'", () => {
    expect(getBorderRadiusClass("rounded")).toBe("rounded-xl");
  });

  it("returns rounded-full for 'full'", () => {
    expect(getBorderRadiusClass("full")).toBe("rounded-full");
  });

  it("falls back to rounded-xl for unknown values", () => {
    expect(getBorderRadiusClass("invalid")).toBe("rounded-xl");
  });
});
