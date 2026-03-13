"use client";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function ColorPicker({ value, onChange, label, className = "" }: ColorPickerProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-gray-400 text-xs">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-x-[-10px] inset-y-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 text-xs transition-colors"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}
