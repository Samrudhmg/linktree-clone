"use client";

import LinkItemSkeleton from "./LinkItemSkeleton";
import { Plus, Pencil, Palette } from "lucide-react";

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full bg-bg-main animate-pulse overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-64 border-r border-border-main bg-muted/20 p-6 space-y-8">
        <div className="h-8 w-32 bg-muted rounded-md mb-4" /> {/* Brand Placeholder */}

        {/* Profile Section */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border-main/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
          <Pencil className="w-3.5 h-3.5 text-text-secondary opacity-30" />
        </div>

        {/* My Pages Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="h-3 w-20 bg-muted/40 rounded uppercase tracking-widest" />
            <Plus className="w-4 h-4 text-text-secondary opacity-30" />
          </div>
          <div className="space-y-2">
            <div className="h-11 w-full bg-muted/50 rounded-xl border border-border-main/50" />
            <div className="h-11 w-full bg-muted/20 rounded-xl px-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-muted/40 rounded" />
              <div className="h-3 w-12 bg-muted/40 rounded" />
            </div>
          </div>
        </div>

        {/* Page Editor Section */}
        <div className="space-y-4 pt-4 border-t border-border-main/20">
          <div className="h-3 w-24 bg-muted/40 rounded uppercase tracking-widest px-2" />
          <div className="h-11 w-full bg-muted/50 rounded-xl border border-border-main/50" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Placeholder */}
        <header className="h-16 border-b border-border-main/50 flex items-center justify-between px-8 bg-muted/10 shrink-0">
          <div className="h-6 w-32 bg-muted rounded-md" />
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-muted rounded-full" />
            <div className="h-9 w-9 bg-muted rounded-full" />
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-2xl mx-auto w-full">
          {/* Back link placeholder */}
          <div className="h-4 w-24 bg-muted/30 rounded" />

          {/* Page Info Card */}
          <div className="bg-muted/30 border border-border-main/50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-3 w-full">
                <div className="h-6 w-40 bg-muted rounded-md" />
                <div className="h-4 w-16 bg-muted/60 rounded" />
              </div>
              <Pencil className="w-4 h-4 text-text-secondary opacity-20" />
            </div>
          </div>

          {/* Profile Header Card */}
          <div className="bg-muted/30 border border-border-main/50 rounded-2xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-muted shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-5 w-32 bg-muted rounded-md" />
                <Pencil className="w-4 h-4 text-text-secondary opacity-20" />
              </div>
              <div className="h-4 w-3/4 bg-muted/60 rounded" />
            </div>
          </div>

          {/* Collapsible Placeholder */}
          <div className="h-14 w-full bg-muted/20 border border-border-main/30 rounded-2xl flex items-center justify-between px-6 opacity-60">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-text-secondary opacity-30" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="w-4 h-4 bg-muted rounded" />
          </div>

          {/* Create New Link Button */}
          <div className="h-14 w-full bg-muted rounded-full" />

          {/* Links List Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="h-4 w-24 bg-muted/40 rounded" />
              <div className="h-4 w-16 bg-muted/40 rounded" />
            </div>
            {[...Array(3)].map((_, i) => (
              <LinkItemSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
