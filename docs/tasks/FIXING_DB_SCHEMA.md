# ✅ TASK: Clean Supabase Schema & Migrations

## 🎯 Goal

You are given a Supabase schema file.

Your job is to:

1. Analyze the entire file
2. Identify the **final intended schema**
3. Remove all duplicate / outdated / conflicting migrations
4. Generate a **clean, minimal, production-ready schema**
5. Output a **single migration file**

---

## ⚠️ Critical Context

The provided file contains:

* Multiple overlapping migrations
* Repeated `ALTER TABLE` statements
* Old schema + new schema mixed together
* Temporary fixes and patches
* A "FINAL DATABASE SCHEMA" section (this is closest to the truth but still noisy)

👉 You MUST NOT blindly copy everything
👉 You MUST extract only the **final correct structure**

---

## 🧩 What the Final Schema MUST Support

### Core Features:

* Users (via Supabase auth)
* Profiles
* Multiple link pages per user
* Links inside pages
* Themes (page-based, NOT user-based)
* Click tracking (analytics)

---

## 🏗️ Required Tables (ONLY KEEP THESE)

### 1. profiles

* Basic user info
* NO styling fields (remove old theme-related columns)

### 2. link_pages

* Must support:

  * slug (globally unique)
  * user_id
  * display_name, bio, avatar
  * theme_id (IMPORTANT)
* Keep minimal fallback styling only if necessary

### 3. links

* Must belong to page_id
* Include:

  * title, url, subtext
  * position, enabled
  * basic styling (optional but clean)

### 4. themes

* MUST be **page-based**
* Supports:

  * page_id (FK)
  * config (JSONB)
  * optional extracted fields:

    * title_color
    * bio_color
    * avatar_style
    * link_text_color
    * link_subtext_color

👉 REMOVE:

* user_settings table
* user-based theme logic

### 5. click_events

* Simple analytics table
* Keep minimal

---

## ❌ What MUST Be Removed

* Duplicate `ALTER TABLE` blocks
* Repeated policy creation
* Old gradient column renames
* Any profile styling fields
* user_settings table
* Duplicate theme constraints
* Multiple RLS rewrites (keep only final version)
* Any migration "fix" sections

---

## 🔐 RLS Rules (Simplified)

Use ONLY these:

* profiles → public read, own write
* link_pages → public read, owner full access
* links → public read, owner full access
* themes → public read, owner full access
* click_events:

  * public insert
  * owner can read

---

## 🧱 Constraints

* `link_pages.slug` → UNIQUE (GLOBAL)
* `themes.page_id` → NOT UNIQUE (allow multiple themes per page)
* All FK relationships must be valid
* Add indexes for:

  * slug
  * page_id
  * link_id

---

## 📦 Output Requirements

You MUST output:

### 1. ✅ Clean Final Schema

* Fully runnable SQL
* No duplicates
* No legacy junk

### 2. ✅ Single Migration File

* Idempotent (safe to run)
* Uses `IF NOT EXISTS`
* Clean structure

### 3. ❌ DO NOT

* Add explanations
* Add comments like "maybe"
* Keep old logic

---

## 🧠 Important Logic Rules

* Themes are **page-based only**
* One page can have multiple themes
* Active theme is selected via `link_pages.theme_id`
* Profiles should NOT contain theme styling

---

## 🚨 Final Instruction

If there are conflicts:
👉 ALWAYS prefer the **latest “FINAL DATABASE SCHEMA” logic**
👉 BUT clean and simplify it

---

## ✅ Expected Result

A **clean, minimal, scalable schema** ready for production
(no duplicated migrations, no conflicting logic)

---
