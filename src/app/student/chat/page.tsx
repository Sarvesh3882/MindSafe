"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAnonymous } from "@/lib/anonymous-context";
import { SubscriptionPopup } from "@/components/student/subscription-popup";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const WELCOME = "Hey! I'm Saathi, your wellness companion. How are you feeling right now? You can share anything — no judgment here.";

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*\*/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_{2,}/g, "")
    .trim();
}

function groupSessionsByDate(sessions: ChatSession[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const week = new Date(today); week.setDate(week.getDate() - 7);
  const month = new Date(today); month.setDate(month.getDate() - 30);

  const groups: { label: string; items: ChatSession[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 Days", items: [] },
    { label: "Previous 30 Days", items: [] },
    { label: "Older", items: [] },
  ];

  sessions.forEach((s) => {
    const d = new Date(s.updated_at);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= today) groups[0].items.push(s);
    else if (day >= yesterday) groups[1].items.push(s);
    else if (day >= week) groups[2].items.push(s);
    else if (day >= month) groups[3].items.push(s);
    else groups[4].items.push(s);
  });

  return groups.filter((g) => g.items.length > 0);
}

export default function ChatPage() {
  const { isAnonymous } = useAnonymous();

  // Show popup immediately for anonymous users
  if (isAnonymous) {
    return <AnonymousChatBlock />;
  }

  return <ChatPageContent />;
}

function AnonymousChatBlock() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center font-student relative">
      {/* Background illustration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] opacity-[0.08]">
          <Image src="/illustrations/chat_bot.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      <SubscriptionPopup
        open={open}
        onClose={() => { setOpen(false); router.push("/student"); }}
        feature="chat"
      />

      {!open && (
        <div className="text-center z-10">
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white font-bold rounded-xl text-sm"
          >
            Unlock Saathi Chat
          </button>
        </div>
      )}
    </div>
  );
}

function ChatPageContent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);
  const [consentExpanded, setConsentExpanded] = useState(false);

  // Session state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load consent
  useEffect(() => {
    async function loadConsent() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("consent_records")
        .select("chat_access, is_active")
        .eq("student_id", user.id)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (data?.chat_access) setConsentGiven(true);
    }
    loadConsent();
  }, []);

  // Load sessions list
  const loadSessions = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("chat_sessions")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (data) setSessions(data);
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  // Load most recent session on mount
  useEffect(() => {
    async function loadLatestSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: latestSession } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (latestSession) {
        loadSession(latestSession.id);
      }
    }
    loadLatestSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSession(sessionId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    setCurrentSessionId(sessionId);
    if (data && data.length > 0) {
      setMessages([
        { role: "assistant", content: WELCOME },
        ...data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ]);
    } else {
      setMessages([{ role: "assistant", content: WELCOME }]);
    }
    setSidebarOpen(false);
  }

  async function createNewSession(firstMessage?: string): Promise<string> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const title = firstMessage
      ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "")
      : "New Chat";

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (error || !data) throw new Error("Failed to create session");
    await loadSessions();
    return data.id;
  }

  function startNewChat() {
    setCurrentSessionId(null);
    setMessages([{ role: "assistant", content: WELCOME }]);
    setInput("");
    setSidebarOpen(false);
  }

  async function deleteSession(sessionId: string) {
    const supabase = createClient();
    await supabase.from("chat_sessions").delete().eq("id", sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setDeleteConfirm(null);
    if (currentSessionId === sessionId) {
      startNewChat();
    }
  }

  async function toggleConsent() {
    setConsentLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setConsentLoading(false); return; }

    if (consentGiven) {
      await supabase
        .from("consent_records")
        .update({ is_active: false, chat_access: false, revoked_at: new Date().toISOString() })
        .eq("student_id", user.id);
      setConsentGiven(false);
    } else {
      const { data: profile } = await supabase.from("users").select("college_id").eq("id", user.id).single();
      const { data: counsellors } = await supabase.from("users").select("id").eq("college_id", profile?.college_id).eq("role", "counsellor");
      for (const c of counsellors ?? []) {
        await supabase.from("consent_records").upsert({
          student_id: user.id, counsellor_id: c.id,
          chat_access: true, is_active: true, granted_at: new Date().toISOString(),
        }, { onConflict: "student_id,counsellor_id" });
      }
      setConsentGiven(true);
    }
    setConsentLoading(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Create session on first real message
    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        sessionId = await createNewSession(userMsg);
        setCurrentSessionId(sessionId);
      } catch {
        // Continue without session
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having a little trouble right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedSessions = groupSessionsByDate(filteredSessions);

  return (
    <div className="flex h-[calc(100vh-4rem)] font-student relative overflow-hidden">

      {/* ── SIDEBAR BACKDROP ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#F0F0F0] shadow-xl z-40 flex flex-col"
            style={{ top: "4rem" }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[#F0F0F0]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                suppressHydrationWarning
              >
                {/* New chat icon (edit/pencil square) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                New Chat
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-[#F0F0F0]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] bg-[#F9FAFB] text-[#1A1A24] placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
              {groupedSessions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0FFF4] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#6B7280]">No chats yet</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Start a conversation with Saathi</p>
                </div>
              ) : (
                groupedSessions.map((group) => (
                  <div key={group.label} className="mb-2">
                    <p className="px-4 py-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                      {group.label}
                    </p>
                    {group.items.map((session) => (
                      <div key={session.id} className="relative group px-2">
                        <button
                          onClick={() => loadSession(session.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 ${
                            currentSessionId === session.id
                              ? "bg-[#F0FFF4] text-[#3DBE29] font-semibold"
                              : "text-[#374151] hover:bg-[#F9FAFB]"
                          }`}
                        >
                          {/* Chat bubble icon */}
                          <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="truncate flex-1">{session.title}</span>
                        </button>

                        {/* Delete button - appears on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(session.id); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FFF5F5] hover:text-[#FF6B6B] text-[#9CA3AF] transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#1A1A24] text-center mb-1">Delete this chat?</h3>
              <p className="text-sm text-[#6B7280] text-center mb-5">This conversation will be permanently deleted and cannot be recovered.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSession(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] text-white text-sm font-semibold hover:bg-[#FF5252] transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full relative">

        {/* Background Illustration */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute right-0 bottom-0 w-[700px] h-[700px] opacity-[0.15]">
            <Image src="/illustrations/chat_bot.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute left-0 top-0 w-[500px] h-[500px] opacity-[0.08] transform scale-x-[-1]">
            <Image src="/illustrations/chat_bot.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-[#F0FFF4]/40" />
        </div>

        {/* Consent Banner - Top Right Corner */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-6 z-50 max-w-xs"
        >
          <div className={`rounded-2xl shadow-lg border-2 overflow-hidden bg-white ${consentGiven ? "border-[#3DBE29]/30" : "border-[#FF9F43]/30"}`}>
            <button
              onClick={() => setConsentExpanded(!consentExpanded)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              suppressHydrationWarning
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${consentGiven ? "bg-[#3DBE29]/10" : "bg-[#FF9F43]/10"}`}>
                <span className="text-sm">{consentGiven ? "✅" : "🔒"}</span>
              </div>
              <p className="font-bold text-[#1A1A24] text-xs flex-1 text-left">
                {consentGiven ? "Shared with counsellor" : "Private chat"}
              </p>
              <svg className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${consentExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {consentExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-100"
                >
                  <div className="px-4 py-3">
                    <p className="text-[#6B7280] text-xs leading-relaxed mb-3">
                      {consentGiven
                        ? "Your counsellor can see this conversation. You can revoke access anytime."
                        : "Only you can see this. Share with your counsellor for personalized support."}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={toggleConsent} disabled={consentLoading}
                      className={`w-full px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        consentGiven
                          ? "bg-[#FFF5F5] text-[#FF6B6B] border border-[#FF6B6B]/30 hover:bg-[#FFE5E5]"
                          : "bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white"
                      }`}
                    >
                      {consentLoading ? "..." : consentGiven ? "Revoke Access" : "Share with Counsellor"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 pb-4 border-b border-[#F0F0F0] mb-4 mt-2 bg-white/80 backdrop-blur-sm relative z-10"
        >
          {/* Hamburger menu */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F0FFF4] text-[#6B7280] hover:text-[#3DBE29] transition-all flex-shrink-0"
            aria-label="Toggle chat history"
            suppressHydrationWarning
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </motion.button>

          {/* Saathi icon + name */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-10 h-10 flex-shrink-0">
            <Image src="/illustrations/chatbot_logo.svg" alt="Saathi" width={40} height={40} className="w-10 h-10" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[#1A1A24] text-base leading-none">Saathi</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Your wellness companion</p>
          </div>

          {/* New Chat button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:border-[#3DBE29] hover:text-[#3DBE29] hover:bg-[#F0FFF4] transition-all flex-shrink-0"
            aria-label="Start new chat"
            suppressHydrationWarning
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
          </motion.button>

          {/* Online status */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#3DBE29]" />
            <span className="text-xs font-semibold text-[#3DBE29] hidden sm:inline">Online</span>
          </div>
        </motion.div>

        {/* ── MESSAGES ── */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4 scrollbar-hide relative z-10">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                  >
                    <Image src="/illustrations/chatbot_logo.svg" alt="Saathi" width={32} height={32} className="w-8 h-8" />
                  </motion.div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#3DBE29] to-[#00C9A7] text-white rounded-br-md"
                      : "bg-white border border-[#F0F0F0] text-[#1A1A24] rounded-bl-md"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {cleanMarkdown(msg.content)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0 opacity-50">
                <Image src="/illustrations/chatbot_logo.svg" alt="Saathi" width={32} height={32} className="w-8 h-8" />
              </div>
              <div className="bg-white border border-[#F0F0F0] rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 150, 300].map((delay) => (
                      <motion.div
                        key={delay}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                        className="w-2 h-2 rounded-full bg-[#3DBE29]"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#6B7280] italic">Saathi is thinking deeply about your message...</p>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── QUICK PROMPTS ── */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="pb-3 relative z-10"
            suppressHydrationWarning
          >
            <p className="text-xs font-semibold text-[#6B7280] mb-2">Quick Prompts</p>
            <div className="flex gap-2 flex-wrap" suppressHydrationWarning>
              {["I'm feeling stressed", "Can't sleep well", "Feeling lonely", "Exam pressure"].map((text) => (
                <motion.button
                  key={text}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setInput(text)}
                  className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A24] font-medium hover:border-[#3DBE29] hover:bg-[#F0FFF0] hover:text-[#3DBE29] transition-all bg-white"
                  suppressHydrationWarning
                >
                  {text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── INPUT ── */}
        <form onSubmit={sendMessage} className="flex gap-3 pt-4 pb-3 border-t border-[#F0F0F0] bg-white/80 backdrop-blur-sm relative z-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#1A1A24] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/30 focus:border-[#3DBE29] bg-white transition-all"
            disabled={loading}
            suppressHydrationWarning
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-gradient-to-br from-[#3DBE29] to-[#00C9A7] text-white px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </form>

        {/* ── CRISIS HELPLINE ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center py-2 bg-[#FFF8F0] rounded-lg border border-[#FF9F43]/20 mt-2 relative z-10"
        >
          <p className="text-xs text-[#1A1A24]">
            In crisis? Call iCall: <a href="tel:9152987821" className="text-[#FF6B6B] font-bold hover:underline">9152987821</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

