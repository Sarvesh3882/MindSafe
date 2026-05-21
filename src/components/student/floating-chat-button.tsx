"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAnonymous } from "@/lib/anonymous-context";
import { SubscriptionPopup } from "@/components/student/subscription-popup";

export function FloatingChatButton() {
  const { isAnonymous } = useAnonymous();
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <SubscriptionPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        feature="chat"
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {isAnonymous ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setPopupOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-[#3DBE29] to-[#00C9A7] rounded-full shadow-lg flex items-center justify-center hover:shadow-[#3DBE29]/30 hover:shadow-2xl transition-shadow"
            aria-label="Open Saathi wellness chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-6 h-6">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </motion.button>
        ) : (
          <Link href="/student/chat">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-14 h-14 bg-gradient-to-tr from-[#3DBE29] to-[#00C9A7] rounded-full shadow-lg flex items-center justify-center hover:shadow-[#3DBE29]/30 hover:shadow-2xl transition-shadow"
              aria-label="Open Saathi wellness chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-6 h-6">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </motion.button>
          </Link>
        )}
      </motion.div>
    </>
  );
}
