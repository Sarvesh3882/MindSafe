import { Sidebar } from "@/components/shared/sidebar";

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export const dynamic = 'force-dynamic'; // Disable caching for this layout
export const revalidate = 0; // Never cache this page

export default async function CounsellorLayout({ children }: { children: React.ReactNode }) {
  let profile = { full_name: "Demo Counsellor", email: "counsellor@demo.in", role: "counsellor" };

  if (!DEV_MODE) {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      redirect("/login");
      return;
    }

    // Use auth metadata as fallback to prevent "Guest" display
    const authFallback = {
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Counsellor",
      email: user.email || "",
      role: "counsellor"
    };

    const { data, error } = await supabase
      .from("users")
      .select("full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching counsellor profile:", error);
      // Use auth fallback instead of redirecting
      profile = authFallback;
    } else if (data && data.full_name) {
      // Check role
      if (data.role !== "counsellor") {
        redirect("/login");
        return;
      }
      profile = data;
    } else {
      // Profile missing or no name - use auth fallback
      profile = authFallback;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFB]">
      <Sidebar role="counsellor" userName={profile.full_name} userEmail={profile.email} />
      <main className="ml-60 flex-1 overflow-y-auto p-5 md:p-8">
        <div className="mx-auto w-full max-w-[1360px]">{children}</div>
      </main>
    </div>
  );
}
