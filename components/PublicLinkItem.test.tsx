import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicLinkItem from "./PublicLinkItem";
import type { Link } from "@/lib/types";
import type { DBTheme } from "@/lib/theme-utils";

// ── Minimal mocks for heavy dependencies ──────────────────────────────────

// next/image doesn't work in jsdom
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Stub child components so tests only care about PublicLinkItem behaviour
vi.mock("./ui/LinkThumbnail", () => ({
  default: () => <span data-testid="link-thumbnail" />,
}));

vi.mock("./ShareModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="share-modal" /> : null,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  MoreVertical: () => <span data-testid="more-vertical-icon" />,
}));

// Prevent JSDOM errors — sendBeacon is not implemented there
Object.defineProperty(navigator, "sendBeacon", {
  value: vi.fn(),
  writable: true,
});

// ── Test fixtures ─────────────────────────────────────────────────────────

const sampleLink: Link = {
  id: "link-001",
  user_id: "user-001",
  page_id: "page-001",
  title: "My Portfolio",
  url: "https://example.com",
  icon: null,
  subtext: "Check out my work",
  thumbnail_url: null,
  position: 0,
  enabled: true,
  bg_color: undefined,
  text_color: undefined,
};

// ── Tests ─────────────────────────────────────────────────────────────────

describe("PublicLinkItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the link title", () => {
    render(<PublicLinkItem link={sampleLink} theme={null} />);
    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
  });

  it("renders the link subtext when provided", () => {
    render(<PublicLinkItem link={sampleLink} theme={null} />);
    expect(screen.getByText("Check out my work")).toBeInTheDocument();
  });

  it("has the correct href attribute", () => {
    render(<PublicLinkItem link={sampleLink} theme={null} />);
    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });

  it("opens the share modal when the menu button is clicked", async () => {
    const user = userEvent.setup();
    render(<PublicLinkItem link={sampleLink} theme={null} />);

    // Modal is initially hidden
    expect(screen.queryByTestId("share-modal")).not.toBeInTheDocument();

    // Click the three-dots button
    const menuButton = screen.getByTitle("More options");
    await user.click(menuButton);

    expect(screen.getByTestId("share-modal")).toBeInTheDocument();
  });

  it("does not render subtext section when subtext is not provided", () => {
    const linkWithoutSubtext = { ...sampleLink, subtext: null };
    render(<PublicLinkItem link={linkWithoutSubtext} theme={null} />);
    expect(screen.queryByText("Check out my work")).not.toBeInTheDocument();
  });

  it("renders with a theme without crashing", () => {
    const theme: DBTheme = {
      id: "theme-001",
      name: "Test Theme",
      type: "default",
      user_id: null,
      config: {
        background: { primary: "#6366F1", secondary: "#A855F7" },
        text: { primary: "#ffffff", secondary: "#e5e7eb" },
        links: { style: "flat", radius: "rounded-xl" },
        button: { variant: "solid", accent: "#6366F1" },
        title: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" },
        bio: { color: "#e5e7eb", fontSize: "1rem", fontWeight: "normal" },
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    render(<PublicLinkItem link={sampleLink} theme={theme} />);
    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
  });
});
