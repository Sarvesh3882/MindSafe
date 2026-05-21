"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  validateAisheCodeFormat,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateFullName,
  validateDepartment,
  passwordsMatch
} from "@/lib/validators";

/**
 * Counsellor Sign-Up Form
 * Allows counsellors to create an account with AISHE code validation
 * Features: Real-time validation, auto-fill college name, password strength indicator
 * Note: No roll number field (only for students)
 */
export default function CounsellorSignUpPage() {
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    department: "",
    aisheCode: "",
    email: "",
    phone: "",
    collegeName: "",
    password: "",
    confirmPassword: ""
  });

  // Validation state
  const [validation, setValidation] = useState({
    aisheCode: { valid: false, checking: false, message: "" },
    email: { valid: false, checking: false, message: "" },
    password: { valid: false, strength: "weak" as "weak" | "medium" | "strong", errors: [] as string[] },
    passwordMatch: { valid: false, message: "" }
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Debounce timers
  const [aisheDebounce, setAisheDebounce] = useState<NodeJS.Timeout | null>(null);
  const [emailDebounce, setEmailDebounce] = useState<NodeJS.Timeout | null>(null);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Real-time AISHE code validation with debouncing
  useEffect(() => {
    if (aisheDebounce) clearTimeout(aisheDebounce);

    if (!form.aisheCode) {
      setValidation(prev => ({
        ...prev,
        aisheCode: { valid: false, checking: false, message: "" }
      }));
      setForm(prev => ({ ...prev, collegeName: "" }));
      return;
    }

    // Check format first
    if (!validateAisheCodeFormat(form.aisheCode)) {
      setValidation(prev => ({
        ...prev,
        aisheCode: { valid: false, checking: false, message: "Invalid format. Expected: C-XXXXX" }
      }));
      setForm(prev => ({ ...prev, collegeName: "" }));
      return;
    }

    // Debounce API call
    const timer = setTimeout(async () => {
      setValidation(prev => ({
        ...prev,
        aisheCode: { valid: false, checking: true, message: "Checking..." }
      }));

      try {
        const response = await fetch(`/api/auth/validate-aishe?code=${encodeURIComponent(form.aisheCode)}`);
        const data = await response.json();

        if (data.valid) {
          setValidation(prev => ({
            ...prev,
            aisheCode: { valid: true, checking: false, message: "✓ Valid AISHE code" }
          }));
          setForm(prev => ({ ...prev, collegeName: data.collegeName }));
        } else {
          setValidation(prev => ({
            ...prev,
            aisheCode: { valid: false, checking: false, message: data.error || "AISHE code not found" }
          }));
          setForm(prev => ({ ...prev, collegeName: "" }));
        }
      } catch (err) {
        setValidation(prev => ({
          ...prev,
          aisheCode: { valid: false, checking: false, message: "Error checking AISHE code" }
        }));
        setForm(prev => ({ ...prev, collegeName: "" }));
      }
    }, 500);

    setAisheDebounce(timer);

    return () => clearTimeout(timer);
  }, [form.aisheCode]);

  // Real-time email validation with debouncing
  useEffect(() => {
    if (emailDebounce) clearTimeout(emailDebounce);

    if (!form.email) {
      setValidation(prev => ({
        ...prev,
        email: { valid: false, checking: false, message: "" }
      }));
      return;
    }

    // Check format first
    const emailValidation = validateEmail(form.email);
    if (!emailValidation.valid) {
      setValidation(prev => ({
        ...prev,
        email: { valid: false, checking: false, message: "Invalid email format" }
      }));
      return;
    }

    // Debounce API call
    const timer = setTimeout(async () => {
      setValidation(prev => ({
        ...prev,
        email: { valid: false, checking: true, message: "Checking availability..." }
      }));

      try {
        const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(form.email)}`);
        const data = await response.json();

        if (data.available) {
          setValidation(prev => ({
            ...prev,
            email: { valid: true, checking: false, message: "✓ Email available" }
          }));
        } else {
          setValidation(prev => ({
            ...prev,
            email: { valid: false, checking: false, message: "Email already registered" }
          }));
        }
      } catch (err) {
        setValidation(prev => ({
          ...prev,
          email: { valid: false, checking: false, message: "Error checking email" }
        }));
      }
    }, 500);

    setEmailDebounce(timer);

    return () => clearTimeout(timer);
  }, [form.email]);

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

  // Check if form is valid
  const isFormValid = 
    validateFullName(form.fullName) &&
    validateDepartment(form.department) &&
    validation.aisheCode.valid &&
    validation.email.valid &&
    validatePhoneNumber(form.phone).valid &&
    validation.password.valid &&
    validation.passwordMatch.valid &&
    !validation.aisheCode.checking &&
    !validation.email.checking;

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const phoneValidation = validatePhoneNumber(form.phone);
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "counsellor",
          fullName: form.fullName,
          department: form.department,
          aisheCode: form.aisheCode,
          email: form.email,
          phone: phoneValidation.formatted,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setTimeout(() => {
        router.push("/login/counsellor");
      }, 2000);

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden bg-white">
      
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-shrink-0 flex-col bg-gradient-to-br from-[#E0FAF5] via-[#F0FDFB] to-[#D4F5EE]">

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.07, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] rounded-full bg-[#00C9A7]/25 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.09, 1], opacity: [0.15, 0.22, 0.15] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-[#3DBE29]/18 blur-3xl"
          />
        </div>

        {/* Floating dots */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] right-[12%] w-3 h-3 rounded-full bg-[#00C9A7]/50 z-10" />
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[50%] left-[8%] w-2 h-2 rounded-full bg-[#3DBE29]/40 z-10" />
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[28%] right-[8%] w-2.5 h-2.5 rounded-full bg-[#00C9A7]/35 z-10" />

        {/* Main illustration — centered and properly sized */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 flex items-center justify-center p-4 pt-20 pb-12"
          style={{ overflow: "hidden" }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/illustrations/login_counsellor2.svg"
              alt="Counsellor wellness illustration"
              fill
              className="object-contain"
              style={{ objectPosition: "center 40%" }}
              priority
            />
          </div>
        </motion.div>

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
              Mind<span className="text-[#00C9A7]">Safe</span>
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
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#00C9A7]/30 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
            <span className="text-xs font-bold text-[#00C9A7]">Counsellor Registration</span>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 pb-8 text-center px-10"
        >
          <p className="text-sm font-semibold text-[#0D7A6A]">
            Supporting student wellness together 🌿
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — sign-up form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-14 overflow-y-auto">
        <div className="w-full max-w-[500px]">

          {/* Mobile logo */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="mb-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo-icon.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
              <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
                Mind<span className="text-[#00C9A7]">Safe</span>
                <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
              </span>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-[#00C9A7] transition-colors mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to role selection
            </Link>
            {/* Role pill */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#00C9A7]/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth={1.75} className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#00C9A7] bg-[#00C9A7]/10 px-2.5 py-1 rounded-full">Counsellor</span>
            </div>
            <h1 className="text-[1.85rem] font-extrabold text-[#1A1A24] leading-tight tracking-tight">
              Create your account
            </h1>
            <p className="text-[#6B7280] mt-1.5 text-sm">
              Join your college&apos;s wellness support team
            </p>
          </motion.div>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#E0FAF5] border border-[#00C9A7]/30 rounded-xl p-4 mb-5 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#00C9A7] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D7A6A]">Account created successfully!</p>
                <p className="text-xs text-[#0D7A6A]/80">Redirecting to login...</p>
              </div>
            </motion.div>
          )}

          {/* Error message */}
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
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Full Name
              </label>
              <input
                id="fullName" name="fullName" type="text"
                placeholder="Dr. Priya Mehta"
                value={form.fullName} onChange={handleChange}
                required disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Department
              </label>
              <input
                id="department" name="department" type="text"
                placeholder="Student Counselling Services"
                value={form.department} onChange={handleChange}
                required disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* AISHE Code */}
            <div>
              <label htmlFor="aisheCode" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                AISHE Code
              </label>
              <input
                id="aisheCode" name="aisheCode" type="text"
                placeholder="C-12345"
                value={form.aisheCode} onChange={handleChange}
                required disabled={loading || success}
                aria-describedby="aisheCode-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.aisheCode.valid ? "border-[#00C9A7] bg-white" :
                  validation.aisheCode.message && !validation.aisheCode.checking ? "border-[#FF6B6B] bg-[#FFF8F8]" :
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {validation.aisheCode.message && (
                <p id="aisheCode-validation" aria-live="polite"
                  className={`text-xs mt-1.5 ${validation.aisheCode.valid ? "text-[#00C9A7]" : validation.aisheCode.checking ? "text-[#9CA3AF]" : "text-[#FF6B6B]"}`}>
                  {validation.aisheCode.message}
                </p>
              )}
            </div>

            {/* College Name (auto-filled) */}
            {form.collegeName && (
              <div>
                <label htmlFor="collegeName" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                  College Name
                </label>
                <input
                  id="collegeName" name="collegeName" type="text"
                  value={form.collegeName} disabled
                  className="w-full rounded-xl border-2 border-[#00C9A7] bg-[#E0FAF5] px-4 py-3 text-sm text-[#0D7A6A] font-medium cursor-not-allowed"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                College Email
              </label>
              <input
                id="email" name="email" type="email"
                placeholder="priya@college.edu.in"
                value={form.email} onChange={handleChange}
                required disabled={loading || success}
                aria-describedby="email-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.email.valid ? "border-[#00C9A7] bg-white" :
                  validation.email.message && !validation.email.checking ? "border-[#FF6B6B] bg-[#FFF8F8]" :
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {validation.email.message && (
                <p id="email-validation" aria-live="polite"
                  className={`text-xs mt-1.5 ${validation.email.valid ? "text-[#00C9A7]" : validation.email.checking ? "text-[#9CA3AF]" : "text-[#FF6B6B]"}`}>
                  {validation.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Phone Number
              </label>
              <input
                id="phone" name="phone" type="tel"
                placeholder="9876543210"
                value={form.phone} onChange={handleChange}
                required disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Password
              </label>
              <input
                id="password" name="password" type="password"
                placeholder="Min. 8 characters"
                value={form.password} onChange={handleChange}
                required disabled={loading || success}
                aria-describedby="password-validation"
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {form.password && (
                <div id="password-validation" className="mt-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${
                        validation.password.strength === "strong" ? "w-full bg-[#00C9A7]" :
                        validation.password.strength === "medium" ? "w-2/3 bg-[#FFA500]" :
                        "w-1/3 bg-[#FF6B6B]"
                      }`} />
                    </div>
                    <span className={`text-xs font-semibold ${
                      validation.password.strength === "strong" ? "text-[#00C9A7]" :
                      validation.password.strength === "medium" ? "text-[#FFA500]" :
                      "text-[#FF6B6B]"
                    }`}>
                      {validation.password.strength.charAt(0).toUpperCase() + validation.password.strength.slice(1)}
                    </span>
                  </div>
                  {validation.password.errors.length > 0 && (
                    <ul className="text-xs text-[#FF6B6B] space-y-0.5" aria-live="polite">
                      {validation.password.errors.map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword" name="confirmPassword" type="password"
                placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange}
                required disabled={loading || success}
                aria-describedby="confirmPassword-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.passwordMatch.valid ? "border-[#00C9A7] bg-white" :
                  validation.passwordMatch.message ? "border-[#FF6B6B] bg-[#FFF8F8]" :
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#00C9A7] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {validation.passwordMatch.message && (
                <p id="confirmPassword-validation" aria-live="polite"
                  className={`text-xs mt-1.5 ${validation.passwordMatch.valid ? "text-[#00C9A7]" : "text-[#FF6B6B]"}`}>
                  {validation.passwordMatch.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || loading || success}
              className="w-full bg-[#00C9A7] hover:bg-[#00B396] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#00C9A7]/25 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </motion.form>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center text-sm text-[#6B7280] mt-6"
          >
            Already have an account?{" "}
            <Link href="/login/counsellor" className="font-bold text-[#00C9A7] hover:underline">
              Log in
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
