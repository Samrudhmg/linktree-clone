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
    <Card className="p-6 space-y-4 shadow-sm transition-colors border-0 dark:border-gray-800">
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
        <Plus className="w-5 h-5 text-purple-400" />
        New Link Page
      </h3>
      <p className="text-gray-400 text-sm">Create a new page with its own set of links and appearance.</p>

      <div className="space-y-2">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium">Page Title *</label>
        <Input
          type="text"
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="My Social Links"
          className="h-12"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium">Page URL *</label>
        <div className="flex items-center bg-background rounded-md border border-input focus-within:ring-1 focus-within:ring-ring overflow-hidden transition-colors">
          <span className="px-3 text-muted-foreground text-sm whitespace-nowrap border-r bg-muted/50 h-[46px] flex items-center">/</span>
          <Input
            type="text"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-social-links"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 rounded-none h-[46px]"
            onKeyDown={(e) => e.key === "Enter" && onCreatePage()}
          />
        </div>
        <p className="text-muted-foreground text-xs">This will be your page&apos;s URL. Use lowercase letters, numbers, and hyphens.</p>
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
          className="flex-1 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Create Page
        </Button>
      </div>
    </Card>
  );
}
