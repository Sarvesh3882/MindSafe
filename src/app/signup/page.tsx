"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, role: "student" },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: form.email,
        full_name: form.fullName,
        role: "student",
      });
      router.push("/student");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen app-shell px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="panel-surface rounded-[30px] p-6 sm:p-8"
        >
          <div className="mb-8 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-[#3DBE29] to-[#00C9A7] rounded-xl flex items-center justify-center shadow-md shadow-[#3DBE29]/30">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-[#1F2A33] tracking-tight">
                Mind<span className="text-[#3DBE29]">Safe</span>
              </span>
            </Link>
            <h1 className="text-3xl font-extrabold text-[#1E1E2E] font-student">Create your account</h1>
            <p className="text-[#637084] mt-2 text-sm">Your wellness journey starts here 🌿</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Arjun Sharma"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="College Email"
              name="email"
              type="email"
              placeholder="arjun@college.edu.in"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="bg-[#FFF0F0] border border-[#FF6B6B]/20 rounded-lg p-3 text-sm text-[#FF6B6B]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] border-0 hover:opacity-95"
              size="lg"
              loading={loading}
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#238F29] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[#6B7280] mt-6">
            Your data is encrypted and private. Always. 🔒
          </p>
        </motion.div>

        {/* Right illustration panel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="panel-surface hidden lg:flex rounded-[30px] p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#DFF8D8]/70 via-transparent to-[#DDF4FF]/70" />
          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#2D8A47]">Join MindSafe</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#1D2B35] max-w-sm">
                Your wellness, your way.
              </h2>
              <p className="mt-3 text-sm text-[#4F6070] max-w-sm">
                Check in daily, track your mood, chat with Saathi, and book sessions with your counsellor — all in one private space.
              </p>
              <ul className="mt-6 space-y-2">
                {["Private & encrypted", "Takes less than 2 minutes a day", "No judgment, no labels"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#2D2D2D]">
                    <div className="w-5 h-5 rounded-full bg-[#3DBE29]/20 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3DBE29" strokeWidth={3} className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[280px] w-full">
              <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#3DBE29]/18 blur-2xl animate-pulse-fade" />
              <Image src="/illustrations/wellness-orbit.svg" alt="Wellness illustration" fill className="object-contain" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
