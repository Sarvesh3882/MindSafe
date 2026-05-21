import { createClient } from "@/lib/supabase/server";
import type { AssessmentScore } from "@/lib/aria/engine";
import { StudentResourcesClient } from "@/components/student/student-resources-client";

export default async function StudentResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view resources</div>;
  }

  // Get ALL resources (global + college-specific)
  const { data: allResources, error: resourcesError } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  // Get prescribed resources for this student
  const { data: prescriptions, error: prescriptionError } = await supabase
    .from("resource_prescriptions")
    .select(`
      id,
      prescribed_at,
      resource_id,
      users!resource_prescriptions_counsellor_id_fkey (
        full_name
      )
    `)
    .eq("student_id", user.id)
    .order("prescribed_at", { ascending: false });



  // Get latest assessment scores for personalization
  const { data: latestAssessment } = await supabase
    .from("assessments")
    .select("scores")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  const scores = latestAssessment?.scores as AssessmentScore | null;

  // Get personalized recommendations based on scores
  const recommendations = getPersonalizedRecommendations(scores, allResources ?? []);

  // Transform prescriptions data - match resource_id with resources
  const prescribedResourceIds = prescriptions?.map((p: any) => p.resource_id) ?? [];
  const prescriptionMap = prescriptions?.map((p: any) => ({
    resourceId: p.resource_id,
    prescribedAt: p.prescribed_at,
    counsellorName: p.users?.full_name ?? "Counsellor",
  })) ?? [];



  return (
    <StudentResourcesClient
      allResources={allResources ?? []}
      prescribedResourceIds={prescribedResourceIds}
      prescriptionMap={prescriptionMap}
      recommendations={recommendations}
      hasScores={!!scores}
    />
  );
}

/**
 * Get personalized resource recommendations based on ARIA scores
 */
function getPersonalizedRecommendations(
  scores: AssessmentScore | null,
  allResources: any[]
): any[] {
  if (!scores) return [];

  const recommendations: any[] = [];
  const categories: string[] = [];

  // Determine which categories to recommend based on clinical thresholds
  if (scores.stress >= 18) categories.push("Stress");
  if (scores.anxiety >= 10) categories.push("Anxiety");
  if (scores.depression >= 10) categories.push("Focus");
  if (scores.sleep >= 14) categories.push("Sleep");
  if (scores.burnout >= 66) categories.push("Stress");
  if (scores.loneliness >= 40) categories.push("Relationships");

  // If no specific concerns, show popular general wellness resources
  if (categories.length === 0) {
    return allResources.slice(0, 3);
  }

  // Get resources from recommended categories
  categories.forEach((cat) => {
    const categoryResources = allResources.filter(
      (r) => r.category?.toLowerCase() === cat.toLowerCase()
    );
    recommendations.push(...categoryResources);
  });

  // Return top 3-5 unique recommendations
  const unique = Array.from(new Set(recommendations.map((r) => r.id)))
    .map((id) => recommendations.find((r) => r.id === id)!)
    .slice(0, 5);

  return unique;
}
