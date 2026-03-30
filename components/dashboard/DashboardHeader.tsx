"use client";

import { Menu, Eye, ExternalLink, QrCode } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  showCreatePage: boolean;
  activePage: LinkPage | null;
  onShowSidebar: () => void;
  onShowPreview: () => void;
  onShowQR: () => void;
}

export default function DashboardHeader({
  showCreatePage,
  activePage,
  onShowSidebar,
  onShowPreview,
  onShowQR,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground h-10 w-10 shrink-0"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {showCreatePage ? "Create New Page" : activePage ? activePage.title : "My Pages"}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {activePage && (
          <>
            {/* Mobile Preview Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowPreview}
              className="lg:hidden text-muted-foreground hover:text-foreground h-10 w-10 shrink-0"
            >
              <Eye className="w-6 h-6" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:flex rounded-full text-muted-foreground hover:text-foreground bg-background shrink-0"
            >
              <a href={`/${activePage.slug}`} target="_blank">
                <span className="truncate max-w-[180px] sm:max-w-none">/{activePage.slug}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            
            <Button
              onClick={onShowQR}
              variant="outline"
              size="sm"
              className="flex rounded-full text-muted-foreground hover:text-foreground bg-background shrink-0 gap-1.5 px-3"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR</span>
            </Button>
            
            <div className="flex items-center gap-1">
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
