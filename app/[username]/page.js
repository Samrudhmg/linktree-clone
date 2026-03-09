import { supabase } from "@/lib/supabase";

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

    return (
        <div className="min-h-screen px-4 py-8 sm:p-8 bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center">
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
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 sm:p-4 bg-white rounded-xl text-gray-800 font-medium text-sm sm:text-base hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                            >
                                {link.title}
                            </a>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-12">
                    <p className="text-white/50 text-xs sm:text-sm mb-2">
                        Powered by ELTLINKTREE
                    </p>
                    <a 
                        href="/login"
                        className="text-white/70 text-xs hover:text-white transition-all"
                    >
                        Create your own ELTLINKTREE
                    </a>
                </div>
            </div>
        </div>
    );
}