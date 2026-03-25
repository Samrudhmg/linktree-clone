# 🚀 FEATURE: Skeleton Loaders & Loading States (Login → Dashboard)

## 🎯 Goal

Implement consistent **loading states and skeleton loaders** across the app to improve perceived performance and user experience.

---

# 🧠 Core Principles

* Never show blank screens ❌
* Avoid full-page spinners ❌
* Use skeletons that match actual UI ✅
* Ensure smooth transitions without layout shift ✅

---

# 1️⃣ 🔐 Login Page Loading

## Behavior

When user clicks "Sign In":

* Disable button
* Show inline loading state
* Prevent multiple submissions

---

## Implementation

```tsx
<Button disabled={isLoading}>
  {isLoading ? "Signing in..." : "Sign In"}
</Button>
```

---

## Optional Enhancement

* Add spinner icon inside button
* Add slight opacity change

---

# 2️⃣ 📄 Dashboard Skeleton

## Trigger

Show when:

* User is authenticated but data is still loading
* Fetching profile, pages, or links

---

## Create Component

```
components/skeletons/DashboardSkeleton.tsx
```

---

## Structure

### Header

* Avatar → circular skeleton
* Name → line skeleton
* Bio → smaller line

### Links List

* 3–5 link cards
* Each includes:

  * title line
  * subtext line

---

## Example

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-16 w-16 rounded-full bg-muted" />
  <div className="h-4 w-40 rounded bg-muted" />
  <div className="h-3 w-60 rounded bg-muted" />

  {[...Array(4)].map((_, i) => (
    <div key={i} className="h-12 rounded-lg bg-muted" />
  ))}
</div>
```

---

# 3️⃣ 🔗 Link Item Skeleton

## Create

```
components/skeletons/LinkItemSkeleton.tsx
```

---

## Structure

* Optional icon placeholder
* Title line
* Subtext line

---

# 4️⃣ 🎨 Theme Preview Skeleton

## Behavior

While theme or page is loading:

* Show skeleton layout matching final UI
* Maintain spacing and structure

---

## Rule

Skeleton layout MUST match real UI layout
→ Prevent layout shift

---

# 5️⃣ ⚙️ Data Loading Logic

## Show Skeleton When:

* `user === null`
* `page === null`
* `links === undefined`

---

## Example

```tsx
if (isLoading) {
  return <DashboardSkeleton />;
}
```

---

# 6️⃣ 🌐 Global Loading Strategy

## States to handle:

* Auth loading
* Page data loading
* Theme loading

---

## Rule

Always render:

* Skeleton (preferred)
  OR
* Inline loading (buttons)

Never block UI completely

---

# 7️⃣ 🎯 UX Enhancements

* Use `animate-pulse`
* Use theme-aware colors (bg-muted)
* Keep consistent spacing
* Avoid flickering

---

# 8️⃣ 🎨 Theme Compatibility (IMPORTANT)

Skeletons must:

* Respect current theme (light/dark)
* Use semantic colors (bg-muted, text-muted)

---

# 9️⃣ 🚫 Do NOT

* Use full-page spinners
* Show blank screen during fetch
* Change layout after load

---

# 🧪 Verification

* Login → button shows loading state
* Redirect → dashboard skeleton appears immediately
* Data loads → smooth transition to real content
* No layout shift or flicker

---

# 🎯 Expected Outcome

* Faster perceived load time
* Smooth UI transitions
* Professional and polished experience

---
