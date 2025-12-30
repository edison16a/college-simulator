import type { ThemeConfig } from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "").trim();
  if (![3, 6].includes(cleaned.length)) return null;

  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Mix color with white (t from 0 to 1).
 */
function tint(hex: string, t: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = rgb.r + (255 - rgb.r) * t;
  const g = rgb.g + (255 - rgb.g) * t;
  const b = rgb.b + (255 - rgb.b) * t;
  return rgbToHex(r, g, b);
}

/**
 * Mix color with black (t from 0 to 1).
 */
function shade(hex: string, t: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = rgb.r * (1 - t);
  const g = rgb.g * (1 - t);
  const b = rgb.b * (1 - t);
  return rgbToHex(r, g, b);
}

export function buildThemeFromPrimary(primary: string): ThemeConfig {
  // Default “portal-like” palette: clean surfaces, readable contrast.
  const surface = "#ffffff";
  const text = "#0b1220";
  const accent = tint(primary, 0.15);
  const muted = tint("#0b1220", 0.86); // light gray derived

  return {
    primary,
    surface,
    text,
    accent,
    muted,
  };
}

export function deriveThemeVariants(theme: ThemeConfig) {
  // Used for hover/active states without Tailwind.
  return {
    primaryHover: shade(theme.primary, 0.08),
    primaryActive: shade(theme.primary, 0.16),
    accentHover: shade(theme.accent, 0.06),
    border: theme.muted,
    card: theme.surface,
    bg: tint(theme.primary, 0.92),
  };
}
