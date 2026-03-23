"use client";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hideLabel?: boolean;
  className?: string;
}

export default function ColorPicker({ value, onChange, label, hideLabel, className = "" }: ColorPickerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && !hideLabel && (
        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-tight">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <label className="relative w-12 h-10 shrink-0 rounded-xl cursor-pointer shadow-sm border border-border-main/50 overflow-hidden group transition-transform active:scale-95">
          <div 
            className="absolute inset-0 z-0 transition-opacity group-hover:opacity-80" 
            style={{ backgroundColor: value }} 
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
            {/* Removed "Pick" text */}
          </div>
        </label>
        <div className="relative flex-1 group">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-bg-main/50 text-text-main px-3 py-2.5 rounded-xl border border-border-main focus:outline-none focus:border-text-secondary transition-all text-sm font-mono tracking-wider "
            placeholder="#FFFFFF"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
             <span className="text-[10px] uppercase font-bold">HEX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
