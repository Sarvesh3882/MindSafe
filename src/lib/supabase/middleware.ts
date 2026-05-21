import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { pathname } = request.nextUrl;

  // ── DEV BYPASS ──────────────────────────────────────────────────────────────
  // When Supabase is not yet configured (placeholder keys), skip auth entirely
  // so all pages are accessible for local UI development.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isSupabaseConfigured =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("your-project") &&
    !supabaseUrl.includes("placeholder");

  if (!isSupabaseConfigured) {
    return supabaseResponse; // Let all requests through — no auth check
  }
  // ────────────────────────────────────────────────────────────────────────────

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow all API routes without authentication
  if (pathname.startsWith('/api')) {
    return supabaseResponse;
  }

  // Public routes (allow access without authentication)
  const publicRoutes = [
    "/",
    "/login",
    "/login/student",
    "/login/counsellor", 
    "/login/admin",
    "/signup",
    "/signup/student",
    "/signup/counsellor",
    "/demo",
    "/forgot-password",
    "/reset-password",
    "/student/checkin",
    "/student/resources"
  ];
  if (publicRoutes.includes(pathname)) return supabaseResponse;

  // Allow anonymous student access — /student/anonymous sets the guest session
  // and all /student/* routes are accessible to guests (layout handles restrictions)
  if (pathname.startsWith("/student/anonymous")) return supabaseResponse;

  // Allow full student area for anonymous/guest users
  // The student layout and individual pages handle feature gating
  if (pathname.startsWith("/student") && !user) {
    // Check if this is a guest-allowed path (dashboard, checkin, resources)
    const guestAllowed = ["/student", "/student/checkin", "/student/resources"];
    const isGuestAllowed = guestAllowed.some(p => pathname === p || pathname.startsWith(p + "/"));
    if (isGuestAllowed) return supabaseResponse;
  }

  // Not logged in — redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based routing — only enforce for authenticated users
  const role = user.user_metadata?.role;
  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/counsellor") && role !== "counsellor") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
