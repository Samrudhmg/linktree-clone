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
        <LinkIcon className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
        <h3 className="text-text-main text-xl font-semibold mb-2">Start Creating Links!</h3>
        <p className="text-text-secondary mb-6">Create your first page and add links to share with the world</p>
        <Button
          onClick={onCreatePage}
          size="lg"
          className="rounded-full bg-btn-bg hover:bg-btn-hover text-btn-text shadow-main px-8"
        >
          Create Your First Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-text-secondary text-sm">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        <Button
          onClick={onCreatePage}
          className="rounded-full bg-btn-bg hover:bg-btn-hover text-btn-text border border-border-main"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>
      {pages.map((page) => (
        <Card
          key={page.id}
          className="p-4 rounded-radius-main hover:bg-muted transition-all group cursor-pointer shadow-main border border-border-main bg-bg-main"
          onClick={() => onSelectPage(page)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-btn-bg border border-border-main shadow-sm"
              >
                <FileText className="w-5 h-5 text-btn-text" />
              </div>
              <div>
                <h3 className="text-text-main font-medium">{page.title}</h3>
                <p className="text-text-secondary text-xs">/{page.slug}</p>
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
