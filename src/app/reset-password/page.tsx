"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { validatePassword, passwordsMatch } from "@/lib/validators";

/**
 * Reset Password Page
 * Allows users to set a new password after clicking reset link
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });
  const [validation, setValidation] = useState({
    password: { valid: false, strength: "weak" as "weak" | "medium" | "strong", errors: [] as string[] },
    passwordMatch: { valid: false, message: "" }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Real-time password validation
  useEffect(() => {
    if (!form.password) {
      setValidation(prev => ({
        ...prev,
        password: { valid: false, strength: "weak", errors: [] }
      }));
      return;
    }

    const passwordValidation = validatePassword(form.password);
    setValidation(prev => ({
      ...prev,
      password: {
        valid: passwordValidation.valid,
        strength: passwordValidation.strength,
        errors: passwordValidation.errors
      }
    }));
  }, [form.password]);

  // Real-time password match validation
  useEffect(() => {
    if (!form.confirmPassword) {
      setValidation(prev => ({
        ...prev,
        passwordMatch: { valid: false, message: "" }
      }));
      return;
    }

    const match = passwordsMatch(form.password, form.confirmPassword);
    setValidation(prev => ({
      ...prev,
      passwordMatch: {
        valid: match,
        message: match ? "✓ Passwords match" : "Passwords don't match"
      }
    }));
  }, [form.password, form.confirmPassword]);

  const isFormValid = validation.password.valid && validation.passwordMatch.valid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: form.password
      });

      if (updateError) {
        setError("Failed to update password. Please try again or request a new reset link.");
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);

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
            Create a strong password to keep your account secure 🔒
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — reset password form ── */}
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
            <h1 className="text-3xl font-extrabold text-[#1A1A24] leading-tight">
              Reset Password 🔑
            </h1>
            <p className="text-[#6B7280] mt-2 text-sm leading-relaxed">
              Choose a strong password for your account
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
                  <p className="text-sm font-semibold text-[#2D6A4F]">Password reset successfully!</p>
                  <p className="text-xs text-[#2D6A4F]/80 mt-1">
                    Redirecting to login page...
                  </p>
                </div>
              </div>
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

                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    aria-describedby="password-validation"
                    className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3DBE29] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {form.password && (
                    <div id="password-validation" className="mt-2">
                      {/* Password strength indicator */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              validation.password.strength === "strong" ? "w-full bg-[#3DBE29]" :
                              validation.password.strength === "medium" ? "w-2/3 bg-[#FFA500]" :
                              "w-1/3 bg-[#FF6B6B]"
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${
                          validation.password.strength === "strong" ? "text-[#3DBE29]" :
                          validation.password.strength === "medium" ? "text-[#FFA500]" :
                          "text-[#FF6B6B]"
                        }`}>
                          {validation.password.strength.charAt(0).toUpperCase() + validation.password.strength.slice(1)}
                        </span>
                      </div>
                      {/* Password errors */}
                      {validation.password.errors.length > 0 && (
                        <ul className="text-xs text-[#FF6B6B] space-y-1" aria-live="polite">
                          {validation.password.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    aria-describedby="confirmPassword-validation"
                    className={`w-full rounded-xl border-2 ${
                      validation.passwordMatch.valid ? "border-[#3DBE29]" : 
                      validation.passwordMatch.message && !validation.passwordMatch.valid ? "border-[#FF6B6B]" : 
                      "border-[#E5E7EB]"
                    } bg-white px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3DBE29] transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  {validation.passwordMatch.message && (
                    <p 
                      id="confirmPassword-validation"
                      aria-live="polite"
                      className={`text-xs mt-1.5 ${
                        validation.passwordMatch.valid ? "text-[#3DBE29]" : "text-[#FF6B6B]"
                      }`}
                    >
                      {validation.passwordMatch.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3DBE29]/25"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Resetting password...
                    </>
                  ) : "Reset password →"}
                </button>
              </form>
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
