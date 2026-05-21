"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { validateAisheCode, validateEmail, validatePhone } from "@/lib/validators";

declare global {
  interface Window { Razorpay: any; }
}

type PlanTier = 'basic' | 'growth' | 'enterprise' | null;
type PaymentStatus = 'pending' | 'success' | 'failed';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹15,000',
    period: '/month',
    students: 'Up to 500 students',
    features: ['Student dashboard', 'Daily check-in (ARIA)', '1 counsellor account', 'Basic analytics'],
    recommended: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹35,000',
    period: '/month',
    students: 'Up to 2,000 students',
    features: ['Everything in Basic', '5 counsellor accounts', 'Full admin dashboard', 'Crisis SMS alerts', 'NAAC reports'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    students: 'Unlimited students',
    features: ['Everything in Growth', 'Custom branding', 'API access', 'Dedicated support', 'SLA guarantee'],
    recommended: false,
  },
];

export default function OnboardingPage() {
  const [form, setForm] = useState({
    adminName: "", adminEmail: "", adminRole: "", adminPhone: "",
    collegeName: "", aisheCode: "", studentCount: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [collegeCode, setCollegeCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.adminName.trim()) errors.adminName = "Name is required";
    if (!form.adminEmail.trim()) errors.adminEmail = "Email is required";
    else if (!validateEmail(form.adminEmail)) errors.adminEmail = "Invalid email format";
    if (!form.adminRole) errors.adminRole = "Role is required";
    if (!form.collegeName.trim()) errors.collegeName = "College name is required";
    if (!form.aisheCode.trim()) errors.aisheCode = "AISHE code is required";
    else if (!validateAisheCode(form.aisheCode)) errors.aisheCode = "Invalid format. Expected: C-XXXXX";
    if (form.adminPhone && !validatePhone(form.adminPhone)) errors.adminPhone = "Invalid phone number";
    if (!selectedPlan) errors.plan = "Please select a plan";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handlePayment() {
    if (!validateForm()) { setError("Please fix the errors above"); return; }
    if (selectedPlan === 'enterprise') { setError("Please contact sales for Enterprise plan"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/payments/create-public-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeName: form.collegeName, planTier: selectedPlan, adminEmail: form.adminEmail, adminName: form.adminName }),
      });
      if (!res.ok) throw new Error('Failed to create payment order');
      const { order } = await res.json();
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; });
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency,
        name: 'MindSafe India',
        description: `${selectedPlan === 'basic' ? 'Basic' : 'Growth'} Plan Subscription`,
        order_id: order.id,
        handler: function (response: any) {
          setPaymentId(response.razorpay_payment_id);
          setOrderId(response.razorpay_order_id);
          setSignature(response.razorpay_signature);
          setPaymentStatus('success'); setLoading(false);
        },
        prefill: { name: form.adminName, email: form.adminEmail, contact: form.adminPhone },
        notes: { college_name: form.collegeName, aishe_code: form.aisheCode },
        theme: { color: '#3DBE29' },
        modal: { 
          ondismiss: function () { 
            setLoading(false); 
            setError('Payment cancelled. Please try again or use Netbanking/UPI.'); 
          },
          confirm_close: true,
          escape: true,
          backdropclose: true,
          animation: true
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  }

  async function handleRegistrationComplete() {
    if (paymentStatus !== 'success') { setError('Please complete payment first'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/register-institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, planTier: selectedPlan, paymentId, orderId, signature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setCollegeCode(data.collegeCode);
      setEmailSent(data.emailSent || false);
      setTemporaryPassword(data.temporaryPassword || '');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0FFF4] via-[#F5FFF6] to-[#EAF9F0] flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-[#3DBE29]/20 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DBE29]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00C9A7]/5 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-[#3DBE29] to-[#32A822] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#3DBE29]/30 relative z-10"
          >
            <motion.svg 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth={3} 
              className="w-10 h-10"
            >
              <motion.polyline 
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-3xl font-black text-[#1A1A24] mb-3 relative z-10"
          >
            Registration Complete! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-[#6B7280] mb-8 relative z-10"
          >
            Your institution has been successfully registered with MindSafe India.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-[#F8FFF8] to-[#F0FFF4] rounded-xl p-6 mb-8 text-left border border-[#3DBE29]/20 relative z-10"
          >
            <h2 className="text-sm font-bold text-[#6B7280] mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#3DBE29]">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              College Details
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-[#6B7280] block mb-1">College Code</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#3DBE29]">{collegeCode}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(collegeCode)}
                    className="p-1.5 hover:bg-[#3DBE29]/10 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#3DBE29]">
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs text-[#6B7280] block mb-1">Admin Email</span>
                <span className="text-sm font-semibold text-[#1A1A24]">{form.adminEmail}</span>
              </div>
              {temporaryPassword && (
                <div>
                  <span className="text-xs text-[#6B7280] block mb-1">Temporary Password</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-white px-3 py-1.5 rounded border border-[#E5E7EB]">{temporaryPassword}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                      className="p-1.5 hover:bg-[#3DBE29]/10 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#3DBE29]">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-[#FF6B6B] mt-1">⚠️ Save this password - you'll need it to login</p>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className={`${emailSent ? 'bg-[#FFF8F0] border-[#FF9F43]/20' : 'bg-[#FFF0F0] border-[#FF6B6B]/20'} border rounded-xl p-4 mb-6 relative z-10`}
          >
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke={emailSent ? "#FF9F43" : "#FF6B6B"} strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-0.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div className="text-left">
                {emailSent ? (
                  <>
                    <p className="text-sm font-semibold text-[#1A1A24] mb-1">Check your email</p>
                    <p className="text-xs text-[#6B7280]">
                      A welcome email with login instructions has been sent to your email address.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#1A1A24] mb-1">Email not sent</p>
                    <p className="text-xs text-[#6B7280]">
                      We couldn't send the welcome email, but your account is ready. Please save the credentials above.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="relative z-10"
          >
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3DBE29] to-[#32A822] hover:from-[#32A822] hover:to-[#2D9A1F] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-[#3DBE29]/25 hover:shadow-xl hover:shadow-[#3DBE29]/30 active:scale-95 group"
            >
              Go to Login
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-student">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe India logo" width={40} height={40} className="w-10 h-10 flex-shrink-0" />
            <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
              <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
            </span>
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#6B7280] hover:text-[#1A1A24] transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      <section className="pt-16 min-h-screen relative bg-gradient-to-br from-[#F0FFF4] via-[#F5FFF6] to-[#EAF9F0]">
        {/* Large background illustration */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] opacity-10 pointer-events-none">
          <Image
            src="/illustrations/demo2.svg"
            alt="Background decoration"
            width={600}
            height={600}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-white border border-[#3DBE29]/30 rounded-full px-4 py-2 text-sm font-semibold text-[#3DBE29] shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#3DBE29] animate-pulse" />
                  Institutional Onboarding
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-black text-[#1A1A24] leading-[1.1] tracking-tight"
                >
                  Join the<br />
                  <span className="text-[#3DBE29]">MindSafe</span><br />
                  Community
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.35 }}
                  className="text-lg text-[#6B7280] leading-relaxed"
                >
                  Register your institution and start protecting your students&apos; mental wellness today.
                </motion.p>
              </div>

              {/* Main illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative h-[320px] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D6F5DC]/40 to-[#E8FFF0]/40 rounded-[40%_60%_55%_45%/45%_55%_60%_40%]" />
                <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-[#3DBE29]/25 animate-pulse" />
                <div className="absolute bottom-12 right-12 w-5 h-5 rounded-full bg-[#00C9A7]/30 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-16 right-16 w-3 h-3 rounded-full bg-[#3DBE29]/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Image
                  src="/illustrations/demo.svg"
                  alt="MindSafe onboarding illustration"
                  width={500}
                  height={320}
                  className="object-contain w-full h-full relative z-10 drop-shadow-lg"
                />
              </motion.div>

              {/* Benefits cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-base font-bold text-[#1A1A24] flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5 text-[#3DBE29]">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Why Choose MindSafe India?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "🎯", title: "NAAC Compliant", desc: "Generate wellness reports instantly" },
                    { icon: "🔒", title: "Secure & Private", desc: "Bank-grade encryption" },
                    { icon: "⚡", title: "Quick Setup", desc: "Live in 48 hours" },
                    { icon: "💚", title: "Trusted", desc: "50+ institutions" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                      className="bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-xl p-4 hover:border-[#3DBE29]/40 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#1A1A24] mb-0.5">{item.title}</h4>
                          <p className="text-xs text-[#6B7280]">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#3DBE29]">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span className="font-semibold">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#3DBE29]">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <span className="font-semibold">ISO Certified</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-[#E5E7EB]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#1A1A24]">Register Your Institution</h2>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#3DBE29]">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Secure
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[
                  { num: 1, label: "Admin", completed: form.adminName && form.adminEmail && form.adminRole },
                  { num: 2, label: "College", completed: form.collegeName && form.aisheCode },
                  { num: 3, label: "Plan", completed: selectedPlan !== null },
                  { num: 4, label: "Payment", completed: paymentStatus === 'success' },
                ].map((step, i) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed 
                          ? 'bg-[#3DBE29] text-white' 
                          : 'bg-[#F0F0F0] text-[#9CA3AF]'
                      }`}>
                        {step.completed ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          step.num
                        )}
                      </div>
                      <span className={`text-xs mt-1 font-semibold ${step.completed ? 'text-[#3DBE29]' : 'text-[#9CA3AF]'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-all ${
                        step.completed ? 'bg-[#3DBE29]' : 'bg-[#F0F0F0]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A24] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3DBE29] text-white text-xs flex items-center justify-center">1</span>
                  Admin Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="adminName"
                      value={form.adminName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.adminName ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                      placeholder="Dr. Rajesh Kumar"
                    />
                    {validationErrors.adminName && <p className="text-xs text-red-600 mt-1">{validationErrors.adminName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">Email *</label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={form.adminEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.adminEmail ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                      placeholder="admin@college.edu.in"
                    />
                    {validationErrors.adminEmail && <p className="text-xs text-red-600 mt-1">{validationErrors.adminEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">Role *</label>
                    <select
                      name="adminRole"
                      value={form.adminRole}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.adminRole ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                    >
                      <option value="">Select role</option>
                      <option value="Principal">Principal</option>
                      <option value="Dean">Dean</option>
                      <option value="HOD">HOD</option>
                      <option value="Admin Staff">Admin Staff</option>
                      <option value="Student Welfare Officer">Student Welfare Officer</option>
                    </select>
                    {validationErrors.adminRole && <p className="text-xs text-red-600 mt-1">{validationErrors.adminRole}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="adminPhone"
                      value={form.adminPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.adminPhone ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                      placeholder="+91 98765 43210"
                    />
                    {validationErrors.adminPhone && <p className="text-xs text-red-600 mt-1">{validationErrors.adminPhone}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#1A1A24] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3DBE29] text-white text-xs flex items-center justify-center">2</span>
                  College Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">College Name *</label>
                    <input
                      type="text"
                      name="collegeName"
                      value={form.collegeName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.collegeName ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                      placeholder="ABC College of Engineering"
                    />
                    {validationErrors.collegeName && <p className="text-xs text-red-600 mt-1">{validationErrors.collegeName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">AISHE Code *</label>
                    <input
                      type="text"
                      name="aisheCode"
                      value={form.aisheCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${validationErrors.aisheCode ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] hover:border-[#3DBE29]/40'} focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all`}
                      placeholder="C-12345"
                    />
                    {validationErrors.aisheCode && <p className="text-xs text-red-600 mt-1">{validationErrors.aisheCode}</p>}
                    <p className="text-xs text-[#6B7280] mt-1">Format: C-XXXXX</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A24] mb-2">Student Count (Optional)</label>
                    <input
                      type="number"
                      name="studentCount"
                      value={form.studentCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-[#3DBE29]/40 focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] transition-all"
                      placeholder="2000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#1A1A24] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3DBE29] text-white text-xs flex items-center justify-center font-bold">3</span>
                  Select Plan
                </h3>
                <div className="space-y-3">
                  {PLANS.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedPlan(plan.id as PlanTier)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-[#3DBE29] bg-[#F8FFF8] shadow-md ring-2 ring-[#3DBE29]/20'
                          : 'border-[#E5E7EB] hover:border-[#3DBE29]/40 hover:bg-[#FAFAFA]'
                      } ${plan.recommended ? 'relative' : ''}`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#3DBE29] to-[#32A822] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                          RECOMMENDED
                        </span>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1A1A24] mb-1 text-base">{plan.name}</h4>
                          <p className="text-sm text-[#6B7280] mb-3">{plan.students}</p>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-2xl font-black text-[#3DBE29]">{plan.price}</span>
                            <span className="text-sm text-[#6B7280]">{plan.period}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {plan.features.slice(0, 3).map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-xs text-[#6B7280]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3DBE29" strokeWidth={2.5} className="w-3.5 h-3.5 flex-shrink-0">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedPlan === plan.id ? 'border-[#3DBE29] bg-[#3DBE29] scale-110' : 'border-[#C8C8C8]'
                        }`}>
                          {selectedPlan === plan.id && (
                            <motion.svg 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="white" 
                              strokeWidth={3} 
                              className="w-3 h-3"
                            >
                              <polyline points="20 6 9 17 4 12"/>
                            </motion.svg>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {validationErrors.plan && <p className="text-xs text-red-600 mt-2">{validationErrors.plan}</p>}
              </div>

              {paymentStatus !== 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 ${
                    paymentStatus === 'success'
                      ? 'border-[#3DBE29] bg-[#F8FFF8]'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {paymentStatus === 'success' ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-[#3DBE29] flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-5 h-5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-[#3DBE29] text-sm">Payment Successful</p>
                          <p className="text-xs text-[#6B7280]">You can now complete registration</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-red-700 text-sm">Payment Failed</p>
                          <p className="text-xs text-red-600">Please try again</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-3 pt-4">
                {paymentStatus === 'pending' ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#3DBE29] to-[#32A822] hover:from-[#32A822] hover:to-[#2D9A1F] text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-[#3DBE29]/25 hover:shadow-xl hover:shadow-[#3DBE29]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                        Proceed to Payment
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegistrationComplete}
                    disabled={loading || paymentStatus !== 'success'}
                    className="w-full bg-gradient-to-r from-[#3DBE29] to-[#32A822] hover:from-[#32A822] hover:to-[#2D9A1F] text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-[#3DBE29]/25 hover:shadow-xl hover:shadow-[#3DBE29]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Complete Registration
                      </>
                    )}
                  </motion.button>
                )}
                <div className="flex items-center justify-center gap-4 text-xs text-[#9CA3AF]">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Secure Payment
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    NAAC Compliant
                  </div>
                </div>
                <p className="text-xs text-center text-[#6B7280] pt-2">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
