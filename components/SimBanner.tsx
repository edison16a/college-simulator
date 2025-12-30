"use client";

import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
  tone?: "warning" | "info";
};

export default function SimBanner({
  title = "Simulation Notice",
  children,
  tone = "warning",
}: Props) {
  return (
    <div className={`simBanner simBanner--${tone}`} role="note" aria-label="Simulation Notice">
      <div className="simBanner__icon" aria-hidden="true">
        !
      </div>
      <div className="simBanner__content">
        <div className="simBanner__title">{title}</div>
        <div className="simBanner__text">
          {children ?? (
            <>
              This is a <strong>SIMULATION</strong>. It is not affiliated with any real university.
              <strong> Do not enter real usernames or passwords</strong>.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
