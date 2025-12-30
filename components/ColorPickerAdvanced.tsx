"use client";

import React, { useMemo, useState } from "react";
import { buildThemeFromPrimary } from "../lib/theme";
import type { ThemeConfig } from "../lib/types";

type Props = {
  value: ThemeConfig;
  onChange: (next: ThemeConfig) => void;
};

const PRESETS = [
  { name: "Navy", hex: "#0b2a6f" },
  { name: "Royal", hex: "#1d4ed8" },
  { name: "Crimson", hex: "#b91c1c" },
  { name: "Emerald", hex: "#047857" },
  { name: "Teal", hex: "#0f766e" },
  { name: "Purple", hex: "#6d28d9" },
  { name: "Orange", hex: "#c2410c" },
  { name: "Charcoal", hex: "#111827" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Very lightweight “darkness” control:
 * - Keep hue from color input
 * - Adjust toward black/white depending on slider
 */
function applyDarkness(hex: string, darkness: number) {
  // darkness: 0 (lighter) .. 100 (darker)
  // We keep it simple: blend with white for 0..50 and black for 50..100.
  const d = clamp(darkness, 0, 100);

  const mix = (h: string, target: { r: number; g: number; b: number }, t: number) => {
    const cleaned = h.replace("#", "");
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const mr = Math.round(r + (target.r - r) * t);
    const mg = Math.round(g + (target.g - g) * t);
    const mb = Math.round(b + (target.b - b) * t);
    const toHex = (v: number) => v.toString(16).padStart(2, "0");
    return `#${toHex(mr)}${toHex(mg)}${toHex(mb)}`;
  };

  if (d <= 50) {
    const t = (50 - d) / 50; // more white when closer to 0
    return mix(hex, { r: 255, g: 255, b: 255 }, t * 0.55);
  }
  const t = (d - 50) / 50; // more black when closer to 100
  return mix(hex, { r: 0, g: 0, b: 0 }, t * 0.55);
}

export default function ColorPickerAdvanced({ value, onChange }: Props) {
  const [customHex, setCustomHex] = useState(value.primary);
  const [darkness, setDarkness] = useState(62);

  const previewHex = useMemo(() => applyDarkness(customHex, darkness), [customHex, darkness]);

  return (
    <div className="colorPicker">
      <div className="colorPicker__row">
        <div className="colorPicker__label">Theme presets</div>
        <div className="colorPicker__presets" role="list">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className="colorPreset"
              onClick={() => {
                setCustomHex(p.hex);
                const next = buildThemeFromPrimary(p.hex);
                onChange(next);
              }}
              role="listitem"
              aria-label={`Select ${p.name} theme`}
              title={p.name}
            >
              <span className="colorPreset__swatch" style={{ background: p.hex }} />
              <span className="colorPreset__name">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="colorPicker__divider" />

      <div className="colorPicker__row colorPicker__row--custom">
        <div className="colorPicker__label">
          Custom color picker <span className="muted">(choose any color)</span>
        </div>

        <div className="colorPicker__customGrid">
          <div className="colorPicker__field">
            <label className="fieldLabel">Color</label>
            <div className="inlineControls">
              <input
                aria-label="Pick a custom theme color"
                type="color"
                value={customHex}
                onChange={(e) => {
                  const nextHex = e.target.value;
                  setCustomHex(nextHex);
                  const themed = buildThemeFromPrimary(applyDarkness(nextHex, darkness));
                  onChange(themed);
                }}
              />
              <input
                className="textInput mono"
                value={customHex}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  setCustomHex(v);
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    const themed = buildThemeFromPrimary(applyDarkness(v, darkness));
                    onChange(themed);
                  }
                }}
                placeholder="#RRGGBB"
                aria-label="Custom hex color"
              />
            </div>
          </div>

          <div className="colorPicker__field">
            <label className="fieldLabel">Darkness</label>
            <input
              type="range"
              min={0}
              max={100}
              value={darkness}
              onChange={(e) => {
                const d = Number(e.target.value);
                setDarkness(d);
                const themed = buildThemeFromPrimary(applyDarkness(customHex, d));
                onChange(themed);
              }}
              aria-label="Darkness slider"
            />
            <div className="rangeMeta">
              <span className="muted">Light</span>
              <span className="mono">{darkness}</span>
              <span className="muted">Dark</span>
            </div>
          </div>

          <div className="colorPicker__field">
            <label className="fieldLabel">Preview</label>
            <div className="colorPreview">
              <div className="colorPreview__swatch" style={{ background: previewHex }} />
              <div className="colorPreview__meta">
                <div className="mono">{previewHex}</div>
                <div className="muted">Applied as portal primary color</div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onChange(buildThemeFromPrimary(previewHex))}
            >
              Use this color
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
