"use client";

import { usePathname } from "next/navigation";

// IllustrationBackdrop — only renders soft colour blobs as ambient background.
// Actual illustrations are placed directly in each page component.
// Login/signup/auth pages have their own full-screen layout — no backdrop needed.

export function IllustrationBackdrop() {
  const pathname = usePathname();

  // No backdrop on landing, login, signup, auth pages — they manage their own bg
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/checkout")
  ) {
    return null;
  }

  // Student pages — soft green ambient
  if (pathname.startsWith("/student")) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#3DBE29]/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#00C9A7]/8 blur-[100px]" />
      </div>
    );
  }

  // Counsellor pages — soft teal ambient
  if (pathname.startsWith("/counsellor")) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#00C9A7]/8 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-[#3DBE29]/6 blur-[100px]" />
      </div>
    );
  }

  // Admin pages — neutral ambient
  if (pathname.startsWith("/admin")) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-5%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#3DBE29]/6 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[25%] h-[25%] rounded-full bg-[#00C9A7]/6 blur-[100px]" />
      </div>
    );
  }

  return null;
}
