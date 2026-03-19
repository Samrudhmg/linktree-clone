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
    <Card className={`p-3 sm:p-4 group transition-all border-0 dark:border-gray-800 shadow-sm ${!isEnabled ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="mt-2 cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors">
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
                className="h-10 text-sm sm:text-base"
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
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all text-sm"
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
                  <div className="mt-2 bg-gray-50 dark:bg-gray-750 rounded-lg p-3 space-y-3 border border-gray-200 dark:border-gray-700 transition-colors">
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
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-all">
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
                            className={`p-2 rounded-lg border transition-all flex items-center justify-center ${icon === opt.value && !thumbnailUrl
                              ? "bg-purple-600 border-purple-500 shadow-sm"
                              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
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
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all text-sm"
              >
                <Palette className="w-4 h-4" />
                Appearance
                <ChevronDown className={`w-3 h-3 transition-transform ${showAppearance ? 'rotate-180' : ''}`} />
              </button>

              {showAppearance && (
                <div className="mt-2 bg-gray-50 dark:bg-gray-750 rounded-lg p-3 space-y-3 border border-gray-200 dark:border-gray-700 transition-colors">
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
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-xs transition-all ${opt.class} ${font === opt.value
                            ? "bg-purple-600 border-purple-500 text-white shadow-sm"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
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
                <Button onClick={handleSave} className="bg-purple-600 text-white hover:bg-purple-700 shadow-sm flex items-center gap-2">
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
                  <h3 className="text-gray-900 dark:text-white font-medium text-sm sm:text-base truncate">{link.title}</h3>
                  {link.subtext && <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{link.subtext}</p>}
                </div>
                <button onClick={() => setEditing(true)} className="text-gray-500 hover:text-purple-500 transition-all p-1">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <p className="text-gray-500 text-xs sm:text-sm truncate flex-1 min-w-0">{link.url}</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
            className={`relative w-11 sm:w-12 h-6 rounded-full transition-all duration-300 ${isEnabled ? "bg-green-500 shadow-inner" : "bg-gray-200 dark:bg-gray-600"}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isEnabled ? "translate-x-5 sm:translate-x-6 scale-110" : "translate-x-0"}`} />
          </button>
          <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition-all p-1">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <Card className="p-6 w-full max-w-sm space-y-4 shadow-2xl border-gray-200 dark:border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Delete Link</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
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
