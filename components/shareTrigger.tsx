"use client";

import { useState } from "react";
import ShareModal, { ShareLinkData } from "@/components/ShareModal";
import { ShareIcon } from "lucide-react";

interface ShareTriggerProps {
  link: ShareLinkData;
}

export default function ShareTrigger({ link }: ShareTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white/20 cursor-pointer backdrop-blur-md text-white px-3 py-2 rounded-full text-sm hover:bg-white/30 transition"
      >
        <ShareIcon size={17} />
      </button>

      <ShareModal
        isOpen={open}
        onClose={() => setOpen(false)}
        link={link}
      />
    </>
  );
}