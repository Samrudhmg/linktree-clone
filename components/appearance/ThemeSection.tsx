import { Check } from "lucide-react";
import { THEMES } from "@/lib/themes";

import { Theme } from "@/lib/types";

interface ThemeSectionProps {
  currentTheme: string | null | undefined;
  onThemeSelect: (theme: Theme) => void;
}

export default function ThemeSection({ currentTheme, onThemeSelect }: ThemeSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4 transition-colors shadow-sm">
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Themes</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {THEMES.map((theme: Theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={`group relative aspect-3/4 rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${currentTheme === theme.id ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
              }`}
          >
            <div className="absolute inset-0 flex flex-col" style={{ background: theme.preview_bg }}>
              <div className="flex-1 p-3 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 self-center mb-2" />
                <div className="h-4 rounded-lg" style={{ background: theme.preview_button, opacity: 0.8 }} />
                <div className="h-4 rounded-lg" style={{ background: theme.preview_button, opacity: 0.8 }} />
                <div className="h-4 rounded-lg" style={{ background: theme.preview_button, opacity: 0.8 }} />
              </div>
              <div className="p-2 bg-white/10 backdrop-blur-md border-t border-white/10">
                <span className="text-[10px] font-medium text-white truncate block text-center uppercase tracking-wider">
                  {theme.name}
                </span>
              </div>
            </div>
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-3 h-3 text-white stroke-3" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
