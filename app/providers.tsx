"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { SimConfig } from "../lib/types";
import { loadSimConfig, saveSimConfig } from "../lib/storage";
import { buildThemeFromPrimary } from "../lib/theme";

type SimContextValue = {
  cfg: SimConfig | null;
  setCfg: (cfg: SimConfig) => void;
  patchCfg: (patch: Partial<SimConfig>) => void;
  clear: () => void;
};

export const SimContext = createContext<SimContextValue>({
  cfg: null,
  setCfg: () => {},
  patchCfg: () => {},
  clear: () => {},
});

function defaultConfig(): SimConfig {
  const createdAt = new Date();

  return {
    collegeName: "Example University",
    logo: { kind: "none" },
    applicantName: "Student Applicant",
    decisionRound: "Regular Decision",
    entryYear: "Fall 2026",
    major: "Undeclared",
    outcome: "accepted",
    theme: buildThemeFromPrimary("#1d4ed8"),
    acknowledgedNoRealCredentials: false,
    createdAtISO: createdAt.toISOString(),
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [cfg, setCfgState] = useState<SimConfig | null>(null);

  useEffect(() => {
    const loaded = loadSimConfig();
    setCfgState(loaded ?? defaultConfig());
  }, []);

  const setCfg = useCallback((next: SimConfig) => {
    setCfgState(next);
    saveSimConfig(next);
  }, []);

  const patchCfg = useCallback(
    (patch: Partial<SimConfig>) => {
      setCfgState((prev) => {
        const base = prev ?? defaultConfig();
        const next = { ...base, ...patch };
        saveSimConfig(next);
        return next;
      });
    },
    []
  );

  const clear = useCallback(() => {
    // Keep it simple: reset to default
    const next = defaultConfig();
    setCfgState(next);
    saveSimConfig(next);
  }, []);

  const value = useMemo(() => ({ cfg, setCfg, patchCfg, clear }), [cfg, setCfg, patchCfg, clear]);

  useEffect(() => {
    if (!cfg) return;
    const href =
      cfg.logo.kind === "none"
        ? "/favicon.ico"
        : cfg.logo.kind === "url"
        ? cfg.logo.url
        : cfg.logo.dataUrl;

    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = href;
  }, [cfg]);

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}
