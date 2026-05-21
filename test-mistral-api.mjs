/**
 * Test Mistral API Response Time
 * Run: node test-mistral-api.mjs
 */

import { Mistral } from "@mistralai/mistralai";

// Hardcode for testing (from .env.local)
const MISTRAL_API_KEY = "RwYpozlLdgCVJslr4aprL3EJS5qfdmzx";
const MISTRAL_AGENT_ID = "ag_019dcb424bd073bcaee58c0d765296d5";

async function testMistralAPI() {
  console.log("🧪 Testing Mistral API...\n");
  console.log("API Key:", MISTRAL_API_KEY.substring(0, 10) + "...");
  console.log("Agent ID:", MISTRAL_AGENT_ID);
  console.log("\n⏱️  Sending test message...\n");

  const client = new Mistral({ apiKey: MISTRAL_API_KEY });

  const startTime = Date.now();

  try {
    const response = await client.agents.complete({
      agentId: MISTRAL_AGENT_ID,
      messages: [
        { role: "user", content: "Hi, I'm feeling stressed" }
      ],
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("✅ Response received in", duration, "seconds\n");
    
    const content = response.choices?.[0]?.message?.content;
    
    if (typeof content === "string") {
      console.log("📝 Response:", content);
    } else if (Array.isArray(content)) {
      const text = content
        .map((chunk) => (typeof chunk === "string" ? chunk : chunk.text ?? ""))
        .join("");
      console.log("📝 Response:", text);
    } else {
      console.log("📝 Response:", JSON.stringify(content, null, 2));
    }

    console.log("\n✅ Mistral API is working correctly!");
    
    if (parseFloat(duration) > 5) {
      console.log("\n⚠️  WARNING: Response took longer than 5 seconds");
      console.log("This could cause timeout issues in production");
    }

  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.error("\n❌ Error after", duration, "seconds:");
    console.error(error.message);
    
    if (error.response) {
      console.error("\nAPI Response:", error.response.status, error.response.statusText);
      console.error("Details:", error.response.data);
    }
    
    process.exit(1);
  }
}

testMistralAPI();
