import { Pencil, Plus, FileText, ExternalLink, Link as LinkIcon, LogOut, X } from "lucide-react";
import { Profile, LinkPage } from "@/lib/types";

export default function Sidebar({ profile, pages, activePage, activeTab, setActiveTab, onSelectPage, onCreatePage, onLogout, onClose, onEditProfile }: { profile: Profile | null, pages: LinkPage[], activePage: LinkPage | null, activeTab: string, setActiveTab: (tab: string) => void, onSelectPage: (page: LinkPage) => void, onCreatePage: () => void, onLogout: () => void, onClose?: () => void, onEditProfile: () => void }) {
  return (
    <div className="w-72 lg:w-64 h-full bg-white dark:bg-[#101828] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors">
      {/* Logo with Close Button for Mobile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ELTLINKTREE
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white transition-colors">
            {profile?.display_name?.[0]?.toUpperCase() || "@"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white font-medium truncate text-sm transition-colors">
              {profile?.display_name || "User"}
            </p>
          </div>
          <button
            onClick={onEditProfile}
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all p-1"
            title="Edit Profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* My Pages Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider transition-colors">My Pages</p>
            <button
              onClick={onCreatePage}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all"
              title="Create New Page"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Page List */}
          {pages && pages.length > 0 ? (
            <div className="space-y-1">
              {pages.map((page) => (
                <div key={page.id} className="group">
                  <button
                    onClick={() => onSelectPage(page)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${activePage?.id === page.id
                      ? "bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">{page.title}</span>
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-purple-400 transition-all"
                      title="Open hosted page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs px-3 py-2 italic">Create your first page to get started!</p>
          )}
        </div>

        {/* Page Editor Tabs (shown when a page is selected) */}
        {activePage && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
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
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function getIcon(icon: string) {
  switch (icon) {
    case "link":
      return <LinkIcon className="w-4 h-4" />;

    default:
      return null;
  }
}

