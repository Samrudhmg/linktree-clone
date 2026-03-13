# Security Guidelines

This document outlines the security architecture and standards for the Linktree Clone.

## Authentication
- Users are authenticated via **Supabase Auth**.
- Support for session-based authentication and OAuth providers.
- Admin dashboard routes are protected via Next.js middleware or server-side session checks.

## Database Security (RLS)
- **Supabase Row Level Security (RLS)** is enabled on all critical tables:
  - `profiles`: Users can only read/write their own profile data.
  - `links`: Users can only manage links associated with their account.
- **Policies**: Every new table must have explicit RLS policies defined before production deployment.

## Data Validation
- **TypeScript**: Used throughout the project to catch type-related bugs and ensure data integrity.
- **Server-side Validation**: All database mutations must be validated on the server or via Supabase RPC/Functions to prevent client-side bypass.

## Secrets Management
- All API keys, database secrets, and private configuration must be stored in `.env.local`.
- **NEVER** commit secrets to the repository.
- Use `NEXT_PUBLIC_` prefix only for keys that are safe to expose to the client.

## File Storage
- User uploads (avatars, thumbnails) are stored in Supabase Storage buckets.
- Bucket policies are configured to ensure that only authenticated owners can upload or delete their files.
