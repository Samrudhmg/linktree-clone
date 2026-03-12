import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Allowed email domain - only @eltglobal.in users can sign in
const ALLOWED_DOMAIN = "eltglobal.in";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user's email to validate domain
      const { data: { user } } = await supabase.auth.getUser();

      // if (user?.email) {
      //   const emailDomain = user.email.split("@")[1];

      //   // Check if email is from allowed domain
      //   if (emailDomain !== ALLOWED_DOMAIN) {
      //     // Sign out the unauthorized user
      //     await supabase.auth.signOut();

      //     // Redirect to login with error message
      //     return NextResponse.redirect(
      //       new URL(`/login?error=unauthorized&message=Only @${ALLOWED_DOMAIN} emails are allowed`, request.url)
      //     );
      //   }
      // }
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
