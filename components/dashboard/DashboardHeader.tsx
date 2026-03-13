"use client";

import { Menu, Eye, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LinkPage } from "@/lib/types";

interface DashboardHeaderProps {
  showCreatePage: boolean;
  activePage: LinkPage | null;
  onShowSidebar: () => void;
  onShowPreview: () => void;
}

export default function DashboardHeader({
  showCreatePage,
  activePage,
  onShowSidebar,
  onShowPreview,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onShowSidebar}
          className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {showCreatePage ? "Create New Page" : activePage ? activePage.title : "My Pages"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {activePage && (
          <>
            {/* Mobile Preview Toggle */}
            <button
              onClick={onShowPreview}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Eye className="w-6 h-6" />
            </button>

            <a
              href={`/${activePage.slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm"
            >
              <span className="truncate max-w-[180px] sm:max-w-none">/{activePage.slug}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
            <div className="flex items-center gap-1">
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
