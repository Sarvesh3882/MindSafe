"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Props {
  studentId: string;
  studentName: string;
}

export function SessionNotesEditor({ studentId, studentName }: Props) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSavedNotes, setLastSavedNotes] = useState("");

  // Load existing notes on mount
  useEffect(() => {
    loadNotes();
  }, [studentId]);

  async function loadNotes() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Get the most recent session notes for this student by this counsellor
      const { data } = await supabase
        .from("sessions")
        .select("notes")
        .eq("student_id", studentId)
        .eq("counsellor_id", user.id)
        .not("notes", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data?.notes) {
        setNotes(data.notes);
        setLastSavedNotes(data.notes);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveNotes() {
    if (!notes.trim()) return;
    
    // Don't save if notes haven't changed
    if (notes.trim() === lastSavedNotes.trim()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("sessions").insert({
        student_id: studentId,
        counsellor_id: user.id,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        type: "offline",
        status: "completed",
        notes: notes.trim(),
      });

      setLastSavedNotes(notes.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  }

  const hasUnsavedChanges = notes.trim() !== lastSavedNotes.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session Notes</CardTitle>
        <p className="text-xs text-[#6B7280]">Private — only visible to you</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3DBE29]"></div>
          </div>
        ) : (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Add notes for ${studentName}...`}
              rows={5}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#1E1E2E] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280]">
                {hasUnsavedChanges && "Unsaved changes"}
              </span>
              <Button
                onClick={saveNotes}
                loading={saving}
                disabled={!notes.trim() || saving}
                className="ml-auto"
                size="sm"
              >
                {saved ? "✓ Saved" : "Save notes"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
