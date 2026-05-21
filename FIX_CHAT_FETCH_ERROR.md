# Fix Chat "Failed to Fetch" Error

## Error Description
When clicking on the chatbot, you get:
```
Console TypeError
Failed to fetch
```

## Possible Causes

### 1. **Mistral API Connection Issue** (Most Likely)
The Mistral API might be:
- Down or experiencing issues
- Blocking requests from your IP/region
- Rate limiting your requests
- Rejecting the API key

### 2. **Network/CORS Issue**
- Browser blocking the request
- Firewall or antivirus blocking API calls
- Network connectivity issue

### 3. **API Key Invalid**
- Mistral API key expired or invalid
- Agent ID doesn't exist or was deleted

## Quick Fixes

### Fix 1: Check Browser Console for Detailed Error
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click on the chatbot
4. Look for the full error message
5. Check the Network tab to see the failed request details

### Fix 2: Test Mistral API Connection
Create a test file to verify Mistral API is working:

**File**: `test-mistral-api.mjs`
```javascript
import { Mistral } from "@mistralai/mistralai";

const apiKey = "your_mistral_api_key_here";
const agentId = "ag_your_agent_id_here";

const client = new Mistral({ apiKey });

try {
  console.log("Testing Mistral API connection...");
  
  const response = await client.agents.complete({
    agentId,
    messages: [
      { role: "user", content: "Hello, this is a test message" }
    ],
  });

  console.log("✅ SUCCESS! Mistral API is working");
  console.log("Response:", response.choices?.[0]?.message?.content);
} catch (error) {
  console.error("❌ ERROR! Mistral API failed");
  console.error("Error details:", error);
  
  if (error.message?.includes("401")) {
    console.error("→ API Key is invalid or expired");
  } else if (error.message?.includes("404")) {
    console.error("→ Agent ID not found");
  } else if (error.message?.includes("429")) {
    console.error("→ Rate limit exceeded");
  } else if (error.message?.includes("fetch")) {
    console.error("→ Network connection issue");
  }
}
```

Run it:
```bash
node test-mistral-api.mjs
```

### Fix 3: Add Better Error Handling to Chat API

Update `src/app/api/chat/route.ts` to provide more detailed error messages:

```typescript
export async function POST(req: NextRequest) {
  try {
    const { message, history, sessionId } = await req.json() as {
      message: string;
      history?: ChatMessage[];
      sessionId?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Crisis keyword detection...
    if (detectCrisisKeywords(message)) {
      // ... existing code
    }

    // Build context...
    let saathiContext: string | undefined;
    try {
      // ... existing code
    } catch (contextError) {
      console.error("Context building error:", contextError);
      // Continue without context
    }

    // Call Mistral API with better error handling
    let reply: string;
    try {
      reply = await sendChatMessage(history ?? [], message, saathiContext);
    } catch (mistralError: any) {
      console.error("Mistral API error:", mistralError);
      
      // Return user-friendly error based on type
      if (mistralError.message?.includes("401")) {
        return NextResponse.json(
          { reply: "I'm having authentication issues. Please contact support." },
          { status: 200 }
        );
      } else if (mistralError.message?.includes("429")) {
        return NextResponse.json(
          { reply: "I'm a bit overwhelmed right now. Please try again in a minute." },
          { status: 200 }
        );
      } else if (mistralError.message?.includes("fetch")) {
        return NextResponse.json(
          { reply: "I'm having trouble connecting. Please check your internet connection and try again." },
          { status: 200 }
        );
      }
      
      throw mistralError; // Re-throw for general error handler
    }

    // Persist chat history...
    try {
      // ... existing code
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue - message was sent successfully
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Saathi chat error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    
    return NextResponse.json(
      { reply: "I'm having a little trouble right now. Please try again in a moment 💙" },
      { status: 200 }
    );
  }
}
```

### Fix 4: Add Timeout to Mistral API Call

Update `src/lib/mistral/chat.ts` to add timeout:

```typescript
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  context?: string
): Promise<string> {
  const client = getMistralClient();

  const agentId = process.env.MISTRAL_AGENT_ID;
  if (!agentId) throw new Error("MISTRAL_AGENT_ID is not set");

  const messages: { role: "user" | "assistant"; content: string }[] = [];

  if (context) {
    messages.push({ role: "user", content: `[Context: ${context}]` });
    messages.push({ role: "assistant", content: "Understood, I'll keep that in mind." });
  }

  const recentHistory = history.slice(-10);
  messages.push(...recentHistory);
  messages.push({ role: "user", content: userMessage });

  // Add timeout wrapper
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Mistral API timeout after 30 seconds")), 30000);
  });

  const apiPromise = client.agents.complete({
    agentId,
    messages,
  });

  try {
    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return "I'm here for you 🌿 How are you feeling right now?";
    }

    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
      return content
        .map((chunk) => (typeof chunk === "string" ? chunk : (chunk as { text?: string }).text ?? ""))
        .join("");
    }

    return "I'm here for you 🌿 How are you feeling right now?";
  } catch (error: any) {
    console.error("Mistral API call failed:", error);
    throw error;
  }
}
```

### Fix 5: Check Server Logs

If running locally:
1. Check the terminal where `npm run dev` is running
2. Look for error messages when you click the chatbot
3. The error will show more details than the browser console

### Fix 6: Verify Environment Variables are Loaded

Add a diagnostic endpoint to check if env vars are loaded:

**File**: `src/app/api/check-env/route.ts`
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mistralApiKeySet: !!process.env.MISTRAL_API_KEY,
    mistralAgentIdSet: !!process.env.MISTRAL_AGENT_ID,
    mistralApiKeyLength: process.env.MISTRAL_API_KEY?.length ?? 0,
    mistralAgentIdValue: process.env.MISTRAL_AGENT_ID?.substring(0, 10) + "...",
  });
}
```

Visit: `http://localhost:3000/api/check-env`

Should show:
```json
{
  "mistralApiKeySet": true,
  "mistralAgentIdSet": true,
  "mistralApiKeyLength": 32,
  "mistralAgentIdValue": "ag_019dcb4..."
}
```

## Alternative Solution: Fallback to Simple Responses

If Mistral API continues to fail, implement a fallback system:

**File**: `src/lib/mistral/fallback.ts`
```typescript
export function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Stress-related
  if (lowerMessage.includes("stress") || lowerMessage.includes("pressure")) {
    return "I hear you — stress can feel overwhelming. Have you tried taking a few deep breaths? Sometimes stepping away for 5 minutes can help. Would you like to talk about what's causing the stress?";
  }
  
  // Sleep-related
  if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
    return "Sleep troubles can be really tough. Creating a calming bedtime routine can help — maybe try avoiding screens an hour before bed? How long has this been going on?";
  }
  
  // Anxiety-related
  if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
    return "Anxiety can be really challenging. Remember, it's okay to feel this way. Have you tried grounding techniques like the 5-4-3-2-1 method? I'm here to listen if you want to share more.";
  }
  
  // Loneliness-related
  if (lowerMessage.includes("lonely") || lowerMessage.includes("alone")) {
    return "Feeling lonely is really hard, and I'm glad you're reaching out. Sometimes connecting with others, even in small ways, can help. Is there someone you trust that you could talk to?";
  }
  
  // General support
  return "I'm here for you 💙 Tell me more about how you're feeling. What's been on your mind lately?";
}
```

Then update `src/lib/mistral/chat.ts`:
```typescript
import { getFallbackResponse } from "./fallback";

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    // ... existing Mistral API call
  } catch (error) {
    console.error("Mistral API failed, using fallback:", error);
    return getFallbackResponse(userMessage);
  }
}
```

## Recommended Action Plan

1. **First**: Check browser console and server logs for detailed error
2. **Second**: Run the test script to verify Mistral API connection
3. **Third**: Add better error handling to see what's failing
4. **Fourth**: If Mistral API is down, implement fallback responses
5. **Fifth**: Contact Mistral support if API key/agent issues persist

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid API key | Check/regenerate API key in Mistral console |
| `404 Not Found` | Agent ID doesn't exist | Verify agent ID in Mistral console |
| `429 Too Many Requests` | Rate limit exceeded | Wait or upgrade plan |
| `Failed to fetch` | Network/CORS issue | Check firewall, network, browser settings |
| `Timeout` | API too slow | Add timeout handling, check Mistral status |

## Next Steps

Please:
1. Check the browser console for the full error message
2. Check the server terminal for backend errors
3. Run the test script to verify Mistral API
4. Share the error details so I can provide a more specific fix
