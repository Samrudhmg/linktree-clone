## Fixing Lint Issues

[!IMPORTANT]

The following lint and TypeScript issues were identified in the project and fixed with the help of Copilot.

### Type Safety Improvements
- Replaced `any` types with proper TypeScript types such as `SupabaseClient`, `PostgrestError`, `LinkPage`, and `Link`.
- Files updated:  
  `themes.ts`, `Sidebar.tsx`, `PageAppearance.tsx`, `LinkForm.tsx`, `CustomSection.tsx`, `ProfileSection.tsx`, `PageList.tsx`.

### Error Handling
- Replaced `catch (error: any)` with `catch (error: unknown)` and handled errors using `instanceof Error` checks.
- Files updated:  
  `LinkCard.tsx`, `LinkForm.tsx`, `CustomSection.tsx`, `ProfileSection.tsx`.

### TypeScript Compliance
- Removed `@ts-nocheck` directives and added proper TypeScript typings.
- Files updated:  
  `LivePreview.tsx`, `ProfileHeader.tsx`.

### Code Quality Improvements
- Fixed unescaped `"` entities in JSX.
- File updated:  
  `LinkCard.tsx`.

### Image Optimization
- Replaced all standard `<img>` tags with Next.js `<Image>` components for better performance, automatic lazy loading, and optimization.
- Configured `next.config.ts` to allow optimized image loading from the Supabase storage domain.
- Files updated:
  `components/ui/LinkThumbnail.tsx`, `components/ShareModal.tsx`, `components/ProfileHeader.tsx`, `components/LivePreview.tsx`, `components/LinkForm.tsx`, `components/LinkCard.tsx`, `components/appearance/ProfileSection.tsx`, `app/[slug]/page.tsx`.

### Cleanup
- Fixed syntax errors and broken imports introduced during the migration process.
- Removed unused imports and variables across affected files.
- Ran `pnpm lint` and `pnpm build`, confirming the project is compliant with Next.js best practices.

All identified lint issues were addressed, and Copilot confirmed that the fixes have been completed.