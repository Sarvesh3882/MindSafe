"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
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
        setError("Invalid email or password. Please check your credentials from the welcome email.");
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

      if (userData.role !== "admin") {
        await supabase.auth.signOut();
        setError("Please use the correct login page for your role.");
        setLoading(false);
        return;
      }

      router.push("/admin");

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-shrink-0 flex-col bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#E8E4FF]">

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.07, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] rounded-full bg-[#6366F1]/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.09, 1], opacity: [0.15, 0.22, 0.15] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-[#4F46E5]/15 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/10 blur-2xl"
          />
        </div>

        {/* Floating dots */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] right-[12%] w-3 h-3 rounded-full bg-[#6366F1]/40 z-10" />
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[50%] left-[8%] w-2 h-2 rounded-full bg-[#4F46E5]/35 z-10" />
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[28%] right-[8%] w-2.5 h-2.5 rounded-full bg-[#6366F1]/30 z-10" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 pt-8 pl-10"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe India" width={40} height={40} className="w-10 h-10 flex-shrink-0" priority />
            <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#6366F1]">Safe</span>
              <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
            </span>
          </Link>
        </motion.div>

        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative z-10 mt-6 ml-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#6366F1]/30 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
            <span className="text-xs font-bold text-[#6366F1]">Admin Portal</span>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex-1 flex items-end justify-center px-6 pb-0"
        >
          <Image
            src="/illustrations/Company.svg"
            alt="Admin institution illustration"
            width={520}
            height={520}
            className="object-contain object-bottom w-full max-w-[520px] drop-shadow-xl"
            priority
          />
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 pb-8 text-center px-10"
        >
          <p className="text-sm font-semibold text-[#4338CA]">
            Manage your institution&apos;s wellness program 🏛️
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
                Mind<span className="text-[#6366F1]">Safe</span>
                <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
              </span>
            </Link>
          </motion.div>

          {/* Back + heading */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7"
          >
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-[#6366F1] transition-colors mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to role selection
            </Link>

            {/* Role pill */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth={1.75} className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#6366F1] bg-[#6366F1]/10 px-2.5 py-1 rounded-full">Admin</span>
            </div>

            <h1 className="text-[1.85rem] font-extrabold text-[#1A1A24] leading-tight tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#6B7280] mt-1.5 text-sm">
              Sign in to manage your institution&apos;s wellness program
            </p>
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#EEF2FF] border border-[#6366F1]/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-[#4338CA] mb-0.5">Use Your Welcome Email Credentials</p>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Your temporary password was sent after institutional onboarding. Change it after your first login.
                </p>
              </div>
            </div>
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
                Admin Email
              </label>
              <input
                id="email" name="email" type="email"
                placeholder="admin@college.edu.in"
                value={form.email} onChange={handleChange}
                required disabled={loading}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#6366F1] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#1A1A24]">Temporary Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#6366F1] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="From welcome email"
                  value={form.password} onChange={handleChange}
                  required disabled={loading}
                  className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 pr-11 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#6366F1] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
              <p className="text-xs text-[#9CA3AF] mt-1.5">
                Use the temporary password from your welcome email
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#6366F1]/25 mt-2"
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
          </motion.form>

          {/* Admin note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center text-xs text-[#C4C4C4] mt-6"
          >
            Admin accounts are created during institutional onboarding
          </motion.p>

          {/* Privacy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-xs text-[#D1D5DB] mt-4 flex items-center justify-center gap-1.5"
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
