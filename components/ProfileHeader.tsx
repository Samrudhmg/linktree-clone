"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 mb-6 transition-colors">
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
              <img
                src={avatarUrl || page?.avatar_url || undefined}
                alt="Avatar"
                className="w-full h-full object-cover"
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
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* URL Input */}
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs">Or paste image URL:</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1.5 rounded text-sm border border-gray-200 dark:border-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleAvatarUrlSave}
                      disabled={!avatarUrlInput.trim()}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-700 dark:text-white rounded text-sm transition-colors border border-gray-200 dark:border-gray-500"
                    >
                      Set
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                {(avatarUrl || page?.avatar_url) && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="w-full py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Avatar
                  </button>
                )}
              </div>

              {/* Close */}
              <button
                onClick={() => setShowAvatarMenu(false)}
                className="w-full py-2 bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 text-sm transition-colors border-t border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Add a bio"
                rows={2}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 resize-none transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg transition-colors">
                  {page?.display_name || "Your Name"}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-white transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              {page?.bio ? (
                <p className="text-gray-400 text-sm break-words overflow-hidden">{page.bio}</p>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-purple-400 text-sm hover:text-purple-300 transition-all"
                >
                  + Add bio
                </button>
              )}
            </>
          )}
        </div>

        {/* Add Social Icons */}
        <button className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hidden sm:flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

