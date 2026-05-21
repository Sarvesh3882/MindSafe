"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── Reusable fade-up wrapper ── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated stat counter ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  /* Navbar scroll shadow */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-student overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F0F0F0] transition-shadow duration-300"
        style={{ boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe India logo" width={40} height={40} className="w-10 h-10 flex-shrink-0" />
            <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
              <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#6B7280]">
            {["Why Us", "Features", "NAAC", "Pricing"].map((label, i) => (
              <a
                key={label}
                href={`#${["problem", "features", "naac", "pricing"][i]}`}
                className="relative group hover:text-[#3DBE29] transition-colors"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#3DBE29] rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-[#6B7280] hover:text-[#1A1A24] transition-colors">
              Sign in
            </Link>
            <Link href="/student/anonymous" className="text-sm font-semibold text-[#6B7280] border border-[#E5E7EB] hover:border-[#3DBE29] hover:text-[#3DBE29] px-4 py-2 rounded-full transition-all">
              Try as Guest
            </Link>
            <Link href="/demo" className="bg-[#3DBE29] hover:bg-[#32A822] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md hover:shadow-[#3DBE29]/25 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="pt-16 min-h-[90vh] flex items-center relative overflow-hidden bg-[#F5FFF6]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0FFF4] via-[#F5FFF6] to-[#EAF9F0] -z-10" />
        <div className="absolute top-0 right-0 w-[55%] h-full bg-[#E8FFF0]/60 -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center py-10">
          {/* Left — staggered entrance */}
          <div className="space-y-7 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white border border-[#3DBE29]/30 rounded-full px-4 py-2 text-sm font-semibold text-[#3DBE29] shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#3DBE29] animate-pulse" />
              NAAC Compliant · AI-Powered
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl lg:text-6xl font-black text-[#1A1A24] leading-[1.1] tracking-tight"
            >
              Your Students&apos;<br />
              <span className="text-[#3DBE29]">Minds. Safe.</span><br />
              Always.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="text-lg text-[#6B7280] leading-relaxed max-w-md"
            >
              AI-powered early detection, counsellor triage, and campus-wide wellness analytics — built for Indian colleges. No stigma. No friction.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg shadow-[#3DBE29]/25 hover:shadow-xl hover:shadow-[#3DBE29]/30 active:scale-95 group">
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 border-2 border-[#C8C8C8] hover:border-[#3DBE29] text-[#1A1A24] font-bold px-8 py-4 rounded-full text-base transition-all bg-white/70 active:scale-95">
                View Dashboard
              </Link>
            </motion.div>
          </div>

          {/* Right — illustration with gentle drift */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center h-[540px]"
          >
            <div className="absolute inset-4 bg-[#D6F5DC]/40 rounded-[40%_60%_55%_45%/45%_55%_60%_40%]" />
            <div className="absolute top-10 left-6 w-4 h-4 rounded-full bg-[#3DBE29]/25" />
            <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-[#00C9A7]/35" />
            <div className="absolute bottom-16 left-6 w-5 h-5 rounded-full bg-[#3DBE29]/15" />
            <div className="absolute bottom-28 right-6 w-2.5 h-2.5 rounded-full bg-[#00C9A7]/30" />
            <svg className="absolute top-14 right-20 w-5 h-5 text-[#3DBE29]/35" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <svg className="absolute bottom-20 right-10 w-4 h-4 text-[#00C9A7]/35" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <Image
              src="/illustrations/Landing_page.svg"
              alt="MindSafe India hero illustration"
              width={600}
              height={540}
              className="object-contain w-full h-full relative z-10"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14 bg-[#1A1A24] relative overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A24]/95 via-[#1A1A24]/90 to-[#1A1A24]/95 backdrop-blur-xl" />
        {/* Subtle glow accents */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#3DBE29]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00C9A7]/8 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { display: null, countTo: 95, suffix: "%", label: "Student engagement rate" },
              { display: null, countTo: 72, suffix: "%", label: "Early intervention success" },
              { display: null, countTo: 48, suffix: "hrs", label: "Avg. response time" },
              { display: null, countTo: 15000, suffix: "+", label: "Students supported" },
            ].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <div className="text-3xl font-black text-[#3DBE29] mb-1">
                  {s.display ? (
                    s.display
                  ) : (
                    <CountUp target={s.countTo!} suffix={s.suffix} />
                  )}
                </div>
                <div className="text-sm text-white/60">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section id="problem" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative h-[420px] flex items-center justify-center">
              <div className="absolute inset-4 bg-[#FFF3E8]/50 rounded-[55%_45%_40%_60%/45%_60%_55%_40%]" />
              <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-[#FF9F43]/30" />
              <div className="absolute bottom-10 left-8 w-4 h-4 rounded-full bg-[#FF6B6B]/20" />
              <svg className="absolute top-10 left-1/4 w-5 h-5 text-[#FF9F43]/25" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              <Image
                src="/illustrations/Student_in_stress_need_help.svg"
                alt="Student in stress — MindSafe helps"
                width={420}
                height={380}
                className="object-contain w-full h-full relative z-10"
              />
            </div>
          </FadeUp>

          <div className="space-y-6">
            <FadeUp delay={0.05}>
              <span className="inline-block bg-[#FFF8F0] text-[#FF9F43] text-sm font-bold px-4 py-2 rounded-full border border-[#FF9F43]/20">
                The Problem We Solve
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-4xl font-black text-[#1A1A24] leading-tight">
                1 in 4 students struggles.<br />
                <span className="text-[#FF9F43]">Most never ask for help.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="text-[#6B7280] leading-relaxed text-lg">
                Exam pressure, social isolation, burnout — Indian college students face it all. But stigma, lack of awareness, and no easy access to support means most suffer in silence.
              </p>
            </FadeUp>
            <div className="space-y-4">
              {[
                { stat: "1 counsellor", desc: "per 500+ students on average" },
                { stat: "Zero systems", desc: "for early detection in most colleges" },
                { stat: "No visibility", desc: "for admins into campus mental health" },
              ].map((item, i) => (
                <FadeUp key={item.stat} delay={0.2 + i * 0.08}>
                  <div className="flex items-start gap-4 p-4 bg-[#FFF8F0] rounded-xl border border-[#FF9F43]/15 hover:border-[#FF9F43]/40 transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-[#FF9F43] mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#1A1A24]">{item.stat}</span>
                      <span className="text-[#6B7280]"> — {item.desc}</span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.45}>
              <p className="text-[#3DBE29] font-bold text-lg">MindSafe India changes this. 🌿</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-[#F8FFF8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <div className="space-y-4">
              <FadeUp>
                <span className="inline-block bg-[#F0FFF4] text-[#3DBE29] text-sm font-bold px-4 py-2 rounded-full">
                  The Platform
                </span>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h2 className="text-4xl font-black text-[#1A1A24] leading-tight">
                  Built for every role<br />
                  <span className="text-[#3DBE29]">on campus.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.14}>
                <p className="text-[#6B7280] leading-relaxed">
                  Students check in daily in under 2 minutes. Counsellors get smart triage. Admins get campus-wide analytics. All in one platform.
                </p>
              </FadeUp>
            </div>
            <FadeUp delay={0.1}>
              <div className="relative h-[320px] flex items-center justify-center">
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#3DBE29]/30" />
                <div className="absolute bottom-8 left-6 w-4 h-4 rounded-full bg-[#00C9A7]/25" />
                <svg className="absolute top-6 left-1/4 w-5 h-5 text-[#3DBE29]/30" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                <Image
                  src="/illustrations/Student_using_laptop_welness.svg"
                  alt="Student using MindSafe wellness platform"
                  width={380}
                  height={300}
                  className="object-contain w-full h-full relative z-10"
                />
              </div>
            </FadeUp>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="inline-block bg-white border border-[#E5E7EB] text-xs font-semibold text-[#9CA3AF] px-4 py-1.5 rounded-full">Features</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.09)" }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-6 border-l-4 group min-h-[160px] flex flex-col cursor-default"
                  style={{
                    borderLeftColor: f.color,
                    backgroundColor: `${f.color}06`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 4 }}
                      transition={{ duration: 0.2 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${f.color}20` }}
                    >
                      <f.Icon color={f.color} />
                    </motion.div>
                    <h3 className="text-sm font-bold text-[#1A1A24] group-hover:text-[#3DBE29] transition-colors leading-tight">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed flex-1">{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAAC SECTION ── */}
      <section id="naac" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <FadeUp>
              <span className="inline-flex items-center gap-2 bg-white border border-[#3DBE29]/20 rounded-full px-4 py-2 text-sm font-bold text-[#3DBE29]">
                🏛️ NAAC Advantage
              </span>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-4xl font-black text-[#1A1A24] leading-tight">
                Turn student welfare into<br />
                <span className="text-[#3DBE29]">your NAAC score.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-[#6B7280] leading-relaxed">
                NAAC directly scores Student Support &amp; Progression. MindSafe generates one-click compliance reports with campus wellness data, counsellor utilization, and intervention metrics.
              </p>
            </FadeUp>
            <ul className="space-y-3">
              {["One-click PDF wellness reports", "Counsellor session utilization data", "Early intervention metrics", "Anonymous student welfare statistics"].map((item, i) => (
                <FadeUp key={item} delay={0.2 + i * 0.07}>
                  <li className="flex items-center gap-3 text-[#1A1A24] text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#3DBE29] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {item}
                  </li>
                </FadeUp>
              ))}
            </ul>
            <FadeUp delay={0.5}>
              <Link href="/demo" className="inline-flex items-center gap-2 bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-md hover:shadow-lg hover:shadow-[#3DBE29]/25 active:scale-95 group">
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0FFF4]/80 to-[#E8FFF0]/80 rounded-3xl" />
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#3DBE29]/30" />
              <div className="absolute bottom-6 left-6 w-4 h-4 rounded-full bg-[#00C9A7]/25" />
              <Image
                src="/illustrations/Landing_page_2.svg"
                alt="NAAC compliance illustration"
                width={460}
                height={400}
                className="object-contain w-full h-full relative z-10 drop-shadow-md"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMMUNITY SECTION ── */}
      <section className="py-24 px-6 bg-[#F8FFF8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <FadeUp>
              <span className="inline-block bg-[#F0FFF4] text-[#3DBE29] text-sm font-bold px-4 py-2 rounded-full mb-4">
                Trusted by Institutions
              </span>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-4xl font-black text-[#1A1A24] leading-tight">
                Built for the Indian<br />
                <span className="text-[#3DBE29]">college community.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
                From small colleges to large universities — MindSafe adapts to your campus culture and scale.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "For Students", tagColor: "#3DBE29", borderColor: "#3DBE29", title: "Classroom Ready", desc: "Designed for the Indian classroom — culturally aware, stigma-free, and built for Gen Z students.", img: "/illustrations/classroom.svg", alt: "Classroom community illustration" },
              { tag: "For Institutions", tagColor: "#00C9A7", borderColor: "#00C9A7", title: "Institution Scale", desc: "From 500 to 50,000 students — MindSafe scales with your institution without compromising privacy.", img: "/illustrations/college.svg", alt: "College institution illustration" },
              { tag: "For Admins", tagColor: "#FF9F43", borderColor: "#FF9F43", title: "Admin Control", desc: "Complete institutional visibility with anonymized data — Deans and SWOs get the insights they need.", img: "/illustrations/Company.svg", alt: "Organization management illustration" },
            ].map((card, i) => (
              <FadeUp key={card.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.22 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-lg transition-shadow duration-200 group h-full"
                  style={{ borderTop: `4px solid ${card.borderColor}` }}
                >
                  <div className="h-52 flex items-center justify-center px-6 pt-6">
                    <Image src={card.img} alt={card.alt} width={220} height={180} className="object-contain h-full w-auto" />
                  </div>
                  <div className="px-6 pb-6 pt-4">
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${card.tagColor}15`, color: card.tagColor }}>
                      {card.tag}
                    </span>
                    <h3 className="font-bold text-[#1A1A24] text-base mb-2 group-hover:text-[#3DBE29] transition-colors">{card.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeUp>
              <span className="inline-block bg-[#F0FFF4] text-[#3DBE29] text-sm font-bold px-4 py-2 rounded-full mb-4">Pricing</span>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-4xl font-black text-[#1A1A24]">Institutional pricing that scales</h2>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-[#6B7280] mt-3">One subscription covers your entire campus.</p>
            </FadeUp>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: plan.featured ? -6 : -4 }}
                  transition={{ duration: 0.22 }}
                  className={`rounded-2xl p-8 border-2 transition-shadow h-full ${plan.featured ? "border-[#3DBE29] bg-[#F8FFF8] shadow-xl shadow-[#3DBE29]/10 relative" : "border-[#E5E7EB] bg-white hover:border-[#3DBE29]/40 hover:shadow-md"}`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3DBE29] text-white text-xs font-black px-5 py-1.5 rounded-full">MOST POPULAR</div>
                  )}
                  <h3 className="text-xl font-black text-[#1A1A24] mb-1">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-black text-[#3DBE29]">{plan.price.split("/")[0]}</span>
                    <span className="text-[#6B7280] text-sm">/{plan.price.split("/")[1]}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] font-semibold mb-6 pb-6 border-b border-[#E5E7EB]">{plan.students}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#1A1A24]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#3DBE29" strokeWidth={2.5} className="w-4 h-4 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/demo" className={`block text-center font-bold py-3 rounded-xl text-sm transition-all active:scale-95 ${plan.featured ? "bg-[#3DBE29] text-white hover:bg-[#32A822] shadow-md" : "border-2 border-[#3DBE29] text-[#3DBE29] hover:bg-[#F0FFF0]"}`}>
                    Get Started
                  </Link>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#1A1A24] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-80 h-80 bg-[#3DBE29] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.16, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00C9A7] rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3DBE29]/6 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-[#3DBE29]/15 border border-[#3DBE29]/30 rounded-full px-4 py-2 text-sm font-semibold text-[#3DBE29] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3DBE29] animate-pulse" />
              Join colleges across India
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Safe minds build<br />stronger institutions.
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Protect your students&apos; mental wellness, boost your NAAC score, and give counsellors the tools they need — all in one platform.
            </p>
          </FadeUp>
          <FadeUp delay={0.26}>
            <Link href="/demo" className="inline-flex items-center gap-2 bg-[#3DBE29] hover:bg-[#32A822] text-white font-bold px-10 py-4 rounded-full text-base transition-all shadow-xl shadow-[#3DBE29]/30 hover:shadow-2xl hover:shadow-[#3DBE29]/40 active:scale-95 group">
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#F8F9FA] border-t border-[#E5E7EB]">
        <div className="bg-[#FFF8F0] border-b border-[#FFE4C4] px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-[#92400E] leading-relaxed">
              <strong>Important:</strong> MindSafe India is a wellness support platform and is not a crisis service or substitute for professional mental health treatment.
              If you or someone you know is in immediate danger, please call <strong>iCall: 9152987821</strong> or <strong>AASRA: 9820466627</strong> immediately.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Image src="/logo-icon.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
                <span className="font-extrabold text-[#1A1A24] text-lg">Mind<span className="text-[#3DBE29]">Safe</span> India</span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
                AI-powered mental wellness platform for Indian colleges. NAAC compliant, stigma-free, built for Gen Z.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {[
                  { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
                  { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                  { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" },
                ].map((s) => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center hover:border-[#3DBE29] hover:text-[#3DBE29] text-[#6B7280] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A24] uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "NAAC Reports", "Get Started", "View Dashboard"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-[#6B7280] hover:text-[#3DBE29] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A24] uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Blog", "Contact", "FAQ", "Careers"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-[#6B7280] hover:text-[#3DBE29] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A24] uppercase tracking-wider">Legal &amp; Safety</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "DPDP Compliance", "Data Security", "Cookie Policy"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-[#6B7280] hover:text-[#3DBE29] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#9CA3AF]">
              © 2026 MindSafe India · Mental health support platform for Indian colleges · DPDP Act 2023 Compliant · AES-256 Encrypted
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3DBE29]" />
              <span className="text-xs text-[#9CA3AF]">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

const FEATURES = [
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "ARIA Assessment Engine",
    desc: "Clinically validated daily check-ins using PHQ-9, GAD-7, and PSS. Students never feel like they're taking a test.",
    color: "#3DBE29",
  },
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
    title: "Real-Time Crisis Alerts",
    desc: "Instant counsellor notification and guardian SMS when a student is flagged critical. Zero delay.",
    color: "#FF6B6B",
  },
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Admin Analytics",
    desc: "Campus-wide wellness dashboard with department breakdowns, trend graphs, and one-click NAAC reports.",
    color: "#00C9A7",
  },
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: "AI Wellness Companion",
    desc: "Saathi — Mistral-powered chatbot for students who prefer not to talk to a human. Warm, non-clinical.",
    color: "#FF9F43",
  },
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Counsellor Triage",
    desc: "Smart priority list — critical students first. Session calendar, digital notes, and resource prescription.",
    color: "#3DBE29",
  },
  {
    Icon: ({ color }: { color: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: "Privacy by Design",
    desc: "Admins see zero student names. Supabase Row Level Security enforces anonymization at the database level.",
    color: "#6B7280",
  },
];

const PRICING = [
  { name: "Basic", price: "₹15,000/mo", students: "Up to 500 students", featured: false, features: ["Student dashboard", "Daily check-in (ARIA)", "1 counsellor account", "Basic analytics", "Email support"] },
  { name: "Growth", price: "₹35,000/mo", students: "Up to 2,000 students", featured: true, features: ["Everything in Basic", "5 counsellor accounts", "Full admin dashboard", "Monthly NAAC reports", "Crisis SMS alerts", "Priority support"] },
  { name: "Enterprise", price: "Custom", students: "Unlimited students", featured: false, features: ["Everything in Growth", "Custom branding", "API access", "Dedicated support", "SLA guarantee", "Onboarding training"] },
];
