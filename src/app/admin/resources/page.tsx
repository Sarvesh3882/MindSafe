import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { AddResourceForm } from "@/components/admin/add-resource-form";

const TYPE_EMOJI: Record<string, string> = {
  video: "🎥", article: "📖", exercise: "🏃", meditation: "🧘", breathing: "💨",
};

export default async function AdminResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .or(`college_id.eq.${adminProfile?.college_id},college_id.is.null`)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">Resource Library</h1>
          <p className="text-[#6B7280] text-sm mt-1">Manage wellness content available to your students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource list */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {!resources?.length ? (
                <div className="p-8 text-center text-[#6B7280] text-sm">No resources yet. Add your first one →</div>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {resources.map((r) => (
                    <div key={r.id as string} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F5FFF5] flex items-center justify-center text-lg">
                          {TYPE_EMOJI[r.type as string] ?? "📌"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1E1E2E]">{r.title as string}</p>
                          <p className="text-xs text-[#6B7280] capitalize">{r.type as string} · {r.category as string}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#6B7280]">
                        {r.college_id ? "College" : "Global"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add resource form */}
        <div>
          <AddResourceForm collegeId={adminProfile?.college_id ?? ""} />
        </div>
      </div>
    </div>
  );
}
