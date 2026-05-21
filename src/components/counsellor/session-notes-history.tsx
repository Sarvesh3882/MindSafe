"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface SessionNote {
  id: string;
  date: string;
  time: string;
  notes: string;
  created_at: string;
}

interface Props {
  studentId: string;
}

export function SessionNotesHistory({ studentId }: Props) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNotesHistory();
  }, [studentId]);

  async function loadNotesHistory() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("sessions")
        .select("id, date, time, notes, created_at")
        .eq("student_id", studentId)
        .eq("counsellor_id", user.id)
        .not("notes", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading notes history:", error);
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error("Error loading notes history:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr || "N/A";
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3DBE29]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">No saved notes yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Notes History</span>
          <span className="text-xs font-normal text-[#6B7280]">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.map((note) => {
            const isExpanded = expandedNotes.has(note.id);
            const shouldTruncate = note.notes.length > 150;

            return (
              <div
                key={note.id}
                className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#3DBE29] transition-colors"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-2 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(note.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(note.time)}</span>
                  </div>
                </div>

                {/* Notes Content */}
                <div className="text-sm text-[#1E1E2E] whitespace-pre-wrap">
                  {isExpanded || !shouldTruncate
                    ? note.notes
                    : truncateText(note.notes)}
                </div>

                {/* Expand/Collapse Button */}
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpand(note.id)}
                    className="mt-2 text-xs text-[#3DBE29] hover:text-[#2da821] font-medium flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Show more
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
