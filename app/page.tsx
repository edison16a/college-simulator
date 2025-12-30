"use client";

import React, { useContext, useMemo, useState } from "react";
import { SimContext } from "./providers";
import type { DecisionOutcome, DecisionRound, LogoConfig } from "../lib/types";
import ColorPickerAdvanced from "../components/ColorPickerAdvanced";
import { useRouter } from "next/navigation";

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

const ROUNDS: DecisionRound[] = [
  "Early Decision",
  "Early Decision II",
  "Early Action",
  "Restrictive Early Action",
  "Regular Decision",
  "Rolling",
];

const OUTCOMES: { value: DecisionOutcome; label: string }[] = [
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "deferred", label: "Deferred" },
];

export default function HomePage() {
  const { cfg, setCfg } = useContext(SimContext);
  const router = useRouter();

  const [logoUrl, setLogoUrl] = useState("");
  const [logoMode, setLogoMode] = useState<"none" | "file" | "url">("none");
  const [fileName, setFileName] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const safeCfg = useMemo(() => cfg, [cfg]);

  if (!safeCfg) return null;

  const applyLogo = (logo: LogoConfig) => {
    setCfg({
      ...safeCfg,
      logo,
    });
  };

  const preloadImage = (url: string) =>
    new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = url;
    });

  const start = () => {
    // Force acknowledgement gate to be reset each run
    setCfg({
      ...safeCfg,
      acknowledgedNoRealCredentials: false,
    });
    router.push("/login");
  };

  return (
    <main className="homeRoot">
      <div className="homeContainer">
        <header className="homeHeader">
          <div className="homeTitleRow">
            <div>
              <h1 className="homeTitle">College Decision Portal</h1>
              <p className="homeSubtitle">
                Build a realistic applicant portal and decision letter experience.
              </p>
            </div>
          </div>
        </header>

        <section className="card">
          <h2 className="cardTitle">1) School branding</h2>

          <div className="grid2">
            <div className="field">
              <label className="fieldLabel">College name (display only)</label>
              <input
                className="textInput"
                value={safeCfg.collegeName}
                onChange={(e) => setCfg({ ...safeCfg, collegeName: e.target.value })}
                placeholder="Example University"
              />
              <div className="helpText">
                Tip: Use a fictional name if you plan to share screenshots publicly.
              </div>
            </div>

            <div className="field">
              <label className="fieldLabel">Logo</label>
              <div className="segmented">
                <button
                  type="button"
                  className={`segBtn ${logoMode === "none" ? "isActive" : ""}`}
                  onClick={() => {
                    setLogoMode("none");
                    applyLogo({ kind: "none" });
                    setFileName("");
                    setLogoUrl("");
                    setLogoPreview(null);
                    setLogoError(null);
                  }}
                >
                  None
                </button>
                <button
                  type="button"
                  className={`segBtn ${logoMode === "file" ? "isActive" : ""}`}
                  onClick={() => {
                    setLogoMode("file");
                    setLogoPreview(null);
                    setLogoError(null);
                  }}
                >
                  Upload file
                </button>
                <button
                  type="button"
                  className={`segBtn ${logoMode === "url" ? "isActive" : ""}`}
                  onClick={() => setLogoMode("url")}
                >
                  Use link
                </button>
              </div>

              {logoMode === "file" && (
                <div className="stack">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const dataUrl = await toDataUrl(f);
                      setFileName(f.name);
                      applyLogo({ kind: "dataUrl", dataUrl, filename: f.name });
                    }}
                  />
                  {fileName && <div className="muted">Selected: {fileName}</div>}
                </div>
              )}

              {logoMode === "url" && (
                <div className="stack">
                  <input
                    className="textInput"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={async () => {
                      const trimmed = logoUrl.trim();
                      if (!trimmed) return;
                      setLogoError(null);
                      try {
                        await preloadImage(trimmed);
                        applyLogo({ kind: "url", url: trimmed });
                        setLogoPreview(trimmed);
                      } catch (err) {
                        setLogoError("Image could not be loaded. Please check the link.");
                      }
                    }}
                  >
                    Apply logo link
                  </button>
                  {logoError && (
                    <div className="helpText" style={{ color: "#b31b1b", fontWeight: 600 }}>
                      {logoError}
                    </div>
                  )}
                  <div className="helpText">
                    Use a direct image URL (ends in .png/.jpg/.svg). This is only for display.
                  </div>
                  {logoPreview && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="muted" style={{ fontSize: 13 }}>
                        Preview:
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "contain",
                          borderRadius: 12,
                          border: "1px solid rgba(11,18,32,0.14)",
                          background: "#fff",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel">Theme color</label>
            <ColorPickerAdvanced
              value={safeCfg.theme}
              onChange={(theme) => setCfg({ ...safeCfg, theme })}
            />
          </div>
        </section>

        <section className="card">
          <h2 className="cardTitle">2) Applicant inputs</h2>

          <div className="grid2">
            <div className="field">
              <label className="fieldLabel">Applicant name</label>
              <input
                className="textInput"
                value={safeCfg.applicantName}
                onChange={(e) => setCfg({ ...safeCfg, applicantName: e.target.value })}
                placeholder="Student Applicant"
              />
            </div>

            <div className="field">
              <label className="fieldLabel">Major</label>
              <input
                className="textInput"
                value={safeCfg.major}
                onChange={(e) => setCfg({ ...safeCfg, major: e.target.value })}
                placeholder="Computer Science"
              />
            </div>

            <div className="field">
              <label className="fieldLabel">Decision round</label>
              <select
                className="textInput"
                value={safeCfg.decisionRound}
                onChange={(e) => setCfg({ ...safeCfg, decisionRound: e.target.value as DecisionRound })}
              >
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="fieldLabel">Entry term / year</label>
              <input
                className="textInput"
                value={safeCfg.entryYear}
                onChange={(e) => setCfg({ ...safeCfg, entryYear: e.target.value })}
                placeholder="Fall 2026"
              />
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel">Decision outcome</label>
            <div className="segmented">
              {OUTCOMES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`segBtn ${safeCfg.outcome === o.value ? "isActive" : ""}`}
                  onClick={() => setCfg({ ...safeCfg, outcome: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="cardTitle">3) Start</h2>
          <p className="muted">You’ll see the applicant portal login screen next.</p>
          <div className="actionsRow">
            <button className="btn btn--primary" type="button" onClick={start}>
              Open portal
            </button>
            <a className="linkLike" href="/portal" onClick={(e) => { e.preventDefault(); router.push("/portal"); }}>
              Jump to portal (debug)
            </a>
          </div>
        </section>

        <footer className="homeFooter" />
      </div>
    </main>
  );
}
