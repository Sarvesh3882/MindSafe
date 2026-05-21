"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function StudentLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        setError("Failed to verify user role. Please try again.");
        setLoading(false);
        return;
      }

      if (userData.role !== "student") {
        await supabase.auth.signOut();
        setError("Please use the correct login page for your role.");
        setLoading(false);
        return;
      }

      router.push("/student");

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-shrink-0 flex-col bg-gradient-to-br from-[#E8F5E9] via-[#F0FFF4] to-[#DCF5E8]">

        {/* Illustration fills the ENTIRE panel as background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-0 z-0 flex items-center justify-center p-6 pt-24 pb-12"
        >
          <Image
            src="/illustrations/Student.svg"
            alt="Student wellness illustration"
            fill
            className="object-contain"
            style={{ objectPosition: "center center" }}
            priority
          />
        </motion.div>

        {/* Gradient overlay at top — keeps logo readable */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9]/80 to-transparent z-10 pointer-events-none" />

        {/* Gradient overlay at bottom — keeps caption readable */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#DCF5E8]/90 to-transparent z-10 pointer-events-none" />

        {/* Logo — sits on top of gradient */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 pt-7 pl-8"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" priority />
            <span className="text-lg font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
              <span className="text-[#4A6741] font-semibold text-sm ml-1">India</span>
            </span>
          </Link>
        </motion.div>

        {/* Student Portal badge */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-20 mt-4 ml-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#3DBE29]/30 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#3DBE29] animate-pulse" />
            <span className="text-xs font-bold text-[#3DBE29]">Student Portal</span>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Caption — bottom */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-20 pb-6 text-center px-8"
        >
          <p className="text-sm font-bold text-[#2D4A28]">
            Welcome back! Continue your wellness journey 🌿
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-14">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo-icon.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
              <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
                Mind<span className="text-[#3DBE29]">Safe</span>
                <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
              </span>
            </Link>
          </motion.div>

          {/* Back + heading */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-[#3DBE29] transition-colors mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to role selection
            </Link>

            {/* Role pill */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#3DBE29]/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3DBE29" strokeWidth={1.75} className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#3DBE29] bg-[#3DBE29]/10 px-2.5 py-1 rounded-full">Student</span>
            </div>

            <h1 className="text-[1.85rem] font-extrabold text-[#1A1A24] leading-tight tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#6B7280] mt-1.5 text-sm">
              Sign in to access your wellness dashboard
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFF0F0] border border-[#FF6B6B]/30 rounded-xl p-3.5 mb-5 text-sm text-[#FF6B6B] flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                College Email
              </label>
              <input
                id="email" name="email" type="email"
                placeholder="you@college.edu.in"
                value={form.email} onChange={handleChange}
                required disabled={loading}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#1A1A24]">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#3DBE29] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required disabled={loading}
                  className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 pr-11 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#3DBE29] hover:bg-[#32A822] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3DBE29]/25 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-px bg-[#F0F0F0]" />
              <span className="text-xs text-[#9CA3AF] font-medium">or</span>
              <div className="flex-1 h-px bg-[#F0F0F0]" />
            </div>

            {/* Guest / Anonymous access */}
            <Link
              href="/student/anonymous"
              className="w-full flex items-center justify-center gap-2 border-2 border-[#E5E7EB] text-[#374151] font-semibold py-3 rounded-xl text-sm hover:border-[#3DBE29]/40 hover:bg-[#F9FAFB] hover:text-[#3DBE29] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Continue as Guest
            </Link>
          </motion.form>

          {/* Sign up */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center text-sm text-[#6B7280] mt-6"
          >
            New to MindSafe?{" "}
            <Link href="/signup/student" className="font-bold text-[#3DBE29] hover:underline">
              Sign up
            </Link>
          </motion.p>

          {/* Privacy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-xs text-[#D1D5DB] mt-6 flex items-center justify-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Your data is encrypted and private. Always.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
