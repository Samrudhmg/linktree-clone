"use client";

import { Link as LinkIcon, Plus, FileText, Trash2, ChevronRight } from "lucide-react";
import { LinkPage } from "@/lib/types";

interface PageListProps {
  pages: LinkPage[];
  onSelectPage: (page: LinkPage) => void;
  onDeletePage: (id: string, e: React.MouseEvent) => void;
  onCreatePage: () => void;
}

export default function PageList({
  pages,
  onSelectPage,
  onDeletePage,
  onCreatePage,
}: PageListProps) {
  if (pages.length === 0) {
    return (
      <div className="text-center py-16">
        <LinkIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
        <h3 className="text-white text-xl font-semibold mb-2">Start Creating Links!</h3>
        <p className="text-gray-400 mb-6">Create your first page and add links to share with the world</p>
        <button
          onClick={onCreatePage}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-lg"
        >
          Create Your First Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        <button
          onClick={onCreatePage}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-all"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>
      {pages.map((page) => (
        <div
          key={page.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group cursor-pointer shadow-sm"
          onClick={() => onSelectPage(page)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${page.page_bg_gradient_start || "#6366F1"} 0%, ${page.page_bg_gradient_end || "#A855F7"} 100%)` }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="dark:text-white text-gray-900 font-medium">{page.title}</h3>
                <p className="text-gray-500 text-xs">/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onDeletePage(page.id, e)}
                className="text-gray-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
