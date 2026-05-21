import { Sidebar } from "@/components/shared/sidebar";

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export const dynamic = 'force-dynamic'; // Disable caching for this layout

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let profile = { full_name: "Demo Admin", email: "admin@demo.in", role: "admin" };

  if (!DEV_MODE) {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching admin profile:", error);
      redirect("/login");
      return;
    }
    
    if (data?.role !== "admin") {
      redirect("/login");
      return;
    }
    
    if (data) profile = data;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar role="admin" userName={profile.full_name} userEmail={profile.email} />
      <main className="ml-60 flex-1 p-5 md:p-8">
        <div className="mx-auto w-full max-w-[1360px]">{children}</div>
      </main>
    </div>
  );
}
