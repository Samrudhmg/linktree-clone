import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import PublicLinkItem from "@/components/PublicLinkItem";
import { unstable_noStore as noStore } from 'next/cache';
import Image from "next/image";
import LinkThumbnail from "@/components/ui/LinkThumbnail";
import ShareTrigger from "@/components/shareTrigger";
import { AnimatedContainer } from "@/components/animated/AnimatedContainer";
import { ScrollHide } from "@/components/animated/ScrollHide";
import {
    getThemeStyles,
    DBTheme
} from "@/lib/theme-utils";
import { LinkPage, Link } from "@/lib/types";

// Disable ALL caching so appearance changes reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';


export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
    // Prevent caching of this page
    noStore();

    const { slug } = await params;

    // Fetch the link page by slug (optimizing column selection)
    const { data: linkPage, error: pageError } = await supabase
        .from("link_pages")
        .select("*")
        .eq("slug", slug)
        .single() as { data: LinkPage | null, error: PostgrestError | null };

    if (pageError || !linkPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-
            [#0f0f1a]">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/70">This page doesn&apos;t exist</p>
                </div>
            </div>
        );
    }

    // Fetch links for this specific page (optimizing normalization to match dashboard)
    const { data: allLinks, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("page_id", linkPage.id)
        .order("position", { ascending: true }) as { data: Link[] | null, error: PostgrestError | null };

    if (linksError) {
        console.error("Error fetching links:", linksError);
    }

    // Normalize and filter enabled links (matching dashboard's logic for NULL/undefined)
    const links = (allLinks || []).filter(link => 
        link.enabled === true || link.enabled === null || (link.enabled as any) === undefined
    );

    // Fetch the active theme (New system: theme_id only)
    let activeTheme: DBTheme | null = null;
    const currentThemeIdentifier = linkPage.theme_id;

    if (currentThemeIdentifier) {
        const { data: themeData } = await supabase
            .from("themes")
            .select("*")
            .eq("id", currentThemeIdentifier)
            .single() as { data: DBTheme | null };
        activeTheme = themeData;
    }

    if (!activeTheme) {
        const { data: defaultTheme } = await supabase
            .from("themes")
            .select("*")
            .eq("type", "default")
            .limit(1)
            .single() as { data: DBTheme | null };
        activeTheme = defaultTheme;
    }

    const themeStyles = activeTheme ? getThemeStyles(activeTheme.config) : {};

    // For avatar shape and font fallback
    const fontClass = "font-sans";



    return (
        <AnimatedContainer>
            <div
                className={`min-h-dvh flex flex-col items-center px-0 sm:px-4 pt-0 sm:pt-12 ${fontClass}`}
                style={{ ...themeStyles, backgroundColor: 'var(--theme-bg-secondary)', color: 'var(--theme-text-primary)' }}
            >
                {/* Main Content Card - Uses Primary BG */}
                <div
                    className="w-full flex-1 sm:max-w-[560px] min-h-[105vh] sm:rounded-t-3xl sm:rounded-b-none relative animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl"
                    style={{ backgroundColor: 'var(--theme-bg-primary)' }}
                >
                    <div className="absolute top-4 right-4 z-20">
                        <ScrollHide>
                            <ShareTrigger
                                link={{
                                    url: typeof window !== "undefined" ? window.location.href : "",
                                    title: linkPage.display_name || "My links",
                                    thumbnail_url: linkPage.avatar_url || undefined
                                }}
                            />
                        </ScrollHide>
                    </div>
                    {/* Gradient overlay has been removed for CSS Var spec */}

                    <div className="relative z-10 px-6 py-8  sm:px-8 sm:py-10">
                        {/* Profile Header */}
                        <div className="text-center mb-8 flex flex-col items-center">
                            {/* Avatar */}
                            {linkPage.avatar_url && (
                                <div className={`${linkPage.avatar_style === "full" ? "-mx-6 sm:-mx-8 -mt-8 sm:-mt-10 mb-4 border-b border-white/10" : "flex justify-center mb-6"}`}>
                                    <LinkThumbnail
                                        thumbnailUrl={linkPage.avatar_url}
                                        shape={activeTheme?.config.avatar?.style || linkPage.avatar_style || 'circle'}
                                        pixels={activeTheme?.config.avatar?.size || linkPage.avatar_size || 96}
                                        className="border-2 border-white/20 shadow-main"
                                    />
                                </div>
                            )}
                            <h1
                                className="wrap-break-word px-2 mb-3 leading-tight"
                                style={{
                                    color: 'var(--theme-title-color)',
                                    fontSize: 'var(--theme-title-size)',
                                    fontWeight: 'var(--theme-title-weight)'
                                }}
                            >
                                {linkPage.display_name || "Untitled"}
                            </h1>
                            {linkPage.bio && (
                                <p
                                    className="w-full mx-auto wrap-break-word px-5 leading-snug opacity-90"
                                    style={{
                                        color: 'var(--theme-bio-color)',
                                        fontSize: 'var(--theme-bio-size)',
                                        fontWeight: 'var(--theme-bio-weight)'
                                    }}
                                >
                                    {linkPage.bio}
                                </p>
                            )}
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                            {(!links || links.length === 0) ? (
                                <p className="opacity-70 text-sm sm:text-base text-center">No links available</p>
                            ) : (
                                links.map((link) => (
                                    <PublicLinkItem
                                        key={link.id}
                                        link={link}
                                        theme={activeTheme}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedContainer>
    );
}
