"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  id?: string;
};

export default function CustomSelect({ label, value, options, onChange, id }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4" ref={ref}>
      <label
        className="text-sm font-medium text-text-secondary whitespace-nowrap"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative w-40" id={id}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-btn-bg border border-border-main text-sm text-text-main hover:bg-btn-hover transition-colors"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>{selectedLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 w-full rounded-lg border border-border-main bg-bg-main shadow-main overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  opt.value === value
                    ? "bg-btn-hover text-text-main font-semibold"
                    : "text-text-secondary hover:bg-btn-bg"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
