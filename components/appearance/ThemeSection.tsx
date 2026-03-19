import { Check, Plus } from "lucide-react";
import { DBTheme } from "@/lib/theme-utils";

interface ThemeSectionProps {
  currentTheme: string | null | undefined;
  themes: DBTheme[];
  onThemeSelect: (theme: DBTheme) => void;
  onAddTheme?: () => void;
}

export default function ThemeSection({ currentTheme, themes, onThemeSelect, onAddTheme }: ThemeSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4 transition-colors shadow-sm">
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Themes</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map((theme: DBTheme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={`group relative aspect-3/4 rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${currentTheme === theme.id ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
              }`}
          >
            <div className="absolute inset-0 flex flex-col" style={{ background: theme.config.background.primary }}>
              <div className="flex-1 p-3 flex flex-col gap-2">
                <div className="w-8 h-8 self-center mb-2" style={{ background: theme.config.background.secondary, borderRadius: theme.config.links.radius === 'rounded-full' ? '9999px' : '0.5rem' }} />
                <div className="h-4 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.25rem', opacity: 0.8 }} />
                <div className="h-4 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.25rem', opacity: 0.8 }} />
                <div className="h-4 w-full" style={{ background: theme.config.button.accent, borderRadius: theme.config.links.radius === 'rounded-full' ? '999px' : '0.25rem', opacity: 0.8 }} />
              </div>
              <div className="p-2 bg-white/10 backdrop-blur-md border-t border-white/10">
                <span className="text-[10px] font-medium text-white truncate block text-center uppercase tracking-wider mix-blend-difference">
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
      
      {onAddTheme && (
        <button
          onClick={onAddTheme}
          className="w-full mt-4 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-center gap-2 group"
        >
          <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            Create Custom Theme
          </span>
        </button>
      )}
    </div>
  );
}
