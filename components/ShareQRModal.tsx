"use client";

import QRCode from "react-qr-code";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareQRModalProps {
  url: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareQRModal({ url, isOpen, onOpenChange }: ShareQRModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-11/12 rounded-3xl flex flex-col items-center p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4 text-center">Share your page</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-4 rounded-xl mb-6 shadow-sm inline-block">
          <QRCode value={url} size={180} />
        </div>

        <Button
          onClick={handleCopy}
          className="w-full rounded-full py-6 font-semibold flex items-center justify-center gap-2"
        >
          <Copy className="h-5 w-5" />
          Copy Link
        </Button>
      </DialogContent>
    </Dialog>
  );
}
