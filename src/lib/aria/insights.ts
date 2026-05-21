/**
 * ARIA Insights Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Transforms raw clinical scores into role-appropriate views.
 *
 * STUDENT  → human-readable insights only. Zero numbers, zero clinical labels.
 * COUNSELLOR → full scores + severity + AI summary.
 * ADMIN    → aggregated counts only. No individual data.
 *
 * This file is the single enforcement point for data separation.
 * Nothing clinical ever reaches the student UI from here.
 */

import type { AssessmentScore, RiskLevel } from "./engine";

// ─── Student-facing insight (no scores, no clinical labels) ──────────────────

export interface StudentInsight {
  /** e.g. "You've been feeling stressed lately" */
  headline: string;
  /** e.g. "Your sleep has been a bit off this week" */
  subtext: string;
  /** Emoji only — no clinical meaning */
  emoji: string;
  /** Soft colour for UI — never red for students */
  color: "green" | "yellow" | "blue";
  /** Friendly trend label */
  trendLabel: string;
}

const EMOTION_HEADLINES: Record<string, string> = {
  great: "You're doing great this week 🌟",
  good: "Things seem to be going well",
  okay: "You're holding steady",
  low: "You've been feeling a bit low lately",
  stressed: "You've been carrying some stress lately",
  tired: "You seem a bit tired this week",
};

/**
 * Convert raw scores + emotion into a student-safe insight.
 * Never exposes PHQ-9, GAD-7, PSS numbers or risk level labels.
 */
export function buildStudentInsight(
  scores: AssessmentScore,
  emotion: string,
  recentEmotions: string[]
): StudentInsight {
  // Determine dominant concern from scores — but never show the number
  const concerns: { key: keyof AssessmentScore; threshold: number; message: string }[] = [
    { key: "stress", threshold: 12, message: "You've been carrying some stress lately" },
    { key: "sleep", threshold: 8, message: "Your sleep has been a bit off this week" },
    { key: "depression", threshold: 8, message: "You've been feeling a bit low lately" },
    { key: "anxiety", threshold: 8, message: "You've been feeling a bit anxious lately" },
    { key: "burnout", threshold: 10, message: "You might be feeling a bit burnt out" },
    { key: "loneliness", threshold: 10, message: "You've been feeling a bit isolated lately" },
  ];

  const topConcern = concerns.find((c) => scores[c.key] >= c.threshold);

  // Trend from recent emotions
  const lowCount = recentEmotions.filter((e) => ["low", "stressed", "tired"].includes(e)).length;
  const trendLabel =
    lowCount >= 4 ? "Rough week" :
    lowCount >= 2 ? "Mixed week" :
    "Good week";

  const color: StudentInsight["color"] =
    lowCount >= 4 ? "yellow" :
    lowCount >= 2 ? "blue" :
    "green";

  return {
    headline: topConcern?.message ?? EMOTION_HEADLINES[emotion] ?? "How are you doing today?",
    subtext: lowCount >= 3
      ? "Remember, it's okay to have tough days. You're not alone 💙"
      : "Keep checking in — small steps add up!",
    emoji: color === "green" ? "🌿" : color === "yellow" ? "🌤️" : "💙",
    color,
    trendLabel,
  };
}

// ─── Counsellor-facing clinical view ─────────────────────────────────────────

export interface ClinicalScore {
  label: string;          // e.g. "Depression (PHQ-9)"
  instrument: string;     // e.g. "PHQ-9"
  score: number;
  maxScore: number;
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
  severityColor: string;
  percentage: number;
}

export interface CounsellorStudentView {
  clinicalScores: ClinicalScore[];
  aiSummary: string;
  riskLevel: RiskLevel;
  riskLabel: string;
  riskColor: string;
  dominantConcern: string;
}

const SEVERITY_THRESHOLDS: Record<keyof AssessmentScore, { max: number; instrument: string; label: string; bands: { max: number; label: ClinicalScore["severity"] }[] }> = {
  depression: {
    max: 27, instrument: "PHQ-9", label: "Depression",
    bands: [{ max: 4, label: "Minimal" }, { max: 9, label: "Mild" }, { max: 14, label: "Moderate" }, { max: 19, label: "Moderately Severe" }, { max: 27, label: "Severe" }],
  },
  anxiety: {
    max: 21, instrument: "GAD-7", label: "Anxiety",
    bands: [{ max: 4, label: "Minimal" }, { max: 9, label: "Mild" }, { max: 14, label: "Moderate" }, { max: 21, label: "Severe" }],
  },
  stress: {
    max: 40, instrument: "PSS-10", label: "Perceived Stress",
    bands: [{ max: 13, label: "Minimal" }, { max: 26, label: "Moderate" }, { max: 40, label: "Severe" }],
  },
  sleep: {
    max: 28, instrument: "ISI", label: "Sleep / Insomnia",
    bands: [{ max: 7, label: "Minimal" }, { max: 14, label: "Mild" }, { max: 21, label: "Moderate" }, { max: 28, label: "Severe" }],
  },
  burnout: {
    max: 132, instrument: "Maslach", label: "Academic Burnout",
    bands: [{ max: 33, label: "Minimal" }, { max: 66, label: "Mild" }, { max: 99, label: "Moderate" }, { max: 132, label: "Severe" }],
  },
  loneliness: {
    max: 80, instrument: "UCLA", label: "Loneliness",
    bands: [{ max: 20, label: "Minimal" }, { max: 40, label: "Mild" }, { max: 60, label: "Moderate" }, { max: 80, label: "Severe" }],
  },
  substance: {
    max: 40, instrument: "AUDIT", label: "Substance Use Risk",
    bands: [{ max: 7, label: "Minimal" }, { max: 15, label: "Mild" }, { max: 19, label: "Moderate" }, { max: 40, label: "Severe" }],
  },
};

const SEVERITY_COLORS: Record<ClinicalScore["severity"], string> = {
  Minimal: "#3DBE29",
  Mild: "#00C9A7",
  Moderate: "#FF9F43",
  "Moderately Severe": "#FF6B6B",
  Severe: "#CC0000",
};

function getSeverity(score: number, bands: { max: number; label: ClinicalScore["severity"] }[]): ClinicalScore["severity"] {
  for (const band of bands) {
    if (score <= band.max) return band.label;
  }
  return bands[bands.length - 1].label;
}

/**
 * Build the full clinical view for counsellors.
 * Includes PHQ-9/GAD-7/PSS scores with severity labels.
 */
export function buildCounsellorView(
  scores: AssessmentScore,
  riskLevel: RiskLevel
): CounsellorStudentView {
  const clinicalScores: ClinicalScore[] = (Object.keys(SEVERITY_THRESHOLDS) as (keyof AssessmentScore)[]).map((key) => {
    const config = SEVERITY_THRESHOLDS[key];
    const score = scores[key] ?? 0;
    const severity = getSeverity(score, config.bands);
    return {
      label: config.label,
      instrument: config.instrument,
      score,
      maxScore: config.max,
      severity,
      severityColor: SEVERITY_COLORS[severity],
      percentage: Math.round((score / config.max) * 100),
    };
  });

  // Find dominant concern for AI summary
  const sorted = [...clinicalScores].sort((a, b) => b.percentage - a.percentage);
  const top = sorted[0];

  const dominantConcern = top?.label ?? "General wellness";

  // Build a plain-English AI summary (no AI call — rule-based)
  const summaryParts: string[] = [];
  clinicalScores.forEach((s) => {
    if (s.severity === "Severe" || s.severity === "Moderately Severe") {
      summaryParts.push(`${s.label}: ${s.severity} (${s.instrument} score ${s.score}/${s.maxScore})`);
    } else if (s.severity === "Moderate") {
      summaryParts.push(`${s.label}: Moderate concern`);
    }
  });

  const aiSummary = summaryParts.length > 0
    ? `Clinical flags: ${summaryParts.join("; ")}. Primary concern: ${dominantConcern}.`
    : `All scores within normal range. Primary emotion trend: ${dominantConcern}.`;

  const riskConfig = {
    stable: { label: "Stable", color: "#3DBE29" },
    attention: { label: "Needs Attention", color: "#FF9F43" },
    critical: { label: "Critical — Immediate Action", color: "#FF6B6B" },
  };

  return {
    clinicalScores,
    aiSummary,
    riskLevel,
    riskLabel: riskConfig[riskLevel].label,
    riskColor: riskConfig[riskLevel].color,
    dominantConcern,
  };
}

/**
 * Build a safe context string for Saathi (AI agent).
 * NEVER includes raw scores or clinical labels.
 * Only humanised descriptions.
 */
export function buildSaathiContext(
  scores: AssessmentScore, 
  emotion: string, 
  riskLevel: RiskLevel,
  recentEmotions?: string[]
): string {
  const parts: string[] = [`Student is feeling ${emotion} today`];

  // Add recent emotion pattern if available
  if (recentEmotions && recentEmotions.length > 1) {
    const emotionSummary = recentEmotions.slice(0, 5).join(", ");
    parts.push(`recent emotions: ${emotionSummary}`);
  }

  // Translate scores to human descriptions — no numbers
  if (scores.stress >= 18) parts.push("experiencing high stress");
  else if (scores.stress >= 10) parts.push("feeling somewhat stressed");

  if (scores.sleep >= 14) parts.push("having significant sleep difficulties");
  else if (scores.sleep >= 7) parts.push("sleep is a bit disrupted");

  if (scores.depression >= 10) parts.push("feeling persistently low");
  else if (scores.depression >= 5) parts.push("mood has been a bit low");

  if (scores.anxiety >= 10) parts.push("feeling quite anxious");
  else if (scores.anxiety >= 5) parts.push("some anxiety present");

  if (scores.burnout >= 66) parts.push("showing signs of academic burnout");
  if (scores.loneliness >= 40) parts.push("feeling somewhat isolated");

  // Translate risk level to human language — never pass the raw label
  if (riskLevel === "critical") parts.push("may need immediate support");
  else if (riskLevel === "attention") parts.push("could benefit from extra support");

  return parts.join(", ") + ".";
}

// ============================================================
// ARIA 2.0 Extensions
// ============================================================

import type { TriageSignal, InstrumentKey, ConsistencyFlag, CamouflageResponse } from "./engine";

/** Wellness tip with emoji, text, source reference, and severity level */
export interface WellnessTip {
  emoji: string;
  text: string;
  source: string;
  severity: "low" | "moderate" | "high" | "any";
}

/**
 * Expanded Wellness Tips Library
 * All tips sourced from techniques.md with evidence-based references
 * Organized by domain and severity level for personalized selection
 */
export const WELLNESS_TIPS: Record<keyof AssessmentScore | "general", WellnessTip[]> = {
  depression: [
    // Low severity (minimal symptoms) - 6 tips
    { emoji: "🚶", text: "Even a 10-minute walk outside can shift your mood — your body and mind are more connected than you think.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "📓", text: "Try writing down three small things that happened today, even tiny ones. It helps your brain notice the good.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "☀️", text: "Getting sunlight in the morning helps regulate your mood and sleep cycle. Even 5 minutes counts.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "🎵", text: "Put on a song that used to make you feel good. Music can shift your emotional state faster than you'd expect.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🌱", text: "Do one small thing for yourself today — make your favorite tea, wear something you like, anything that feels like self-care.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "💬", text: "Send a message to someone you trust, even just to say hi. Small connections can lift your mood.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "📞", text: "Reach out to one person today — a friend, a family member, anyone. Connection is medicine.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Pick one small task you've been avoiding. Completing it can break the cycle of feeling stuck.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🌿", text: "Do one thing today that used to bring you joy, even if you don't feel like it. Action comes before motivation.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🧘", text: "Try 5 minutes of slow breathing. It won't fix everything, but it can create a small shift in how you feel.", source: "Box Breathing (techniques.md)", severity: "moderate" },
    { emoji: "📅", text: "Schedule one activity you used to enjoy, even if it feels pointless right now. Your brain needs reminders of what feels good.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🤲", text: "Be kind to yourself today. Depression makes everything harder — you're doing better than you think.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🤝", text: "You don't have to go through this alone. Talking to a counsellor or trusted person can genuinely help.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💙", text: "Depression lies to you. The thoughts you're having right now are symptoms, not facts about who you are.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🛡️", text: "If you're having thoughts of self-harm, please reach out immediately. iCall: 9152987821 or Tele-MANAS: 14416.", source: "Crisis Resources (india_guidelines.md)", severity: "high" },
    { emoji: "🌟", text: "You've survived every difficult day so far. That takes real strength, even if it doesn't feel like it.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "Professional support can make a real difference. A counsellor can help you find a way through this.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "Recovery is possible. Many people who felt exactly like you do now have found their way back. You can too.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  anxiety: [
    // Low severity - 6 tips
    { emoji: "🌬️", text: "Try box breathing: breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times.", source: "Box Breathing (techniques.md)", severity: "low" },
    { emoji: "🎧", text: "Put on a familiar song or podcast — something your brain already knows. It signals safety.", source: "5-4-3-2-1 Grounding (techniques.md)", severity: "low" },
    { emoji: "🧘", text: "A 5-minute breathing exercise can calm your nervous system faster than you'd expect. Try it before reacting.", source: "Box Breathing (techniques.md)", severity: "low" },
    { emoji: "🚶", text: "A short walk can help discharge anxious energy. Movement tells your body the threat has passed.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "🌡️", text: "Splash cold water on your face or hold an ice cube. It activates your body's calming response.", source: "5-4-3-2-1 Grounding (techniques.md)", severity: "low" },
    { emoji: "📱", text: "Text someone you trust and tell them you're feeling anxious. Just naming it can reduce its power.", source: "Mindful Self-Compassion (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "📝", text: "Write down what's worrying you, then ask: 'Is this something I can act on today?' If not, set it aside for now.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "👁️", text: "Try 5-4-3-2-1 grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.", source: "5-4-3-2-1 Grounding (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Anxiety makes everything feel urgent. Pick one thing to focus on right now. The rest can wait.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🤲", text: "Place your hand on your heart and take 3 slow breaths. Remind yourself: 'I am safe right now.'", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🧊", text: "Progressive muscle relaxation can release tension you didn't know you were holding. Tense and release each muscle group.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "moderate" },
    { emoji: "🌿", text: "Anxiety thrives on 'what ifs.' Bring yourself back to what's actually happening right now, in this moment.", source: "5-4-3-2-1 Grounding (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🛑", text: "If you're having a panic attack, remember: it will pass. Focus on slow breathing and grounding yourself.", source: "Box Breathing (techniques.md)", severity: "high" },
    { emoji: "🤝", text: "Severe anxiety is treatable. A counsellor can teach you techniques that genuinely work.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "You've survived every anxious moment so far. You're stronger than anxiety tells you.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "If anxiety is affecting your daily life, please reach out for support. You don't have to manage this alone.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🧠", text: "Your brain is trying to protect you, but the alarm system is too sensitive right now. A counsellor can help recalibrate it.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🌟", text: "Many people with severe anxiety have learned to manage it effectively. Recovery is absolutely possible.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  stress: [
    // Low severity - 6 tips
    { emoji: "⏸️", text: "Take one 5-minute break today where you do absolutely nothing — no phone, no tasks. Just breathe.", source: "Box Breathing (techniques.md)", severity: "low" },
    { emoji: "🛁", text: "A warm shower or a cup of chai can genuinely reset your nervous system. Small rituals matter.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "low" },
    { emoji: "🎵", text: "Music can shift your stress response. Put on something calming or something that makes you feel strong.", source: "5-4-3-2-1 Grounding (techniques.md)", severity: "low" },
    { emoji: "🌳", text: "Step outside for 5 minutes. Fresh air and a change of scenery can interrupt the stress cycle.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "📱", text: "Put your phone on silent for 30 minutes. Constant notifications keep your stress response activated.", source: "Mindful Self-Compassion (techniques.md)", severity: "low" },
    { emoji: "🧘", text: "Try 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8. It activates your body's relaxation response.", source: "Box Breathing (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "📋", text: "Write down everything on your mind, then pick just one thing to focus on. The rest can wait.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🧘", text: "Try progressive muscle relaxation: tense and release each muscle group. It releases physical stress you didn't know you were holding.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "moderate" },
    { emoji: "🚶", text: "A 15-minute walk can lower cortisol levels and clear your head. Movement is medicine for stress.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Identify one thing you can control right now and focus on that. Let go of what you can't control.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🤝", text: "Talk to someone about what's stressing you. Sharing the load makes it lighter.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "⏰", text: "Set a timer for 10 minutes and do something purely for enjoyment. Your brain needs breaks to function well.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🛑", text: "You're carrying too much. It's okay to ask for help, take a break, or say no to something.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💙", text: "Chronic stress affects your health. Talking to a counsellor can help you find sustainable coping strategies.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🌿", text: "You don't have to do everything perfectly. Done is better than perfect when you're overwhelmed.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "If stress is affecting your sleep, appetite, or health, it's time to reach out for professional support.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🧠", text: "Your body is in constant fight-or-flight mode. A counsellor can help you break this cycle.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "You're not weak for struggling with stress. You're human, and you deserve support.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  sleep: [
    // Low severity - 6 tips
    { emoji: "📵", text: "Try putting your phone face-down 30 minutes before bed. Even that small change can improve sleep quality.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "🌡️", text: "A slightly cool room helps you fall asleep faster — try opening a window or using a fan.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "☕", text: "Avoid caffeine after 2 PM. It stays in your system longer than you think and disrupts deep sleep.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "📖", text: "Read something light before bed instead of scrolling. It signals your brain that it's time to wind down.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "🛁", text: "A warm bath or shower 1-2 hours before bed can help you fall asleep faster.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "🌙", text: "Dim the lights an hour before bed. Bright light tells your brain it's still daytime.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "⏰", text: "Waking up at the same time every day (yes, weekends too) is the single most effective sleep habit.", source: "Sleep Hygiene (techniques.md)", severity: "moderate" },
    { emoji: "🧘", text: "Try progressive muscle relaxation before bed. Tense and release each muscle group to signal your body it's time to rest.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "moderate" },
    { emoji: "📖", text: "If you can't sleep after 20 minutes, get up and do something calming. Don't let your bed become a place of frustration.", source: "Sleep Hygiene (techniques.md)", severity: "moderate" },
    { emoji: "🌬️", text: "Try 4-7-8 breathing in bed: inhale for 4, hold for 7, exhale for 8. It slows your heart rate and prepares you for sleep.", source: "Box Breathing (techniques.md)", severity: "moderate" },
    { emoji: "☀️", text: "Get bright light exposure in the morning. It helps regulate your circadian rhythm and improves nighttime sleep.", source: "Sleep Hygiene (techniques.md)", severity: "moderate" },
    { emoji: "🛏️", text: "Use your bed only for sleep. Working or scrolling in bed trains your brain to stay alert there.", source: "Sleep Hygiene (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🌙", text: "Chronic insomnia affects everything — mood, focus, health. A counsellor can help you address the root causes.", source: "Sleep Hygiene (techniques.md)", severity: "high" },
    { emoji: "💭", text: "If racing thoughts keep you awake, try writing them down before bed. It helps your brain let go.", source: "Behavioral Activation (techniques.md)", severity: "high" },
    { emoji: "🛡️", text: "Sleep problems often signal underlying stress or anxiety. Addressing those can improve your sleep.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "If you've been struggling with sleep for weeks, it's time to talk to a counsellor. Insomnia is treatable.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🧠", text: "Your brain needs sleep to function. Chronic sleep deprivation affects your mental health — please reach out for help.", source: "Sleep Hygiene (techniques.md)", severity: "high" },
    { emoji: "💪", text: "Many people with severe insomnia have learned to sleep well again. Recovery is possible with the right support.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  burnout: [
    // Low severity - 6 tips
    { emoji: "🌿", text: "Do one thing today that has nothing to do with studying or work — something just for you.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🔋", text: "Rest is not laziness. Your brain needs downtime to consolidate learning and restore energy.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "low" },
    { emoji: "🎨", text: "Engage in one activity purely for enjoyment, not productivity. Play is essential for preventing burnout.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🚶", text: "Take a walk without your phone. Let your mind wander — it's how your brain recharges.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "😴", text: "Prioritize sleep this week. When you're running on empty, sleep is more important than one more hour of work.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "🎵", text: "Listen to music you love, not as background noise but as the main activity. It's restorative.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "🤝", text: "Talk to someone who gets it — a friend, a classmate, anyone who understands the pressure you're under.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🛑", text: "You can't pour from an empty cup. Taking a break isn't giving up — it's refueling.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "📅", text: "Schedule rest like you schedule work. Block out time for activities that restore you, not just distract you.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Say no to one thing this week. Protecting your energy is not selfish — it's necessary.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🌳", text: "Spend time in nature if you can. Even 20 minutes outside can reduce burnout symptoms.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "moderate" },
    { emoji: "🧘", text: "Try a body scan meditation. Burnout lives in your body — noticing tension is the first step to releasing it.", source: "Progressive Muscle Relaxation (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🚨", text: "Burnout is a sign you've been pushing beyond your limits for too long. It's time to make changes.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💙", text: "You're not failing — the system is demanding too much. A counsellor can help you set sustainable boundaries.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🌱", text: "Recovery from burnout takes time. Be patient with yourself and prioritize rest over productivity.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🛡️", text: "Burnout affects your physical and mental health. Please reach out to a counsellor before it gets worse.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "You can't think or work your way out of burnout. You need rest, support, and probably some changes.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "Many people have recovered from severe burnout. With support and changes, you can too.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  loneliness: [
    // Low severity - 6 tips
    { emoji: "💬", text: "Send one message today — even a meme or a 'thinking of you' — to someone you haven't spoken to in a while.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🏛️", text: "Look for one club, group, or activity on campus that interests you. Belonging starts with showing up once.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "☕", text: "Strike up a small conversation with someone — a classmate, a shopkeeper, anyone. Micro-connections add up.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "📱", text: "Call someone instead of texting. Hearing a voice creates more connection than words on a screen.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🎮", text: "Join an online community around something you enjoy. Shared interests are a bridge to connection.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    { emoji: "🚶", text: "Go to a public space — a library, a café, a park. Being around people, even without talking, can ease loneliness.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "🌐", text: "Feeling alone in a crowd is more common than you think. You're not the only one feeling this way right now.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🤝", text: "Reach out to one person you trust and tell them you've been feeling isolated. Vulnerability builds connection.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Join one group activity this week — a study group, a sports team, anything. Shared activities create bonds.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🌱", text: "Building friendships takes time. Show up consistently to the same place or group — familiarity breeds connection.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🤲", text: "Be kind to yourself about feeling lonely. It's a signal that you need connection, not a sign that something's wrong with you.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🎨", text: "Volunteer or help someone. Contributing to others can create a sense of belonging and purpose.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "💙", text: "Chronic loneliness affects your health and wellbeing. Talking to a counsellor can help you reconnect.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🛡️", text: "You deserve connection and belonging. If you're struggling to reach out, a counsellor can help you take the first steps.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🌱", text: "Building connections takes time and courage. Every small step you take toward others matters.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🆘", text: "If loneliness is affecting your daily life, please reach out for support. You don't have to face this alone.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🤝", text: "A counsellor can help you understand what's blocking connection and develop strategies to build relationships.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "Many people who felt profoundly alone have found their people. Connection is possible, even when it doesn't feel like it.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  substance: [
    // Low severity - 6 tips
    { emoji: "💧", text: "Staying hydrated and eating regularly keeps your mood more stable than you might expect.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "🚶", text: "Physical activity releases the same feel-good chemicals you might be seeking elsewhere. Try a 15-minute walk.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "low" },
    { emoji: "🧘", text: "When you feel the urge to escape, try a 5-minute breathing exercise first — it genuinely helps.", source: "Box Breathing (techniques.md)", severity: "low" },
    { emoji: "😴", text: "Poor sleep increases cravings. Prioritizing rest can reduce the urge to use substances.", source: "Sleep Hygiene (techniques.md)", severity: "low" },
    { emoji: "🎯", text: "Notice what you're feeling before you reach for a substance. Awareness is the first step to change.", source: "Mindful Self-Compassion (techniques.md)", severity: "low" },
    { emoji: "🌿", text: "Find one healthy way to relax that works for you — music, walking, talking to someone, breathing.", source: "Behavioral Activation (techniques.md)", severity: "low" },
    
    // Moderate severity - 6 tips
    { emoji: "🤝", text: "Talking to someone you trust about what you're going through is always a good first step.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "📝", text: "Notice what triggers the urge to use. Understanding your patterns is the first step to changing them.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🎯", text: "Find one healthy coping strategy that works for you — exercise, music, talking to someone, breathing exercises.", source: "Behavioral Activation (techniques.md)", severity: "moderate" },
    { emoji: "🛑", text: "If you're using substances to cope with stress or pain, there are healthier strategies that actually work better long-term.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🌱", text: "Change is hard, but it's possible. Start with one small step — reducing frequency, talking to someone, trying alternatives.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    { emoji: "🤲", text: "Be honest with yourself about how substance use is affecting your life. Awareness creates the possibility for change.", source: "Mindful Self-Compassion (techniques.md)", severity: "moderate" },
    
    // High severity - 6 tips
    { emoji: "🛡️", text: "Substance use often masks deeper pain. A counsellor can help you address what's underneath.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💙", text: "You're not weak for struggling with this. Addiction is a health issue, not a character flaw.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🚨", text: "If substance use is affecting your life, please reach out for help. iCall: 9152987821 or Tele-MANAS: 14416.", source: "Crisis Resources (india_guidelines.md)", severity: "high" },
    { emoji: "🆘", text: "You don't have to quit alone. Professional support significantly increases your chances of recovery.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "🤝", text: "A counsellor can help you develop healthier coping strategies and address the root causes of substance use.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
    { emoji: "💪", text: "Many people have overcome substance dependence. Recovery is possible with the right support.", source: "Mindful Self-Compassion (techniques.md)", severity: "high" },
  ],
  
  general: [
    { emoji: "🌱", text: "Checking in with yourself is already a form of self-care. You're doing something good by being here.", source: "Mindful Self-Compassion (techniques.md)", severity: "any" },
    { emoji: "☀️", text: "Start tomorrow with one small intention — not a goal, just a direction. That's enough.", source: "Behavioral Activation (techniques.md)", severity: "any" },
    { emoji: "💙", text: "You don't have to have it all figured out. Most people are figuring it out as they go, just like you.", source: "Mindful Self-Compassion (techniques.md)", severity: "any" },
    { emoji: "🌿", text: "Small daily habits matter more than big occasional efforts. Consistency beats intensity.", source: "Behavioral Activation (techniques.md)", severity: "any" },
    { emoji: "🤝", text: "Connection is one of the strongest predictors of wellbeing. Reach out to someone today.", source: "Mindful Self-Compassion (techniques.md)", severity: "any" },
    { emoji: "🚶", text: "Movement is medicine. Even a short walk can shift your mood and energy.", source: "WHO Physical Activity Guidelines (techniques.md)", severity: "any" },
    { emoji: "🧘", text: "Taking a few slow breaths is one of the fastest ways to calm your nervous system. Try it right now.", source: "Box Breathing (techniques.md)", severity: "any" },
    { emoji: "😴", text: "Sleep is not optional. It's when your brain processes emotions and consolidates learning.", source: "Sleep Hygiene (techniques.md)", severity: "any" },
    { emoji: "🤲", text: "Be as kind to yourself as you would be to a friend. Self-compassion is a skill you can practice.", source: "Mindful Self-Compassion (techniques.md)", severity: "any" },
  ],
};

/**
 * Calculate severity level from score and instrument config
 */
function calculateSeverity(score: number, domain: keyof AssessmentScore): "low" | "moderate" | "high" {
  const config = SEVERITY_THRESHOLDS[domain];
  if (!config) return "low";
  
  const percentage = (score / config.max) * 100;
  
  if (percentage >= 70) return "high";
  if (percentage >= 40) return "moderate";
  return "low";
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Build wellness summary for students after assessment completion.
 * Returns personalized headline and 3 randomized tips based on scores and severity.
 * Supports multi-domain scenarios (e.g., high stress + high anxiety).
 */
export function buildWellnessSummary(
  dominantConcern: keyof AssessmentScore | "general",
  isStable: boolean,
  scores?: AssessmentScore
): { headline: string; tips: WellnessTip[]; sectionHeading: string } {
  console.log('=== BUILD WELLNESS SUMMARY ===');
  console.log('Dominant concern:', dominantConcern);
  console.log('Is stable:', isStable);
  console.log('Scores received:', scores);
  console.log('==============================');
  
  // Severity-based headlines for each domain
  const headlinesByDomain: Record<keyof AssessmentScore | "general", Record<"low" | "moderate" | "high", string>> = {
    depression: {
      low: "You've been feeling a bit low lately. Here are some things that might help.",
      moderate: "You've been carrying some weight lately. Here are some things that might help.",
      high: "You've been going through a really tough time. Here are some things that might help.",
    },
    anxiety: {
      low: "You've been feeling a bit anxious. Here are some ways to find calm.",
      moderate: "Your mind has been working overtime. Here are some ways to find calm.",
      high: "You've been feeling very anxious lately. Here are some ways to find calm.",
    },
    stress: {
      low: "You've been feeling some pressure. Here are some things that might ease the load.",
      moderate: "You've been under a lot of pressure. Here are some things that might ease the load.",
      high: "You've been under intense pressure. Here are some things that might ease the load.",
    },
    sleep: {
      low: "Your sleep has been a bit off. Here are some ways to rest better.",
      moderate: "Your sleep has been disrupted. Here are some ways to rest better.",
      high: "You've been struggling with sleep. Here are some ways to rest better.",
    },
    burnout: {
      low: "You've been feeling a bit drained. Here are some ways to recharge.",
      moderate: "You've been pushing hard. Here are some ways to recharge.",
      high: "You're experiencing burnout. Here are some ways to recover.",
    },
    loneliness: {
      low: "You've been feeling a bit isolated. Here are some ways to reconnect.",
      moderate: "You've been feeling disconnected. Here are some ways to reconnect.",
      high: "You've been feeling very alone. Here are some ways to reconnect.",
    },
    substance: {
      low: "You've been coping in some tough ways. Here are some healthier alternatives.",
      moderate: "You've been relying on substances to cope. Here are some healthier alternatives.",
      high: "Substance use has been affecting you. Here are some healthier alternatives.",
    },
    general: {
      low: "You're doing well. Here are some ways to keep taking care of yourself.",
      moderate: "You're doing well. Here are some ways to keep taking care of yourself.",
      high: "You're doing well. Here are some ways to keep taking care of yourself.",
    },
  };

  // Dynamic section headings that vary
  const sectionHeadings = [
    "Here are some things to try",
    "Small steps that can help",
    "Ways to take care of yourself",
    "Things you can do right now",
    "Strategies that might help",
    "Ideas to support yourself",
    "Practical steps forward",
    "Things worth trying",
  ];

  // Calculate severity for dominant concern
  // Even for "stable" users, we now have scores from baseline PHQ-9 + GAD-7
  const severity = scores && dominantConcern !== "general"
    ? calculateSeverity(scores[dominantConcern as keyof AssessmentScore] ?? 0, dominantConcern as keyof AssessmentScore)
    : "low";
  
  console.log('Calculated severity:', severity);
  console.log('Score for', dominantConcern, ':', scores?.[dominantConcern as keyof AssessmentScore] ?? 0);
  
  // Get severity-appropriate headline
  const headlineConfig = headlinesByDomain[dominantConcern] ?? headlinesByDomain.general;
  const headline = headlineConfig[severity];
  
  console.log('Selected headline:', headline);

  // Get all tips for this domain
  const allTips = WELLNESS_TIPS[dominantConcern] ?? WELLNESS_TIPS.general;
  
  // Filter tips by severity (include "any" severity tips for all levels)
  const severityTips = allTips.filter(tip => tip.severity === severity || tip.severity === "any");
  
  // If we have multi-domain concerns (e.g., high stress + high anxiety), mix tips
  let finalTips: WellnessTip[] = [];
  
  if (scores && dominantConcern !== "general") {
    // Find secondary concerns (scores above moderate threshold)
    const secondaryConcerns = (Object.keys(scores) as (keyof AssessmentScore)[])
      .filter(domain => {
        if (domain === dominantConcern) return false;
        const domainSeverity = calculateSeverity(scores[domain], domain);
        return domainSeverity === "moderate" || domainSeverity === "high";
      })
      .slice(0, 1); // Take only the top secondary concern
    
    if (secondaryConcerns.length > 0) {
      // Mix tips from dominant and secondary concern
      const secondaryConcern = secondaryConcerns[0];
      const secondarySeverity = calculateSeverity(scores[secondaryConcern], secondaryConcern);
      const secondaryTips = WELLNESS_TIPS[secondaryConcern].filter(
        tip => tip.severity === secondarySeverity || tip.severity === "any"
      );
      
      // Take 2 from dominant, 1 from secondary
      const shuffledPrimary = shuffleArray(severityTips);
      const shuffledSecondary = shuffleArray(secondaryTips);
      
      finalTips = [
        ...shuffledPrimary.slice(0, 2),
        ...shuffledSecondary.slice(0, 1),
      ];
    } else {
      // Single concern - take 3 random tips from severity-appropriate pool
      finalTips = shuffleArray(severityTips).slice(0, 3);
    }
  } else {
    // No scores provided or general concern - take 3 random tips
    finalTips = shuffleArray(severityTips).slice(0, 3);
  }
  
  // Fallback if we don't have enough tips
  if (finalTips.length < 3) {
    const allDomainTips = shuffleArray(allTips);
    finalTips = [...finalTips, ...allDomainTips].slice(0, 3);
  }

  // Select random section heading
  const sectionHeading = sectionHeadings[Math.floor(Math.random() * sectionHeadings.length)];

  return { headline, tips: finalTips, sectionHeading };
}

/**
 * Extended counsellor report with ARIA 2.0 fields
 */
export interface CounsellorReport {
  clinicalScores: ClinicalScore[];
  riskLevel: RiskLevel;
  riskLabel: string;
  riskColor: string;
  dominantConcern: string;
  aiSummary: string;
  recommendedAction: string;
  instrumentsAdministered: InstrumentKey[];
  triageSignal: TriageSignal;
  consistencyFlags: ConsistencyFlag[];
  camouflageResponses: CamouflageResponse[];
}

/**
 * Build extended counsellor report with recommended action and consistency flags
 */
export function buildCounsellorReport(
  scores: AssessmentScore,
  riskLevel: RiskLevel,
  instrumentsAdministered: InstrumentKey[],
  triageSignal: TriageSignal,
  consistencyFlags: ConsistencyFlag[],
  camouflageResponses: CamouflageResponse[]
): CounsellorReport {
  // Build base counsellor view
  const baseView = buildCounsellorView(scores, riskLevel);

  // Determine recommended action based on risk level
  const recommendedAction =
    riskLevel === "critical" ? "Immediate outreach required" :
    riskLevel === "attention" ? "Follow up within 7 days" :
    "No action required";

  return {
    ...baseView,
    recommendedAction,
    instrumentsAdministered,
    triageSignal,
    consistencyFlags,
    camouflageResponses,
  };
}
