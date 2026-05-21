"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { validateEmail } from "@/lib/validators";

/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        console.error('Password reset error:', resetError);
      }

      // Always show success message for security (don't reveal if email exists)
      setSuccess(true);
      setLoading(false);

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden bg-white">
      
      {/* ── LEFT PANEL — illustration (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#E8F5E9] overflow-hidden flex-shrink-0">
        
        {/* Soft organic blob behind illustration */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#3DBE29]/20 blur-3xl" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#00C9A7]/20 blur-3xl" />
        </div>

        {/* Brand tag top-left */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <div className="w-9 h-9 bg-[#3DBE29] rounded-xl flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span className="text-lg font-extrabold text-[#1A1A24]">
            Mind<span className="text-[#3DBE29]">Safe</span>
          </span>
        </Link>

        {/* Main illustration */}
        <div className="relative w-full h-full flex items-end justify-center pb-0">
          <Image
            src="/illustrations/Student_using_laptop_welness.svg"
            alt="Password reset illustration"
            width={500}
            height={500}
            className="object-contain object-bottom w-full max-w-[500px] drop-shadow-xl"
            priority
          />
        </div>

        {/* Bottom caption */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
          <p className="text-sm font-semibold text-[#2D6A4F]">
            We&apos;re here to help you get back in 🌿
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — forgot password form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#3DBE29] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-[#1A1A24]">
              Mind<span className="text-[#3DBE29]">Safe</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#3DBE29] mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to login
            </Link>
            <h1 className="text-3xl font-extrabold text-[#1A1A24] leading-tight">
              Forgot Password? 🔑
            </h1>
            <p className="text-[#6B7280] mt-2 text-sm leading-relaxed">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {/* Success message */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#E8F5E9] border border-[#3DBE29]/30 rounded-xl p-6 mb-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#3DBE29] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D6A4F]">Check your email!</p>
                  <p className="text-xs text-[#2D6A4F]/80 mt-1">
                    If an account exists with {email}, you&apos;ll receive a password reset link shortly.
                  </p>
                </div>
              </div>
              <Link 
                href="/login"
                className="block w-full text-center bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Back to login
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FFF0F0] border border-[#FF6B6B]/30 rounded-xl p-4 mb-6 text-sm text-[#FF6B6B]"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@college.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3DBE29] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3DBE29]/25"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending reset link...
                    </>
                  ) : "Send reset link →"}
                </button>
              </form>

              {/* Back to login */}
              <p className="text-center text-sm text-[#6B7280] mt-6">
                Remember your password?{" "}
                <Link href="/login" className="text-[#3DBE29] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* Privacy note */}
          <p className="text-center text-xs text-[#9CA3AF] mt-8 flex items-center justify-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Your data is encrypted and private. Always.
          </p>
        </div>
      </div>
    </div>
  );
}
