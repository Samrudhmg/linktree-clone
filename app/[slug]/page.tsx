import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import PublicLinkItem from "@/components/PublicLinkItem";
import { unstable_noStore as noStore } from 'next/cache';
import Image from "next/image";
import ShareTrigger from "@/components/shareTrigger";
import {
    getPageBackgroundStyle,
    getFontClass,
    getBorderRadiusClass,
} from "@/lib/themes";
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
        .select(`
            id, 
            user_id, 
            slug, 
            display_name, 
            bio, 
            avatar_url, 
            avatar_shape,
            page_bg_type,
            page_bg_color,
            page_bg_gradient_start,
            page_bg_gradient_end,
            page_bg_image,
            card_bg_color,
            card_text_color,
            card_border_radius,
            card_style,
            page_font
        `)
        .eq("slug", slug)
        .single() as { data: LinkPage | null, error: PostgrestError | null };

    if (pageError || !linkPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/70">This page doesn&apos;t exist</p>
                </div>
            </div>
        );
    }

    // Fetch links for this specific page (only enabled links, optimizing columns)
    const { data: links, error: linksError } = await supabase
        .from("links")
        .select(`
            id,
            title,
            url,
            subtext,
            icon,
            thumbnail_url,
            enabled,
            position,
            bg_type,
            bg_color,
            bg_image,
            text_color,
            font
        `)
        .eq("page_id", linkPage.id)
        .neq("enabled", false)
        .order("position", { ascending: true }) as { data: Link[] | null, error: PostgrestError | null };

    if (linksError) {
        console.error("Error fetching links:", linksError);
    }

    const boxStyle = getPageBackgroundStyle(linkPage);
    const fontClass = getFontClass(linkPage.page_font);
    const borderRadiusClass = getBorderRadiusClass(linkPage.card_border_radius);

    return (
        <div
            className={`min-h-screen flex items-start sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-8 ${fontClass}`}
            style={{ backgroundColor: "#0f0f1a" }}
        >
            {/* Card / Box Container */}
            <div
                className="w-full sm:max-w-lg min-h-screen sm:min-h-0 sm:rounded-3xl overflow-hidden relative"
                style={{
                    ...boxStyle,
                    boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5)",
                }}
            >
                <div className="absolute top-4 right-4 z-20">
                    <ShareTrigger
                        link={{
                            url: typeof window !== "undefined" ? window.location.href : "",
                            title: linkPage.display_name || "My links"
                        }}
                    />
                </div>
                {/* Gradient overlay for readability when using image backgrounds */}
                {linkPage?.page_bg_type === "image" && linkPage?.page_bg_image && (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                        }}
                    />
                )}

                <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10">
                    {/* Profile Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        {/* Avatar */}
                        {linkPage.avatar_url && (
                            <div className={`${linkPage.avatar_shape === "full" ? "-mx-6 sm:-mx-8 -mt-8 sm:-mt-10 mb-6 border-b border-white/10" : "flex justify-center mb-4"}`}>
                                <div className={`relative overflow-hidden ${linkPage.avatar_shape === "square" ? "w-20 h-20 mt-10 sm:w-24 sm:h-24 rounded-none border-2 border-white/20" :
                                    linkPage.avatar_shape === "rounded" ? "w-20 h-20 mt-10 sm:w-24 sm:h-24 rounded-3xl border-2 border-white/20" :
                                        linkPage.avatar_shape === "full" ? "w-[50%] h-20 mt-20 mx-auto aspect-video" :
                                            "w-20 h-20 mt-10 sm:w-24 sm:h-24 rounded-full border-2 border-white/20"
                                    }`}>
                                    <Image
                                        src={linkPage.avatar_url}
                                        alt={linkPage.display_name || "Profile"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 break-words px-2">{linkPage.display_name || "Untitled"}</h1>
                        {linkPage.bio && (
                            <p className="text-white/80 text-sm max-w-xs mx-auto break-words px-4">{linkPage.bio}</p>
                        )}
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {(!links || links.length === 0) ? (
                            <p className="text-white/70 text-sm sm:text-base text-center">No links available</p>
                        ) : (
                            links.map((link) => (
                                <PublicLinkItem
                                    key={link.id}
                                    link={link}
                                    profile={linkPage}
                                    borderRadiusClass={borderRadiusClass}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
