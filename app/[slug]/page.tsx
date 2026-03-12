// @ts-nocheck
import { supabase } from "@/lib/supabase";
import PublicLinkItem from "@/components/PublicLinkItem";
import { unstable_noStore as noStore } from 'next/cache';
import ShareTrigger from "@/components/shareTrigger";

// Disable ALL caching so appearance changes reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const getBoxBackgroundStyle = (page) => {
    const bgType = page?.page_bg_type || "gradient";
    if (bgType === "image" && page?.page_bg_image) {
        return {
            backgroundImage: `url(${page.page_bg_image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        };
    }
    if (bgType === "color") {
        return { backgroundColor: page?.page_bg_color || "#6366F1" };
    }
    return {
        background: `linear-gradient(135deg, ${page?.page_bg_gradient_from || "#6366F1"} 0%, ${page?.page_bg_gradient_to || "#A855F7"} 100%)`
    };
};

const getFontClass = (page) => {
    const fonts = { sans: "font-sans", serif: "font-serif", mono: "font-mono" };
    return fonts[page?.page_font] || "font-sans";
};

const getCardBorderRadius = (page) => {
    const radiusMap = { none: "rounded-none", sm: "rounded-lg", rounded: "rounded-xl", full: "rounded-full" };
    return radiusMap[page?.card_border_radius] || "rounded-xl";
};

const getAvatarShape = (page) => {
    return page?.avatar_shape === "square" ? "rounded-xl" : "rounded-full";
};

export default async function PublicPage({ params }) {
    // Prevent caching of this page
    noStore();

    const { slug } = await params;

    // Fetch the link page by slug (globally unique)
    const { data: linkPage, error: pageError } = await supabase
        .from("link_pages")
        .select("*")
        .eq("slug", slug)
        .single();

    if (pageError || !linkPage) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0f0f1a" }}>
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/70">This page doesn&apos;t exist</p>
                </div>
            </div>
        );
    }

    // Fetch the profile for this page
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", linkPage.user_id)
        .single();

    if (profileError || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0f0f1a" }}>
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/70">This page doesn&apos;t exist</p>
                </div>
            </div>
        );
    }

    // Fetch links for this specific page (only enabled links)
    const { data: links, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("page_id", linkPage.id)
        .neq("enabled", false)
        .order("position", { ascending: true });

    if (linksError) {
        console.error("Error fetching links:", linksError);
    }

    const boxStyle = getBoxBackgroundStyle(linkPage);
    const fontClass = getFontClass(linkPage);
    const borderRadiusClass = getCardBorderRadius(linkPage);
    const avatarShapeClass = getAvatarShape(linkPage);

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
                                <img
                                    src={linkPage.avatar_url}
                                    alt={linkPage.display_name || "Profile"}
                                    className={`object-cover ${linkPage.avatar_shape === "square" ? "w-20 h-20 sm:w-24 sm:h-24 rounded-none border-2 border-white/20" :
                                        linkPage.avatar_shape === "rounded" ? "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 border-white/20" :
                                            linkPage.avatar_shape === "full" ? "w-[50%] h-20 mt-2 mx-auto aspect-video" :
                                                "w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/20"
                                        }`}
                                />
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
