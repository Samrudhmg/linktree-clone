import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn()", () => {
  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges multiple class strings", () => {
    const result = cn("flex", "items-center", "gap-2");
    expect(result).toBe("flex items-center gap-2");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge should keep the last conflicting utility
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("deduplicates conflicting text size classes", () => {
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg");
  });

  it("ignores falsy values (undefined, null, false)", () => {
    const result = cn("flex", undefined, null, false, "gap-2");
    expect(result).toBe("flex gap-2");
  });

  it("handles conditional classes via objects", () => {
    const isActive = true;
    const result = cn("base", { "bg-blue-500": isActive, "bg-gray-200": !isActive });
    expect(result).toBe("base bg-blue-500");
  });
});
