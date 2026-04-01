"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomSelect from "@/components/ui/CustomSelect";

// ─── Types ──────────────────────────────────────────────────────────────────

type DotsType = "square" | "dots" | "rounded" | "classy";
type EyeType = "square" | "dot" | "extra-rounded";

const PATTERN_OPTIONS: { label: string; value: DotsType }[] = [
  { label: "Square", value: "square" },
  { label: "Dots", value: "dots" },
  { label: "Rounded", value: "rounded" },
  { label: "Classy", value: "classy" },
];

const EYE_OPTIONS: { label: string; value: EyeType }[] = [
  { label: "Square", value: "square" },
  { label: "Circle", value: "dot" },
  { label: "Rounded", value: "extra-rounded" },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface ShareQRModalProps {
  url: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ShareQRModal({ url, isOpen, onOpenChange }: ShareQRModalProps) {
  const [pattern, setPattern] = useState<DotsType>("square");
  const [eyeStyle, setEyeStyle] = useState<EyeType>("square");

  const qrRef = useRef<HTMLDivElement | null>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  const userPageUrl = url || (typeof window !== "undefined" ? window.location.origin : "");

  // ── Initialize QR once on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Give the DOM a tick to render the ref container
    const timer = setTimeout(() => {
      if (!qrRef.current) return;

      // Clear any previous content to prevent duplicate nodes
      qrRef.current.replaceChildren();

      qrInstance.current = new QRCodeStyling({
        width: 260,
        height: 260,
        data: userPageUrl,
        dotsOptions: { type: pattern },
        cornersSquareOptions: { type: eyeStyle },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { crossOrigin: "anonymous" },
      });

      qrInstance.current.append(qrRef.current);
    }, 0);

    return () => {
      clearTimeout(timer);
      // Clean up DOM on modal close
      qrRef.current?.replaceChildren();
      qrInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Update QR dynamically when options or URL change ─────────────────────
  useEffect(() => {
    if (!qrInstance.current) return;

    qrInstance.current.update({
      data: userPageUrl,
      dotsOptions: { type: pattern },
      cornersSquareOptions: { type: eyeStyle },
    });
  }, [pattern, eyeStyle, userPageUrl]);

  // ── Download handler ─────────────────────────────────────────────────────
  const handleDownload = (format: "png" | "svg") => {
    if (!qrInstance.current) return;
    qrInstance.current.download({ name: "qr-code", extension: format });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-11/12 rounded-3xl flex flex-col items-center p-6 sm:p-8 gap-0">
        <DialogHeader className="w-full mb-5">
          <DialogTitle className="text-xl font-semibold text-center">
            Share your page
          </DialogTitle>
        </DialogHeader>

        {/* QR Preview */}
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-sm border border-black/5 inline-flex items-center justify-center">
          <div ref={qrRef} />
        </div>

        {/* Style Controls */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <CustomSelect
            id="qr-pattern-select"
            label="Pattern Style"
            value={pattern}
            options={PATTERN_OPTIONS}
            onChange={(v) => setPattern(v as DotsType)}
          />
          <CustomSelect
            id="qr-eye-select"
            label="Eye Style"
            value={eyeStyle}
            options={EYE_OPTIONS}
            onChange={(v) => setEyeStyle(v as EyeType)}
          />
        </div>

        {/* Download Buttons */}
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            id="qr-download-png"
            onClick={() => handleDownload("png")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-btn-bg hover:bg-btn-hover border border-border-main text-text-main text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            id="qr-download-svg"
            onClick={() => handleDownload("svg")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-btn-bg hover:bg-btn-hover border border-border-main text-text-main text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
