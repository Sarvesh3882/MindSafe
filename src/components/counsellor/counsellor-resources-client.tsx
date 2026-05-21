"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link as LinkIcon, FileText, Video, X } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
  category: string;
  duration: string | null;
  created_at: string;
}

interface Student {
  id: string;
  full_name: string;
}

export function CounsellorResourcesClient({
  resources: initialResources,
  students,
  collegeId,
}: {
  resources: Resource[];
  students: Student[];
  collegeId: string;
}) {
  const [resources, setResources] = useState(initialResources);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [tips, setTips] = useState("");
  const [link, setLink] = useState("");
  const [linkType, setLinkType] = useState<"video" | "document">("video");

  async function handleCreateResource() {
    if (!title.trim() || !tips.trim()) {
      alert("Please fill in resource name and tips");
      return;
    }

    if (!collegeId) {
      alert("Error: College ID not found. Please refresh and try again.");
      return;
    }

    setCreating(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("resources")
      .insert({
        title: title.trim(),
        content: tips.trim(),
        url: link.trim() || null,
        type: linkType === "video" ? "video" : "article",
        category: "Custom",
        duration: null,
        college_id: collegeId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating resource:", error);
      alert(`Failed to create resource: ${error.message}`);
    } else if (data) {
      setResources([data, ...resources]);
      // Reset form
      setTitle("");
      setTips("");
      setLink("");
      setLinkType("video");
      setShowCreateForm(false);
    }

    setCreating(false);
  }

  async function handlePrescribe(resourceId: string, studentId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to prescribe resources");
      return;
    }

    // Check if already prescribed
    const { data: existing } = await supabase
      .from("resource_prescriptions")
      .select("id")
      .eq("student_id", studentId)
      .eq("resource_id", resourceId)
      .single();

    if (existing) {
      alert("This resource is already prescribed to this student");
      return;
    }

    // Insert prescription
    const { error } = await supabase.from("resource_prescriptions").insert({
      student_id: studentId,
      counsellor_id: user.id,
      resource_id: resourceId,
    });

    if (error) {
      console.error("Error prescribing resource:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        alert("This resource is already prescribed to this student");
      } else {
        alert(`Failed to prescribe resource: ${error.message}`);
      }
    } else {
      alert("Resource prescribed successfully!");
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">Resources</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Create and prescribe resources to students
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#3DBE29] hover:bg-[#2FA01F] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Resource
        </Button>
      </div>

      {/* Create Resource Form */}
      {showCreateForm && (
        <Card className="border-2 border-[#3DBE29]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1E1E2E]">Create New Resource</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-[#6B7280] hover:text-[#1E1E2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Resource Name */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E2E] mb-2">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Stress Management Techniques"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
                />
              </div>

              {/* Tips/Content */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E2E] mb-2">
                  Tips & Description *
                </label>
                <textarea
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  placeholder="Provide helpful tips and description for this resource..."
                  rows={4}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29] resize-none"
                />
              </div>

              {/* Link Type */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E2E] mb-2">
                  Link Type (Optional)
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLinkType("video")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                      linkType === "video"
                        ? "border-[#3DBE29] bg-[#F0FFF0] text-[#3DBE29]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3DBE29]"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Video Link
                  </button>
                  <button
                    onClick={() => setLinkType("document")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                      linkType === "document"
                        ? "border-[#3DBE29] bg-[#F0FFF0] text-[#3DBE29]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3DBE29]"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Document Link
                  </button>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E2E] mb-2">
                  {linkType === "video" ? "Video" : "Document"} URL (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={`https://example.com/${linkType === "video" ? "video" : "document"}`}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCreateResource}
                  disabled={creating || !title.trim() || !tips.trim()}
                  className="flex-1 bg-[#3DBE29] hover:bg-[#2FA01F] text-white"
                >
                  {creating ? "Creating..." : "Create Resource"}
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5FFF5] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#3DBE29]" />
            </div>
            <h3 className="font-semibold text-[#1E1E2E] mb-2">No resources yet</h3>
            <p className="text-[#6B7280] text-sm mb-4">
              Create your first resource to share with students
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#3DBE29] hover:bg-[#2FA01F] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              students={students}
              onPrescribe={handlePrescribe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  students,
  onPrescribe,
}: {
  resource: Resource;
  students: Student[];
  onPrescribe: (resourceId: string, studentId: string) => void;
}) {
  const [showStudents, setShowStudents] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#F5FFF5] flex items-center justify-center mb-4">
          {resource.type === "video" ? (
            <Video className="w-6 h-6 text-[#3DBE29]" />
          ) : (
            <FileText className="w-6 h-6 text-[#3DBE29]" />
          )}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-[#1E1E2E] mb-2 line-clamp-2">
          {resource.title}
        </h4>

        {/* Tips */}
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-3">
          {resource.content}
        </p>

        {/* Link */}
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#3DBE29] hover:underline flex items-center gap-1 mb-4"
          >
            <LinkIcon className="w-3 h-3" />
            View {resource.type === "video" ? "Video" : "Document"}
          </a>
        )}

        {/* Prescribe Button */}
        <div className="relative">
          <Button
            onClick={() => setShowStudents(!showStudents)}
            variant="outline"
            className="w-full border-[#3DBE29] text-[#3DBE29] hover:bg-[#F0FFF0]"
          >
            Prescribe to Student
          </Button>

          {/* Student Dropdown */}
          {showStudents && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {students.length === 0 ? (
                <p className="p-3 text-xs text-[#6B7280] text-center">
                  No students found
                </p>
              ) : (
                students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      onPrescribe(resource.id, student.id);
                      setShowStudents(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#1E1E2E] hover:bg-[#F5FFF5] transition-colors"
                  >
                    {student.full_name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
