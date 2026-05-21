"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Video, ExternalLink, User, Sparkles } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
  category: string;
  duration: string | null;
}

interface PrescriptionInfo {
  resourceId: string;
  prescribedAt: string;
  counsellorName: string;
}

const TYPE_EMOJI: Record<string, string> = {
  video: "🎥",
  article: "📖",
  exercise: "🏃",
  meditation: "🧘",
  breathing: "💨",
};

const CATEGORIES = ["All", "Stress", "Sleep", "Anxiety", "Focus", "Relationships", "Custom"];

export function StudentResourcesClient({
  allResources,
  prescribedResourceIds,
  prescriptionMap,
  recommendations,
  hasScores,
}: {
  allResources: Resource[];
  prescribedResourceIds: string[];
  prescriptionMap: PrescriptionInfo[];
  recommendations: Resource[];
  hasScores: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Convert arrays to Set and Map for efficient lookup
  const prescribedIdsSet = new Set(prescribedResourceIds);
  const prescriptionInfoMap = new Map(
    prescriptionMap.map(p => [p.resourceId, { prescribedAt: p.prescribedAt, counsellorName: p.counsellorName }])
  );

  // Separate prescribed and other resources FIRST (before filtering)
  const prescribedResources = allResources.filter((r) =>
    prescribedIdsSet.has(r.id)
  );
  
  const nonPrescribedResources = allResources.filter(
    (r) => !prescribedIdsSet.has(r.id)
  );

  // THEN apply category filter only to non-prescribed resources
  const filteredOtherResources =
    selectedCategory === "All"
      ? nonPrescribedResources
      : nonPrescribedResources.filter((r) => r.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Resources</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Mental health resources and tools for your wellbeing
        </p>
      </div>

      {/* Personalized Recommendations */}
      {hasScores && recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3DBE29]" />
            <h2 className="font-semibold text-[#1E1E2E]">
              Recommended for You
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isPrescribed={prescribedIdsSet.has(resource.id)}
                prescriptionInfo={prescriptionInfoMap.get(resource.id)}
                isRecommended
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-[#3DBE29] text-white"
                : "bg-[#F5FFF5] text-[#6B7280] hover:bg-[#E8F5E8]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Prescribed Resources Section */}
      {prescribedResources.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#3DBE29]" />
            <h2 className="font-semibold text-[#1E1E2E]">
              Prescribed by Your Counsellor
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescribedResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isPrescribed
                prescriptionInfo={prescriptionInfoMap.get(resource.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Resources Section */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#1E1E2E]">
          {prescribedResources.length > 0 ? "All Resources" : "Browse Resources"}
        </h2>
        {filteredOtherResources.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
              <p className="text-[#6B7280]">
                No resources found in this category
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOtherResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isPrescribed={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  isPrescribed,
  prescriptionInfo,
  isRecommended,
}: {
  resource: Resource;
  isPrescribed: boolean;
  prescriptionInfo?: { prescribedAt: string; counsellorName: string };
  isRecommended?: boolean;
}) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        isPrescribed ? "border-2 border-[#3DBE29]" : ""
      } ${isRecommended ? "bg-[#F5FFF5]" : ""}`}
    >
      <CardContent className="p-5">
        {/* Header with icon and category */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5FFF5] flex items-center justify-center text-xl">
            {TYPE_EMOJI[resource.type] ?? "📌"}
          </div>
          <span className="text-xs bg-[#F8F9FF] text-[#6B7280] px-2 py-1 rounded-full capitalize">
            {resource.category}
          </span>
        </div>

        {/* Prescribed badge */}
        {isPrescribed && prescriptionInfo && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-[#3DBE29]">
            <User className="w-3.5 h-3.5" />
            <span>Recommended by {prescriptionInfo.counsellorName}</span>
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold text-[#1E1E2E] text-sm leading-snug mb-2">
          {resource.title}
        </h4>

        {/* Duration */}
        {resource.duration && (
          <p className="text-xs text-[#6B7280] mb-3">{resource.duration}</p>
        )}

        {/* Content/Description */}
        {resource.content && (
          <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
            {resource.content}
          </p>
        )}

        {/* Link */}
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3DBE29] hover:text-[#2FA01F] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Resource
          </a>
        )}
      </CardContent>
    </Card>
  );
}
