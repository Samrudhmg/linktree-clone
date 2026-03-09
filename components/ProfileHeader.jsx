"use client";

import { useState } from "react";

export default function ProfileHeader({ profile, updateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSave = () => {
    updateProfile({ display_name: displayName, bio });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl sm:text-2xl shrink-0">
          {profile?.display_name?.[0]?.toUpperCase() || "@"}
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
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Add a bio"
                rows={2}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-semibold text-lg">
                  {profile?.display_name || "Your Name"}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-2">@{profile?.username || "username"}</p>
              {profile?.bio ? (
                <p className="text-gray-400 text-sm">{profile.bio}</p>
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
        <button className="shrink-0 w-8 h-8 rounded-full bg-gray-700 hidden sm:flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
