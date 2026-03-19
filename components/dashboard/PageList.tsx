"use client";

import { Link as LinkIcon, Plus, FileText, Trash2, ChevronRight } from "lucide-react";
import { LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        <Button
          onClick={onCreatePage}
          size="lg"
          className="rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
        >
          Create Your First Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        <Button
          onClick={onCreatePage}
          className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>
      {pages.map((page) => (
        <Card
          key={page.id}
          className="p-4 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all group cursor-pointer shadow-sm border-gray-200 dark:border-gray-800"
          onClick={() => onSelectPage(page)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
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
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onDeletePage(page.id, e)}
                className="text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
