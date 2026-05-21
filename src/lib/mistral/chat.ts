/**
 * Saathi — MindSafe India's AI wellness companion
 * Powered by Mistral Agents API (agents.complete)
 *
 * Uses a custom Mistral Agent (Saathi) instead of a raw model.
 * The agent carries its own system prompt, personality, and guardrails
 * configured in the Mistral console — we only pass conversation history.
 *
 * Assessment engine (ARIA) uses ZERO Mistral calls — this file is
 * exclusively for the optional student chat companion.
 */

import { Mistral } from "@mistralai/mistralai";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Build the Mistral client once (module-level singleton)
function getMistralClient(): Mistral {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not set");
  return new Mistral({ apiKey });
}

/**
 * Send a message to the Saathi agent and return the reply text.
 *
 * @param history  Prior conversation turns (user + assistant only — no system)
 * @param userMessage  The new message from the student
 * @param context  Optional extra context injected as a leading user turn
 *                 (e.g. student's current risk level, last check-in emotion)
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  context?: string
): Promise<string> {
  const client = getMistralClient();

  const agentId = process.env.MISTRAL_AGENT_ID;
  if (!agentId) throw new Error("MISTRAL_AGENT_ID is not set");

  // Build message array — agents.complete() does NOT accept "system" role
  // Context is injected as a prefixed user message if provided
  const messages: { role: "user" | "assistant"; content: string }[] = [];

  if (context) {
    // Inject context as a silent user turn so the agent has student state
    messages.push({ role: "user", content: `[Context: ${context}]` });
    messages.push({ role: "assistant", content: "Understood, I'll keep that in mind." });
  }

  // Append prior conversation history (max last 10 turns to stay within limits)
  const recentHistory = history.slice(-10);
  messages.push(...recentHistory);

  // Append the new user message
  messages.push({ role: "user", content: userMessage });

  // Add timeout wrapper to prevent indefinite hanging (60 second timeout)
  // Mistral API typically takes 20-30 seconds, so we need a longer timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Mistral API timeout after 60 seconds")), 60000);
  });

  const apiPromise = client.agents.complete({
    agentId,
    messages,
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    return "I'm here for you 🌿 How are you feeling right now?";
  }

  // content can be string or ContentChunk[] — normalise to string
  if (typeof content === "string") return content;

  // ContentChunk array — join text chunks
  if (Array.isArray(content)) {
    return content
      .map((chunk) => (typeof chunk === "string" ? chunk : (chunk as { text?: string }).text ?? ""))
      .join("");
  }

  return "I'm here for you 🌿 How are you feeling right now?";
}
