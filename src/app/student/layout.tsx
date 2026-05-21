import { Sidebar } from "@/components/shared/sidebar";
import { AnonymousProvider } from "@/lib/anonymous-context";
import { FloatingChatButton } from "@/components/student/floating-chat-button";

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export const dynamic = 'force-dynamic'; // Disable caching for this layout
export const revalidate = 0; // Never cache this page

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  let profile = { full_name: "Demo Student", email: "student@demo.in", role: "student" };

  if (!DEV_MODE) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    
    // Get auth user first - this is the source of truth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
    }

    // Allow anonymous access — don't redirect if no user
    if (user) {
      // ALWAYS use auth metadata as the primary source
      // This prevents "Guest" from showing when DB query fails
      const authFallback = {
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
        email: user.email || "",
        role: "student"
      };

      // Try to get profile from database, but don't rely on it
      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, role")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        // Use auth metadata
        profile = authFallback;
      } else if (data && data.full_name) {
        // User profile found in database with valid name
        if (data.role && data.role !== "student") {
          const { redirect } = await import("next/navigation");
          redirect(`/${data.role}`);
        }
        profile = data;
      } else {
        // Profile exists but no name, or profile doesn't exist
        // Use auth data - NEVER show "Guest" for authenticated users
        profile = authFallback;
      }
    } else {
      // No auth user - truly anonymous
      profile = { full_name: "Guest", email: "", role: "student" };
    }
  }

  return (
    <AnonymousProvider>
      <div className="flex h-screen overflow-hidden bg-[#F8FAF9]">
        <Sidebar role="student" userName={profile.full_name} userEmail={profile.email} />
        <main className="ml-60 flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
        {/* Floating chat button — outside main so it stays fixed on scroll */}
        <FloatingChatButton />
      </div>
    </AnonymousProvider>
  );
}
