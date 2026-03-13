"use client";

import { ChevronLeft, Pencil } from "lucide-react";
import { LinkPage } from "@/lib/types";

interface PageInfoCardProps {
  activePage: LinkPage;
  editingPageSlug: boolean;
  setEditingPageSlug: (editing: boolean) => void;
  editPageSlug: string;
  setEditPageSlug: (slug: string) => void;
  onSavePageSlug: () => void;
  onBack: () => void;
}

export default function PageInfoCard({
  activePage,
  editingPageSlug,
  setEditingPageSlug,
  editPageSlug,
  setEditPageSlug,
  onSavePageSlug,
  onBack,
}: PageInfoCardProps) {
  return (
    <>
      {/* Back to Pages */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all mb-4 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Pages
      </button>

      {/* Page Info Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm transition-colors">
        <h2 className="dark:text-white text-black font-semibold text-lg mb-2">{activePage.title}</h2>
        <div className="flex items-center gap-2">
          {editingPageSlug ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-purple-500 overflow-hidden flex-1 transition-colors">
                <span className="px-2 text-gray-400 text-xs whitespace-nowrap border-r border-gray-200 dark:border-gray-600">/</span>
                <input
                  type="text"
                  value={editPageSlug}
                  onChange={(e) => setEditPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-transparent dark:text-white text-gray-900 px-2 py-1.5 text-sm focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                onClick={onSavePageSlug}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPageSlug(false)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm flex-1">/{activePage.slug}</p>
              <button
                onClick={() => { setEditPageSlug(activePage.slug); setEditingPageSlug(true); }}
                className="text-gray-500 hover:text-purple-400 transition-all p-1"
                title="Edit URL"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
