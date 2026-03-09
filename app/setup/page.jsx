"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

export default function Setup() {
  const router = useRouter();
  const [user, setUser] = useState(null);
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

    setUser(user);
    setDisplayName(user.email?.split("@")[0] || "");
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const validateProjectName = (name) => {
    // Only allow lowercase letters, numbers, and hyphens
    const regex = /^[a-z0-9-]+$/;
    return regex.test(name) && name.length >= 3 && name.length <= 30;
  };

  const checkAvailability = async (name) => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .single();
    
    return !data;
  };

  const handleSubmit = async (e) => {
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
        id: user.id,
        username: projectName,
        display_name: displayName || projectName,
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl w-full max-w-md">
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
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Choose your project name
            </label>
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 text-sm whitespace-nowrap">eltlinktree/</span>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="my-links"
                className="flex-1 bg-transparent py-3 px-2 focus:outline-none text-gray-800 min-w-0"
                required
              />
            </div>
            <p className="text-gray-400 text-xs mt-1">
              This will be your shareable link URL
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-gray-100 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              This is how visitors will see your name
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
          <button
            type="submit"
            disabled={saving || !projectName}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              saving || !projectName
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
            }`}
          >
            {saving ? "Creating..." : "Create My ELTLINKTREE"}
          </button>
        </form>
      </div>
    </div>
  );
}
