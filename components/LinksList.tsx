// @ts-nocheck
// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import { LinkIcon } from "./LinkForm";
import { createClient } from "@/lib/supabase-browser";

export default function LinksList({ links, updateLink, deleteLink }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-3">
      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p>No links yet. Click &quot;Create New Link&quot; to add your first link!</p>
        </div>
      ) : (
        links.map((link) => (
          <LinkCard
            key={`${link.id}-${link.enabled}`}
            link={link}
            isEditing={editingId === link.id}
            setEditing={(editing) => setEditingId(editing ? link.id : null)}
            updateLink={updateLink}
            deleteLink={deleteLink}
          />
        ))
      )}
    </div>
  );
}

const FONT_OPTIONS = [
  { value: "sans", label: "Sans", class: "font-sans" },
  { value: "serif", label: "Serif", class: "font-serif" },
  { value: "mono", label: "Mono", class: "font-mono" },
];

const ICON_OPTIONS = [
  { value: "", label: "No Icon" },
  { value: "link", label: "Link" },
  { value: "globe", label: "Globe" },
  { value: "mail", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "spotify", label: "Spotify" },
  { value: "discord", label: "Discord" },
  { value: "twitch", label: "Twitch" },
  { value: "shopping", label: "Shopping" },
  { value: "document", label: "Document" },
  { value: "calendar", label: "Calendar" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "music", label: "Music" },
];

function LinkCard({ link, isEditing, setEditing, updateLink, deleteLink }) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [icon, setIcon] = useState(link.icon || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(link.thumbnail_url || "");
  const [bgColor, setBgColor] = useState(link.bg_color || "#FFFFFF");
  const [textColor, setTextColor] = useState(link.text_color || "#1F2937");
  const [font, setFont] = useState(link.font || "sans");
  const [showAppearance, setShowAppearance] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isEnabled, setIsEnabled] = useState(link.enabled);
  const [isUploading, setIsUploading] = useState(false);
  const isToggling = useRef(false);
  const supabase = createClient();

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be less than 5MB"); return; }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from("link_images").upload(fileName, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from("link_images").getPublicUrl(fileName);
      setThumbnailUrl(publicUrlData.publicUrl);
      setIcon(""); // clear preset icon when custom image is uploaded
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateLink(link.id, { title, url, icon, thumbnail_url: thumbnailUrl, bg_color: bgColor, text_color: textColor, font });
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

    // Reset after a short delay
    setTimeout(() => {
      isToggling.current = false;
    }, 500);
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-3 sm:p-4 group transition-all ${!isEnabled ? 'opacity-60' : ''}`}>
      {/* Drag Handle & Content */}
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Drag Handle */}
        <div className="mt-2 cursor-grab text-gray-600 hover:text-gray-400 hidden sm:block">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />

              {/* Icon Section */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all text-sm"
                >
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="" className="w-5 h-5 rounded object-cover" />
                  ) : icon ? (
                    <LinkIcon icon={icon} color="#9CA3AF" size="w-5 h-5" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  Icon / Image
                  <svg className={`w-3 h-3 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showIconPicker && (
                  <div className="mt-2 bg-gray-750 rounded-lg p-3 space-y-3 border border-gray-700">
                    {/* Custom Image Upload */}
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5">Upload Custom Icon</label>
                      <div className="flex items-center gap-2">
                        {thumbnailUrl && (
                          <div className="relative">
                            <img src={thumbnailUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl("")}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 border border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-all">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-gray-400 text-xs">{isUploading ? "Uploading..." : "Upload image"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      </div>
                    </div>

                    {/* Preset Icons */}
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5">Or choose a preset icon</label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setIcon(opt.value); if (opt.value) setThumbnailUrl(""); }}
                            className={`p-2 rounded-lg border transition-all flex items-center justify-center ${icon === opt.value && !thumbnailUrl
                                ? "bg-purple-600 border-purple-500"
                                : "bg-gray-700 border-gray-600 hover:border-gray-500"
                              }`}
                            title={opt.label}
                          >
                            {opt.value ? (
                              <LinkIcon icon={opt.value} color={icon === opt.value && !thumbnailUrl ? "#FFFFFF" : "#9CA3AF"} size="w-4 h-4" />
                            ) : (
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Appearance Toggle */}
              <button
                type="button"
                onClick={() => setShowAppearance(!showAppearance)}
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Appearance
                <svg className={`w-3 h-3 transition-transform ${showAppearance ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Appearance Controls */}
              {showAppearance && (
                <div className="bg-gray-750 rounded-lg p-3 space-y-3 border border-gray-700">
                  {/* Background Color */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-xs"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-xs"
                        placeholder="#1F2937"
                      />
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Font</label>
                    <div className="flex gap-1.5">
                      {FONT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFont(opt.value)}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-xs transition-all ${opt.class} ${font === opt.value
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mini Preview */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Preview</label>
                    <div
                      className={`py-2 px-3 rounded-lg text-sm ${FONT_OPTIONS.find(f => f.value === font)?.class || 'font-sans'}`}
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {title || "Link Preview"}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setShowAppearance(false); }}
                  className="px-3 sm:px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                {/* Link Icon / Thumbnail */}
                {link.thumbnail_url ? (
                  <img
                    src={link.thumbnail_url}
                    alt=""
                    className="w-6 h-6 rounded object-cover shrink-0"
                  />
                ) : link.icon ? (
                  <div className="shrink-0">
                    <LinkIcon icon={link.icon} color="#9CA3AF" size="w-5 h-5" />
                  </div>
                ) : null}
                <h3 className="text-white font-medium text-sm sm:text-base truncate">{link.title}</h3>
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-500 hover:text-white transition-all flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm truncate">{link.url}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors duration-200 ${isEnabled ? "bg-green-500" : "bg-gray-600"
              }`}
            aria-label={isEnabled ? "Disable link" : "Enable link"}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isEnabled ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
                }`}
            />
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteLink(link.id)}
            className="text-gray-500 hover:text-red-500 transition-all sm:opacity-0 sm:group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

