"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Counsellor {
  id: string;
  full_name: string;
  email: string;
}

export default function BookSessionPage() {
  const router = useRouter();
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"online" | "offline">("online");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadCounsellors() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, try to get the student's profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("college_id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      // If profile doesn't exist or has no college_id, show all counsellors
      // This handles cases where college_id might be null for both student and counsellor
      let counsellorQuery = supabase
        .from("users")
        .select("id, full_name, email, college_id")
        .eq("role", "counsellor")
        .not("full_name", "is", null); // Only get counsellors with names

      // Only filter by college if student has a college_id
      if (profile?.college_id) {
        counsellorQuery = counsellorQuery.eq("college_id", profile.college_id);
      }

      const { data, error } = await counsellorQuery;

      if (error) {
        console.error("Counsellors error:", error);
      }

      const counsellorsList = (data ?? []).filter(c => c.full_name); // Extra safety check
      setCounsellors(counsellorsList);
      if (counsellorsList[0]) setSelectedCounsellor(counsellorsList[0].id);
    }
    loadCounsellors();
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCounsellor || !date || !time) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("sessions").insert({
      student_id: user!.id,
      counsellor_id: selectedCounsellor,
      date,
      time,
      type,
      status: "scheduled",
    });

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/student/sessions"), 1500);
  }

  if (success) {
    return (
      <div className="font-student flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-[#1E1E2E]">Session booked!</h2>
          <p className="text-[#6B7280] text-sm mt-1">Redirecting to your sessions...</p>
        </div>
      </div>
    );
  }

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="font-student space-y-6 pb-12 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Book a Session</h1>
        <p className="text-[#6B7280] text-sm mt-1">Confidential. Safe. On your terms.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleBook} className="space-y-5">
            {/* Counsellor */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Choose Counsellor</label>
              {counsellors.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No counsellors available at your college yet.</p>
              ) : (
                <div className="space-y-2">
                  {counsellors.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCounsellor === c.id ? "border-[#3DBE29] bg-[#F5FFF5]" : "border-[#E5E7EB] hover:border-[#3DBE29]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="counsellor"
                        value={c.id}
                        checked={selectedCounsellor === c.id}
                        onChange={() => setSelectedCounsellor(c.id)}
                        className="accent-[#3DBE29]"
                      />
                      <div className="w-8 h-8 rounded-full bg-[#3DBE29]/10 flex items-center justify-center text-[#3DBE29] font-bold text-sm">
                        {c.full_name?.[0]?.toUpperCase() ?? "C"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E1E2E]">{c.full_name || "Counsellor"}</p>
                        <p className="text-xs text-[#6B7280]">{c.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                min={minDateStr}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Preferred Time</label>
              <div className="grid grid-cols-3 gap-2">
                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`py-2 rounded-lg text-sm border-2 transition-all ${
                      time === t ? "border-[#3DBE29] bg-[#F5FFF5] text-[#3DBE29] font-semibold" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3DBE29]/50"
                    }`}
                    suppressHydrationWarning
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Session Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(["online", "offline"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-3 rounded-xl text-sm border-2 capitalize transition-all ${
                      type === t ? "border-[#3DBE29] bg-[#F5FFF5] text-[#3DBE29] font-semibold" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3DBE29]/50"
                    }`}
                    suppressHydrationWarning
                  >
                    {t === "online" ? "💻 Online" : "🏫 In-person"}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={!selectedCounsellor || !date || !time}
            >
              Confirm Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
