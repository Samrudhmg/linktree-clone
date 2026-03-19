"use client";

import { useState, useRef } from "react";
import { LinkIcon } from "./LinkIcon";
import Image from "next/image";
import {
    LucideLink,
    Twitter,
    Facebook,
    Linkedin,
    MessageCircle,
    MessageSquare,
    Check,
    X
} from "lucide-react";
import { Link } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type ShareLinkData = { url: string; title: string; thumbnail_url?: string; icon?: string; };

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    link: Link | ShareLinkData | null | undefined;
}

export default function ShareModal({ isOpen, onClose, link }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const draggedSinceDown = useRef(false);

    const [activeLink, setActiveLink] = useState(link);
    const [prevLinkProp, setPrevLinkProp] = useState(link);

    if (link !== prevLinkProp) {
        setPrevLinkProp(link);
        if (link) {
            setActiveLink(link);
        }
    }

    if (!activeLink) return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        draggedSinceDown.current = false;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        if (Math.abs(walk) > 5) {
            draggedSinceDown.current = true;
        }
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const url = activeLink.url;
    const title = activeLink.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareOptions = [
        {
            id: "copy",
            name: "Copy link",
            color: "bg-gray-100 dark:bg-gray-700",
            textColor: "text-gray-800 dark:text-white",
            icon: <LucideLink className="w-5 h-5" />,
            action: () => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        },
        {
            id: "x",
            name: "X",
            color: "bg-black",
            textColor: "text-white",
            icon: <Twitter className="w-5 h-5" />,
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
        },
        {
            id: "facebook",
            name: "Facebook",
            color: "bg-[#1877F2]",
            textColor: "text-white",
            icon: <Facebook className="w-5 h-5" />,
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        },
        {
            id: "whatsapp",
            name: "WhatsApp",
            color: "bg-[#25D366]",
            textColor: "text-white",
            icon: <MessageCircle className="w-5 h-5" />,
            action: () => window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank')
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            color: "bg-[#0A66C2]",
            textColor: "text-white",
            icon: <Linkedin className="w-5 h-5" />,
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')
        },
        {
            id: "messenger",
            name: "Messenger",
            color: "bg-gradient-to-tr from-[#00C6FF] to-[#0072FF]",
            textColor: "text-white",
            icon: <MessageSquare className="w-5 h-5" />,
            action: () => window.open(`fb-messenger://share/?link=${encodedUrl}`, '_blank')
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex flex-col sm:max-w-[360px] w-[95vw] p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl gap-0 outline-none [&>button]:hidden">
                {/* Header */}
                <div className="relative flex items-center justify-center w-full px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <DialogTitle className="text-base font-bold text-gray-900 dark:text-white m-0 text-center">
                        Share link
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body - Forced centered */}
                <div className="w-full px-4 py-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">

                    {/* Preview Card */}
                    <div className="relative w-[260px] max-w-[90%] bg-gray-800 rounded-[24px] p-5 flex flex-col items-center text-center shadow-lg mb-8 border border-gray-700/50">
                        <div className="w-16 h-16 mb-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center p-1.5 shadow-sm relative shrink-0">
                            {activeLink.thumbnail_url ? (
                                <Image src={activeLink.thumbnail_url} alt="" fill className="rounded-2xl object-cover p-1.5" />
                            ) : (
                                <>
                                    <LinkIcon
                                        icon={activeLink.icon || "link"}
                                        color={activeLink.icon === "whatsapp" ? "#25D366" : "#4ade80"}
                                        size="w-8 h-8"
                                    />
                                    {activeLink.icon === "whatsapp" && (
                                        <span className="text-[#25D366] font-bold text-[10px] mt-0.5">
                                            WhatsApp
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="w-full flex flex-col items-center">
                            <h3 className="text-white font-semibold text-base leading-snug mb-1 truncate w-full px-2 text-center">
                                {activeLink.title}
                            </h3>
                            <p className="text-white/80 text-[11px] truncate w-full mb-1 px-2 text-center">
                                {activeLink.url.replace(/^https?:\/\//, "")}
                            </p>
                            {activeLink.url.includes("whatsapp.com") && (
                                <p className="text-[#25D366] text-[10px] font-bold uppercase tracking-wider mt-1 text-center">
                                    Group Invite
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Share Row - Slider */}
                    <div
                        ref={scrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className="w-full flex justify-start gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 pt-2 px-1 cursor-grab active:cursor-grabbing select-none"
                    >
                        {shareOptions.map((option) => (
                            <div key={option.id} className="flex flex-col items-center justify-start gap-2 shrink-0 w-[64px]">
                                <button
                                    onClick={(e) => {
                                        if (draggedSinceDown.current) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            return;
                                        }
                                        option.action();
                                    }}
                                    className={`w-[48px] h-[48px] rounded-full flex flex-col items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform shrink-0 outline-none ${option.color} ${option.textColor}`}
                                >
                                    {option.id === "copy" && copied ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        option.icon
                                    )}
                                </button>
                                <span className="text-gray-700 dark:text-gray-300 text-[10px] font-medium text-center w-full whitespace-nowrap overflow-hidden text-ellipsis px-1 select-none pointer-events-none">
                                    {option.id === "copy" && copied ? "Copied!" : option.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>

            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
        </Dialog>
    );
}
