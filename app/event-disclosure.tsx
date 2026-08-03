"use client";

import type { KeyboardEvent, ReactNode } from "react";

function isSummaryKeyEvent(event: KeyboardEvent<HTMLDetailsElement>) {
  return (event.key === "Enter" || event.key === " ")
    && event.target instanceof HTMLElement
    && event.target.closest("summary") !== null;
}

export default function EventDisclosure({ children, className = "event-disclosure" }: { children: ReactNode; className?: string }) {
  function toggleWithKeyboard(event: KeyboardEvent<HTMLDetailsElement>) {
    if (!isSummaryKeyEvent(event)) return;
    event.preventDefault();
    event.currentTarget.open = !event.currentTarget.open;
  }

  return <details className={className} onKeyDown={toggleWithKeyboard}>{children}</details>;
}
