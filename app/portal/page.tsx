"use client";

import React, { useContext, useMemo } from "react";
import { SimContext } from "../providers";
import PortalShell from "../../components/PortalShell";
import { useRouter } from "next/navigation";
import type { PortalChecklistItem, PortalProfile } from "../../lib/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function todayMMDDYYYY(): string {
  const d = new Date();
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function buildChecklist(date: string): PortalChecklistItem[] {
  // “Common pattern” items found across many applicant portals (original wording).
  return [
    { label: "Application Fee", status: "Received", receivedDate: date },
    { label: "Application Form", status: "Received", receivedDate: date },
    { label: "Writing Supplement", status: "Received", receivedDate: date },
    { label: "High School Transcript", status: "Received", receivedDate: date },
    { label: "Standardized Testing (if provided)", status: "Received", receivedDate: date },
    { label: "Counselor Recommendation", status: "Received", receivedDate: date },
    { label: "School Report", status: "Received", receivedDate: date },
    { label: "Teacher Evaluation — First", status: "Received", receivedDate: date },
    { label: "Teacher Evaluation — Second", status: "Received", receivedDate: date },
  ];
}

function buildProfile(name: string): PortalProfile {
  const safe = name.trim() || "Student Applicant";
  const parts = safe.split(" ");
  const first = parts[0] ?? "student";
  const email = `${first.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;

  return {
    fullName: safe,
    applicantId: Math.floor(10000000 + Math.random() * 89999999).toString(),
    email,
    addressLine1: "4929 College St.",
    cityStateZip: "United States of America 92202",
    country: "United States of America",
  };
}

export default function PortalPage() {
  const { cfg } = useContext(SimContext);
  const router = useRouter();

  const safeCfg = useMemo(() => cfg, [cfg]);
  if (!safeCfg) return null;

  const receivedDate = todayMMDDYYYY();
  const checklist = buildChecklist(receivedDate);
  const profile = buildProfile(safeCfg.applicantName);
  const postedDate = formatLongDate(new Date());
  const emailDomain = safeCfg.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, "") || "school";

  return (
    <PortalShell cfg={safeCfg} activeTopTab="application">
      <div className="portalHero">
        <div className="portalHero__inner">
          <div className="portalHero__title">Welcome, {safeCfg.applicantName}</div>
          <div className="portalHero__subtitle">
            Use your student portal to track application progress, required materials, and next steps.
          </div>
        </div>
      </div>

      <div className="portalStatusRow">
        <div className="statusStrip">
          <div className="statusStrip__title">Status Update</div>
          <div className="statusStrip__desc">An update to your application was last posted {postedDate}.</div>
          <a className="statusStrip__link" href="#" onClick={(e) => { e.preventDefault(); router.push("/portal/update"); }}>
            View Update &gt;&gt;
          </a>
        </div>
      </div>

      <div className="portalPageHeader">
        <div>
          <h1 className="portalH1">Application Checklist</h1>
          <p className="portalLead">
            Review your submitted materials and any additional items we may request.
          </p>
        </div>
      </div>

      <div className="portalGrid">
        <section className="portalCard">
          <div className="portalCard__titleRow">
            <h2 className="portalH2">Application Checklist</h2>
            <div className="muted mono">Last refreshed: {receivedDate}</div>
          </div>

          <div className="tableWrap" role="region" aria-label="Application checklist table">
            <table className="table">
              <thead>
                <tr>
                  <th>Status Item</th>
                  <th>Status</th>
                  <th>Date Received</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((it) => (
                  <tr key={it.label}>
                    <td>{it.label}</td>
                    <td>
                      <span className="statusTag statusTag--ok">{it.status}</span>
                    </td>
                    <td className="mono">{it.receivedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="portalCard__sub">
            <h3 className="portalH3">Upload Materials</h3>
            <p className="muted">
              This area is included for realism. In a real portal, uploads are only used for items a school requests.
            </p>
            <div className="uploadRow">
              <select className="textInput">
                <option>Document type…</option>
                <option>Additional Information</option>
                <option>Updated Resume</option>
                <option>Portfolio Supplement</option>
              </select>
              <input type="file" />
              <button className="btn" type="button" onClick={() => alert("Upload disabled (no backend).")}>
                Upload
              </button>
            </div>
          </div>
        </section>

        <aside className="portalSide">
          <section className="portalCard">
            <h2 className="portalH2">Your Application Profile</h2>
            <div className="profileGrid">
              <div className="profileRow">
                <div className="muted">Name</div>
                <div className="mono">{profile.fullName}</div>
              </div>
              <div className="profileRow">
                <div className="muted">ID</div>
                <div className="mono">{profile.applicantId}</div>
              </div>
              <div className="profileRow">
                <div className="muted">Email</div>
                <div className="mono">{profile.email}</div>
              </div>
              <div className="profileRow">
                <div className="muted">Entry Term</div>
                <div className="mono">{safeCfg.entryYear} — {safeCfg.decisionRound}</div>
              </div>
              <div className="profileRow">
                <div className="muted">Major</div>
                <div className="mono">{safeCfg.major}</div>
              </div>
              <div className="profileRow">
                <div className="muted">Address</div>
                <div className="mono">
                  {profile.addressLine1}
                  <br />
                  {profile.cityStateZip}
                  <br />
                  {profile.country}
                </div>
              </div>
            </div>
          </section>

          <section className="portalCard">
            <h2 className="portalH2">Resources</h2>
            <ul className="resourceList">
              <li>
                <a className="linkLike" href="#" onClick={(e) => e.preventDefault()}>
                  Virtual Events
                </a>
              </li>
              <li>
                <a className="linkLike" href="#" onClick={(e) => e.preventDefault()}>
                  On-Campus Visits
                </a>
              </li>
              <li>
                <a className="linkLike" href="#" onClick={(e) => e.preventDefault()}>
                  Important Dates
                </a>
              </li>
              <li>
                <a className="linkLike" href="#" onClick={(e) => e.preventDefault()}>
                  Admission Blog
                </a>
              </li>
            </ul>
            <div className="resourceContact">
              <div className="footerTitle">Need help?</div>
              <div className="muted">Call <span className="mono">(680) 212-5282</span></div>
              <div className="muted">Email <span className="mono">admission@{emailDomain}.edu</span></div>
              <div className="muted">Hours M–F 8:30 a.m. to 5 p.m.</div>
              <div className="footerTitle" style={{ marginTop: "10px" }}>{safeCfg.collegeName}</div>
              <div className="muted">4929 College St. United States of America 92202</div>
              <div className="muted">Privacy Policy | Accessibility</div>
            </div>
          </section>
        </aside>
      </div>
    </PortalShell>
  );
}
