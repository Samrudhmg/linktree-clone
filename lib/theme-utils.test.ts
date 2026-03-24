import { describe, it, expect } from "vitest";
import { getThemeStyles } from "./theme-utils";
import type { ThemeConfig } from "./theme-utils";

// ── Fixture ────────────────────────────────────────────────────────────────

const baseConfig: ThemeConfig = {
  background: {
    primary: "#6366F1",
    secondary: "#A855F7",
  },
  text: {
    primary: "#ffffff",
    secondary: "#e5e7eb",
  },
  links: {
    style: "flat",
    radius: "rounded-xl",
    shadow: "none",
    padding: "p-4",
  },
  button: {
    variant: "solid",
    accent: "#6366F1",
  },
  title: {
    color: "#ffffff",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  bio: {
    color: "#e5e7eb",
    fontSize: "1rem",
    fontWeight: "normal",
  },
};

// ── getThemeStyles ─────────────────────────────────────────────────────────

describe("getThemeStyles()", () => {
  it("maps background.primary to --theme-bg-primary", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-bg-primary" as string]).toBe("#6366F1");
  });

  it("maps background.secondary to --theme-bg-secondary", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-bg-secondary" as string]).toBe("#A855F7");
  });

  it("maps text.primary to --theme-text-primary", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-text-primary" as string]).toBe("#ffffff");
  });

  it("maps text.secondary to --theme-text-secondary", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-text-secondary" as string]).toBe("#e5e7eb");
  });

  it("maps button.accent to --theme-accent", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-accent" as string]).toBe("#6366F1");
  });

  it("maps title styling properties correctly", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-title-color" as string]).toBe("#ffffff");
    expect(styles["--theme-title-size" as string]).toBe("1.5rem");
    expect(styles["--theme-title-weight" as string]).toBe("bold");
  });

  it("maps bio styling properties correctly", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles["--theme-bio-color" as string]).toBe("#e5e7eb");
    expect(styles["--theme-bio-size" as string]).toBe("1rem");
    expect(styles["--theme-bio-weight" as string]).toBe("normal");
  });

  it("falls back to text.primary for --theme-title-color when title is missing", () => {
    const config = {
      ...baseConfig,
      title: undefined as unknown as ThemeConfig["title"],
    };
    const styles = getThemeStyles(config);
    expect(styles["--theme-title-color" as string]).toBe("#ffffff"); // text.primary
  });

  it("falls back to '1.5rem' for --theme-title-size when title is missing", () => {
    const config = {
      ...baseConfig,
      title: undefined as unknown as ThemeConfig["title"],
    };
    const styles = getThemeStyles(config);
    expect(styles["--theme-title-size" as string]).toBe("1.5rem");
  });

  it("falls back to text.secondary for --theme-bio-color when bio is missing", () => {
    const config = {
      ...baseConfig,
      bio: undefined as unknown as ThemeConfig["bio"],
    };
    const styles = getThemeStyles(config);
    expect(styles["--theme-bio-color" as string]).toBe("#e5e7eb"); // text.secondary
  });

  it("returns a plain object (not null/undefined)", () => {
    const styles = getThemeStyles(baseConfig);
    expect(styles).toBeDefined();
    expect(typeof styles).toBe("object");
  });
});
