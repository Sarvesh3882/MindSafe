import { Mistral } from "@mistralai/mistralai";

const apiKey = "RwYpozlLdgCVJslr4aprL3EJS5qfdmzx";
const agentId = "ag_019dcb424bd073bcaee58c0d765296d5";

console.log("=".repeat(60));
console.log("MISTRAL API CONNECTION TEST");
console.log("=".repeat(60));
console.log("");

console.log("Configuration:");
console.log("  API Key:", apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 4));
console.log("  Agent ID:", agentId);
console.log("");

const client = new Mistral({ apiKey });

try {
  console.log("→ Sending test message to Mistral API...");
  console.log("");
  
  const response = await client.agents.complete({
    agentId,
    messages: [
      { role: "user", content: "Hello, this is a test message. Please respond with a simple greeting." }
    ],
  });

  console.log("✅ SUCCESS! Mistral API is working correctly");
  console.log("");
  console.log("Response:");
  console.log("─".repeat(60));
  console.log(response.choices?.[0]?.message?.content);
  console.log("─".repeat(60));
  console.log("");
  console.log("Full response object:");
  console.log(JSON.stringify(response, null, 2));
  
} catch (error) {
  console.log("❌ ERROR! Mistral API call failed");
  console.log("");
  console.log("Error details:");
  console.log("─".repeat(60));
  console.error(error);
  console.log("─".repeat(60));
  console.log("");
  
  // Diagnose specific error types
  const errorMessage = error.message || String(error);
  
  if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
    console.log("🔍 Diagnosis: API Key is invalid or expired");
    console.log("   → Check your Mistral console and regenerate the API key");
    console.log("   → Update .env.local with the new key");
  } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
    console.log("🔍 Diagnosis: Agent ID not found");
    console.log("   → Verify the agent exists in your Mistral console");
    console.log("   → Check if the agent ID is correct in .env.local");
  } else if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests")) {
    console.log("🔍 Diagnosis: Rate limit exceeded");
    console.log("   → Wait a few minutes before trying again");
    console.log("   → Consider upgrading your Mistral plan");
  } else if (errorMessage.includes("fetch") || errorMessage.includes("ENOTFOUND") || errorMessage.includes("ECONNREFUSED")) {
    console.log("🔍 Diagnosis: Network connection issue");
    console.log("   → Check your internet connection");
    console.log("   → Check if firewall/antivirus is blocking the request");
    console.log("   → Try disabling VPN if you're using one");
  } else if (errorMessage.includes("timeout") || errorMessage.includes("ETIMEDOUT")) {
    console.log("🔍 Diagnosis: Request timeout");
    console.log("   → Mistral API might be slow or down");
    console.log("   → Check Mistral status page");
  } else {
    console.log("🔍 Diagnosis: Unknown error");
    console.log("   → Check the error details above");
    console.log("   → Contact Mistral support if issue persists");
  }
  
  console.log("");
  process.exit(1);
}

console.log("=".repeat(60));
console.log("TEST COMPLETED SUCCESSFULLY");
console.log("=".repeat(60));
