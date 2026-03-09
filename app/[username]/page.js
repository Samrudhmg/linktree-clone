import { supabase } from "@/lib/supabase";
import PublicLinkItem from "@/components/PublicLinkItem";
import Link from "next/link";

// Helper functions for page styling
const getPageBackgroundStyle = (profile) => {
    const bgType = profile?.page_bg_type || "gradient";
    if (bgType === "image" && profile?.page_bg_image) {
        return { 
            backgroundImage: `url(${profile.page_bg_image})`, 
            backgroundSize: "cover", 
            backgroundPosition: "center" 
        };
    }
    if (bgType === "color") {
        return { backgroundColor: profile?.page_bg_color || "#6366F1" };
    }
    return { 
        background: `linear-gradient(135deg, ${profile?.page_bg_gradient_from || "#6366F1"} 0%, ${profile?.page_bg_gradient_to || "#A855F7"} 100%)` 
    };
};

const getFontClass = (profile) => {
    const fonts = {
        sans: "font-sans",
        serif: "font-serif",
        mono: "font-mono",
    };
    return fonts[profile?.page_font] || "font-sans";
};

const getCardBorderRadius = (profile) => {
    const radiusMap = {
        none: "rounded-none",
        sm: "rounded-lg",
        rounded: "rounded-xl",
        full: "rounded-full",
    };
    return radiusMap[profile?.card_border_radius] || "rounded-xl";
};

export default async function UserProfile({ params }) {
    const { username } = await params;

    // Fetch profile by username
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (profileError || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/70">This page doesn&apos;t exist</p>
                </div>
            </div>
        );
    }

    // Fetch user's enabled links
    const { data: links, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profile.id)
        .eq("enabled", true)
        .order("position", { ascending: true });

    if (linksError) {
        console.error("Error fetching links:", linksError);
    }

    const pageStyle = getPageBackgroundStyle(profile);
    const fontClass = getFontClass(profile);
    const borderRadiusClass = getCardBorderRadius(profile);

    return (
        <div 
            className={`min-h-screen px-4 py-8 sm:p-8 flex flex-col items-center ${fontClass}`}
            style={pageStyle}
        >
            <div className="max-w-md w-full text-center">
                {/* Profile Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 sm:mb-4 flex items-center justify-center text-3xl sm:text-4xl text-white">
                        {profile.display_name?.[0]?.toUpperCase() || "@"}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{profile.display_name}</h1>
                    <p className="text-white/70 text-sm sm:text-base mb-2 sm:mb-3">@{profile.username}</p>
                    {profile.bio && (
                        <p className="text-white/80 text-sm">{profile.bio}</p>
                    )}
                </div>

                {/* Links */}
                <div className="flex flex-col gap-2 sm:gap-3">
                    {(!links || links.length === 0) ? (
                        <p className="text-white/70 text-sm sm:text-base">No links available</p>
                    ) : (
                        links.map((link) => (
                            <PublicLinkItem 
                                key={link.id} 
                                link={link} 
                                profile={profile}
                                borderRadiusClass={borderRadiusClass}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-12">
                    <p className="text-white/50 text-xs sm:text-sm mb-2">
                        Powered by ELTLINKTREE
                    </p>
                    <Link
                        href="/login"
                        className="text-white/70 text-xs hover:text-white transition-all"
                    >
                        Create your own ELTLINKTREE
                    </Link>
                </div>
            </div>
        </div>
    );
}