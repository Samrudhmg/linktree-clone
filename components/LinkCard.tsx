"use client";

import { useState, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Pencil,
  Check,
  X,
  AlertCircle,
  BarChart2,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { Link } from "@/lib/types";
import { ICON_OPTIONS, uploadLinkImage } from "@/lib/themes";
import LinkThumbnail from "./ui/LinkThumbnail";
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
      setIcon(""); // Clear preset icon when custom image is uploaded
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };


  const handleSave = () => {
    updateLink(link.id, { 
      title, 
      url, 
      subtext,
      icon,
      thumbnail_url: thumbnailUrl
    });
    setEditing(false);
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
                className="h-10 text-sm sm:text-base bg-bg-main border-border-main text-text-main focus:ring-1 focus:ring-text-secondary"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest pl-1">Preset Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => {
                      setIcon(e.target.value);
                      if (e.target.value) setThumbnailUrl(""); // Clear thumbnail if icon is selected
                    }}
                    className="w-full bg-bg-main text-text-main px-3 h-10 text-sm rounded-xl border border-border-main focus:outline-none focus:border-text-secondary transition-colors"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest pl-1">Thumbnail</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center h-10 border border-border-main border-dashed rounded-xl cursor-pointer bg-bg-main hover:bg-btn-hover hover:border-text-secondary transition-colors overflow-hidden">
                      <div className="flex items-center gap-2 px-3">
                        {isUploading ? (
                          <Loader2 className="animate-spin h-3.5 w-3.5 text-text-secondary" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-text-secondary" />
                        )}
                        <span className="text-xs text-text-secondary font-medium">
                          {isUploading ? "Uploading..." : "Upload"}
                        </span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </label>

                    {(thumbnailUrl || icon) && (
                      <div className="w-10 h-10 relative flex items-center justify-center bg-muted rounded-xl border border-border-main overflow-hidden shrink-0">
                        {thumbnailUrl ? (
                          <>
                            <Image src={thumbnailUrl} alt="" fill className="object-cover" />
                            <button 
                              onClick={() => setThumbnailUrl("")}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg z-10 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-text-secondary">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="bg-btn-bg text-btn-text hover:bg-btn-hover shadow-main flex items-center gap-2 rounded-full px-6 transition-all">
                  <Check className="w-4 h-4" /> Save
                </Button>
                <Button onClick={() => setEditing(false)} variant="outline" className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <LinkThumbnail
                    thumbnailUrl={link.thumbnail_url || undefined}
                    icon={link.icon || undefined}
                    size="w-10 h-10"
                  />
                </div>
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
