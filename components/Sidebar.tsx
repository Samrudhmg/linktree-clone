// @ts-nocheck
// @ts-nocheck
"use client";

export default function Sidebar({ profile, pages, activePage, activeTab, setActiveTab, onSelectPage, onCreatePage, onLogout, onClose }) {
  return (
    <div className="w-56 h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo with Close Button for Mobile */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ELTLINKTREE
        </h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {profile?.display_name?.[0]?.toUpperCase() || "@"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate text-sm">
              {profile?.display_name || "User"}
            </p>
            <p className="text-gray-500 text-xs truncate">
              @{profile?.username || "user"}
            </p>
          </div>
        </div>
      </div>

      {/* My Pages Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">My Pages</p>
            <button
              onClick={onCreatePage}
              className="text-purple-400 hover:text-purple-300 transition-all"
              title="Create New Page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Page List */}
          {pages && pages.length > 0 ? (
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onSelectPage(page)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${activePage?.id === page.id
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate">{page.title}</span>

                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-xs px-3 py-2">No pages yet</p>
          )}
        </div>

        {/* Page Editor Tabs (shown when a page is selected) */}
        {activePage && (
          <div className="p-3 border-t border-gray-800">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
              Page Editor
            </p>
            <div className="space-y-1">
              {[
                { id: "links", label: "Links", icon: "link" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${activeTab === item.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`}
                >
                  {getIcon(item.icon)}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function getIcon(icon) {
  switch (icon) {
    case "link":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );

    default:
      return null;
  }
}

