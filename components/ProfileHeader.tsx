"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import {
  Camera,
  Loader2,
  Upload,
  Trash2,
  Pencil,
  Plus,
  Check,
  X
} from "lucide-react";
import { LinkPage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileHeader({ page, updatePage, autoEdit, onEditComplete }: { page: LinkPage | null, updatePage: (data: Partial<LinkPage>) => Promise<{ success?: boolean; error?: unknown }>, autoEdit?: boolean, onEditComplete?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(page?.display_name || "");
  const [bio, setBio] = useState(page?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(page?.avatar_url || "");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Sync state when page changes
  useEffect(() => {
    setDisplayName(page?.display_name || "");
    setBio(page?.bio || "");
    setAvatarUrl(page?.avatar_url || "");
  }, [page?.id, page?.display_name, page?.bio, page?.avatar_url]);

  // Auto-enable edit mode when autoEdit prop is true
  useEffect(() => {
    if (autoEdit) {
      setIsEditing(true);
    }
  }, [autoEdit]);

  const handleSave = async () => {
    const result = await updatePage({ display_name: displayName, bio });
    if (result?.error) {
      alert("Failed to save. Please try again.");
      return;
    }
    setIsEditing(false);
    onEditComplete?.();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(page?.display_name || "");
    setBio(page?.bio || "");
    onEditComplete?.();
  };

  const handleAvatarUrlSave = async () => {
    if (avatarUrlInput.trim()) {
      setAvatarUrl(avatarUrlInput.trim());
      const result = await updatePage({ avatar_url: avatarUrlInput.trim() });
      if (result?.error) {
        alert("Failed to save avatar URL. Please try again.");
      }
    }
    setShowAvatarMenu(false);
    setAvatarUrlInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${page?.id || 'temp'}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("link_images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("link_images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;
      setAvatarUrl(imageUrl);

      const result = await updatePage({ avatar_url: imageUrl });
      if (result?.error) {
        console.error("Failed to save avatar:", result.error);
        alert("Failed to save avatar. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image. Please try again.");
    }

    setUploadingAvatar(false);
    setShowAvatarMenu(false);
  };

  const handleRemoveAvatar = async () => {
    setAvatarUrl("");
    await updatePage({ avatar_url: "" });
    setShowAvatarMenu(false);
  };

  return (
    <Card className="p-4 sm:p-6 mb-6 transition-colors border-0 dark:border-gray-800 shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white text-xl sm:text-2xl shrink-0 overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group ${page?.avatar_shape === "square" ? "rounded-none" :
              page?.avatar_shape === "rounded" ? "rounded-2xl" :
                page?.avatar_shape === "full" ? "w-full aspect-video rounded-none" : "rounded-full"
              }`}
          >
            {avatarUrl || page?.avatar_url ? (
              <Image
                src={avatarUrl || page?.avatar_url || ""}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              page?.display_name?.[0]?.toUpperCase() || "@"
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* Avatar Menu Dropdown */}
          {showAvatarMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 overflow-hidden transition-colors">
              <div className="p-3 space-y-3">
                <p className="text-gray-900 dark:text-white text-sm font-medium">Update Avatar</p>

                {/* Upload Button */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full"
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* URL Input */}
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">Or paste image URL:</p>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-9"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAvatarUrlSave}
                      disabled={!avatarUrlInput.trim()}
                      className="h-9"
                    >
                      Set
                    </Button>
                  </div>
                </div>

                {/* Remove Button */}
                {(avatarUrl || page?.avatar_url) && (
                  <Button
                    variant="destructive"
                    onClick={handleRemoveAvatar}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Avatar
                  </Button>
                )}
              </div>

              {/* Close */}
              <Button
                variant="ghost"
                onClick={() => setShowAvatarMenu(false)}
                className="w-full rounded-none border-t border-border"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full"
              />
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Add a bio"
                rows={2}
                className="w-full resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="shadow-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-foreground font-semibold text-lg transition-colors">
                  {page?.display_name || "Your Name"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              {page?.bio ? (
                <p className="text-muted-foreground text-sm break-words overflow-hidden">{page?.bio}</p>
              ) : (
                <Button
                  variant="link"
                  onClick={() => setIsEditing(true)}
                  className="p-0 h-auto text-primary"
                >
                  + Add bio
                </Button>
              )}
            </>
          )}
        </div>

        {/* Add Social Icons */}
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0 w-8 h-8 rounded-full hidden sm:flex text-muted-foreground"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

