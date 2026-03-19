// FIX SHADCN ANIMATIONS (Radix + tailwindcss-animate)

// Problem:
// All Dialog / Sheet / Dropdown / Popover components are opening instantly
// or closing without animation. Exit animations are not working.

// Goal:
// Enable smooth open + close animations using shadcn's recommended approach:
// - tailwindcss-animate
// - Radix data-state attributes
// - No framer-motion

// TASK:

// 1. Ensure tailwindcss-animate is installed and configured
// If not present:
// npm install tailwindcss-animate

// In tailwind.config.js:
plugins: [require("tailwindcss-animate")]


// 2. UPDATE ALL SHADCN COMPONENTS TO USE data-[state] ANIMATIONS

// Example: DialogContent

className="
data-[state=open]:animate-in
data-[state=closed]:animate-out

data-[state=open]:fade-in-0
data-[state=closed]:fade-out-0

data-[state=open]:zoom-in-95
data-[state=closed]:zoom-out-95

data-[state=open]:slide-in-from-bottom-4
data-[state=closed]:slide-out-to-bottom-4

duration-200 ease-out
"


// 3. UPDATE OVERLAY (VERY IMPORTANT)

className="
fixed inset-0 bg-black/50 backdrop-blur-sm

data-[state=open]:animate-in
data-[state=closed]:animate-out

data-[state=open]:fade-in-0
data-[state=closed]:fade-out-0

duration-200
"


// 4. APPLY SAME PATTERN TO:

// - SheetContent
// - DropdownMenuContent
// - PopoverContent
// - TooltipContent


// 5. REMOVE ANY CONDITIONAL RENDERING LIKE:

// ❌ {open && <DialogContent />}

// MUST USE:
// Radix controlled state ONLY


// 6. ENSURE COMPONENTS ARE NOT UNMOUNTED IMMEDIATELY

// Radix should control mount/unmount
// DO NOT manually remove components on close


// 7. ADD SMOOTH EASING

duration-200 ease-out


// 8. VERIFY:

// - Opening animation works
// - Closing animation plays before disappearing
// - No instant closing
// - Works across all popup components


// EXPECTED RESULT:

// - Dialog fades + zooms smoothly
// - Overlay fades in/out
// - Closing feels smooth (not instant)
// - UI feels like modern SaaS (Linear / Vercel)