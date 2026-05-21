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
  validateRollNumber,
  passwordsMatch
} from "@/lib/validators";

/**
 * Student Sign-Up Form
 * Allows students to create an account with AISHE code validation
 * Features: Real-time validation, auto-fill college name, password strength indicator
 */
export default function StudentSignUpPage() {
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    rollNumber: "",
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
    validateRollNumber(form.rollNumber) &&
    validateDepartment(form.department) &&
    validation.aisheCode.valid &&
    validation.email.valid &&
    validatePhoneNumber(form.phone).valid &&
    validation.password.valid &&
    validation.passwordMatch.valid &&
    !validation.aisheCode.checking &&
    !validation.email.checking;

  // Debug logging to see which validation is failing
  useEffect(() => {
    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('Full Name:', form.fullName, '→', validateFullName(form.fullName));
    console.log('Roll Number:', form.rollNumber, '→', validateRollNumber(form.rollNumber));
    console.log('Department:', form.department, '→', validateDepartment(form.department));
    console.log('AISHE Code Valid:', validation.aisheCode.valid);
    console.log('AISHE Code Checking:', validation.aisheCode.checking);
    console.log('Email Valid:', validation.email.valid);
    console.log('Email Checking:', validation.email.checking);
    console.log('Phone:', form.phone, '→', validatePhoneNumber(form.phone));
    console.log('Password Valid:', validation.password.valid);
    console.log('Password Match Valid:', validation.passwordMatch.valid);
    console.log('IS FORM VALID:', isFormValid);
    console.log('============================');
  }, [form, validation, isFormValid]);

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
          role: "student",
          fullName: form.fullName,
          rollNumber: form.rollNumber,
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
        router.push("/login/student");
      }, 2000);

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden bg-white">
      
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-shrink-0 flex-col bg-[#F8FFF8]">

        {/* Illustration fills the entire panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-0 z-0 flex items-center justify-center p-6 pt-24 pb-12"
        >
          <Image
            src="/illustrations/Student_signup.svg"
            alt="Student signup illustration"
            fill
            className="object-contain"
            style={{ objectPosition: "center center" }}
            priority
          />
        </motion.div>

        {/* Top gradient — keeps logo readable over illustration */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/70 to-transparent z-10 pointer-events-none" />

        {/* Bottom gradient — keeps caption readable */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent z-10 pointer-events-none" />

        {/* Logo */}
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
              <span className="text-[#6B7280] font-semibold text-sm ml-1">India</span>
            </span>
          </Link>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-20 pb-6 text-center px-8"
        >
          <p className="text-sm font-bold text-[#2D6A4F]">
            Your wellness journey starts here 🌿
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
                Mind<span className="text-[#3DBE29]">Safe</span>
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
              Create your account
            </h1>
            <p className="text-[#6B7280] mt-1.5 text-sm">
              Join your college&apos;s wellness community
            </p>
          </motion.div>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#E8F5E9] border border-[#3DBE29]/30 rounded-xl p-4 mb-5 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#3DBE29] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D6A4F]">Account created successfully!</p>
                <p className="text-xs text-[#2D6A4F]/80">Redirecting to login...</p>
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
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Arjun Sharma"
                value={form.fullName}
                onChange={handleChange}
                required
                disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Roll Number
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="CS21B1001"
                value={form.rollNumber}
                onChange={handleChange}
                required
                disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="Computer Science"
                value={form.department}
                onChange={handleChange}
                required
                disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* AISHE Code */}
            <div>
              <label htmlFor="aisheCode" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                AISHE Code
              </label>
              <input
                id="aisheCode"
                name="aisheCode"
                type="text"
                placeholder="C-12345"
                value={form.aisheCode}
                onChange={handleChange}
                required
                disabled={loading || success}
                aria-describedby="aisheCode-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.aisheCode.valid ? "border-[#3DBE29]" : 
                  validation.aisheCode.message && !validation.aisheCode.checking ? "border-[#FF6B6B]" : 
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {validation.aisheCode.message && (
                <p 
                  id="aisheCode-validation"
                  aria-live="polite"
                  className={`text-xs mt-1.5 ${
                    validation.aisheCode.valid ? "text-[#3DBE29]" : 
                    validation.aisheCode.checking ? "text-[#6B7280]" : 
                    "text-[#FF6B6B]"
                  }`}
                >
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
                  id="collegeName"
                  name="collegeName"
                  type="text"
                  value={form.collegeName}
                  disabled
                  className="w-full rounded-xl border-2 border-[#3DBE29] bg-[#E8F5E9] px-4 py-3 text-sm text-[#2D6A4F] font-medium cursor-not-allowed"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                College Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="arjun@college.edu.in"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading || success}
                aria-describedby="email-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.email.valid ? "border-[#3DBE29]" : 
                  validation.email.message && !validation.email.checking ? "border-[#FF6B6B]" : 
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {validation.email.message && (
                <p 
                  id="email-validation"
                  aria-live="polite"
                  className={`text-xs mt-1.5 ${
                    validation.email.valid ? "text-[#3DBE29]" : 
                    validation.email.checking ? "text-[#6B7280]" : 
                    "text-[#FF6B6B]"
                  }`}
                >
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
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={loading || success}
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A24] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading || success}
                aria-describedby="password-validation"
                className="w-full rounded-xl border-2 border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading || success}
                aria-describedby="confirmPassword-validation"
                className={`w-full rounded-xl border-2 ${
                  validation.passwordMatch.valid ? "border-[#3DBE29]" : 
                  validation.passwordMatch.message && !validation.passwordMatch.valid ? "border-[#FF6B6B]" : 
                  "border-[#F0F0F0] bg-[#FAFAFA]"
                } px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#3DBE29] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
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
              disabled={!isFormValid || loading || success}
              className="w-full bg-[#3DBE29] hover:bg-[#32A822] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3DBE29]/25 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
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
            <Link href="/login/student" className="text-[#3DBE29] font-bold hover:underline">
              Log in
            </Link>
          </motion.p>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-xs text-[#D1D5DB] mt-6 flex items-center justify-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Your data is encrypted and private. Always.
          </motion.p>
        </div>
      </div>
    </div>
  );
}



