"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginLandingPage() {
  const roles = [
    {
      id: "student",
      title: "Student",
      subtitle: "Wellness Dashboard",
      description: "Track your mental health, connect with counsellors, and access wellness resources.",
      href: "/login/student",
      accentColor: "#3DBE29",
      lightBg: "#F0FFF4",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      id: "counsellor",
      title: "Counsellor",
      subtitle: "Student Support",
      description: "Manage sessions, monitor wellness alerts, and provide professional support.",
      href: "/login/counsellor",
      accentColor: "#00C9A7",
      lightBg: "#F0FDFB",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      id: "admin",
      title: "Admin",
      subtitle: "Institution Management",
      description: "Oversee campus wellness analytics, manage counsellors, and generate NAAC reports.",
      href: "/login/admin",
      accentColor: "#6366F1",
      lightBg: "#F5F3FF",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full flex font-student overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-gradient-to-br from-[#E8F5E9] via-[#F0FFF4] to-[#DCF5E8] overflow-hidden flex-shrink-0 flex-col">

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.26, 0.18] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] rounded-full bg-[#3DBE29]/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.14, 0.22, 0.14] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-[#00C9A7]/18 blur-3xl"
          />
        </div>

        {/* Floating dots */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] right-[12%] w-3 h-3 rounded-full bg-[#3DBE29]/40"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[45%] left-[8%] w-2 h-2 rounded-full bg-[#00C9A7]/50"
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[30%] right-[8%] w-2.5 h-2.5 rounded-full bg-[#3DBE29]/30"
        />

        {/* Logo — top left, same style as landing page navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 pt-8 pl-10"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-icon.svg"
              alt="MindSafe India logo"
              width={40}
              height={40}
              className="w-10 h-10 flex-shrink-0"
              priority
            />
            <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
              <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
            </span>
          </Link>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex-1 flex items-end justify-center"
        >
          <Image
            src="/illustrations/Student_using_laptop_welness.svg"
            alt="Student wellness illustration"
            width={580}
            height={580}
            className="object-contain object-bottom w-full max-w-[580px] drop-shadow-xl"
            priority
          />
        </motion.div>

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 pb-8 text-center px-10"
        >
          <p className="text-sm font-semibold text-[#2D6A4F]">
            You&apos;re not alone. We&apos;re here with you. 🌿
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-14 overflow-y-auto">
        <div className="w-full max-w-[480px]">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 lg:hidden"
          >
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-icon.svg"
                alt="MindSafe India logo"
                width={36}
                height={36}
                className="w-9 h-9 flex-shrink-0"
              />
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
            className="mb-9"
          >
            <h1 className="text-[2rem] font-extrabold text-[#1A1A24] leading-tight tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#6B7280] mt-2 text-sm leading-relaxed">
              Choose your role to continue to your personalized dashboard
            </p>
          </motion.div>

          {/* Role cards */}
          <div className="flex flex-col gap-3 mb-9">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={role.href}
                  className="group flex items-center gap-4 rounded-2xl border-2 border-[#F0F0F0] hover:border-transparent bg-white px-5 py-4 transition-all duration-250 hover:shadow-lg"
                  style={{
                    ["--hover-bg" as string]: role.lightBg,
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.18 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{
                      backgroundColor: `${role.accentColor}15`,
                      color: role.accentColor,
                    }}
                  >
                    {role.icon}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-[#1A1A24] group-hover:text-[#1A1A24]">
                        {role.title}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${role.accentColor}15`,
                          color: role.accentColor,
                        }}
                      >
                        {role.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed truncate">
                      {role.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.18 }}
                  >
                    <svg
                      className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#6B7280] transition-colors flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex-1 h-px bg-[#F3F4F6]" />
            <span className="text-xs text-[#C4C4C4] font-medium">New to MindSafe?</span>
            <div className="flex-1 h-px bg-[#F3F4F6]" />
          </motion.div>

          {/* Sign up + admin note */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="text-center space-y-2"
          >
            <p className="text-sm text-[#6B7280]">
              Students &amp; Counsellors:{" "}
              <Link
                href="/signup/student"
                className="font-bold hover:underline transition-colors"
                style={{ color: "#3DBE29" }}
              >
                Create your account
              </Link>
            </p>
            <p className="text-xs text-[#C4C4C4]">
              Admin accounts are created during institutional onboarding
            </p>
          </motion.div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.75 }}
            className="text-center text-xs text-[#D1D5DB] mt-8 flex items-center justify-center gap-1.5"
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
