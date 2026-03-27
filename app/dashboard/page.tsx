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
  ExternalLink,
  User as UserIcon,
  Loader2,
  Upload,
  RefreshCw
} from "lucide-react";
import { Link, LinkPage, Profile } from "@/lib/types";
import { DBTheme } from "@/lib/theme-utils";
import { uploadLinkImage } from "@/lib/themes";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pages, setPages] = useState<LinkPage[]>([]);
  const [activePage, setActivePage] = useState<LinkPage | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [themes, setThemes] = useState<DBTheme[]>([]);
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
  const [editingThemePreview, setEditingThemePreview] = useState<DBTheme | null>(null);
  // Profile editing
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [isUploadingProfileAvatar, setIsUploadingProfileAvatar] = useState(false);
  // Page URL editing
  const [editingPageSlug, setEditingPageSlug] = useState(false);
  const [editPageSlug, setEditPageSlug] = useState("");
  // Auto-edit profile for new pages
  const [autoEditProfile, setAutoEditProfile] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [editPageTitle, setEditPageTitle] = useState("");


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
      await Promise.all([
        fetchPages(user.id),
        fetchThemes(user.id)
      ]);
    } catch (err) {
      console.error("Auth error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async (userId: string, pageId?: string) => {
    try {
      let query = supabase
        .from("themes")
        .select("*");

      if (pageId) {
        query = query.or(`type.eq.default,page_id.eq.${pageId}`);
      } else {
        query = query.eq("type", "default");
      }

      const { data, error } = await query.order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching themes:", error);
        return;
      }
      setThemes(data || []);
    } catch (err) {
      console.error("Unexpected error fetching themes:", err);
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
              title: "",
              slug: prof.username || `user-${userId.substring(0, 5)}`,
              is_default: true,
              display_name: "",
              bio: "",
              avatar_url: null
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
        await Promise.all([
          fetchLinks(defaultPage.id),
          fetchThemes(userId, defaultPage.id)
        ]);
      } else if (activePage) {
        // Refresh the active page data
        const updatedPage = data?.find(p => p.id === activePage.id);
        if (updatedPage) setActivePage(updatedPage);
        await fetchThemes(userId, activePage.id);
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
        .select("*, click_events(count)")
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

  const trackClick = (link: Link) => {
    // Optimistic UI update
    setLinks((prev) =>
      prev.map((l) =>
        l.id === link.id
          ? {
            ...l,
            click_events: [
              { count: (l.click_events?.[0]?.count ?? 0) + 1 }
            ]
          }
          : l
      )
    );

    // Record click
    if (typeof window !== "undefined" && navigator.sendBeacon) {
      const data = JSON.stringify({ linkId: link.id });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("/api/track-click", blob);
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

    // Filter to only include actual database columns
    const ALLOWED_COLUMNS = [
      "slug",
      "title",
      "display_name",
      "bio",
      "avatar_url",
      "theme_id",
      "is_default",
      "avatar_style",
      "avatar_size"
    ];

    const dbUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => ALLOWED_COLUMNS.includes(key))
    );

    if (Object.keys(dbUpdates).length === 0) {
      console.log("[Dashboard] No valid DB columns to update");
      return { success: true };
    }

    const { error, data } = await supabase
      .from("link_pages")
      .update(dbUpdates)
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

  const handleProfileAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfileAvatar(true);
    try {
      const publicUrl = await uploadLinkImage(supabase, file, "avatars");
      setEditAvatarUrl(publicUrl);
    } catch (error: unknown) {
      console.error("Error uploading profile avatar:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploadingProfileAvatar(false);
    }
  };

  const saveEditProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: editDisplayName,
        avatar_url: editAvatarUrl
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
      return;
    }

    if (profile) setProfile({ ...profile, display_name: editDisplayName, avatar_url: editAvatarUrl } as Profile);
    setShowEditProfile(false);
  };

  const savePageInfo = async () => {
    if (!activePage || !editPageSlug.trim() || !editPageTitle.trim()) return;

    // Check if slug is available (only if changed)
    if (editPageSlug !== activePage.slug) {
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
    }

    const { error } = await supabase
      .from("link_pages")
      .update({ 
        slug: editPageSlug,
        title: editPageTitle
      })
      .eq("id", activePage.id)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error updating page info:", error);
      setError("Failed to update page information");
      return;
    }

    setActivePage({ ...activePage, slug: editPageSlug, title: editPageTitle });
    setEditingPageSlug(false);
    if (user) await fetchPages(user.id);
  };

  const handleSelectPage = (page: LinkPage) => {
    setActivePage(page);
    setActiveTab("links");
    setLiveAppearance(null);

    fetchLinks(page.id);
    if (user) fetchThemes(user.id, page.id);
    setShowSidebar(false);
  };

  const handleCreatePage = () => {
    setShowCreatePage(true);
    setShowSidebar(false);
  };

  const handleAppearanceChange = (appearance: LinkPage) => {
    setLiveAppearance(appearance);
  };

  const deriveActiveTheme = () => {
    if (editingThemePreview) return editingThemePreview;

    const currentThemeId = liveAppearance?.theme_id || activePage?.theme_id;

    if (!currentThemeId) return themes.find(t => t.type === 'default') || null;

    const matchedTheme = themes.find(t => t.id === currentThemeId);

    // Fallback logic: stay at current if possible, otherwise null
    return matchedTheme || null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="text-text-main text-xl">Loading...</div>
      </div>
    );
  }

  const enabledLinks = links.filter(l => l.enabled !== false);

  return (
    <div className="min-h-screen font-inter bg-transparent text-main flex transition-colors">
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
          user={user}
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
            setEditDisplayName(profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "");
            setEditAvatarUrl(profile?.avatar_url || user?.user_metadata?.picture || user?.user_metadata?.avatar_url || "");
            setImageError(false);
            setShowEditProfile(true);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row bg-transparent transition-colors">
        {/* Editor Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 overflow-y-auto"
        >
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
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-btn-bg text-text-secondary border border-border-main rounded-lg hover:bg-btn-hover transition-all text-sm"
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
                  editPageTitle={editPageTitle}
                  setEditPageTitle={setEditPageTitle}
                  onSavePageInfo={savePageInfo}
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
                      user={user!}
                      page={activePage}
                      updatePage={updatePage}
                      autoEdit={autoEditProfile}
                      onEditComplete={() => setAutoEditProfile(false)}
                      theme={deriveActiveTheme()}
                    />

                    {/* Page Appearance (collapsible, inline) */}
                    <PageAppearance
                      page={activePage}
                      updatePage={updatePage}
                      onAppearanceChange={handleAppearanceChange}
                      themes={themes}
                      pages={pages}
                      user={user!}
                      refreshThemes={async () => { if (user) await fetchThemes(user.id, activePage.id); }}
                      onPreviewChange={setEditingThemePreview}
                    />

                    {/* Create New Link Button */}
                    <button
                      onClick={() => setActiveTab("create-link")}
                      className="w-full py-3 sm:py-4 bg-btn-bg hover:bg-btn-hover text-btn-text font-semibold rounded-full mb-6 transition-all flex items-center justify-center gap-2 shadow-main border border-border-main"
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
        </motion.div>

        {/* Live Preview - Desktop (Fixed on right side, vertically centered) */}
        {activePage && (
          <div className="hidden lg:flex fixed right-0 top-0 bottom-0 w-96 bg-bg-main items-center justify-center border-l border-border-main transition-colors">
            <LivePreview
              user={user}
              page={activePage}
              links={enabledLinks}
              theme={deriveActiveTheme()}
              onLinkClick={trackClick}
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
                theme={deriveActiveTheme()}
                onLinkClick={trackClick}
              />
            </div>
          </div>
        )}
      </div>


      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-0 shadow-main transition-colors bg-muted border border-border-main rounded-radius-main outline-none [&>button]:hidden sm:rounded-radius-main overflow-hidden">
          {/* Grain Overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

          <div className="relative z-10 p-6 space-y-4 bg-muted/50">
            <div className="flex items-center gap-4 mb-2">
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-border-main relative">
                  {(editAvatarUrl || user?.user_metadata?.picture || user?.user_metadata?.avatar_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editAvatarUrl || user?.user_metadata?.picture || user?.user_metadata?.avatar_url}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                      <UserIcon className="w-10 h-10" />
                    </div>
                  )}
                  {isUploadingProfileAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2 translate-y-1">
                  <label className="w-8 h-8 bg-btn-bg hover:bg-btn-hover text-btn-text rounded-full flex items-center justify-center cursor-pointer shadow-main border border-border-main transition-transform hover:scale-110">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileAvatarUpload}
                      disabled={isUploadingProfileAvatar}
                    />
                  </label>
                  {editAvatarUrl && (
                    <button
                      onClick={() => setEditAvatarUrl("")}
                      className="w-8 h-8 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center shadow-main border border-white/20 transition-transform hover:scale-110"
                      title="Reset to Google Image"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Account</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-text-secondary text-sm font-medium">Display Name</label>
                {(editDisplayName !== (user?.user_metadata?.full_name || user?.email?.split('@')[0])) && (
                  <button
                    onClick={() => setEditDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || "")}
                    className="text-xs text-text-secondary/60 hover:text-text-secondary flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset to Account Name
                  </button>
                )}
              </div>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-bg-main text-text-main px-4 py-3 rounded-lg border border-border-main focus:outline-none focus:border-text-secondary transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 py-3 px-6 bg-btn-bg text-text-secondary font-semibold rounded-full hover:bg-btn-hover transition-all"
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
