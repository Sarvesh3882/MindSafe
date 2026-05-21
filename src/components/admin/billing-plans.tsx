"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  { id: "basic", name: "Basic", price: "₹5,000 / month", features: ["Up to 500 students", "Basic reporting", "Email support"] },
  { id: "growth", name: "Growth", price: "₹15,000 / month", features: ["Up to 2,000 students", "Advanced Analytics", "Priority support", "Custom branding"] },
  { id: "enterprise", name: "Enterprise", price: "₹50,000 / month", features: ["Unlimited students", "Dedicated success manager", "Custom integrations", "API access"] },
];

export function BillingPlans({ currentPlan, adminInfo }: { currentPlan: string, adminInfo: any }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    setLoading(tier);
    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();

      if (!data.order) throw new Error(data.error || "Failed to create order");

      // 2. Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      // 3. Open checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "MindSafe India",
        description: `Upgrade to ${tier} plan`,
        order_id: data.order.id,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.reload();
        },
        prefill: {
          name: adminInfo?.full_name,
          email: adminInfo?.email,
        },
        theme: {
          color: "#3DBE29",
        },
        modal: {
          ondismiss: function () {
            setLoading(null);
          },
          confirm_close: true,
          escape: true,
          backdropclose: true,
          animation: true
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      alert("Error initiating payment.");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        return (
          <Card key={plan.id} className={isCurrent ? "border-[#3DBE29] shadow-sm relative overflow-hidden" : ""}>
            {isCurrent && <div className="absolute top-0 left-0 w-full h-1 bg-[#3DBE29]" />}
            <CardContent className="p-6 flex flex-col h-full">
              {isCurrent && <span className="text-xs font-bold text-[#3DBE29] bg-[#F0FFF0] px-2 py-1 rounded w-max mb-3 mt-1 inline-block">CURRENT PLAN</span>}
              <h3 className={`text-xl font-bold text-[#1E1E2E] ${!isCurrent ? "mt-4" : ""}`}>{plan.name}</h3>
              <p className="text-[#6B7280] font-semibold mt-2 mb-6">{plan.price}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-[#1E1E2E] flex items-start gap-2">
                    <span className="text-[#3DBE29] shrink-0">✓</span> <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || loading !== null}
                loading={loading === plan.id}
                className={`w-full ${isCurrent ? "bg-gray-100 text-gray-500 hover:bg-gray-100 opacity-100" : ""}`}
              >
                {isCurrent ? "Active" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
