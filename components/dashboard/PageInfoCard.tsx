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
      <Card className="p-4 mb-6 shadow-sm transition-colors border-gray-200 dark:border-gray-800">
        <h2 className="text-foreground font-semibold text-lg mb-2">{activePage.title}</h2>
        <div className="flex items-center gap-2">
          {editingPageSlug ? (
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-background rounded-md border border-input focus-within:ring-1 focus-within:ring-ring overflow-hidden flex-1 transition-colors">
                <span className="px-3 py-2 text-muted-foreground text-sm bg-muted/50 border-r h-9 flex items-center">/</span>
                <Input
                  type="text"
                  value={editPageSlug}
                  onChange={(e) => setEditPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 rounded-none h-9"
                  autoFocus
                />
              </div>
              <Button size="sm" onClick={onSavePageSlug}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditingPageSlug(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm flex-1">/{activePage.slug}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setEditPageSlug(activePage.slug); setEditingPageSlug(true); }}
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-all"
                title="Edit URL"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
