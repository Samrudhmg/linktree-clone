"use client";

import { Plus } from "lucide-react";

interface CreatePageFormProps {
  newPageTitle: string;
  setNewPageTitle: (val: string) => void;
  newPageSlug: string;
  setNewPageSlug: (val: string) => void;
  onCreatePage: () => void;
  onCancel: () => void;
}

export default function CreatePageForm({
  newPageTitle,
  setNewPageTitle,
  newPageSlug,
  setNewPageSlug,
  onCreatePage,
  onCancel,
}: CreatePageFormProps) {
  const normalizedSlug = newPageSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4 shadow-sm transition-colors">
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
        <Plus className="w-5 h-5 text-purple-400" />
        New Link Page
      </h3>
      <p className="text-gray-400 text-sm">Create a new page with its own set of links and appearance.</p>

      <div>
        <label className="block text-gray-400 text-sm mb-1">Page Title *</label>
        <input
          type="text"
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="My Social Links"
          className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-1">Page URL *</label>
        <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-purple-500 overflow-hidden transition-colors">
          <span className="px-3 text-gray-400 text-sm whitespace-nowrap border-r border-gray-200 dark:border-gray-600">/</span>
          <input
            type="text"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-social-links"
            className="flex-1 bg-transparent text-black dark:text-white px-3 py-3 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && onCreatePage()}
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">This will be your page&apos;s URL. Use lowercase letters, numbers, and hyphens.</p>
      </div>

      {newPageSlug.trim() && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 transition-colors">
          <p className="text-gray-400 text-xs mb-1">Your page will be hosted at:</p>
          <p className="text-green-400 text-sm font-mono">
            {typeof window !== "undefined" ? window.location.origin : ""}/{normalizedSlug}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onCreatePage}
          disabled={!newPageTitle.trim() || !newPageSlug.trim()}
          className="flex-1 py-3 px-6 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 disabled:bg-purple-600/50 transition-all"
        >
          Create Page
        </button>
      </div>
    </div>
  );
}
