import type { SimConfig } from "./types";

const KEY = "collegeDecisionSim.config.v1";

export function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadSimConfig(): SimConfig | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  return safeJsonParse<SimConfig>(raw);
}

export function saveSimConfig(cfg: SimConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(cfg));
}

export function clearSimConfig(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
