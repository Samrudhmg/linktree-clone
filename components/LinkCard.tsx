"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Pencil,
  Check,
  ChevronDown,
  Upload,
  X,
  Palette,
  AlertCircle,
  BarChart2
} from "lucide-react";
import { LinkIcon } from "./LinkIcon";
import {
  ICON_OPTIONS,
  FONT_OPTIONS,
  uploadLinkImage
} from "@/lib/themes";
import ColorPicker from "./ui/ColorPicker";
import LinkThumbnail from "./ui/LinkThumbnail";
import { createClient } from "@/lib/supabase-browser";
import { Link } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkCardProps {
  link: Link;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  updateLink: (id: string, data: Partial<Link>) => void;
  deleteLink: (id: string) => void;
}

export default function LinkCard({ link, isEditing, setEditing, updateLink, deleteLink }: LinkCardProps) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [subtext, setSubtext] = useState(link.subtext || "");
  const [icon, setIcon] = useState(link.icon || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(link.thumbnail_url || "");
  const [bgColor, setBgColor] = useState(link.bg_color || "#FFFFFF");
  const [textColor, setTextColor] = useState(link.text_color || "#1F2937");
  const [font, setFont] = useState(link.font || "sans");
  const [showAppearance, setShowAppearance] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isEnabled, setIsEnabled] = useState(link.enabled);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isToggling = useRef(false);
  const supabase = createClient();

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    deleteLink(link.id);
    setShowDeleteConfirm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadLinkImage(supabase, file);
      setThumbnailUrl(publicUrl);
      setIcon("");
    } catch (error: unknown) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateLink(link.id, { title, url, subtext, icon, thumbnail_url: thumbnailUrl, bg_color: bgColor, text_color: textColor, font });
    setEditing(false);
    setShowAppearance(false);
    setShowIconPicker(false);
  };

  const handleToggle = () => {
    if (isToggling.current) return;
    isToggling.current = true;
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    updateLink(link.id, { enabled: newEnabled });
    setTimeout(() => { isToggling.current = false; }, 500);
  };

  return (
    <Card className={`p-3 sm:p-4 group transition-all border border-border-main bg-bg-main shadow-main rounded-radius-main ${!isEnabled ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="mt-2 cursor-grab active:cursor-grabbing text-text-secondary hover:text-text-main transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="h-10 text-sm sm:text-base bg-bg-main border-border-main text-text-main focus:ring-1 focus:ring-text-secondary"
              />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
                className="h-10 text-sm sm:text-base"
              />
              <Input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="Subtext (optional)"
                className="h-10 text-sm sm:text-base"
              />

              <div>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-main transition-all text-sm"
                >
                  <LinkThumbnail
                    thumbnailUrl={thumbnailUrl || undefined}
                    icon={icon || undefined}
                    size="w-5 h-5"
                  />
                  Icon / Image
                  <ChevronDown className={`w-3 h-3 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} />
                </button>

                {showIconPicker && (
                  <div className="mt-2 bg-muted rounded-lg p-3 space-y-3 border border-border-main transition-colors">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5">Upload Custom Icon</label>
                      <div className="flex items-center gap-2">
                        {thumbnailUrl && (
                          <div className="relative">
                            <div className="relative w-10 h-10 shadow-sm">
                              <Image
                                src={thumbnailUrl}
                                alt=""
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl("")}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-10"
                            >
                              <X className="w-2.5 h-2.5 text-white" />
                            </button>
                          </div>
                        )}
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-main border border-border-main border-dashed rounded-xl cursor-pointer hover:border-text-secondary transition-all">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-xs">{isUploading ? "Uploading..." : "Upload image"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5">Or choose a preset icon</label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setIcon(opt.value); if (opt.value) setThumbnailUrl(""); }}
                            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${icon === opt.value && !thumbnailUrl
                              ? "bg-btn-bg border-text-secondary shadow-sm"
                              : "bg-bg-main border-border-main hover:border-text-secondary"
                              }`}
                            title={opt.label}
                          >
                            <LinkIcon icon={opt.value} color={icon === opt.value && !thumbnailUrl ? "#FFFFFF" : "#9CA3AF"} size="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAppearance(!showAppearance)}
                className="flex items-center gap-2 text-text-secondary hover:text-text-main transition-all text-sm"
              >
                <Palette className="w-4 h-4" />
                Appearance
                <ChevronDown className={`w-3 h-3 transition-transform ${showAppearance ? 'rotate-180' : ''}`} />
              </button>

              {showAppearance && (
                <div className="mt-2 bg-muted rounded-lg p-3 space-y-3 border border-border-main transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ColorPicker
                      value={bgColor}
                      onChange={setBgColor}
                      label="Background"
                    />
                    <ColorPicker
                      value={textColor}
                      onChange={setTextColor}
                      label="Text"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Font</label>
                    <div className="flex gap-1.5">
                      {FONT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFont(opt.value)}
                          className={`flex-1 py-1.5 px-2 rounded-xl border text-xs transition-all ${opt.class} ${font === opt.value
                            ? "bg-btn-bg border-text-secondary text-btn-text shadow-sm"
                            : "bg-bg-main border-border-main text-text-main hover:border-text-secondary"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="bg-btn-bg text-btn-text hover:bg-btn-hover shadow-main flex items-center gap-2 rounded-full px-6 transition-all">
                  <Check className="w-4 h-4" /> Save
                </Button>
                <Button onClick={() => { setEditing(false); setShowAppearance(false); }} variant="outline" className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <LinkThumbnail
                  thumbnailUrl={link.thumbnail_url || undefined}
                  icon={link.icon || undefined}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-text-main font-medium text-sm sm:text-base truncate">{link.title}</h3>
                  {link.subtext && <p className="text-text-secondary text-xs truncate">{link.subtext}</p>}
                </div>
                <button onClick={() => setEditing(true)} className="text-text-secondary hover:text-text-main transition-all p-1">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <p className="text-text-secondary text-xs sm:text-sm truncate flex-1 min-w-0">{link.url}</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-btn-bg rounded text-text-secondary group-hover:bg-btn-hover group-hover:text-text-main transition-colors">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{link.click_events?.[0]?.count || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggle}
            className={`relative w-11 sm:w-12 h-6 rounded-full transition-all duration-300 ${isEnabled ? "bg-green-500 shadow-inner" : "bg-muted border border-border-main"}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isEnabled ? "translate-x-5 sm:translate-x-6 scale-110" : "translate-x-0"}`} />
          </button>
          <button onClick={handleDelete} className="text-text-secondary hover:text-red-500 transition-all p-1">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <Card className="p-6 w-full max-w-sm space-y-4 shadow-2xl border-border-main rounded-2xl bg-bg-main">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-text-main font-semibold text-lg">Delete Link</h3>
            </div>
            <p className="text-text-secondary text-sm">
              Are you sure you want to delete <span className="font-medium">&quot;{link.title}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-2">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={confirmDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
