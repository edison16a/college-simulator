"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SimContext } from "../../providers";
import PortalShell from "../../../components/PortalShell";
import { useRouter } from "next/navigation";
import type { SimConfig } from "../../../lib/types";

type ConfettiPiece = {
  id: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
};

function generateConfetti(count: number): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: `${i}-${Math.random().toString(16).slice(2)}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.6 + Math.random() * 2.0,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    });
  }
  return pieces;
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function signatureBlock(collegeName: string) {
  return (
    <div className="letterSignature">
      <div className="signatureScript">Lisa Nishii</div>
      <div className="signatureLine" />
      <div className="sigName">Lisa Nishii</div>
      <div className="muted">Senior Vice Provost for Enrollment Management and Undergraduate Education</div>
      <div className="muted">{collegeName}</div>
    </div>
  );
}

function letterLogo(cfg: SimConfig) {
  if (cfg.logo.kind === "none") {
    return <div className="letterLogoFallback" aria-label="Logo placeholder" />;
  }
  const src = cfg.logo.kind === "url" ? cfg.logo.url : cfg.logo.dataUrl;
  return <img className="letterLogo" src={src} alt={`${cfg.collegeName} logo`} />;
}

export default function UpdatePage() {
  const { cfg } = useContext(SimContext);
  const router = useRouter();

  const safeCfg = useMemo(() => cfg, [cfg]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const letterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!safeCfg) return;
    if (safeCfg.outcome === "accepted") {
      setConfetti(generateConfetti(240));
      const t = setTimeout(() => setConfetti([]), 5200);
      return () => clearTimeout(t);
    }
  }, [safeCfg]);

  if (!safeCfg) return null;

  const now = new Date();
  const dateStr = formatLongDate(now);

  useEffect(() => {
    const node = letterRef.current;
    if (!node) return;
    // Scroll the letter into view on load so it is centered for the user.
    setTimeout(() => {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  const body =
    safeCfg.outcome === "accepted"
      ? (
        <>
          <p>
            Congratulations on your admission to <strong>{safeCfg.collegeName}</strong> for{" "}
            <strong>{safeCfg.entryYear}</strong>.
          </p>
          <p>
            Your application reflects strong academic preparation, initiative, and a clear fit with the opportunities
            offered through our programs. We look forward to welcoming you to our community.
          </p>
          <p>
            Next steps will appear in this portal as they become available. Please review your checklist for any items
            that may need attention.
          </p>
        </>
      )
      : safeCfg.outcome === "deferred"
      ? (
        <>
          <p>
            Thank you for applying to <strong>{safeCfg.collegeName}</strong>. After careful review, we are unable to
            make a final decision at this time.
          </p>
          <p>
            Your application has been moved to a later review cycle. No additional materials are required unless
            requested in the portal. You may submit significant updates if they become available.
          </p>
          <p>
            A final decision will be posted here once the review process is complete. We appreciate your patience
            during this review period.
          </p>
        </>
      )
      : (
        <>
          <p>
            The admissions committee has reviewed your application to <strong>{safeCfg.collegeName}</strong>, and I am
            genuinely sorry to inform you that we cannot offer you admission for <strong>{safeCfg.entryYear}</strong>.
          </p>
          <p>
            <strong>{safeCfg.collegeName}</strong>’s admission process was especially competitive this year. While we
            recognize your hard work and many accomplishments, the increasing number of applicants to the university
            means that we cannot offer admission to every qualified applicant.
          </p>
          <p>
            I understand that this message comes as a disappointment. We greatly appreciate the time and effort you put
            into your <strong>{safeCfg.collegeName}</strong> application, and we extend our best wishes to you for
            success during your collegiate years.
          </p>
        </>
      );

  return (
    <PortalShell cfg={safeCfg} activeTopTab="application" contentClassName="portalContentInner--full">
      <div className="updateWrap">
        {safeCfg.outcome === "accepted" && (
          <div className="confettiLayer" aria-hidden="true">
            {confetti.map((p) => (
              <div
                key={p.id}
                className="confetti"
                style={
                  {
                    left: `${p.left}%`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                    width: `${p.size}px`,
                    height: `${p.size * 0.6}px`,
                    transform: `rotate(${p.rotate}deg)`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        <div className="updateHeaderRow">
          <div>
            <h1 className="portalH1">Status Update</h1>
            <div className="muted">
              Posted: <span className="mono">{dateStr}</span>
            </div>
          </div>
          <div className="updateHeaderActions">
            <button className="btn" type="button" onClick={() => router.push("/portal")}>
              Back to portal
            </button>
            <button className="btn btn--primary" type="button" onClick={() => window.print()}>
              Print
            </button>
          </div>
        </div>

        <div className="letterStage" ref={letterRef}>
          <div className="letterCard" role="article" aria-label="Decision letter">
            <div className="letterTop">
              <div className="letterBrand">
                {letterLogo(safeCfg)}
                <div className="letterMeta">
                  <div className="letterCollege">{safeCfg.collegeName}</div>
                  <div className="muted">Office of Admission</div>
                </div>
              </div>
            </div>

            <div className="letterBody">
              <div className="letterDate mono">{dateStr}</div>

              <div className="letterGreeting">Dear {safeCfg.applicantName},</div>

              {body}

              {signatureBlock(safeCfg.collegeName)}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
