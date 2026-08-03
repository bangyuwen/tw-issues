"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type FrameScheduler = (callback: () => void) => void;

type InteractionEnvironment = {
  readHash: () => string;
  addHashChangeListener: (listener: () => void) => void;
  removeHashChangeListener: (listener: () => void) => void;
  addClickListener: (listener: (event: MouseEvent) => void) => void;
  removeClickListener: (listener: (event: MouseEvent) => void) => void;
};

const scheduleFrame: FrameScheduler = (callback) => requestAnimationFrame(callback);

export function revealSourceFromHash(
  disclosure: HTMLDetailsElement,
  hash: string,
  schedule: FrameScheduler = scheduleFrame,
) {
  if (!hash.startsWith("#") || hash.length === 1) return false;

  let sourceId: string;
  try {
    sourceId = decodeURIComponent(hash.slice(1));
  } catch {
    return false;
  }

  const target = disclosure.ownerDocument.getElementById(sourceId);
  if (!target?.matches("[data-source-ref]") || !disclosure.contains(target)) return false;

  disclosure.open = true;
  schedule(() => {
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "center" });
  });
  return true;
}

export function bindSourceDisclosureInteractions(
  disclosure: HTMLDetailsElement,
  environment: InteractionEnvironment,
  schedule: FrameScheduler = scheduleFrame,
) {
  const revealCurrentSource = () => revealSourceFromHash(disclosure, environment.readHash(), schedule);
  const revealClickedSource = (event: MouseEvent) => {
    const origin = event.target as { closest?: (selector: string) => Element | null } | null;
    if (typeof origin?.closest !== "function") return;
    const link = origin.closest('a[href^="#"]');
    const href = link?.getAttribute("href");
    if (href) revealSourceFromHash(disclosure, href, schedule);
  };

  revealCurrentSource();
  environment.addHashChangeListener(revealCurrentSource);
  environment.addClickListener(revealClickedSource);
  return () => {
    environment.removeHashChangeListener(revealCurrentSource);
    environment.removeClickListener(revealClickedSource);
  };
}

export default function SourcesDisclosure({
  sourceCount,
  children,
}: {
  sourceCount: number;
  children: ReactNode;
}) {
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const disclosure = disclosureRef.current;
    if (!disclosure) return;
    return bindSourceDisclosureInteractions(disclosure, {
      readHash: () => window.location.hash,
      addHashChangeListener: (listener) => window.addEventListener("hashchange", listener),
      removeHashChangeListener: (listener) => window.removeEventListener("hashchange", listener),
      addClickListener: (listener) => document.addEventListener("click", listener),
      removeClickListener: (listener) => document.removeEventListener("click", listener),
    });
  }, []);

  return <details className="sources-disclosure" id="sources" ref={disclosureRef}>
    <summary>
      <span>資料與來源 · {sourceCount} 筆</span>
      <span className="sources-disclosure-action" aria-hidden="true">展開</span>
    </summary>
    <div className="sources-disclosure-content">{children}</div>
  </details>;
}
