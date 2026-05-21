import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function getRiskColor(level: "stable" | "attention" | "critical") {
  const map = {
    stable: { bg: "#F0FFF0", text: "#3DBE29", border: "#3DBE29" },
    attention: { bg: "#FFF8F0", text: "#FF9F43", border: "#FF9F43" },
    critical: { bg: "#FFF0F0", text: "#FF6B6B", border: "#FF6B6B" },
  };
  return map[level];
}

export function getRiskLabel(level: "stable" | "attention" | "critical") {
  const map = {
    stable: "🟢 Stable",
    attention: "🟠 Needs Attention",
    critical: "🔴 Critical",
  };
  return map[level];
}

export function anonymizeStudent(id: string) {
  return `Student #${id.slice(0, 4).toUpperCase()}`;
}
