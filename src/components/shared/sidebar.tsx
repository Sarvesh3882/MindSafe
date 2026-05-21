"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: "Home", href: "/student", icon: <HomeIcon /> },
  { label: "Check-in", href: "/student/checkin", icon: <CheckIcon /> },
  { label: "Recommendations", href: "/student/prescriptions", icon: <RecommendationsIcon /> },
  { label: "Resources", href: "/student/resources", icon: <BookIcon /> },
  { label: "Sessions", href: "/student/sessions", icon: <CalendarIcon /> },
  { label: "Chat", href: "/student/chat", icon: <ChatIcon /> },
];

const counsellorNav: NavItem[] = [
  { label: "Dashboard", href: "/counsellor", icon: <HomeIcon /> },
  { label: "Students", href: "/counsellor/students", icon: <UsersIcon /> },
  { label: "Recommendations", href: "/counsellor/prescriptions", icon: <RecommendationsIcon /> },
  { label: "Sessions", href: "/counsellor/sessions", icon: <CalendarIcon /> },
  { label: "Alerts", href: "/counsellor/alerts", icon: <BellIcon /> },
  { label: "Resources", href: "/counsellor/resources", icon: <BookIcon /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <HomeIcon /> },
  { label: "Analytics", href: "/admin/analytics", icon: <ChartIcon /> },
  { label: "Students", href: "/admin/students", icon: <UsersIcon /> },
  { label: "Counsellors", href: "/admin/counsellors", icon: <UsersIcon /> },
  { label: "Evidence", href: "/admin/evidence", icon: <DocumentIcon /> },
  { label: "Reports", href: "/admin/reports", icon: <DocumentIcon /> },
  { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
];


const navMap: Record<UserRole, NavItem[]> = {
  student: studentNav,
  counsellor: counsellorNav,
  admin: adminNav,
};

interface SidebarProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navMap[role];

  // Define colors based on role
  const colors = {
    student: {
      primary: '#3DBE29',
      secondary: '#00C9A7',
      light: '#F8FAF9',
      lightBg: '#F0FFF4',
    },
    counsellor: {
      primary: '#00C9A7',
      secondary: '#00B396',
      light: '#E0FAF5',
      lightBg: '#E0FAF5',
    },
    admin: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      light: '#EFF6FF',
      lightBg: '#EFF6FF',
    },
  };

  const roleColors = colors[role];

  function handleSignOut() {
    // Guest user — clear sessionStorage and redirect to login
    if (userName === "Guest" || !userEmail) {
      sessionStorage.removeItem("mindsafe_anonymous_mode");
      router.push("/login");
      return;
    }
    // Real user — use the auth signout API
    window.location.href = "/api/auth/signout";
  }

  return (
    <aside className="w-64 min-h-screen bg-white flex flex-col fixed left-0 top-0 z-40 border-r border-[#F0F0F0] shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
      {/* Logo Section - Exactly like Landing Page */}
      <div className="h-20 flex items-center px-6 border-b border-[#F0F0F0]">
        <Link href={`/${role}`} className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Image 
              src="/logo-icon.svg" 
              alt="MindSafe India" 
              width={40} 
              height={40} 
              className="w-10 h-10 flex-shrink-0" 
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight leading-none">
              Mind<span style={{ color: roleColors.primary }}>Safe</span>
            </span>
            <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mt-0.5">
              {role === 'student' ? 'Student Portal' : role === 'counsellor' ? 'Counsellor Portal' : 'Admin Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? "text-white shadow-lg"
                    : "text-[#6B7280] hover:text-[#1A1A24]"
                )}
                style={isActive ? {
                  background: `linear-gradient(to right, ${roleColors.primary}, ${roleColors.secondary})`,
                  boxShadow: `0 10px 25px ${roleColors.primary}25`
                } : {}}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = roleColors.light;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.span 
                    layoutId="activeTab"
                    className="absolute -left-1 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full"
                    style={{ backgroundColor: roleColors.primary }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <span className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  isActive ? "" : "group-hover:scale-110"
                )}>
                  {item.icon}
                </span>
                
                {/* Label */}
                <span>{item.label}</span>
                
                {/* Hover arrow */}
                {!isActive && (
                  <svg 
                    className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#F0F0F0]">
        <div 
          className="rounded-2xl p-4 border border-[#E5E7EB]"
          style={{ 
            background: `linear-gradient(to bottom right, ${roleColors.light}, ${roleColors.lightBg})` 
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-md"
              style={{ 
                background: `linear-gradient(to bottom right, ${roleColors.primary}, ${roleColors.secondary})` 
              }}
            >
              {userName?.[0]?.toUpperCase() ?? "U"}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A24] text-sm font-bold truncate">{userName ?? "User"}</p>
              <p className="text-[#6B7280] text-xs truncate">{userEmail ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#6B7280] hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30 hover:bg-[#FFF5F5] transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            suppressHydrationWarning
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {userName === "Guest" || !userEmail ? "Exit Guest" : "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}

// Icon components
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function RecommendationsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function PrescriptionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
