# 🧩 Implementation Plan – Fix Google Profile Sync (Header Only)

## 🎯 Goal

Ensure that:

- ✅ Google **name + avatar** appear ONLY in the **top-left header**
- ❌ NOT auto-filled into page **title** or **bio**
- ❌ NOT injected into page data on creation
- ✅ New pages are **completely empty**
- ✅ Page content (title, bio, avatar) is **user-controlled only**

---

## 🚨 Problem Summary

Currently:

- Google profile data is incorrectly being used to populate:
  - Page title ❌
  - Page bio ❌
  - Page avatar ❌

👉 This mixes **user identity data** with **page content**, causing bad UX.

---

## ✅ Expected Behavior

| Data        | Source      | Where it should appear |
| ----------- | ----------- | ---------------------- |
| Name        | Google Auth | Header (top-left)      |
| Avatar      | Google Auth | Header (top-left)      |
| Page Title  | User Input  | Page only              |
| Bio         | User Input  | Page only              |
| Page Avatar | User Input  | Page only              |

---

## ⚙️ Implementation Changes

---

## 1️⃣ Fix Page Creation Logic

### [MODIFY] Page Creation Function

### ❌ REMOVE:

```ts
title: user.name,
bio: user.email,
avatar_url: user.image,
```

### ✅ REPLACE WITH:

```ts
title: '',
bio: '',
avatar_url: null,
```

👉 Result:

- New page starts **empty**
- No auto-filled content

---

## 2️⃣ Use Google Data Only in Header

### 📍 Source:

```ts
user.user_metadata = {
  full_name: string,
  avatar_url: string,
};
```

---

## 3️⃣ Update Header Component (Top-Left)

### [MODIFY] Header / Sidebar Top Section

### ✅ Replace static values:

```tsx
<Image src={user.user_metadata.avatar_url} />
<span>{user.user_metadata.full_name}</span>
```

---

### ⚠️ IMPORTANT

- DO NOT use `page` data here
- ONLY use authenticated `user`

```ts
const { user } = useAuth();
```

---

## 4️⃣ Remove Auto-Sync Logic

### [SEARCH & REMOVE]

Any logic like:

```ts
setPage({
  title: user.name,
  bio: user.email,
});
```

❌ DELETE completely

---

## 5️⃣ Fix Page Preview (Right Side Mobile View)

### [MODIFY]

### ❌ Current:

- Uses Google data automatically

### ✅ Update:

```ts
name = page.title || "Your Name";
avatar = page.avatar_url || defaultAvatar;
```

👉 Result:

- Empty page shows placeholder
- No Google data leak

---

## 6️⃣ Keep Page Fully User-Controlled

- Title → user types
- Bio → user types
- Avatar → user uploads

👉 No automatic population

---

## 🧪 Verification Plan

---

### ✅ Test 1: Create New Page

- Click "Create New Page"

Expected:

- Title = empty
- Bio = empty
- Avatar = empty

---

### ✅ Test 2: Header

- Top-left shows:
  - Google avatar
  - Google name

---

### ✅ Test 3: Page Editor

- No pre-filled data
- User inputs everything manually

---

### ✅ Test 4: Preview

- Shows placeholders initially
- Updates only after user edits

---

## ⚠️ Key Rule

> NEVER mix `user` (auth data) with `page` (content data)

---

## 🧠 Final Architecture

### 🔹 Auth Layer

```ts
user.full_name;
user.avatar_url;
```

### 🔹 Page Layer

```ts
page.title;
page.bio;
page.avatar_url;
```

👉 Keep them completely separate

---

## 🚀 Final Result

- Clean page creation ✅
- Correct header identity ✅
- No unwanted auto-fill ✅
- Better UX + scalable structure ✅

---
