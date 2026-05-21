"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "growth";

  const [form, setForm] = useState({
    collegeName: "",
    fullName: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pre-load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Public Razorpay Order
      const orderRes = await fetch("/api/payments/create-public-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: plan, collegeName: form.collegeName }),
      });
      
      const orderData = await orderRes.json();
      if (!orderData.order) throw new Error(orderData.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "MindSafe India",
        description: `${plan} Plan for ${form.collegeName}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 3. On successful payment, create user and college!
          await processRegistration();
        },
        prefill: {
          name: form.fullName,
          email: form.email,
        },
        theme: { color: "#3DBE29" },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled. Please try again.");
          },
          confirm_close: true,
          escape: true,
          backdropclose: true,
          animation: true
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError("Payment failed. " + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "An error occurred during checkout.");
      setLoading(false);
    }
  }

  async function processRegistration() {
    try {
      const supabase = createClient();
      
      // A. Create Auth Account
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: "admin", full_name: form.fullName } },
      });

      if (authError || !data.user) throw new Error(authError?.message || "Auth failed");

      // B. Securely Register College & Profile
      const res = await fetch("/api/auth/register-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.user.id,
          email: form.email,
          fullName: form.fullName,
          role: "admin",
          collegeName: form.collegeName,
          planTier: plan
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // C. Redirect to dashboard
      router.push("/admin");
    } catch (err: any) {
      setError("Payment succeeded but registration failed: " + err.message + ". Please contact support.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5FFF5] flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Summary */}
        <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <Link href="/" className="inline-block text-[#6B7280] text-sm mb-6 hover:text-[#2D2D2D]">← Back</Link>
          <h1 className="text-2xl font-bold text-[#1E1E2E] mb-2">Complete your purchase</h1>
          <p className="text-[#6B7280] text-sm mb-8">You are purchasing the <span className="font-bold text-[#3DBE29] capitalize">{plan}</span> plan.</p>
          
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280] capitalize">{plan} Plan (Monthly)</span>
              <span className="font-semibold text-[#1E1E2E]">
                {plan === "growth" ? "₹15,000" : plan === "enterprise" ? "₹50,000" : "₹5,000"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Setup Fee</span>
              <span className="font-semibold text-[#1E1E2E]">₹0</span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between font-bold">
              <span className="text-[#1E1E2E]">Total</span>
              <span className="text-[#3DBE29]">
                {plan === "growth" ? "₹15,000" : plan === "enterprise" ? "₹50,000" : "₹5,000"}
              </span>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-center gap-2">✓ Billed automatically every month</li>
            <li className="flex items-center gap-2">✓ Cancel anytime</li>
            <li className="flex items-center gap-2">✓ 24/7 Priority Support</li>
          </ul>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-8 rounded-2xl border border-[#3DBE29]/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#3DBE29]" />
          <h2 className="text-xl font-bold text-[#1E1E2E] mb-6">Organization Details</h2>
          
          <form onSubmit={handleCheckout} className="space-y-4">
            <Input label="College / University Name" name="collegeName" placeholder="Delhi University" value={form.collegeName} onChange={handleChange} required />
            <div className="pt-4 border-t border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#1E1E2E] mb-4">Primary Admin Account</h3>
              <div className="space-y-4">
                <Input label="Admin Full Name" name="fullName" placeholder="Dr. Priya Sharma" value={form.fullName} onChange={handleChange} required />
                <Input label="Admin Work Email" type="email" name="email" placeholder="priya@college.edu" value={form.email} onChange={handleChange} required />
                <Input label="Password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
            </div>

            {error && (
              <div className="bg-[#FFF0F0] border border-[#FF6B6B]/20 rounded-lg p-3 text-sm text-[#FF6B6B]">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
              Pay & Register
            </Button>
          </form>
          <p className="text-center text-xs text-[#6B7280] mt-4">
            Secured by Razorpay.
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#3DBE29] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
