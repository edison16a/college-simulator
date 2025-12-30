export type DecisionOutcome = "accepted" | "rejected" | "deferred";

export type DecisionRound =
  | "Early Decision"
  | "Early Action"
  | "Regular Decision"
  | "Rolling"
  | "Restrictive Early Action";

export type ThemeConfig = {
  /** Primary brand color in hex, e.g. #0a58ca */
  primary: string;
  /** Background surface color (light mode style) */
  surface: string;
  /** Text color */
  text: string;
  /** Optional accent color */
  accent: string;
  /** Derived: used for borders/lines */
  muted: string;
};

export type LogoConfig =
  | { kind: "none" }
  | { kind: "url"; url: string }
  | { kind: "dataUrl"; dataUrl: string; filename?: string };

export type SimConfig = {
  // Branding / institution
  collegeName: string;
  logo: LogoConfig;

  // Applicant inputs
  applicantName: string;
  decisionRound: DecisionRound;
  entryYear: string; // e.g. "Fall 2026"
  major: string;

  // Decision
  outcome: DecisionOutcome;

  // Theme
  theme: ThemeConfig;

  // Guardrails
  /** If true, user acknowledged "do not enter real credentials" gate */
  acknowledgedNoRealCredentials: boolean;

  // Meta
  createdAtISO: string;
};

export type PortalChecklistItem = {
  label: string;
  status: "Received" | "Awaiting" | "Waived";
  receivedDate: string; // MM/DD/YYYY
  details?: string;
};

export type PortalProfile = {
  fullName: string;
  applicantId: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  cityStateZip: string;
  country: string;
};
