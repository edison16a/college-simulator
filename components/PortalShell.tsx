"use client";

import React, { useMemo } from "react";
import type { SimConfig } from "../lib/types";
import { deriveThemeVariants } from "../lib/theme";

type Props = {
  cfg: SimConfig;
  activeTopTab?: "application" | "aid" | "scores" | "interview" | "account" | "contact";
  children: React.ReactNode;
  contentClassName?: string;
};

function Logo({ cfg }: { cfg: SimConfig }) {
  if (cfg.logo.kind === "none") {
    return (
      <div className="logoFallback" aria-label="Logo placeholder">
        <span className="logoFallback__mark" />
      </div>
    );
  }
  const src = cfg.logo.kind === "url" ? cfg.logo.url : cfg.logo.dataUrl;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="portalLogo" src={src} alt={`${cfg.collegeName} logo`} />
  );
}

export default function PortalShell({ cfg, activeTopTab = "application", children, contentClassName }: Props) {
  const v = useMemo(() => deriveThemeVariants(cfg.theme), [cfg.theme]);
  const emailDomain = useMemo(() => {
    const domain = cfg.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return domain || "school";
  }, [cfg.collegeName]);

  return (
    <div
      className="portalRoot"
      style={
        {
          ["--brand" as any]: cfg.theme.primary,
          ["--brandHover" as any]: v.primaryHover,
          ["--brandActive" as any]: v.primaryActive,
          ["--surface" as any]: cfg.theme.surface,
          ["--text" as any]: cfg.theme.text,
          ["--muted" as any]: cfg.theme.muted,
          ["--accent" as any]: cfg.theme.accent,
          ["--bg" as any]: v.bg,
        } as React.CSSProperties
      }
    >
      <div className="portalTopBar">
        <div className="portalTopBar__left">
          <div className="portalTopBar__brand">
            <Logo cfg={cfg} />
            <div className="portalTopBar__brandText">
              <div className="portalTopBar__college">{cfg.collegeName}</div>
              <div className="portalTopBar__office">Undergraduate Admissions</div>
            </div>
          </div>
        </div>

        <div className="portalTopBar__right">
          <div className="portalTopBar__userPills">
            <div className="pill pill--ghost">
              <span className="muted">Signed in as</span> <span className="mono">{cfg.applicantName}</span>
            </div>
            <a className="pill pill--primary" href="/" aria-label="Return to home">
              Logout
            </a>
          </div>
        </div>
      </div>

      <div className="portalSubNav">
        <div className="portalSubNav__inner" role="tablist" aria-label="Portal sections">
          <a className={`tabItem ${activeTopTab === "application" ? "isActive" : ""}`} href="/portal">
            My Application
          </a>
          <a className={`tabItem ${activeTopTab === "aid" ? "isActive" : ""}`} href="#" onClick={(e) => e.preventDefault()}>
            My Financial Aid
          </a>
          <a className={`tabItem ${activeTopTab === "scores" ? "isActive" : ""}`} href="#" onClick={(e) => e.preventDefault()}>
            My Test Scores
          </a>
          <a className={`tabItem ${activeTopTab === "interview" ? "isActive" : ""}`} href="#" onClick={(e) => e.preventDefault()}>
            My Interview
          </a>
          <a className={`tabItem ${activeTopTab === "account" ? "isActive" : ""}`} href="#" onClick={(e) => e.preventDefault()}>
            My Account
          </a>
          <a className={`tabItem ${activeTopTab === "contact" ? "isActive" : ""}`} href="#" onClick={(e) => e.preventDefault()}>
            Contact Us
          </a>
        </div>
      </div>

      <div className="portalContentWrap">
        <div className={`portalContentInner ${contentClassName ?? ""}`.trim()}>
          {children}
        </div>
      </div>
    </div>
  );
}
