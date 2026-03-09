"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Sidebar from "@/components/Sidebar";
import LinksList from "@/components/LinksList";
import LivePreview from "@/components/LivePreview";
import ProfileHeader from "@/components/ProfileHeader";
import LinkForm from "@/components/LinkForm";
import PageAppearance from "@/components/PageAppearance";

const supabase = createClient();

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("manage-links");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push("/login");
        return;
      }
      
      setUser(user);
      
      // Check if user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileError || !profileData) {
        // No profile, redirect to setup
        router.push("/setup");
        return;
      }
      
      setProfile(profileData);
      await fetchLinks(user.id);
    } catch (err) {
      console.error("Auth error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("position", { ascending: true });
      
      if (error) {
        console.error("Error fetching links:", error);
        setError("Failed to load links");
        return;
      }
      
      // Ensure enabled field has a boolean value
      const normalizedLinks = (data || []).map(link => ({
        ...link,
        enabled: link.enabled === true || link.enabled === null || link.enabled === undefined ? true : false
      }));
      
      setLinks(normalizedLinks);
      setError(null);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    }
  };

  const addLink = async (linkData = {}) => {
    if (!user) return;

    const nextPosition = links.length > 0 
      ? Math.max(...links.map(l => l.position || 0)) + 1 
      : 0;

    const newLink = {
      user_id: user.id,
      title: linkData.title || "New Link",
      url: linkData.url || "https://example.com",
      position: nextPosition,
      enabled: true,
      icon: linkData.icon || null,
      thumbnail_url: linkData.thumbnail_url || null,
      bg_type: linkData.bg_type || "color",
      bg_color: linkData.bg_color || "#FFFFFF",
      bg_image: linkData.bg_image || null,
      text_color: linkData.text_color || "#1F2937",
      font: linkData.font || "sans",
    };

    const { error } = await supabase.from("links").insert([newLink]);

    if (error) {
      console.error("Error adding link:", error);
      setError(`Failed to add link: ${error.message}`);
      return;
    }

    await fetchLinks(user.id);
    setActiveTab("manage-links"); // Switch to manage links after creating
  };

  const updateLink = async (linkId, updates) => {
    // Optimistically update UI first
    setLinks(prevLinks => 
      prevLinks.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      )
    );

    const { error } = await supabase
      .from("links")
      .update(updates)
      .eq("id", linkId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating link:", error);
      // Revert on error
      await fetchLinks(user.id);
      return;
    }
  };

  const deleteLink = async (linkId) => {
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting link:", error);
      return;
    }

    await fetchLinks(user.id);
  };

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return;
    }

    setProfile({ ...profile, ...updates });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const enabledLinks = links.filter(l => l.enabled === true);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 lg:z-auto transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <Sidebar 
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Links Management Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {activeTab === "create-link" ? "Create New Link" : activeTab === "appearance" ? "Appearance" : "Manage Links"}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mobile Preview Toggle */}
                <button
                  onClick={() => setShowPreview(true)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                <a 
                  href={`/${profile?.username || "user"}`}
                  target="_blank"
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-all text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[120px] sm:max-w-none">eltlinktree/{profile?.username || "user"}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Link to Profile */}
            <a 
              href={`/${profile?.username || "user"}`}
              target="_blank"
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm"
            >
              <span>View: eltlinktree/{profile?.username || "user"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 text-red-400 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "create-link" ? (
              <LinkForm 
                onSubmit={addLink}
                onCancel={() => setActiveTab("manage-links")}
              />
            ) : activeTab === "appearance" ? (
              <PageAppearance 
                profile={profile}
                updateProfile={updateProfile}
              />
            ) : (
              <>
                {/* Profile Header Card */}
                <ProfileHeader 
                  profile={profile}
                  updateProfile={updateProfile}
                />

                {/* Create New Link Button */}
                <button
                  onClick={() => setActiveTab("create-link")}
                  className="w-full py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full mb-6 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Link
                </button>

                {/* Links List */}
                <LinksList 
                  links={links}
                  updateLink={updateLink}
                  deleteLink={deleteLink}
                />
              </>
            )}
          </div>
        </div>

        {/* Live Preview - Desktop */}
        <div className="hidden lg:block w-80 bg-gray-800 p-6">
          <LivePreview 
            profile={profile}
            links={enabledLinks}
          />
        </div>

        {/* Live Preview - Mobile Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 z-50 lg:hidden flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 text-white p-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <LivePreview 
                profile={profile}
                links={enabledLinks}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//                 <span>eltlinktree/{profile?.username || "user"}</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                 </svg>
//               </a>
//             </div>

//             {/* Profile Header Card */}
//             <ProfileHeader 
//               profile={profile}
//               updateProfile={updateProfile}
//             />

//             {/* Add Button */}
//             <button
//               onClick={addLink}
//               className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full mb-6 transition-all flex items-center justify-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add
//             </button>

//             {/* Error Message */}
//             {error && (
//               <div className="p-4 bg-red-500/20 text-red-400 rounded-lg mb-6">
//                 {error}
//               </div>
//             )}

//             {/* Links List */}
//             <LinksList 
//               links={links}
//               updateLink={updateLink}
//               deleteLink={deleteLink}
//             />
//           </div>
//         </div>

//         {/* Live Preview */}
//         <div className="w-80 bg-gray-800 p-6 hidden lg:block">
//           <LivePreview 
//             profile={profile}
//             links={enabledLinks}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
