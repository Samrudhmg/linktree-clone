# Project Overview

This project is a **Linktree clone** built using **Next.js and Supabase**, designed to provide fast and customizable personal link pages.

The main goal is to allow users to create a simple page where they can share multiple links with a customizable appearance (profile image, themes, layouts, etc.).

---

# Tech Stack

- **OS:** Windows (Development Environment)
- **Package Manager:** pnpm

## Frontend

- **Next.js** (App Router)
- **Tailwind CSS v4**
- **Lucide React** (Icons)

## Backend / BaaS

- **Supabase**
  - Authentication
  - PostgreSQL Database
  - Storage (for user images and assets)

---

# Standards

## Maintainability

Code should be modular and easy to maintain.  
Reusable logic should be placed in the `lib/` directory, and UI elements should be split into reusable components whenever possible.

## Readability

Follow the existing naming conventions and project structure.  
Use **TypeScript** wherever possible to ensure better type safety and reduce runtime errors.

## Documentation

Any significant changes to the design system or architecture should be reflected in the `docs/` directory to keep the project documentation accurate and helpful.

## Security

When modifying database schemas or backend logic, always verify and update **Row Level Security (RLS)** policies in Supabase to ensure proper access control and data protection.