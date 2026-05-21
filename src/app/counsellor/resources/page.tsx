import { createClient } from "@/lib/supabase/server";
import { CounsellorResourcesClient } from "@/components/counsellor/counsellor-resources-client";

export default async function CounsellorResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  // Get counsellor's created resources
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("college_id", profile?.college_id)
    .order("created_at", { ascending: false });

  // Get students for prescribing
  const { data: students } = await supabase
    .from("users")
    .select("id, full_name")
    .eq("college_id", profile?.college_id)
    .eq("role", "student")
    .order("full_name");

  return (
    <CounsellorResourcesClient 
      resources={resources ?? []} 
      students={students ?? []}
      collegeId={profile?.college_id ?? ""}
    />
  );
}
