"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const supabase = createClient();

export default function Setup() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projectName, setProjectName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const checkUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      router.push("/login");
      return;
    }

    // Check if user already has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      // User already has a profile, redirect to dashboard
      router.push("/dashboard");
      return;
    }

    setUser(user as User);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkUser();
  }, [checkUser]);

  const validateProjectName = (name: string) => {
    // Only allow lowercase letters, numbers, and hyphens
    const regex = /^[a-z0-9-]+$/;
    return regex.test(name) && name.length >= 3 && name.length <= 30;
  };

  const checkAvailability = async (name: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .single();

    return !data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateProjectName(projectName)) {
      setError("Project name must be 3-30 characters, lowercase letters, numbers, and hyphens only");
      return;
    }

    setSaving(true);

    const isAvailable = await checkAvailability(projectName);
    if (!isAvailable) {
      setError("This project name is already taken. Please choose another.");
      setSaving(false);
      return;
    }

    // Create the profile
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user!.id,
        username: projectName,
        display_name: displayName || "",
        bio: "",
        avatar_url: ""
      }
    ]);

    if (insertError) {
      console.error("Error creating profile:", insertError);
      setError(`Failed to create profile: ${insertError.message || insertError.code || 'Unknown error'}`);
      setSaving(false);
      return;
    }

    // Create default link page so the user's public URL works immediately
    const { error: pageError } = await supabase.from("link_pages").insert([
      {
        user_id: user!.id,
        title: displayName || "My Links",
        slug: projectName,
        is_default: true,
        display_name: displayName || "",
      }
    ]);

    if (pageError) {
      console.error("Error creating default page:", pageError);
    }

    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 sm:p-10 rounded-2xl shadow-2xl border-0 bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to ELTLINKTREE
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Let&apos;s set up your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium text-sm">
              Choose your project name
            </label>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-input focus-within:ring-1 focus-within:ring-ring">
              <span className="px-3 text-gray-500 text-sm whitespace-nowrap">eltlinktree/</span>
              <Input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="my-links"
                className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 px-2 h-12 rounded-none dark:text-white"
                required
              />
            </div>
            <p className="text-gray-400 text-xs">
              This will be your shareable link URL
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium text-sm">
              Display Name (optional)
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="h-12 bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-1"
            />
            <p className="text-gray-400 text-xs">
              You can add this later
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-2">Preview URL:</p>
            <p className="text-purple-600 font-medium text-sm break-all">
              {typeof window !== "undefined" ? window.location.origin : ""}/{projectName || "your-project"}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={saving || !projectName}
            className="w-full py-6 rounded-md font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white transition-all shadow-sm hover:shadow-md mt-2"
          >
            {saving ? "Creating..." : "Create My ELTLINKTREE"}
          </Button>
        </form>
        </Card>
      </motion.div>
    </div>
  );
}

