"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BulkOnboardingForm({ collegeId }: { collegeId: string }) {
  const [role, setRole] = useState<"student" | "counsellor">("student");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; errors: string[] } | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean).slice(1); // skip header
    const created: string[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      const [fullName, email] = line.split(",").map((s) => s.trim());
      if (!email || !fullName) { errors.push(`Invalid row: ${line}`); continue; }

      const res = await fetch("/api/admin/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, role, collegeId }),
      });

      if (res.ok) created.push(email);
      else errors.push(`Failed: ${email}`);
    }

    setResult({ created: created.length, errors });
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {(["student", "counsellor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-lg text-sm border-2 capitalize transition-all ${
              role === r ? "border-[#3DBE29] bg-[#F5FFF5] text-[#3DBE29] font-semibold" : "border-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            {r}s
          </button>
        ))}
      </div>

      <div className="bg-[#F8F9FF] rounded-xl p-4 text-xs text-[#6B7280]">
        <p className="font-semibold mb-1">CSV Format:</p>
        <code className="font-mono">Full Name,Email</code><br />
        <code className="font-mono">Arjun Sharma,arjun@college.edu.in</code>
      </div>

      <form onSubmit={handleUpload} className="space-y-3">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-[#6B7280] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3DBE29] file:text-white hover:file:bg-[#32A822] cursor-pointer"
        />
        <Button type="submit" loading={loading} disabled={!file} className="w-full">
          Upload & Create Accounts
        </Button>
      </form>

      {result && (
        <div className={`rounded-xl p-4 text-sm ${result.errors.length === 0 ? "bg-[#F0FFF0] text-[#3DBE29]" : "bg-[#FFF8F0] text-[#FF9F43]"}`}>
          <p className="font-semibold">✓ {result.created} accounts created</p>
          {result.errors.map((e, i) => <p key={i} className="text-xs mt-1">{e}</p>)}
        </div>
      )}
    </div>
  );
}
