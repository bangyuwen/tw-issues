"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ezwaySlug, type CitationOccurrence } from "./ezway-reading-map";

export function validCitationOrigin(state: unknown, hash: string, occurrences: readonly CitationOccurrence[]) {
  if (!state || typeof state !== "object" || !("twIssuesCitationOrigin" in state)) return undefined;
  const origin = state.twIssuesCitationOrigin;
  if (!origin || typeof origin !== "object" || !("topicSlug" in origin) || !("anchorId" in origin) || !("sourceRef" in origin)) return undefined;
  if (origin.topicSlug !== ezwaySlug || hash !== `#${origin.sourceRef}`) return undefined;
  return occurrences.find(entry => entry.anchorId === origin.anchorId && entry.sourceRef === origin.sourceRef);
}

export default function EzwaySourceDisclosure({ occurrences, children, sourceCount }: {
  occurrences: readonly CitationOccurrence[]; children: ReactNode; sourceCount: number;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [origin, setOrigin] = useState<CitationOccurrence>();

  useEffect(() => {
    const disclosure = ref.current;
    const root = disclosure?.closest("main");
    if (!disclosure || !root) return;
    const sync = () => {
      setOrigin(validCitationOrigin(window.history.state, window.location.hash, occurrences));
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const target = document.getElementById(id);
      if (!target || !root.contains(target)) return;
      if (disclosure.contains(target)) disclosure.open = true;
      for (let parent = target.parentElement; parent && parent !== root; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      const focusTarget = target === disclosure ? disclosure.querySelector("summary") : target;
      focusTarget?.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const inspect = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-citation-inspect]") : null;
      if (!link || !root.contains(link) || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const occurrence = occurrences.find(entry => entry.anchorId === link.dataset.citationInspect && link.getAttribute("href") === `#${entry.sourceRef}`);
      if (!occurrence || !document.getElementById(occurrence.sourceRef)) return;
      event.preventDefault();
      const state = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
      const url = new URL(window.location.href);
      url.hash = occurrence.anchorId;
      window.history.replaceState(state, "", url);
      url.hash = occurrence.sourceRef;
      window.history.pushState({ ...state, twIssuesCitationOrigin: {
        topicSlug: ezwaySlug, anchorId: occurrence.anchorId, sourceRef: occurrence.sourceRef,
      } }, "", url);
      sync();
    };
    const frame = requestAnimationFrame(sync);
    root.addEventListener("click", inspect);
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("click", inspect);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [occurrences]);

  return <details className="sources-disclosure" id="sources" ref={ref}>
    <summary><span>資料與來源 · {sourceCount} 筆</span><span className="sources-disclosure-action" aria-hidden="true">展開</span></summary>
    {origin && <p className="ezway-preferred-return"><a href={`#${origin.anchorId}`}>回到引用處</a></p>}
    <div className="sources-disclosure-content">{children}</div>
  </details>;
}
