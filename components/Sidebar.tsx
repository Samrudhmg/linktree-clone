import { Pencil, Plus, FileText, ExternalLink, Link as LinkIcon, LogOut, X } from "lucide-react";
import { Profile, LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/animated/interaction";

export default function Sidebar({ profile, pages, activePage, activeTab, setActiveTab, onSelectPage, onCreatePage, onLogout, onClose, onEditProfile }: { profile: Profile | null, pages: LinkPage[], activePage: LinkPage | null, activeTab: string, setActiveTab: (tab: string) => void, onSelectPage: (page: LinkPage) => void, onCreatePage: () => void, onLogout: () => void, onClose?: () => void, onEditProfile: () => void }) {
  return (
    <div className="w-72 lg:w-64 h-full bg-white dark:bg-[#101828] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors">
      {/* Logo with Close Button for Mobile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ELTLINKTREE
        </h1>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditProfile}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Edit Profile"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* My Pages Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider transition-colors">My Pages</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreatePage}
              className="h-6 w-6 text-primary hover:text-primary/80 transition-all"
              title="Create New Page"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Page List */}
          {pages && pages.length > 0 ? (
            <div className="space-y-1">
              {pages.map((page) => (
                <div key={page.id} className="group flex items-center justify-between w-full relative">
                  <AnimatedButton
                    variant={activePage?.id === page.id ? "secondary" : "ghost"}
                    selected={activePage?.id === page.id}
                    onClick={() => onSelectPage(page)}
                    className={`w-full justify-start gap-2 h-10 ${
                      activePage?.id === page.id
                        ? "bg-primary/10 text-primary hover:text-primary hover:bg-primary/20 border border-primary/20"
                        : "text-muted-foreground"
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium truncate flex-1 text-left">{page.title}</span>
                  </AnimatedButton>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary h-8 w-8 transition-all"
                    title="Open hosted page"
                  >
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
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
                <AnimatedButton
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  selected={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full justify-start gap-2 h-10 ${
                    activeTab === item.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {getIcon(item.icon)}
                  <span className="text-sm font-medium">{item.label}</span>
                </AnimatedButton>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 h-12 text-muted-foreground hover:bg-muted"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
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

