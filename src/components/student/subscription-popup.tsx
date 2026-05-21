"use client";

/**
 * Subscription Popup
 * Shown to anonymous users when they try to access chat or sessions.
 */

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SubscriptionPopupProps {
  open: boolean;
  onClose: () => void;
  feature: "chat" | "sessions";
}

const CONTENT = {
  chat: {
    title: "Unlock Saathi Chat",
    subtitle: "Create a free account to chat with Saathi, your 24/7 AI wellness companion.",
    features: [
      "Unlimited conversations with Saathi",
      "Personalized wellness insights",
      "Chat history saved securely",
      "Connect with your counsellor",
    ],
  },
  sessions: {
    title: "Book Counsellor Sessions",
    subtitle: "Create a free account to book confidential one-on-one sessions with a counsellor.",
    features: [
      "Book sessions with certified counsellors",
      "Track your wellness journey",
      "Personalized support & follow-ups",
      "Secure & confidential",
    ],
  },
};

export function SubscriptionPopup({ open, onClose, feature }: SubscriptionPopupProps) {
  const router = useRouter();
  const content = CONTENT[feature];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Illustration header */}
              <div className="relative bg-gradient-to-br from-[#F0FFF4] to-[#E8FFF0] px-6 pt-8 pb-4 flex flex-col items-center">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#6B7280] hover:bg-white hover:text-[#1A1A24] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <Image
                  src="/illustrations/anonymoususer_acess_popup.svg"
                  alt="Unlock full access"
                  width={200}
                  height={160}
                  className="object-contain"
                />

                {/* Lock badge */}
                <div className="flex items-center gap-2 bg-white/80 border border-[#3DBE29]/20 rounded-full px-4 py-1.5 mt-2">
                  <svg className="w-3.5 h-3.5 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <span className="text-xs font-bold text-[#3DBE29]">Free Account Required</span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <h2 className="text-xl font-black text-[#1A1A24] mb-1.5">{content.title}</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-5">{content.subtitle}</p>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-6">
                  {content.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#374151]">
                      <div className="w-5 h-5 rounded-full bg-[#3DBE29]/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA buttons */}
                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/signup/student")}
                    className="w-full py-3.5 bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-[#3DBE29]/25 transition-all"
                  >
                    Create Free Account
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/login")}
                    className="w-full py-3 border-2 border-[#E5E7EB] text-[#374151] font-semibold rounded-xl text-sm hover:border-[#3DBE29]/40 hover:bg-[#F9FAFB] transition-all"
                  >
                    Sign In
                  </motion.button>
                </div>

                <p className="text-center text-xs text-[#9CA3AF] mt-4">
                  Free forever for students · No credit card required
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
