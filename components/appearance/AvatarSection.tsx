import { AvatarStyle } from "@/lib/types";

interface AvatarSectionProps {
  currentStyle: AvatarStyle;
  onStyleSelect: (style: AvatarStyle) => void;
}

export default function AvatarSection({ currentStyle = 'full', onStyleSelect }: AvatarSectionProps) {
  const options: { label: string; value: AvatarStyle; previewClass: string }[] = [
    { label: 'Full', value: 'full', previewClass: 'w-8 h-6 bg-muted-foreground/20 rounded-none border border-border-main' },
    { label: 'Square', value: 'square', previewClass: 'w-6 h-6 bg-muted-foreground/20 rounded-none border border-border-main' },
    { label: 'Rounded', value: 'rounded', previewClass: 'w-6 h-6 bg-muted-foreground/20 rounded-lg border border-border-main' },
    { label: 'Circle', value: 'circle', previewClass: 'w-6 h-6 bg-muted-foreground/20 rounded-full border border-border-main' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Avatar Shape</label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStyleSelect(opt.value)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              currentStyle === opt.value
                ? 'bg-btn-bg border-text-secondary text-btn-text shadow-main ring-1 ring-text-secondary/20'
                : 'bg-bg-main border-border-main text-text-secondary hover:bg-btn-hover/50 hover:border-text-secondary'
            }`}
          >
            <div className={`shrink-0 overflow-hidden flex items-center justify-center ${opt.previewClass}`}>
              {currentStyle === opt.value && <div className="w-2 h-2 bg-text-secondary rounded-full" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
