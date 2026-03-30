"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface FloatingQRProps {
  initialUrl?: string;
  slug: string;
}

export default function FloatingQR({ initialUrl, slug }: FloatingQRProps) {
  const [url, setUrl] = useState(initialUrl || "");

  useEffect(() => {
    if (typeof window !== "undefined" && !url) {
      setUrl(window.location.href);
    }
  }, [url]);

  if (!url) return null;

  return (
    <div className="hidden lg:block fixed bottom-6 right-6 z-50 transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-black/5 flex flex-col items-center group">
        <p className="text-xs font-bold text-center mb-2 text-black/70 group-hover:text-black transition-colors">
          Scan Me
        </p>
        <QRCode value={url} size={84} />
      </div>
    </div>
  );
}
