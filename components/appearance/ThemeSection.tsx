import { Check, Plus, Edit2, CheckCircle2, Smartphone } from "lucide-react";
import { DBTheme } from "@/lib/theme-utils";
import { Button } from "@/components/ui/button";

interface ThemeSectionProps {
  currentThemeId: string | null | undefined;
  themes: DBTheme[];
  onThemeSelect: (theme: DBTheme) => void;
  onEditTheme: (theme: DBTheme) => void;
  onAddTheme?: () => void;
}

export default function ThemeSection({ currentThemeId, themes, onThemeSelect, onEditTheme, onAddTheme }: ThemeSectionProps) {
  return (
    <div className="bg-bg-main border border-border-main rounded-2xl p-6 space-y-4 transition-colors shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-text-main font-semibold text-lg">Themes</h3>
        <span className="text-xs text-text-secondary font-normal">Select or edit page styles</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme: DBTheme) => (
          <div
            key={theme.id}
            className={`group relative aspect-3/4 rounded-radius-main overflow-hidden transition-all hover:shadow-md border-2 ${currentThemeId === theme.id
              ? 'border-text-main shadow-main shadow-text-main/10'
              : 'border-border-main hover:border-text-secondary'
              }`}
          >
            {/* Theme Visual Preview */}
            <div className="absolute -inset-[2px] flex flex-col pointer-events-none" style={{ background: theme.config.background.primary }}>
              <div className="flex-1 p-2 flex flex-col gap-1.5 opacity-80">
                <div className="w-6 h-6 self-center mb-1" style={{ background: theme.config.background.secondary, borderRadius: theme.config.links.radius === 'rounded-full' ? '9999px' : '0.4rem' }} />
                <div className="h-3 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.2rem' }} />
                <div className="h-3 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.2rem' }} />
                <div className="h-3 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.2rem' }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/10 backdrop-blur-[2px] border-t border-white/5">
                <span className="text-[9px] font-bold text-white truncate block text-center uppercase tracking-widest leading-none drop-shadow-sm">
                  {theme.name}
                </span>
              </div>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-2">
              <Button
                size="sm"
                variant={currentThemeId === theme.id ? "secondary" : "default"}
                className={`w-full text-[10px] h-8 gap-1.5 font-bold uppercase tracking-tighter shadow-xl ${currentThemeId === theme.id ? 'bg-white text-black' : 'bg-btn-bg hover:bg-btn-hover text-btn-text'}`}
                onClick={() => onThemeSelect(theme)}
              >
                {currentThemeId === theme.id ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3 h-3 text-white" />
                    Apply
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="w-full text-[10px] h-8 gap-1.5 font-bold uppercase tracking-tighter bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={() => onEditTheme(theme)}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
            </div>

            {/* Selection indicator (non-hover) */}
            {currentThemeId === theme.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-btn-bg border border-border-main rounded-full flex items-center justify-center shadow-main pointer-events-none group-hover:opacity-0 transition-opacity">
                <Check className="w-2.5 h-2.5 text-text-main stroke-3" />
              </div>
            )}
          </div>
        ))}

        {onAddTheme && (
          <button
            onClick={onAddTheme}
            className="aspect-3/4 rounded-radius-main border-2 border-dashed border-border-main hover:border-text-secondary hover:bg-btn-hover/30 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-btn-bg flex items-center justify-center shadow-sm group-hover:bg-btn-hover transition-colors">
              <Plus className="w-5 h-5 text-text-secondary group-hover:text-text-main transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-text-secondary group-hover:text-text-main uppercase tracking-widest">New</span>
          </button>
        )}
      </div>
    </div>
  );
}
