"use client";

import { ChevronLeft, Pencil } from "lucide-react";
import { LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PageInfoCardProps {
  activePage: LinkPage;
  editingPageSlug: boolean;
  setEditingPageSlug: (editing: boolean) => void;
  editPageSlug: string;
  setEditPageSlug: (slug: string) => void;
  editPageTitle: string;
  setEditPageTitle: (title: string) => void;
  onSavePageInfo: () => void;
  onBack: () => void;
}

export default function PageInfoCard({
  activePage,
  editingPageSlug,
  setEditingPageSlug,
  editPageSlug,
  setEditPageSlug,
  editPageTitle,
  setEditPageTitle,
  onSavePageInfo,
  onBack,
}: PageInfoCardProps) {
  return (
    <>
      {/* Back to Pages */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground transition-all mb-4 -ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Pages
      </Button>

      {/* Page Info Card */}
      <Card className="p-5 mb-6 shadow-sm transition-colors border-border-main bg-bg-main">
        {editingPageSlug ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-text-secondary font-bold ml-1">Page Name</label>
              <Input
                type="text"
                value={editPageTitle}
                onChange={(e) => setEditPageTitle(e.target.value)}
                placeholder="Page Name"
                className="w-full min-w-0 bg-bg-main border-border-main focus:border-text-secondary h-10 transition-all font-semibold text-lg"
                autoFocus
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-text-secondary font-bold ml-1">Page URL</label>
              <div className="flex items-center w-full min-w-0 bg-bg-main rounded-md border border-border-main focus-within:border-text-secondary overflow-hidden flex-1 transition-all h-10">
                <span className="px-3 text-text-secondary text-sm bg-muted/30 border-r border-border-main shrink-0 h-full flex items-center">/</span>
                <Input
                  type="text"
                  value={editPageSlug}
                  onChange={(e) => setEditPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 min-w-0 w-full border-0 shadow-none focus-visible:ring-0 rounded-none h-full bg-transparent text-text-main"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={onSavePageInfo} className="px-6">Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditingPageSlug(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-text-main font-bold text-xl mb-1 flex items-center gap-2">
              {activePage.title}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-text-secondary text-sm font-medium flex-1">/{activePage.slug}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { 
                  setEditPageTitle(activePage.title);
                  setEditPageSlug(activePage.slug); 
                  setEditingPageSlug(true); 
                }}
                className="h-8 w-8 text-text-secondary hover:text-text-main transition-all"
                title="Edit Page"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
