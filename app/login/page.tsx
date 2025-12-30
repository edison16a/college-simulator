"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { SimContext } from "../providers";
import { useRouter } from "next/navigation";
import { deriveThemeVariants } from "../../lib/theme";

function Logo({ src, name }: { src: string | null; name: string }) {
  if (!src) return <div className="logoFallback logoFallback--lg" aria-label="Logo placeholder" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="loginLogo" src={src} alt={`${name} logo`} />;
}

export default function LoginPage() {
  const { cfg, patchCfg } = useContext(SimContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const safeCfg = useMemo(() => cfg, [cfg]);

  useEffect(() => {
    patchCfg({ acknowledgedNoRealCredentials: true });
  }, [patchCfg]);

  if (!safeCfg) return null;

  const v = deriveThemeVariants(safeCfg.theme);
  const logoSrc =
    safeCfg.logo.kind === "none" ? null : safeCfg.logo.kind === "url" ? safeCfg.logo.url : safeCfg.logo.dataUrl;

  return (
    <div
      className="loginRoot"
      style={
        {
          ["--brand" as any]: safeCfg.theme.primary,
          ["--brandHover" as any]: v.primaryHover,
          ["--brandActive" as any]: v.primaryActive,
          ["--surface" as any]: safeCfg.theme.surface,
          ["--text" as any]: safeCfg.theme.text,
          ["--muted" as any]: safeCfg.theme.muted,
          ["--accent" as any]: safeCfg.theme.accent,
          ["--bg" as any]: v.bg,
        } as React.CSSProperties
      }
    >
      <div className="loginTopBar">
        <div className="loginTopBrand">
          <Logo src={logoSrc} name={safeCfg.collegeName} />
          <div className="loginTopBrandText">
            <div className="loginTopTitle">{safeCfg.collegeName}</div>
            <div className="loginTopSubtitle">Undergraduate Admissions</div>
          </div>
        </div>
        <div className="loginTopButtons">
          <div className="loginTopRow loginTopRow--small">
            <a className="loginTopBtn loginTopBtn--primary" href="#" onClick={(e) => e.preventDefault()}>
              Check Application Status
            </a>
            {["Policies", "Request Information", "Contact Us"].map((label) => (
              <a key={label} className="loginTopBtn loginTopBtn--sm" href="#" onClick={(e) => e.preventDefault()}>
                {label}
              </a>
            ))}
          </div>
          <div className="loginTopRow loginTopRow--large">
            {["How to Apply", "Visit & Connect"].map((label) => (
              <a key={label} className="loginTopBtn loginTopBtn--lg" href="#" onClick={(e) => e.preventDefault()}>
                {label}
              </a>
            ))}
            <span className="loginTopDivider" aria-hidden="true" />
            <a className="loginTopBtn loginTopBtn--lg" href="#" onClick={(e) => e.preventDefault()}>
              Menu
            </a>
          </div>
        </div>
      </div>

      <div className="loginMain">
        <div className="loginClassic">
          <h1 className="loginClassicHeading">Login</h1>
          <div className="loginClassicNote">To log in, please enter your email address and password.</div>

          <form
            className="loginClassicForm"
            onSubmit={(e) => {
              e.preventDefault();
              setPw("");
              router.push("/portal");
            }}
          >
            <div className="loginClassicField">
              <label className="loginClassicLabel" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="loginClassicInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder="name@example.com"
              />
            </div>

            <div className="loginClassicField loginClassicField--withLink">
              <label className="loginClassicLabel" htmlFor="password">
                Password
              </label>
              <div className="loginClassicInputRow">
                <input
                  id="password"
                  className="loginClassicInput"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoComplete="off"
                  placeholder="Password"
                />
                <a className="loginClassicForgot" href="#" onClick={(e) => e.preventDefault()}>
                  Forgot your password?
                </a>
              </div>
            </div>

            <button className="loginClassicSubmit" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
