import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { uploadLinkImage } from "@/lib/themes";
import { LinkPage } from "@/lib/types";

interface ProfileSectionProps {
  profile: LinkPage;
  updateProfile: (data: Partial<LinkPage>) => Promise<{ success?: boolean; error?: unknown } | void>;
}

export default function ProfileSection({ profile, updateProfile }: ProfileSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadLinkImage(supabase, file);
      await updateProfile({ avatar_url: publicUrl });
    } catch (error: unknown) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6 transition-colors shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-4 ring-purple-500/10 dark:ring-purple-500/20">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <Upload className="w-8 h-8" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <label className="absolute bottom-1 right-1 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110">
            <Upload className="w-4 h-4" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
              <input
                type="text"
                value={profile?.username || ""}
                onChange={(e) => updateProfile({ username: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1.5">Bio</label>
            <textarea
              value={profile?.bio || ""}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-all resize-none"
              placeholder="Tell the world about yourself..."
              rows={2}
            />
            <div className="flex justify-end mt-1">
              <span className={`text-[10px] ${(profile?.bio?.length || 0) > 80 ? 'text-amber-500' : 'text-gray-400'}`}>
                {profile?.bio?.length || 0}/80
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
