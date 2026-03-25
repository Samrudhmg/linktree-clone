# 🚀 REFACTOR: Routing & Page Flow Optimization

## 🎯 Goal

Improve performance and UX by separating:

* Page management (authenticated)
* Page editing (dashboard)
* Public hosted pages

---

## 🧱 Route Structure

### 🔐 Authenticated Routes

* `/login` → login page
* `/pages` → list of user pages
* `/pages/[slug]` → page editor (dashboard)

---

### 🌐 Public Routes

* `/[slug]` → public hosted page

---

## ⚙️ Behavior

### Login Flow

* After login → redirect to `/pages`

---

### Pages List (`/pages`)

* Fetch all user pages
* Display list
* Clicking a page → `/pages/[slug]`

---

### Page Editor (`/pages/[slug]`)

* Load only selected page data
* Validate ownership
* If invalid → redirect to `/pages`

---

### Public Page (`/[slug]`)

* Fetch page by slug
* Render public view
* No authentication required

---

## 🔒 Access Control

* `/pages` → requires auth
* `/pages/[slug]` → requires auth + ownership check
* `/[slug]` → public

---

## ⚠️ Constraints

* `link_pages.slug` MUST be globally unique
* Reserved routes:

  * `/pages`
  * `/login`
  * `/api`

---

## 🚀 Performance Benefits

* Faster initial load (lightweight `/pages`)
* Lazy loading of editor
* Better perceived performance

---

## 🧪 Verification

* Login → lands on `/pages`
* Clicking page → opens editor
* Visiting `/[slug]` → shows public page
* No route conflicts
* Unauthorized access blocked

---

## 🎯 Expected Outcome

* Clean navigation flow
* Faster load times
* Scalable routing system

---
