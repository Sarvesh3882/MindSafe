import { NextRequest, NextResponse } from "next/server";
import { sendChatMessage, type ChatMessage } from "@/lib/mistral/chat";
import { detectCrisisKeywords } from "@/lib/aria/engine";
import { createClient } from "@/lib/supabase/server";
import { createAlertAndNotify } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { message, history, sessionId } = await req.json() as {
      message: string;
      history?: ChatMessage[];
      sessionId?: string;
    };

    console.log(`[Chat API] Received message: "${message.substring(0, 50)}..."`);

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ── Crisis keyword detection ─────────────────────────────────────────
    // Hardcoded — never delegated to AI for reliability
    if (detectCrisisKeywords(message)) {
      console.log("[Chat API] Crisis keywords detected");
      const crisisReply =
        "I'm really glad you shared that with me 💙 Please talk to your counsellor right away — they're here to help you. You can also call iCall right now: **9152987821**. You're not alone.";

      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await createAlertAndNotify({
          studentId: user.id,
          type: "crisis_keyword",
          riskLevel: "critical",
          notes: "Triggered by Saathi chat keyword detection"
        });
      }
      return NextResponse.json({ reply: crisisReply });
    }

    // ── Call Saathi via Mistral Agents API ────────────────────────────────
    // Note: Context building disabled for performance (was adding 15-20s delay)
    console.log("[Chat API] Calling Mistral API...");
    const mistralStart = Date.now();
    
    let reply: string;
    try {
      reply = await sendChatMessage(history ?? [], message, undefined);
      const mistralDuration = ((Date.now() - mistralStart) / 1000).toFixed(2);
      console.log(`[Chat API] Mistral API responded in ${mistralDuration}s`);
    } catch (mistralError: any) {
      const mistralDuration = ((Date.now() - mistralStart) / 1000).toFixed(2);
      console.error(`[Chat API] Mistral API error after ${mistralDuration}s:`, mistralError.message);
      
      // Return friendly error message instead of crashing
      reply = "I'm having a little trouble right now. Please try again in a moment 💙";
    }

    // ── Persist chat history ──────────────────────────────────────────────
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("chat_messages").insert([
          { user_id: user.id, role: "user", content: message, session_id: sessionId ?? null },
          { user_id: user.id, role: "assistant", content: reply, session_id: sessionId ?? null },
        ]);
        console.log("[Chat API] Messages persisted to database");
      }
    } catch (error) {
      console.error("[Chat API] Error persisting messages:", error);
      // Non-critical
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Chat API] Total request time: ${totalDuration}s`);

    return NextResponse.json({ reply });
  } catch (error) {
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[Chat API] Error after ${totalDuration}s:`, error);
    return NextResponse.json(
      { reply: "I'm having a little trouble right now. Please try again in a moment 💙" },
      { status: 200 }
    );
  }
}
