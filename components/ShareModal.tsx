"use client";

import { useState, useEffect } from "react";
import { LinkIcon } from "./LinkForm";

export default function ShareModal({ isOpen, onClose, link }) {
    const [copied, setCopied] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
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
            color: "bg-gray-100",
            textColor: "text-gray-800",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
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
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z" />
                </svg>
            ),
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
        },
        {
            id: "facebook",
            name: "Facebook",
            color: "bg-[#1877F2]",
            textColor: "text-white",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        },
        {
            id: "whatsapp",
            name: "WhatsApp",
            color: "bg-[#25D366]",
            textColor: "text-white",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
            ),
            action: () => window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank')
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            color: "bg-[#0A66C2]",
            textColor: "text-white",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')
        },
        {
            id: "messenger",
            name: "Messenger",
            color: "bg-gradient-to-tr from-[#00C6FF] to-[#0072FF]",
            textColor: "text-white",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.25 5.56 3.28 7.45.16.14.28.34.32.55l.48 2.6c.09.48.56.76 1.01.62l2.76-.85c.22-.07.47-.07.69 0a10.68 10.68 0 0 0 3.8.56c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1 12.87-2.61-2.9-5.14 2.9 5.6-6.3 2.68 2.87L18.6 8.6l-5.6 6.27z" />
                </svg>
            ),
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
            <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <div
                    className="w-full max-w-[360px] mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto transition-transform sm:transform-none transform translate-y-0"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="relative flex items-center justify-center px-5 py-3 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Share link</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 h-full flex flex-col justify-center">
                        {/* Link Preview Card (Dark style from image) */}
                        <div className="bg-[#3A332C] rounded-[24px] p-5 flex flex-col items-center text-center shadow-md relative overflow-hidden mb-5 max-w-[260px] mx-auto w-full">

                            {/* Box around icon/thumbnail */}
                            <div className="w-16 h-16 mb-3 bg-[#F7F3E8] rounded-2xl flex flex-col items-center justify-center shadow-sm p-1.5 shrink-0">
                                {link.thumbnail_url ? (
                                    <img src={link.thumbnail_url} alt="" className="w-full h-full rounded-xl object-cover" />
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
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <div className="scale-100">
                                                {option.icon}
                                            </div>
                                        )}
                                    </button>
                                    <span className="text-gray-700 text-[10px] font-medium text-center truncate w-full">
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
