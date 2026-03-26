import { useState } from "react";
import Image from "next/image";
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
import { Link, AvatarStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/animated/interaction";

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
  const [thumbnailStyle, setThumbnailStyle] = useState<AvatarStyle>("circle");
  const [thumbnailSize, setThumbnailSize] = useState(40);
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
      thumbnail_style: thumbnailStyle,
      thumbnail_size: thumbnailSize,
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
      <Card className="p-4 sm:p-6 space-y-4 transition-colors bg-bg-main border border-border-main shadow-main rounded-radius-main">
        <h3 className="text-text-main font-semibold text-lg flex items-center gap-2">
          <LucideLink className="w-5 h-5 text-text-secondary" />
          Link Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Title *</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Link"
              required
              className="h-12 bg-bg-main border-border-main text-text-main focus:ring-1 focus:ring-text-secondary"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">URL *</label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="h-12 bg-bg-main border-border-main text-text-main focus:ring-1 focus:ring-text-secondary"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Subtext</label>
            <Input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              placeholder="Optional description below the title"
              className="h-12 bg-bg-main border-border-main text-text-main focus:ring-1 focus:ring-text-secondary"
            />
          </div>
        </div>
      </Card>

      {/* Icon Selection */}
      <Card className="p-4 sm:p-6 space-y-4 transition-colors bg-bg-main border border-border-main shadow-main rounded-radius-main">
        <h3 className="text-text-main font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-text-secondary" />
          Icon & Thumbnail
        </h3>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Preset Icon</label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full bg-btn-bg text-text-main px-4 py-3 rounded-xl border border-border-main focus:outline-none focus:border-text-secondary transition-colors"
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
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-main border-dashed rounded-xl cursor-pointer bg-btn-bg hover:bg-btn-hover hover:border-text-secondary transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader2 className="animate-spin h-8 w-8 text-text-secondary mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-text-secondary mb-2" />
                )}
                <p className="mb-2 text-sm text-text-secondary">
                  {isUploading ? "Uploading..." : <><span className="font-semibold text-text-main">Click to upload</span> or drag and drop</>}
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
                <div className="relative w-16 h-16 shadow-md">
                  <Image
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border-main/50 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-2 uppercase font-bold tracking-wider">Thumbnail Shape</label>
            <div className="grid grid-cols-4 gap-2">
              {(['circle', 'rounded', 'square', 'full'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setThumbnailStyle(style)}
                  className={`py-2 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                    thumbnailStyle === style 
                      ? "bg-btn-bg border-text-secondary text-btn-text shadow-sm"
                      : "bg-bg-main border-border-main text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Thumbnail Size</label>
              <span className="text-[10px] font-mono text-text-secondary opacity-50">{thumbnailSize}px</span>
            </div>
            <input 
              type="range"
              min="20"
              max="80"
              value={thumbnailSize}
              onChange={(e) => setThumbnailSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-main rounded-lg appearance-none cursor-pointer accent-text-secondary"
            />
          </div>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="p-4 sm:p-6 space-y-4 transition-colors bg-bg-main border border-border-main shadow-main rounded-radius-main">
        <h3 className="text-text-main font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-text-secondary" />
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
              <AnimatedButton
                key={type.value}
                type="button"
                selected={bgType === type.value}
                onClick={() => setBgType(type.value)}
                className={`flex-1 py-2 px-4 rounded-xl border transition-all text-sm font-medium ${bgType === type.value
                  ? "bg-btn-bg border-text-secondary text-btn-text shadow-sm"
                  : "bg-bg-main border-border-main text-text-secondary hover:border-text-secondary"
                  }`}
              >
                {type.label}
              </AnimatedButton>
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
            <Input
              type="url"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-12"
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
              <AnimatedButton
                key={opt.value}
                type="button"
                selected={font === opt.value}
                onClick={() => setFont(opt.value)}
                className={`py-3 px-4 rounded-xl border transition-all text-sm ${opt.class} ${font === opt.value
                  ? "bg-btn-bg border-text-secondary text-btn-text shadow-sm"
                  : "bg-bg-main border-border-main text-text-secondary hover:border-text-secondary"
                  }`}
              >
                {opt.label}
              </AnimatedButton>
            ))}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4 sm:p-6 space-y-4 transition-colors bg-bg-main border border-border-main shadow-main rounded-radius-main">
        <h3 className="text-text-main font-semibold text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-text-secondary" />
          Preview
        </h3>
        <div className="bg-muted p-4 rounded-xl">
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
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <AnimatedButton
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 rounded-full h-12"
        >
          Cancel
        </AnimatedButton>
        <AnimatedButton
          type="submit"
          className="flex-1 rounded-full h-12 bg-btn-bg hover:bg-btn-hover shadow-main text-btn-text font-bold"
        >
          Create Link
        </AnimatedButton>
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


