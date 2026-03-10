"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("links");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  // Live appearance for real-time preview
  const [liveAppearance, setLiveAppearance] = useState<any>(null);


  useEffect(() => {
    checkUser();
  }, []);

  // Supabase Realtime: keep links in sync
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("links-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          if (activePage) fetchLinks(activePage.id);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "link_pages",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchPages(user.id)
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, activePage]);

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
        router.push("/setup");
        return;
      }

      setProfile(profileData);
      await fetchPages(user.id);
    } catch (err) {
      console.error("Auth error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("link_pages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching pages:", error);
        // If link_pages table doesn't exist yet, create a virtual default page
        setPages([]);
        return;
      }

      setPages(data || []);

      // Auto-select default page or first page if none selected
      if (data && data.length > 0 && !activePage) {
        const defaultPage = data.find(p => p.is_default) || data[0];
        setActivePage(defaultPage);
        await fetchLinks(defaultPage.id);
      } else if (activePage) {
        // Refresh the active page data
        const updatedPage = data?.find(p => p.id === activePage.id);
        if (updatedPage) setActivePage(updatedPage);
      }
    } catch (err) {
      console.error("Unexpected error fetching pages:", err);
    }
  };

  const fetchLinks = async (pageId: string) => {
    if (!pageId) return;
    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("page_id", pageId)
        .order("position", { ascending: true });

      if (error) {
        console.error("Error fetching links:", error);
        setError("Failed to load links");
        return;
      }

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

  const createPage = async () => {
    if (!user || !newPageTitle.trim() || !newPageSlug.trim()) return;

    const slug = newPageSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");

    if (!slug || slug.length < 2) {
      setError("Hosted name must be at least 2 characters (letters, numbers, hyphens)");
      return;
    }

    const newPage = {
      user_id: user.id,
      title: newPageTitle.trim(),
      slug: slug,
    };

    const { data, error } = await supabase
      .from("link_pages")
      .insert([newPage])
      .select()
      .single();

    if (error) {
      console.error("Error creating page:", error);
      if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
        setError(`The hosted name "${slug}" is already taken. Please choose a different one.`);
      } else {
        setError(`Failed to create page: ${error.message}`);
      }
      return;
    }

    setShowCreatePage(false);
    setNewPageTitle("");
    setNewPageSlug("");
    await fetchPages(user.id);

    // Auto-select the new page
    if (data) {
      setActivePage(data);
      setLinks([]);
      setActiveTab("links");
    }
  };

  const deletePage = async (pageId: string) => {
    if (!user) return;
    const page = pages.find(p => p.id === pageId);
    if (page?.is_default && pages.length > 1) {
      setError("Cannot delete the default page. Set another page as default first.");
      return;
    }

    const { error } = await supabase
      .from("link_pages")
      .delete()
      .eq("id", pageId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting page:", error);
      return;
    }

    if (activePage?.id === pageId) {
      setActivePage(null);
      setLinks([]);
    }
    await fetchPages(user.id);
  };

  const addLink = async (linkData: any = {}) => {
    if (!user || !activePage) return;

    const nextPosition = links.length > 0
      ? Math.max(...links.map(l => l.position || 0)) + 1
      : 0;

    const newLink = {
      user_id: user.id,
      page_id: activePage.id,
      title: linkData.title || "New Link",
      url: linkData.url || "https://example.com",
      position: nextPosition,
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

    await fetchLinks(activePage.id);
    setActiveTab("links");
  };

  const updateLink = async (linkId: string, updates: any) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    );

    const SCHEMA_FIELDS = ["title", "url", "position", "icon", "thumbnail_url", "bg_type", "bg_color", "bg_image", "text_color", "font", "enabled"];
    const dbUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => SCHEMA_FIELDS.includes(key))
    );

    if (Object.keys(dbUpdates).length === 0) return;

    const { error } = await supabase
      .from("links")
      .update(dbUpdates)
      .eq("id", linkId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating link:", error);
      if (activePage) await fetchLinks(activePage.id);
      return;
    }
  };

  const deleteLink = async (linkId: string) => {
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting link:", error);
      return;
    }

    if (activePage) await fetchLinks(activePage.id);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
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

  const updatePage = async (updates: any) => {
    if (!activePage) return;

    const { error } = await supabase
      .from("link_pages")
      .update(updates)
      .eq("id", activePage.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating page:", error);
      return;
    }

    setActivePage({ ...activePage, ...updates });
    // Refresh pages list
    await fetchPages(user.id);
  };

  const handleSelectPage = (page: any) => {
    setActivePage(page);
    setActiveTab("links");
    setLiveAppearance(null);

    fetchLinks(page.id);
    setShowSidebar(false);
  };

  const handleCreatePage = () => {
    setShowCreatePage(true);
    setShowSidebar(false);
  };

  const handleAppearanceChange = useCallback((appearance: any) => {
    setLiveAppearance(appearance);
  }, []);

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

  const enabledLinks = links.filter(l => l.enabled !== false);

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
      <div className={`fixed lg:relative z-50 lg:z-auto transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <Sidebar
          profile={profile}
          pages={pages}
          activePage={activePage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectPage={handleSelectPage}
          onCreatePage={handleCreatePage}
          onLogout={handleLogout}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {showCreatePage ? "Create New Page" : activePage ? activePage.title : "My Pages"}
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
                  href={activePage ? `/${profile?.username}/${activePage.slug}` : `/`}
                  target="_blank"
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-all text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[180px] sm:max-w-none">{activePage ? `/${profile?.username}/${activePage.slug}` : `/`}</span>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Link to Profile */}
            <a
              href={activePage ? `/${profile?.username}/${activePage.slug}` : `/`}
              target="_blank"
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm"
            >
              <span>View: {activePage ? `/${profile?.username}/${activePage.slug}` : `/`}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 text-red-400 rounded-lg mb-6 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Create New Page Form */}
            {showCreatePage ? (
              <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Link Page
                </h3>
                <p className="text-gray-400 text-sm">Create a new page with its own set of links and appearance.</p>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Page Title *</label>
                  <input
                    type="text"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="My Social Links"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Hosted Name (URL) *</label>
                  <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 focus-within:border-purple-500 overflow-hidden">
                    <span className="px-3 text-gray-400 text-sm whitespace-nowrap border-r border-gray-600">/{profile?.username}/</span>
                    <input
                      type="text"
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="my-social-links"
                      className="flex-1 bg-transparent text-white px-3 py-3 focus:outline-none"
                      onKeyDown={(e) => e.key === "Enter" && createPage()}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">This will be your page&apos;s URL. Use lowercase letters, numbers, and hyphens.</p>
                </div>

                {newPageSlug.trim() && (
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Your page will be hosted at:</p>
                    <p className="text-green-400 text-sm font-mono">
                      {typeof window !== "undefined" ? window.location.origin : ""}/{profile?.username}/{newPageSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "")}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowCreatePage(false); setNewPageTitle(""); setNewPageSlug(""); }}
                    className="flex-1 py-3 px-6 bg-gray-700 text-gray-300 font-semibold rounded-full hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPage}
                    disabled={!newPageTitle.trim() || !newPageSlug.trim()}
                    className="flex-1 py-3 px-6 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 disabled:bg-purple-600/50 transition-all"
                  >
                    Create Page
                  </button>
                </div>
              </div>
            ) : !activePage ? (
              /* No Page Selected — Show Page List */
              <div className="space-y-4">
                {pages.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-white text-lg font-semibold mb-2">No Link Pages Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first link page to get started!</p>
                    <button
                      onClick={handleCreatePage}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all"
                    >
                      Create Your First Page
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
                      <button
                        onClick={handleCreatePage}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Page
                      </button>
                    </div>
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all group cursor-pointer"
                        onClick={() => handleSelectPage(page)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${page.page_bg_gradient_from || "#6366F1"} 0%, ${page.page_bg_gradient_to || "#A855F7"} 100%)` }}
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{page.title}</h3>
                              <p className="text-gray-500 text-xs">/{page.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">

                            <button
                              onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                              className="text-gray-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              /* Page Editor */
              <>
                {/* Back to Pages */}
                <button
                  onClick={() => { setActivePage(null); setLiveAppearance(null); }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Pages
                </button>



                {/* Tab Content */}
                {activeTab === "create-link" ? (
                  <LinkForm
                    onSubmit={addLink}
                    onCancel={() => setActiveTab("links")}
                  />
                ) : (
                  <>
                    {/* Profile Header Card */}
                    <ProfileHeader
                      profile={profile}
                      updateProfile={updateProfile}
                    />

                    {/* Page Appearance (collapsible, inline) */}
                    <PageAppearance
                      page={activePage}
                      updatePage={updatePage}
                      onAppearanceChange={handleAppearanceChange}
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
              </>
            )}
          </div>
        </div>

        {/* Live Preview - Desktop */}
        <div className="hidden lg:block w-80 bg-gray-800 p-6">
          <div className="sticky top-6">
            <LivePreview
              profile={profile}
              page={activePage}
              links={enabledLinks}
              appearance={liveAppearance}
            />
          </div>
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
                page={activePage}
                links={enabledLinks}
                appearance={liveAppearance}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
