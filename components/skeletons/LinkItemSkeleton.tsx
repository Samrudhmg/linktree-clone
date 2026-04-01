"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";

export default function LinkItemSkeleton() {
  return (
    <div className="w-full bg-muted/30 border border-border-main/50 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="shrink-0 opacity-20">
          <GripVertical className="w-5 h-5 text-text-secondary" />
        </div>

        {/* Thumbnail/Icon placeholder */}
        <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
        
        {/* Title and URL placeholders */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-muted rounded-md" />
          <div className="h-3 w-40 bg-muted/60 rounded-md" />
        </div>
        
        {/* Action buttons placeholder */}
        <div className="flex items-center gap-2 shrink-0 opacity-40">
           <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
             <Pencil className="w-3.5 h-3.5 text-text-secondary" />
           </div>
           <div className="w-10 h-6 rounded-full bg-muted" />
           <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
             <Trash2 className="w-3.5 h-3.5 text-text-secondary" />
           </div>
        </div>
      </div>
    </div>
  );
}
