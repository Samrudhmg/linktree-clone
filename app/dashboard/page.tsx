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
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreatePageForm from "@/components/dashboard/CreatePageForm";
import PageList from "@/components/dashboard/PageList";
import PageInfoCard from "@/components/dashboard/PageInfoCard";
import {
  X,
  Plus,
  Pencil,
  ExternalLink
} from "lucide-react";
import { Link, LinkPage, Profile } from "@/lib/types";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pages, setPages] = useState<LinkPage[]>([]);
  const [activePage, setActivePage] = useState<LinkPage | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("links");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  // Live appearance for real-time preview
  const [liveAppearance, setLiveAppearance] = useState<LinkPage | null>(null);
  // Profile editing
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  // Page URL editing
  const [editingPageSlug, setEditingPageSlug] = useState(false);
  const [editPageSlug, setEditPageSlug] = useState("");
  // Auto-edit profile for new pages
  const [autoEditProfile, setAutoEditProfile] = useState(false);


  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Auto-create default page for existing users who don't have one yet
      if (!data || data.length === 0) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("username, display_name")
          .eq("id", userId)
          .single();

        if (prof?.username) {
          const { data: newPage } = await supabase
            .from("link_pages")
            .insert([{
              user_id: userId,
              title: prof.display_name || "My Links",
              slug: prof.username,
              is_default: true,
              display_name: prof.display_name || "",
            }])
            .select()
            .single();

          if (newPage) {
            setPages([newPage]);
            setActivePage(newPage);
            setLinks([]);
            return;
          }
        }
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
      setAutoEditProfile(true); // Auto-open edit mode for new page
    }
  };

  const deletePage = async (pageId: string) => {
    if (!user) return;

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

  const addLink = async (linkData: Partial<Link> = {}) => {
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
      subtext: linkData.subtext || null,
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

  const updateLink = async (linkId: string, updates: Partial<Link>) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    );

    const SCHEMA_FIELDS = ["title", "url", "subtext", "position", "icon", "thumbnail_url", "bg_type", "bg_color", "bg_image", "text_color", "font", "enabled"];
    const dbUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => SCHEMA_FIELDS.includes(key))
    );

    if (Object.keys(dbUpdates).length === 0) return;

    const { error } = await supabase
      .from("links")
      .update(dbUpdates)
      .eq("id", linkId)
      .eq("user_id", user?.id);

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
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error deleting link:", error);
      return;
    }

    if (activePage) await fetchLinks(activePage.id);
  };

  const reorderLinks = async (newOrderedLinks: Link[]) => {
    // Update local state immediately for responsive UI
    setLinks(newOrderedLinks);

    // Update positions in database
    const updates = newOrderedLinks.map((link, index) => ({
      id: link.id,
      position: index,
    }));

    // Update each link's position in the database
    for (const update of updates) {
      const { error } = await supabase
        .from("links")
        .update({ position: update.position })
        .eq("id", update.id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error updating link position:", error);
        // Refetch to restore correct order if there's an error
        if (activePage) await fetchLinks(activePage.id);
        return;
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "No user" };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return { error };
    }

    if (profile) setProfile({ ...profile, ...updates } as Profile);
    return { success: true };
  };

  const updatePage = async (updates: Partial<LinkPage>) => {
    if (!activePage) return { error: "No active page" };

    console.log("[Dashboard] Updating page:", activePage.id, "with:", updates);

    const { error, data } = await supabase
      .from("link_pages")
      .update(updates)
      .eq("id", activePage.id)
      .eq("user_id", user?.id)
      .select();

    if (error) {
      console.error("[Dashboard] Error updating page:", error);
      return { error };
    }

    console.log("[Dashboard] Page updated successfully:", data);
    setActivePage({ ...activePage, ...updates });
    // Refresh pages list
    if (user) await fetchPages(user.id);
    return { success: true };
  };

  const saveEditProfile = async () => {
    if (!user || !editDisplayName.trim()) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: editDisplayName
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
      return;
    }

    if (profile) setProfile({ ...profile, display_name: editDisplayName } as Profile);
    setShowEditProfile(false);
  };

  const savePageSlug = async () => {
    if (!activePage || !editPageSlug.trim()) return;

    // Check if slug is available globally (not just for this user)
    const { data } = await supabase
      .from("link_pages")
      .select("slug")
      .eq("slug", editPageSlug)
      .neq("id", activePage.id)
      .single();

    if (data) {
      setError("This URL is already taken. Please choose a different one.");
      return;
    }

    const { error } = await supabase
      .from("link_pages")
      .update({ slug: editPageSlug })
      .eq("id", activePage.id)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error updating page slug:", error);
      setError("Failed to update page URL");
      return;
    }

    setActivePage({ ...activePage, slug: editPageSlug });
    setEditingPageSlug(false);
    if (user) await fetchPages(user.id);
  };

  const handleSelectPage = (page: LinkPage) => {
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

  const handleAppearanceChange = (appearance: LinkPage) => {
    setLiveAppearance(appearance);
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

  const enabledLinks = links.filter(l => l.enabled !== false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] text-gray-900 dark:text-white flex transition-colors">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 lg:relative z-50 lg:z-auto transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
          onEditProfile={() => {
            setEditDisplayName(profile?.display_name || "");
            setShowEditProfile(true);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row  bg-gray-50 dark:bg-[#101828] transition-colors">
        {/* Editor Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Dashboard Header */}
            <DashboardHeader
              showCreatePage={showCreatePage}
              activePage={activePage}
              onShowSidebar={() => setShowSidebar(true)}
              onShowPreview={() => setShowPreview(true)}
            />

            {/* Mobile Link to Profile */}
            {activePage && (
              <a
                href={`/${activePage.slug}`}
                target="_blank"
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
              >
                <span>View: /{activePage.slug}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 text-red-400 rounded-lg mb-6 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Create New Page Form */}
            {showCreatePage ? (
              <CreatePageForm
                newPageTitle={newPageTitle}
                setNewPageTitle={setNewPageTitle}
                newPageSlug={newPageSlug}
                setNewPageSlug={setNewPageSlug}
                onCreatePage={createPage}
                onCancel={() => { setShowCreatePage(false); setNewPageTitle(""); setNewPageSlug(""); }}
              />
            ) : !activePage ? (
              <PageList
                pages={pages}
                onSelectPage={handleSelectPage}
                onDeletePage={(deleteId, e) => { e.stopPropagation(); deletePage(deleteId); }}
                onCreatePage={handleCreatePage}
              />
            ) : (
              /* Page Editor */
              <>
                <PageInfoCard
                  activePage={activePage}
                  editingPageSlug={editingPageSlug}
                  setEditingPageSlug={setEditingPageSlug}
                  editPageSlug={editPageSlug}
                  setEditPageSlug={setEditPageSlug}
                  onSavePageSlug={savePageSlug}
                  onBack={() => { setActivePage(null); setLiveAppearance(null); }}
                />


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
                      page={activePage}
                      updatePage={updatePage}
                      autoEdit={autoEditProfile}
                      onEditComplete={() => setAutoEditProfile(false)}
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
                      <Plus className="w-5 h-5" />
                      Create New Link
                    </button>

                    {/* Links List */}
                    <LinksList
                      links={links}
                      updateLink={updateLink}
                      deleteLink={deleteLink}
                      reorderLinks={reorderLinks}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Live Preview - Desktop (Fixed on right side, vertically centered) */}
        {activePage && (
          <div className="hidden lg:flex fixed right-0 top-0 bottom-0 w-96 bg-gray-100 dark:bg-gray-800 items-center justify-center border-l border-gray-200 dark:border-gray-700 transition-colors">
            <LivePreview
              page={activePage}
              links={enabledLinks}
              appearance={liveAppearance}
            />
          </div>)}
        {/* Spacer to prevent content from going under the fixed preview */}
        {activePage && (
          <div className="hidden lg:block w-96 shrink-0" />
        )}

        {/* Live Preview - Mobile Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 z-50 lg:hidden flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 text-white p-2"
              >
                <X className="w-8 h-8" />
              </button>
              <LivePreview
                page={activePage}
                links={enabledLinks}
                appearance={liveAppearance}
              />
            </div>
          </div>
        )}
      </div>


      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl transition-colors">
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
              <Pencil className="w-5 h-5 text-purple-400" />
              Edit Profile
            </h3>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Display Name</label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEditProfile}
                disabled={!editDisplayName.trim()}
                className="flex-1 py-3 px-6 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 disabled:bg-purple-600/50 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
