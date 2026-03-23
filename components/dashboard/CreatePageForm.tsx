"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <Card className="p-6 space-y-4 shadow-main transition-colors border border-border-main bg-bg-main rounded-radius-main">
      <h3 className="text-text-main font-semibold text-lg flex items-center gap-2">
        <Plus className="w-5 h-5 text-text-secondary" />
        New Link Page
      </h3>
      <p className="text-text-secondary text-sm">Create a new page with its own set of links and appearance.</p>

      <div className="space-y-2">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium">Page Title *</label>
        <Input
          type="text"
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="My Social Links"
          className="h-12 bg-bg-main border-border-main text-text-main rounded-xl focus:ring-1 focus:ring-text-secondary"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium">Page URL *</label>
        <div className="flex items-center bg-bg-main rounded-xl border border-border-main focus-within:ring-1 focus-within:ring-text-secondary overflow-hidden transition-colors">
          <span className="px-3 text-text-secondary text-sm whitespace-nowrap border-r border-border-main bg-muted h-[46px] flex items-center">/</span>
          <Input
            type="text"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-social-links"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 rounded-none h-[46px] bg-bg-main text-text-main"
            onKeyDown={(e) => e.key === "Enter" && onCreatePage()}
          />
        </div>
        <p className="text-muted-foreground text-xs">This will be your page&apos;s URL. Use lowercase letters, numbers, and hyphens.</p>
      </div>

      {newPageSlug.trim() && (
        <div className="bg-muted rounded-xl p-3 transition-colors border border-border-main">
          <p className="text-text-secondary text-xs mb-1">Your page will be hosted at:</p>
          <p className="text-green-500 text-sm font-mono">
            {typeof window !== "undefined" ? window.location.origin : ""}/{normalizedSlug}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="flex-1 h-12 rounded-full"
        >
          Cancel
        </Button>
        <Button
          onClick={onCreatePage}
          disabled={!newPageTitle.trim() || !newPageSlug.trim()}
          className="flex-1 h-12 rounded-full bg-btn-bg hover:bg-btn-hover text-btn-text shadow-main font-bold border border-border-main"
        >
          Create Page
        </Button>
      </div>
    </Card>
  );
}
