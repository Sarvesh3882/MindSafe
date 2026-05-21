"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddResourceForm({ collegeId }: { collegeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "article", category: "Stress", url: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("resources").insert({
      title: form.title,
      type: form.type,
      category: form.category,
      url: form.url || null,
      college_id: collegeId,
    });
    setForm({ title: "", type: "article", category: "Stress", url: "" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" placeholder="Resource title" value={form.title} onChange={handleChange} required />
          <div>
            <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DBE29]">
              {["article", "video", "exercise", "meditation", "breathing"].map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E1E2E] mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DBE29]">
              {["Stress", "Anxiety", "Sleep", "Focus", "Relationships", "Burnout"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input label="URL (optional)" name="url" type="url" placeholder="https://..." value={form.url} onChange={handleChange} />
          <Button type="submit" className="w-full" loading={loading}>Add Resource</Button>
        </form>
      </CardContent>
    </Card>
  );
}
