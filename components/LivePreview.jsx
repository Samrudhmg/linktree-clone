"use client";

export default function LivePreview({ profile, links }) {
  return (
    <div className="h-full flex flex-col">
      {/* Phone Frame */}
      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl flex flex-col max-h-[600px]">
        {/* Notch */}
        <div className="h-6 bg-gray-900 flex justify-center items-end pb-1">
          <div className="w-20 h-4 bg-gray-800 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-y-auto">
          <div className="p-4 text-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center text-2xl text-white">
              {profile?.display_name?.[0]?.toUpperCase() || "@"}
            </div>

            {/* Name */}
            <h2 className="text-white font-bold text-sm mb-1">
              {profile?.display_name || "Your Name"}
            </h2>
            <p className="text-white/70 text-xs mb-4">
              @{profile?.username || "username"}
            </p>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-white/80 text-xs mb-4 px-2">
                {profile.bio}
              </p>
            )}

            {/* Links */}
            <div className="space-y-2 px-2">
              {links.length === 0 ? (
                <p className="text-white/50 text-xs py-8">
                  Your links will appear here
                </p>
              ) : (
                links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2.5 px-4 bg-white rounded-lg text-gray-800 font-medium text-xs hover:scale-[1.02] transition-transform"
                  >
                    {link.title}
                  </a>
                ))
              )}
            </div>

            {/* Footer */}
            <p className="mt-6 text-white/40 text-[10px]">
              ELTLINKTREE
            </p>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="h-6 bg-gray-900 flex justify-center items-center">
          <div className="w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Share URL */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-gray-400 text-xs mb-1">Your ELTLINKTREE is live:</p>
        <div className="flex items-center gap-2">
          <code className="text-green-400 text-xs flex-1 truncate">
            eltlinktree/{profile?.username || "username"}
          </code>
          <button 
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${profile?.username || "username"}`)}
            className="text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
