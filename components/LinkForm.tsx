import { useState } from "react";
import {
  X,
  Palette,
  Eye,
  Upload,
  Loader2,
  Link as LucideLink
} from "lucide-react";
import {
  ICON_OPTIONS,
  FONT_OPTIONS,
  getFontClass,
  getPageBackgroundStyle,
  uploadLinkImage
} from "@/lib/themes";
import ColorPicker from "./ui/ColorPicker";
import LinkThumbnail from "./ui/LinkThumbnail";
import { createClient } from "@/lib/supabase-browser";
import { Link } from "@/lib/types";

interface LinkFormProps {
  onSubmit: (data: Partial<Link>) => void;
  onCancel: () => void;
}

export default function LinkForm({ onSubmit, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtext, setSubtext] = useState("");
  const [icon, setIcon] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bgType, setBgType] = useState("color"); // 'color' or 'image'
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [bgImage, setBgImage] = useState("");
  const [textColor, setTextColor] = useState("#1F2937");
  const [font, setFont] = useState("sans");
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadLinkImage(supabase, file);
      setThumbnailUrl(publicUrl);
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("Please fill in title and URL");
      return;
    }

    onSubmit({
      title: title.trim(),
      url: url.trim(),
      subtext: subtext.trim(),
      icon,
      thumbnail_url: thumbnailUrl,
      bg_type: bgType,
      bg_color: bgColor,
      bg_image: bgImage,
      text_color: textColor,
      font,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 transition-colors">
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
          <LucideLink className="w-5 h-5 text-purple-400" />
          Link Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Link"
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Subtext</label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              placeholder="Optional description below the title"
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Icon Selection */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 transition-colors">
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          Icon & Thumbnail
        </h3>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Preset Icon</label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Custom Icon / Thumbnail (optional)</label>
          <p className="text-gray-500 text-xs mt-1 mb-3 text-left">Upload an image to replace the preset icon. This will show on the left side of your link.</p>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-purple-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-purple-400 mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                )}
                <p className="mb-2 text-sm text-gray-400">
                  {isUploading ? "Uploading..." : <><span className="font-semibold text-purple-400">Click to upload</span> or drag and drop</>}
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>

          {thumbnailUrl && (
            <div className="mt-4 relative bg-gray-50 dark:bg-gray-750 rounded-lg p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700 transition-colors">
              <span className="text-gray-400 text-xs mb-2 w-full text-left">Uploaded Icon Preview:</span>
              <div className="relative group">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-16 h-16 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 transition-colors">
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          Per-Link Styling
        </h3>

        {/* Background Type Toggle */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Background Type</label>
          <div className="flex gap-2">
            {[
              { value: "color", label: "Color" },
              { value: "image", label: "Image" }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setBgType(type.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all text-sm font-medium ${bgType === type.value
                  ? "bg-purple-600 border-purple-500 text-white shadow-sm"
                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color Picker */}
        {bgType === "color" && (
          <ColorPicker
            value={bgColor}
            onChange={setBgColor}
            label="Background Color"
          />
        )}

        {/* Background Image URL */}
        {bgType === "image" && (
          <div>
            <label className="block text-gray-400 text-sm mb-2">Background Image URL</label>
            <input
              type="url"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">Enter a direct URL to an image</p>
          </div>
        )}

        {/* Text Color Picker */}
        <ColorPicker
          value={textColor}
          onChange={setTextColor}
          label="Text Color"
        />

        {/* Font Selection */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Font Style</label>
          <div className="grid grid-cols-3 gap-2">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFont(opt.value)}
                className={`py-3 px-4 rounded-lg border transition-all text-sm ${opt.class} ${font === opt.value
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

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 transition-colors">
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          Preview
        </h3>
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-xl">
          <LinkPreviewItem
            title={title || "Your Link Title"}
            icon={icon}
            bgType={bgType}
            bgColor={bgColor}
            bgImage={bgImage}
            textColor={textColor}
            font={font}
            thumbnailUrl={thumbnailUrl}
            url={url}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20"
        >
          Create Link
        </button>
      </div>
    </form>
  );
}

export function LinkPreviewItem({
  title,
  icon,
  bgType,
  bgColor,
  bgImage,
  textColor,
  font,
  url = "",
  showShare = false,
  thumbnailUrl = ""
}: {
  title: string;
  icon: string;
  bgType: string;
  bgColor: string;
  bgImage: string;
  textColor: string;
  font: string;
  url?: string;
  showShare?: boolean;
  thumbnailUrl?: string;
}) {
  const bgStyle = getPageBackgroundStyle({
    page_bg_type: bgType,
    page_bg_color: bgColor,
    page_bg_image: bgImage
  });

  return (
    <div
      className={`relative flex items-center justify-center min-h-[48px] px-12 py-3 rounded-xl transition-transform hover:scale-[1.02] ${getFontClass(font)}`}
      style={{ ...bgStyle, color: textColor || "#1F2937" }}
    >
      <div className="absolute left-3 flex items-center justify-center pointer-events-none">
        <LinkThumbnail
          thumbnailUrl={thumbnailUrl}
          icon={icon}
          color={textColor}
          size="w-6 h-6"
        />
      </div>

      <span className="font-semibold text-center break-words w-full text-sm leading-tight">{title}</span>

      {showShare && url && (
        <div className="absolute right-3 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard.writeText(url);
              alert("Link copied!");
            }}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            title="Copy URL"
          >
            <LucideLink className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}


