"use client";

import { useState, useEffect } from "react";
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
export type ShareLinkData = { url: string; title: string; thumbnail_url?: string; icon?: string; };

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    link: Link | ShareLinkData | null | undefined;
}

export default function ShareModal({ isOpen, onClose, link }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen || !link) return null;

    const url = link.url;
    const title = link.title;
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
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="w-full max-w-[360px] mx-auto bg-white dark:bg-gray-800 rounded-3xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto transition-all sm:transform-none transform translate-y-0"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="relative flex items-center justify-center px-5 py-3 border-b border-gray-100 dark:border-gray-700 transition-colors">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Share link</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-3 p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 h-full flex flex-col justify-center transition-colors">
                        {/* Link Preview Card (Dark style from image) */}
                        <div className="bg-gray-700 rounded-[24px] p-5 flex flex-col items-center text-center shadow-md relative overflow-hidden mb-5 max-w-[260px] mx-auto w-full">

                            {/* Box around icon/thumbnail */}
                            <div className="w-16 h-16 mb-3 bg-[#F7F3E8] rounded-2xl flex flex-col items-center justify-center shadow-sm p-1.5 shrink-0 relative">
                                {link.thumbnail_url ? (
                                    <Image src={link.thumbnail_url} alt="" fill className="rounded-xl object-cover p-1.5" />
                                ) : (
                                    <>
                                        <LinkIcon icon={link.icon || "link"} color={link.icon === "whatsapp" ? "#25D366" : "#4ade80"} size="w-8 h-8" />
                                        {link.icon === "whatsapp" && (
                                            <span className="text-[#25D366] font-bold text-[10px] mt-0.5">WhatsApp</span>
                                        )}
                                    </>
                                )}
                            </div>

                            <h3 className="text-white font-extrabold text-base leading-snug mb-1.5 w-full truncate px-2">
                                {link.title}
                            </h3>

                            <p className="text-white/80 text-[11px] truncate w-full mb-3 px-2">
                                {link.url.replace(/^https?:\/\//, '')}
                            </p>

                            {link.url.includes('whatsapp.com') && (
                                <p className="text-white/90 text-[10px] font-semibold tracking-wide uppercase">
                                    Group Invite
                                </p>
                            )}
                        </div>

                        {/* Share Options Row */}
                        <div className="flex overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar justify-start -mx-4 px-4 w-[calc(100%+32px)] gap-4">
                            {shareOptions.map((option) => (
                                <div key={option.id} className="flex flex-col items-center gap-1.5 shrink-0 snap-center w-[56px]">
                                    <button
                                        onClick={option.action}
                                        className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform active:scale-95 ${option.color} ${option.textColor}`}
                                        aria-label={`Share on ${option.name}`}
                                    >
                                        {option.id === "copy" && copied ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <div className="scale-100">
                                                {option.icon}
                                            </div>
                                        )}
                                    </button>
                                    <span className="text-gray-700 dark:text-gray-300 text-[10px] font-medium text-center truncate w-full transition-colors">
                                        {option.id === "copy" && copied ? "Copied!" : option.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
        </>
    );
}
