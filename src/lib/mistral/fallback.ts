/**
 * Fallback responses for when Mistral API is unavailable
 * Provides empathetic, supportive responses based on keyword matching
 */

export function getFallbackResponse(message: string, history?: any[]): string {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords - highest priority
  if (
    lowerMessage.includes("suicide") ||
    lowerMessage.includes("kill myself") ||
    lowerMessage.includes("end it all") ||
    lowerMessage.includes("want to die") ||
    lowerMessage.includes("self harm") ||
    lowerMessage.includes("hurt myself")
  ) {
    return "I'm really glad you shared that with me 💙 Please talk to your counsellor right away — they're here to help you. You can also call iCall right now: **9152987821**. You're not alone.";
  }
  
  // Stress-related
  if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("pressure") ||
    lowerMessage.includes("overwhelm") ||
    lowerMessage.includes("too much")
  ) {
    return "I hear you — stress can feel really overwhelming. Have you tried taking a few deep breaths? Sometimes stepping away for just 5 minutes can help reset your mind. Would you like to talk about what's causing the stress? I'm here to listen 💙";
  }
  
  // Sleep-related
  if (
    lowerMessage.includes("sleep") ||
    lowerMessage.includes("tired") ||
    lowerMessage.includes("insomnia") ||
    lowerMessage.includes("can't sleep") ||
    lowerMessage.includes("exhausted")
  ) {
    return "Sleep troubles can be really tough, and they affect everything else too. Creating a calming bedtime routine can help — maybe try avoiding screens an hour before bed, or doing some light stretching? How long has this been going on? 🌙";
  }
  
  // Anxiety-related
  if (
    lowerMessage.includes("anxious") ||
    lowerMessage.includes("anxiety") ||
    lowerMessage.includes("worried") ||
    lowerMessage.includes("panic") ||
    lowerMessage.includes("nervous")
  ) {
    return "Anxiety can be really challenging, and it's okay to feel this way. Have you tried grounding techniques? One that helps many people is the 5-4-3-2-1 method: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. I'm here to listen if you want to share more 💚";
  }
  
  // Depression/sadness-related
  if (
    lowerMessage.includes("depress") ||
    lowerMessage.includes("sad") ||
    lowerMessage.includes("hopeless") ||
    lowerMessage.includes("empty") ||
    lowerMessage.includes("numb")
  ) {
    return "I'm really sorry you're feeling this way. These feelings are valid, and you don't have to go through this alone. Sometimes just talking about it can help. Have you been able to share how you're feeling with anyone you trust? Your counsellor is also here to support you 💙";
  }
  
  // Loneliness-related
  if (
    lowerMessage.includes("lonely") ||
    lowerMessage.includes("alone") ||
    lowerMessage.includes("isolated") ||
    lowerMessage.includes("no friends")
  ) {
    return "Feeling lonely is really hard, and I'm glad you're reaching out. You're not alone in feeling this way — many students experience this. Sometimes connecting with others, even in small ways like joining a club or study group, can help. Is there someone you trust that you could talk to? 🤝";
  }
  
  // Exam/academic pressure
  if (
    lowerMessage.includes("exam") ||
    lowerMessage.includes("test") ||
    lowerMessage.includes("study") ||
    lowerMessage.includes("grades") ||
    lowerMessage.includes("fail")
  ) {
    return "Academic pressure can feel intense, especially around exams. Remember, your worth isn't defined by grades. Have you tried breaking your study time into smaller chunks with breaks in between? The Pomodoro technique (25 min study, 5 min break) works well for many students. How are you managing your study schedule? 📚";
  }
  
  // Relationship issues
  if (
    lowerMessage.includes("relationship") ||
    lowerMessage.includes("breakup") ||
    lowerMessage.includes("boyfriend") ||
    lowerMessage.includes("girlfriend") ||
    lowerMessage.includes("partner")
  ) {
    return "Relationship challenges can be emotionally draining. It's important to remember that your feelings are valid. Have you been able to communicate openly about how you're feeling? Sometimes talking things through with a trusted friend or counsellor can provide clarity. I'm here to listen 💕";
  }
  
  // Family issues
  if (
    lowerMessage.includes("family") ||
    lowerMessage.includes("parents") ||
    lowerMessage.includes("mom") ||
    lowerMessage.includes("dad") ||
    lowerMessage.includes("home")
  ) {
    return "Family dynamics can be complex and challenging. It's okay to feel frustrated or hurt. Remember that you can't control others' actions, but you can control how you respond and take care of yourself. Have you considered talking to your counsellor about this? They can provide support and strategies 🏠";
  }
  
  // Positive/good feelings
  if (
    lowerMessage.includes("good") ||
    lowerMessage.includes("happy") ||
    lowerMessage.includes("great") ||
    lowerMessage.includes("better") ||
    lowerMessage.includes("excited")
  ) {
    return "That's wonderful to hear! 🌟 It's important to celebrate the good moments. What's been going well for you? I'd love to hear more about it!";
  }
  
  // Gratitude/thanks
  if (
    lowerMessage.includes("thank") ||
    lowerMessage.includes("appreciate") ||
    lowerMessage.includes("helpful")
  ) {
    return "You're very welcome! I'm here whenever you need to talk. Remember, reaching out is a sign of strength, not weakness. Take care of yourself 💚";
  }
  
  // Greetings
  if (
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hey") ||
    (lowerMessage.length < 10 && (lowerMessage.includes("h") || lowerMessage.includes("y")))
  ) {
    if (history && history.length > 2) {
      return "Hey! How are you feeling right now? 🌿";
    }
    return "Hey! I'm Saathi, your wellness companion. How are you feeling right now? You can share anything — no judgment here 🌿";
  }
  
  // Goodbye
  if (
    lowerMessage.includes("bye") ||
    lowerMessage.includes("goodbye") ||
    lowerMessage.includes("see you") ||
    lowerMessage.includes("talk later")
  ) {
    return "Take care! Remember, I'm here whenever you need to talk. You're doing great by reaching out 💙";
  }
  
  // Default empathetic response
  const defaultResponses = [
    "I'm here to listen. Tell me more about how you're feeling. What's been on your mind lately? 💙",
    "Thank you for sharing that with me. How has this been affecting you? I'm here to support you 🌿",
    "I hear you. It sounds like you're going through something challenging. Would you like to talk more about it? 💚",
    "That sounds tough. How long have you been feeling this way? Remember, you don't have to go through this alone 💙",
    "I appreciate you opening up. What do you think would help you feel better right now? I'm here to listen 🌿",
  ];
  
  // Use message length to pick a response (pseudo-random but consistent)
  const index = message.length % defaultResponses.length;
  return defaultResponses[index];
}
