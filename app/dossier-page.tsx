import type { ReactNode } from "react";
import type { AttributedSpeakerGroup, DeepResearchTopic, PublicClaim, PublicSpeaker } from "./topic-data";
import type { ClaimCollectionModel, DossierPageModel } from "./dossier-page-model";
import SourcesDisclosure from "./topics/[slug]/source-disclosure";
import EventDisclosure from "./event-disclosure";
import SiteLink from "./site-link";

const eventStatusCopy = {
  verified: { label: "已確認", target: "#claims" },
  attributed: { label: "具名說法", target: "#reports" },
  unresolved: { label: "仍待釐清", target: "#questions" },
} as const;

function AiAutomationDisclaimer() {
  return <aside className="ai-automation-disclaimer" role="note" aria-label="AI 自動製作說明">
    <strong>AI 自動製作說明</strong>
    <p>本頁由 AI 自動整理與產生，可能仍有錯漏。請以頁面列出的原始資料與來源連結為準。</p>
  </aside>;
}

export function UnavailableDossierPage({ topic, displayTitle }: { topic: DeepResearchTopic; displayTitle: string }) {
  return <main className="site-shell dossier-shell">
      <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
      <section className="hero hero-detail"><div className="hero-detail-copy"><p className="eyebrow">深度研究 · 公開資料補強中</p><h1>{displayTitle}</h1><p className="lede">本題列入最近更新的深度研究，但公開來源覆蓋尚未完成；現階段不下結論，也不公開研究敘事。</p></div><aside className="dossier-meta"><p>最近更新</p><strong>{topic.lastUpdated.slice(5).replace("-", ".")}</strong><span>研究持續整理</span></aside></section>
      <section className="evidence-section"><div className="section-intro"><p className="eyebrow">公開資料界線</p><h2>先補足來源，<br />再公開命題。</h2><p>研究中不代表任何一方說法成立。待可核對的原始紀錄與獨立來源群組足以支撐具體命題後，本頁才會顯示事實、證明範圍與來源限制。</p></div></section>
      <section className="next-topic"><div><p className="eyebrow">繼續閱讀</p><h2>回到最近更新的研究索引。</h2></div><SiteLink href="/">回到議題索引 <span>→</span></SiteLink></section>
      <AiAutomationDisclaimer />
      <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
    </main>;
}

function ClaimEvidenceBody({ claim, sourceLinks }: { claim: PublicClaim & { sampleSize?: number }; sourceLinks: (ids: string[]) => ReactNode }) {
  return <><section className="claim-boundary" aria-label="可確認範圍與限制"><div className="claim-scope"><strong>這能確認</strong><p>{claim.proofScope}</p></div><div className="claim-limit"><strong>這不能證明</strong><p>{claim.limitations.join("；")}</p></div>{claim.sampleSize !== undefined && <p className="claim-sample"><strong>樣本數</strong>{claim.sampleSize}（N = {claim.sampleSize}）</p>}</section><div className="claim-sources" aria-label="資料來源"><div className="citations">{sourceLinks(claim.sources.map(({ publicRef }) => publicRef))}</div></div></>;
}

function ClaimCard({ claim, index, label, zone, sourceLinks }: { claim: PublicClaim & { sampleSize?: number }; index: number; label: string; zone: "direct" | "remainder"; sourceLinks: (ids: string[]) => ReactNode }) {
  return <article data-claim-zone={zone}><div className="claim-card-heading"><p>{label}</p><span className="fact-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{claim.statement}</h3><details className="claim-boundary-disclosure"><summary>資料與限制</summary><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></details></article>;
}

function ClaimCollection({ collection, sourceLinks }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode }) {
  const direct = collection.claims.slice(0, 4);
  const remainder = collection.claims.slice(4);
  const cards = (claims: typeof collection.claims, offset: number, zone: "direct" | "remainder") => <div className={`fact-grid fact-grid--${collection.kind}`}>{claims.map((claim, index) => <ClaimCard key={`${collection.id}-${index + offset}`} claim={claim} index={index + offset} label={collection.label} zone={zone} sourceLinks={sourceLinks} />)}</div>;
  const rows = (claims: typeof collection.claims, offset: number, zone: "direct" | "remainder") => <div className="verified-claim-list">{claims.map((claim, index) => <div data-claim-zone={zone} key={`${collection.id}-${index + offset}`}><EventDisclosure className="verified-claim-row"><summary><span className="verified-claim-ordinal">{String(index + offset + 1).padStart(2, "0")}</span><span className="verified-claim-title">{claim.statement}</span><span className="event-disclosure-action" aria-hidden="true">展開資料</span></summary><div className="verified-claim-body"><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></div></EventDisclosure></div>)}</div>;
  const items = collection.id === "claims" ? rows : cards;
  return <><div className="claim-direct">{items(direct, 0, "direct")}</div>{remainder.length > 0 && <details className="claim-remainder"><summary>展開其餘 {remainder.length} 項{collection.label}</summary>{items(remainder, 4, "remainder")}</details>}</>;
}

function SpeakerGroups({ groups, sourceLinks }: { groups: DossierPageModel["attributedSpeakerGroups"]; sourceLinks: (ids: string[]) => ReactNode }) {
  const offsets = groups.reduce<number[]>((values, group) => [...values, values.at(-1)! + group.claims.length], [0]);
  return <div className="speaker-groups">{groups.map((group, groupIndex) => {
    const groupOffset = offsets[groupIndex];
    const statements = (claims: typeof group.claims, start: number) => <div className="speaker-statement-list">{claims.map((claim, index) => <div data-claim-zone="detail" key={`${group.speaker.name}-${start + index}`}><EventDisclosure className="speaker-statement-row"><summary><span className="speaker-statement-ordinal">{String(start + index + 1).padStart(2, "0")}</span><span className="speaker-statement-title">{claim.statement}</span><span className="event-disclosure-action" aria-hidden="true">展開資料</span></summary><div className="speaker-statement-body"><dl><div><dt>這能確認</dt><dd>{claim.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{claim.limitations.join("；")}</dd></div></dl><div className="citations">{sourceLinks(claim.sources.map(({ publicRef }) => publicRef))}</div></div></EventDisclosure></div>)}</div>;
    const summary = group.stanceSummary ?? group.claims[0]?.statement ?? "目前沒有可公開的具名說法。";
    return <section className="speaker-group" key={`${group.speaker.name}-${groupIndex}`}><header><div className="speaker-group-heading"><strong>{group.speaker.name}</strong><span>{group.speaker.role}</span></div><p className="speaker-group-summary"><span>摘要</span>{summary}</p></header><details className="speaker-group-details"><summary>查看 {group.claims.length} 項具名說法</summary>{statements(group.claims, groupOffset)}</details></section>;
  })}</div>;
}

type StanceMapEntry = {
  speaker: PublicSpeaker;
  claim: PublicClaim;
  relation: string;
  targetLabel: string;
  explicitTarget: boolean;
  claimCount: number;
};

function cleanStanceTarget(target: string) {
  return target.replace(/^(?:有|所謂|對|關於|將|把)\s*/, "").trim().slice(0, 42);
}

function findStanceTarget(claims: PublicClaim[]) {
  for (const claim of claims) {
    const quoted = claim.statement.match(/(批評|批判|指稱|指控|抨擊|攻擊|責怪|質疑|反駁|駁斥|影射|否認|呼籲|主張|稱為|定性為|辯稱|提醒)[^「」]{0,24}「([^」]{2,42})」/);
    if (quoted) return { claim, relation: quoted[1], targetLabel: cleanStanceTarget(quoted[2]), explicitTarget: true };
    const direct = claim.statement.match(/(批評|批判|指稱|指控|抨擊|攻擊|責怪|質疑|反駁|駁斥|影射|否認|呼籲|主張|稱為|定性為|研判|認為|不應|辯稱|提醒)\s*([^，。；]{2,42})/);
    if (direct) return { claim, relation: direct[1], targetLabel: cleanStanceTarget(direct[2]), explicitTarget: true };
  }
  return { claim: claims[0], relation: "提出說法", targetLabel: "議題焦點", explicitTarget: false };
}

function buildStanceMap(groups: AttributedSpeakerGroup[]): StanceMapEntry[] {
  const merged = new Map<string, { speaker: PublicSpeaker; claims: PublicClaim[] }>();
  groups.forEach((group) => {
    const key = `${group.speaker.name}::${group.speaker.role}`;
    const current = merged.get(key) ?? { speaker: group.speaker, claims: [] };
    current.claims.push(...group.claims);
    merged.set(key, current);
  });
  return Array.from(merged.values()).map(({ speaker, claims }) => ({
    speaker,
    ...findStanceTarget(claims),
    claimCount: claims.length,
  }));
}

function StanceMap({ groups, sourceLinks }: { groups: DossierPageModel["attributedSpeakerGroups"]; sourceLinks: (ids: string[]) => ReactNode }) {
  const entries = buildStanceMap(groups);
  return <section className="stance-map-section" id="stance-map" aria-label="立場關係圖">
    <div className="stance-map-intro section-intro"><p className="eyebrow">立場關係圖</p><h2>把「誰在指向誰」畫出來。</h2><p>每個六邊形是一個公開發言主體；箭頭沿用原句裡的明示動詞，讓讀者先看見說法的落點，再回到原文查核。</p></div>
    <div className="stance-map-board">
      <div className="stance-map-axis" aria-hidden="true"><span>公開主體</span><span>文字中的落點</span></div>
      <div className="stance-map-lanes">
        {entries.map((entry, index) => <article className={`stance-lane ${entry.explicitTarget ? "stance-lane--explicit" : "stance-lane--topic"}`} key={`${entry.speaker.name}-${entry.speaker.role}`}>
          <div className="stance-actor" role="img" aria-label={`${entry.speaker.name}，${entry.speaker.role}；${entry.relation}：${entry.targetLabel}`}>
            <span className="stance-actor-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{entry.speaker.name}</strong>
            <small>{entry.speaker.role}</small>
          </div>
          <div className="stance-arrow" aria-hidden="true"><span>{entry.relation}</span><b>→</b></div>
          <div className="stance-target">
            <span className="stance-target-kicker">{entry.explicitTarget ? "明示指向" : "共同節點"}</span>
            <strong>{entry.targetLabel}</strong>
            <small>{entry.claimCount} 項具名說法</small>
            <details className="stance-evidence"><summary>看原句</summary><p>{entry.claim.statement}</p><div className="citations">{sourceLinks(entry.claim.sources.map(({ publicRef }) => publicRef))}</div></details>
          </div>
        </article>)}
      </div>
    </div>
    <p className="stance-map-note"><strong>閱讀界線：</strong>箭頭只表示公開文字中的明示指向，不等於責任判定、攻擊事實或 TW Issues 的立場；沒有明示對象時，統一回到「議題焦點」。</p>
  </section>;
}

const evidenceCopy = {
  claims: { aria: "命題追溯", eyebrow: "已知資訊", title: undefined, intro: undefined },
  questions: { aria: "仍待釐清", eyebrow: "仍待釐清", title: <>知道哪裡還不知道，<br />比假裝有答案更重要。</>, intro: "這些項目已有公開調查或報導脈絡，但尚不能把任何一種解釋寫成根因或責任定論。" },
};

function EvidenceSection({ collection, sourceLinks }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode }) {
  const copy = evidenceCopy[collection.id];
  return <section className="evidence-section" id={collection.id} aria-label={copy.aria}><div className="section-intro"><p className="eyebrow">{copy.eyebrow}</p>{copy.title && <h2>{copy.title}</h2>}{copy.intro && <p>{copy.intro}</p>}</div><ClaimCollection collection={collection} sourceLinks={sourceLinks} /></section>;
}

function AttributedEvidenceSection({ groups, sourceLinks }: { groups: DossierPageModel["attributedSpeakerGroups"]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section" id="reports" aria-label="不同主體怎麼說"><div className="section-intro"><p className="eyebrow">不同主體怎麼說</p><p>依主體整理公開說法；不代表已確認或完整。</p></div><SpeakerGroups groups={groups} sourceLinks={sourceLinks} /></section>;
}

function EditorialSection({ id, eyebrow, claims, sourceLinks }: { id: "analysis" | "positions"; eyebrow: string; claims: PublicClaim[]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section editorial-section" id={id} aria-label={eyebrow}>
    <div className="section-intro"><p className="eyebrow">{eyebrow}</p><p>以下是 TW Issues 依公開前提提出的判讀或主張，不是已確認事實。</p></div>
    <div className="fact-grid">{claims.map((claim, index) => <article key={`${id}-${index}`}><div className="claim-card-heading"><p>{claim.editorialLabel}</p><span className="fact-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{claim.statement}</h3><dl>{claim.premises && <div><dt>依據前提</dt><dd>{claim.premises.join("；")}</dd></div>}{claim.inference && <div><dt>推論</dt><dd>{claim.inference}</dd></div>}{claim.uncertainty && <div><dt>不確定性</dt><dd>{claim.uncertainty}</dd></div>}{claim.falsifier && <div><dt>什麼會推翻這個判讀</dt><dd>{claim.falsifier}</dd></div>}{claim.consistentStandard && <div><dt>一致標準</dt><dd>{claim.consistentStandard}</dd></div>}</dl><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></article>)}</div>
  </section>;
}

export default function DossierPage({ model }: { model: DossierPageModel }) {
  const { topic, displayTitle, collections, attributedSpeakerGroups, analysisClaims = [], editorialPositions = [], socialObservations = [], socialSampleSize, publicSources, sourceById, timelineGroups, recentTimelineGroups, olderTimelineGroups } = model;
  if (!topic || !displayTitle) throw new Error("Dossier page metadata is required");
  const stanceMapAvailable = buildStanceMap(attributedSpeakerGroups).length > 1;
  const sourceLinks = (sourceIds: string[]) => sourceIds.map((id) => {
    const source = sourceById.get(id);
    return source ? <a className="citation" href={`#${source.publicRef}`} key={source.publicRef} aria-label={`查看來源：${source.publisher}`}><span aria-hidden="true">{source.publisher}</span><span className="citation-tooltip" role="tooltip"><span>{source.publisher} · {source.publishedAt}</span><strong>{source.title}</strong><small>點擊跳至完整來源</small></span></a> : null;
  });
  const renderTimelineGroups = (groups: DossierPageModel["timelineGroups"], variant: "recent" | "history") => <div className={`event-timeline event-timeline--${variant}`}>{groups.map((group) => {
    const hasMultipleEvents = group.events.length > 1;
    return <section className="event-date-group" data-date-key={group.key} key={group.key}>
      <header className="event-date-heading"><time dateTime={group.key}>{group.label}</time>{hasMultipleEvents && <span className="event-date-multiple-label">同日 {group.events.length} 則</span>}</header>
      <div className="event-date-events">{group.events.map((event) => {
        const attribution = event.items.flatMap((item) => item.speakers ?? []).map((speaker) => `${speaker.name}・${speaker.role}`).join("、");
        const eventStatuses = Array.from(new Set(event.items.map((item) => item.status)));
        return <EventDisclosure key={event.publicKey}>
          <summary><span className="event-summary-meta"><span className="event-kind-label">{event.kindLabel}</span>{eventStatuses.map((status) => <span className={`event-status-chip event-status-chip--${status}`} key={status}>{eventStatusCopy[status].label}</span>)}</span>{attribution && <span className="event-summary-attribution">{attribution}</span>}<span className="event-summary-title">{event.headline}</span><span className="event-disclosure-action" aria-hidden="true">展開證據</span></summary>
          <div className="event-disclosure-body">{event.items.map((item, index) => <article className={`event-item event-item--${item.status}`} key={`${event.publicKey}-${index}`}><header><span>{eventStatusCopy[item.status].label}</span><a href={eventStatusCopy[item.status].target}>查看完整分區</a></header><h4>{item.statement}</h4>{item.status === "attributed" && item.speakers && <p className="claim-speakers"><strong>說法歸屬</strong>{item.speakers.map((speaker) => speaker.name).join("、")}</p>}<dl><div><dt>這能確認</dt><dd>{item.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{item.limitations.join("；")}</dd></div></dl><div className="citations">{sourceLinks(item.sources.map((itemSource) => itemSource.publicRef))}</div></article>)}
            {event.commentary && <aside className="event-commentary"><p className="eyebrow">怎麼看這個轉折</p><p><strong>意義：</strong>{event.commentary.significance}</p>{event.commentary.changeFromPrior && <p><strong>與前一步的變化：</strong>{event.commentary.changeFromPrior}</p>}<p><strong>這不能證明：</strong>{event.commentary.evidenceBoundary}</p></aside>}
          </div>
        </EventDisclosure>;
      })}</div>
    </section>;
  })}</div>;
  const [verified, unresolved] = collections;

  return <main className="site-shell dossier-shell">
    <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
    <section className="hero hero-detail">
      <div className="hero-detail-copy"><p className="eyebrow">深度研究 · 公開命題證據</p><h1>{displayTitle}</h1><p className="lede">更新於 {topic.lastUpdated}。先看事情如何發展，再分辨哪些資訊已確認、各方怎麼說，以及哪些問題仍待釐清。</p></div>
      <aside className="dossier-meta"><p>公開來源</p><strong>{String(publicSources.length).padStart(2, "0")}</strong><span>筆可核對來源</span></aside>
    </section>
    <nav className="article-nav" aria-label="本頁閱讀導覽"><span>本頁導覽</span><div>{timelineGroups.length > 0 && <a href="#progress">事件進展</a>}<a href="#claims">已知資訊</a>{attributedSpeakerGroups.length > 0 && <a href="#reports">各方怎麼說</a>}{stanceMapAvailable && <a href="#stance-map">立場圖</a>}{analysisClaims.length > 0 && <a href="#analysis">我們怎麼理解</a>}{editorialPositions.length > 0 && <a href="#positions">我們主張什麼</a>}{unresolved.claims.length > 0 && <a href="#questions">仍待釐清</a>}<a href="#sources">資料來源</a></div></nav>
    {timelineGroups.length > 0 && <section className="event-progress-section" id="progress" aria-label="事件進展">
      <div className="section-intro"><p className="eyebrow">事件進展</p><p>預設顯示最近一週（以最新事件為基準）；較早進度仍保留在下方。</p></div>
      {recentTimelineGroups.length > 0 && renderTimelineGroups(recentTimelineGroups, "recent")}
      {olderTimelineGroups.length > 0 && <details className="event-history-disclosure">
        <summary>{`展開較早的 ${olderTimelineGroups.length} 個日期`}</summary>
        {renderTimelineGroups(olderTimelineGroups, "history")}
      </details>}
    </section>}
    <EvidenceSection collection={verified} sourceLinks={sourceLinks} />
    {attributedSpeakerGroups.length > 0 && <AttributedEvidenceSection groups={attributedSpeakerGroups} sourceLinks={sourceLinks} />}
    {stanceMapAvailable && <StanceMap groups={attributedSpeakerGroups} sourceLinks={sourceLinks} />}
    {analysisClaims.length > 0 && <EditorialSection id="analysis" eyebrow="我們怎麼理解" claims={analysisClaims} sourceLinks={sourceLinks} />}
    {editorialPositions.length > 0 && <EditorialSection id="positions" eyebrow="我們主張什麼" claims={editorialPositions} sourceLinks={sourceLinks} />}
    {unresolved.claims.length > 0 && <EvidenceSection collection={unresolved} sourceLinks={sourceLinks} />}
    {socialObservations.length > 0 && <aside className="social-observation-note" aria-label="社群反應樣本"><div><p className="eyebrow">社群反應樣本</p><strong>樣本數 N = {socialSampleSize}</strong><p>非隨機樣本，不能代表民意或事件真相。</p></div><ol>{socialObservations.map((observation, index) => <li key={index}><span>樣本 {String.fromCharCode(65 + index)}</span><p>{observation.summary}</p></li>)}</ol></aside>}
    <SourcesDisclosure sourceCount={publicSources.length}>
      <section className="sources-section" aria-label="資料與來源">
        <ol className="source-list">{publicSources.map((source, index) => { const number = String(index + 1).padStart(2, "0"); const hasCalendarDate = /^\d{4}-\d{2}(?:-\d{2})?$/.test(source.publishedAt); return <li id={source.publicRef} data-source-ref={source.publicRef} tabIndex={-1} key={source.publicRef}><span>{number}</span><div><a className="source-title" href={source.canonicalUrl} target="_blank" rel="noreferrer">{source.title} <b aria-hidden="true">↗</b></a><p className="source-meta"><span>{source.publisher}</span><i />{hasCalendarDate ? <time dateTime={source.publishedAt}>{source.publishedAt}</time> : <span>{source.publishedAt}</span>}</p></div></li>; })}</ol>
      </section>
    </SourcesDisclosure>
    <section className="next-topic"><div><p className="eyebrow">繼續閱讀</p><h2>繼續探索其他議題。</h2></div><SiteLink href="/">回到議題索引 <span>→</span></SiteLink></section>
    <AiAutomationDisclaimer />
    <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
  </main>;
}
