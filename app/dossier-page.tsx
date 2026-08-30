import SiteLink from "./site-link";
import type { ReactNode } from "react";
import type { AdministrationAction, ContextOverview, DeepResearchTopic, PoliticalNarrative, PrimaryDocument, ProceedingTrack, PublicClaim, PublicPersonProfile, PublicSource, SocialObservation } from "./topic-data";
import { getHsinchuDossierChapters, type AttributedReportModel, type ClaimCollectionModel, type CoverageLimitViewModel, type DossierPageModel, type HsinchuChapterDescriptor, type TimelineGroup, type TimelinePhaseModel } from "./dossier-page-model";
import SourcesDisclosure from "./topics/[slug]/source-disclosure";
import EventDisclosure from "./event-disclosure";

const eventStatusCopy = {
  verified: { label: "已確認", target: "#claims" },
  attributed: { label: "具名說法", target: "#reports" },
  unresolved: { label: "仍待釐清", target: "#questions" },
} as const;

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

function nextHeadingLevel(level: HeadingLevel): HeadingLevel {
  return Math.min(level + 1, 6) as HeadingLevel;
}

function Heading({ level, id, children }: { level: HeadingLevel; id?: string; children: ReactNode }) {
  if (level === 2) return <h2 id={id}>{children}</h2>;
  if (level === 3) return <h3 id={id}>{children}</h3>;
  if (level === 4) return <h4 id={id}>{children}</h4>;
  if (level === 5) return <h5 id={id}>{children}</h5>;
  return <h6 id={id}>{children}</h6>;
}

function AiAutomationDisclaimer() {
  return <aside className="ai-automation-disclaimer" role="note" aria-label="AI 自動製作說明">
    <strong>AI 自動製作說明</strong>
    <p>本頁由 AI 自動整理與產生，可能仍有錯漏。請以頁面列出的原始資料與來源連結為準。</p>
  </aside>;
}

export function UnavailableDossierPage({ topic, displayTitle }: { topic: DeepResearchTopic; displayTitle: string }) {
  const isCaseDossier = topic.slug === "hsinchu-baseball-stadium";
  return <main className={`site-shell dossier-shell${isCaseDossier ? " dossier-shell--case" : ""}`}>
      <a className="skip-link" href="#main-content">跳至主要內容</a>
      <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
      <section id="main-content" tabIndex={-1} className="hero hero-detail"><div className="hero-detail-copy"><p className="eyebrow">深度研究 · 公開資料補強中</p><h1>{displayTitle}</h1><p className="lede">本題列入最近更新的深度研究，但公開來源覆蓋尚未完成；現階段不下結論，也不公開研究敘事。</p></div><aside className="dossier-meta"><p>最近更新</p><strong>{topic.lastUpdated.slice(5).replace("-", ".")}</strong><span>研究持續整理</span></aside></section>
      <section className="evidence-section"><div className="section-intro"><p className="eyebrow">公開資料界線</p><h2>先補足來源，<br />再公開命題。</h2><p>研究中不代表任何一方說法成立。待可核對的原始紀錄與獨立來源群組足以支撐具體命題後，本頁才會顯示事實、證明範圍與來源限制。</p></div></section>
      <section className="next-topic"><div><p className="eyebrow">繼續閱讀</p><h2>回到最近更新的研究索引。</h2></div><SiteLink href="/">回到議題索引 <span>→</span></SiteLink></section>
      <AiAutomationDisclaimer />
      <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
    </main>;
}

function ClaimBoundary({ claim }: { claim: PublicClaim & { sampleSize?: number } }) {
  return <section className="claim-boundary" aria-label="可確認範圍與限制"><div className="claim-scope"><strong>這能確認</strong><p>{claim.proofScope}</p></div><div className="claim-limit"><strong>這不能證明</strong><p>{claim.limitations.join("；")}</p></div>{claim.sampleSize !== undefined && <p className="claim-sample"><strong>樣本數</strong>{claim.sampleSize}（N = {claim.sampleSize}）</p>}</section>;
}

function ClaimSources({ claim, sourceLinks }: { claim: PublicClaim; sourceLinks: (ids: string[]) => ReactNode }) {
  return <div className="claim-sources" aria-label="資料來源"><div className="citations">{sourceLinks(claim.sources.map(({ publicRef }) => publicRef))}</div></div>;
}

function ClaimEvidenceBody({ claim, sourceLinks }: { claim: PublicClaim & { sampleSize?: number }; sourceLinks: (ids: string[]) => ReactNode }) {
  return <><ClaimBoundary claim={claim} /><ClaimSources claim={claim} sourceLinks={sourceLinks} /></>;
}

function ClaimCollection({ collection, sourceLinks, exposeBoundary = false }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode; exposeBoundary?: boolean }) {
  const directLimit = collection.kind === "open" ? collection.claims.length : 4;
  const direct = collection.claims.slice(0, directLimit);
  const remainder = collection.claims.slice(directLimit);
  const statusLabel = collection.kind === "open" ? "仍待釐清" : "已知資訊";
  const rows = (claims: typeof collection.claims, offset: number, zone: "direct" | "remainder") => <div className={`evidence-claim-list evidence-claim-list--${collection.kind}`}>{claims.map((claim, index) => {
    const itemIndex = index + offset;
    if (!exposeBoundary) {
      return <div data-claim-zone={zone} key={`${collection.id}-${itemIndex}`}><EventDisclosure className={`evidence-claim-row evidence-claim-row--${collection.kind}`}><summary><span className="evidence-claim-ordinal">{String(itemIndex + 1).padStart(2, "0")}</span><span className="evidence-claim-title">{claim.statement}</span><span className="event-disclosure-action" aria-hidden="true">展開資料</span></summary><div className="evidence-claim-body"><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></div></EventDisclosure></div>;
    }
    return <article className={`evidence-claim-card evidence-claim-card--${collection.kind}`} data-claim-zone={zone} key={`${collection.id}-${itemIndex}`}>
      <header className="evidence-claim-card-heading"><span className="evidence-claim-ordinal">{String(itemIndex + 1).padStart(2, "0")}</span><div><span className="evidence-claim-status">{statusLabel}</span><p className="evidence-claim-title">{claim.statement}</p></div></header>
      <ClaimBoundary claim={claim} />
      <EventDisclosure className={`evidence-claim-row evidence-claim-row--${collection.kind}`}><summary><span>查看資料與來源</span><span className="event-disclosure-action" aria-hidden="true">展開</span></summary><div className="evidence-claim-body"><ClaimSources claim={claim} sourceLinks={sourceLinks} /></div></EventDisclosure>
    </article>;
  })}</div>;
  const items = rows;
  return <div className={`claim-collection claim-collection--${collection.kind}`}><div className="claim-direct">{items(direct, 0, "direct")}</div>{remainder.length > 0 && <details className="claim-remainder"><summary>展開其餘 {remainder.length} 項{collection.label}</summary>{items(remainder, directLimit, "remainder")}</details>}</div>;
}

function SourceDateContext({ sources }: { sources: PublicSource[] }) {
  const dates = Array.from(new Set(sources.map(({ publishedAt }) => publishedAt)));
  if (dates.length === 0) return null;
  return <span className="speaker-statement-date"><span>來源日期：</span>{dates.map((date) => <time dateTime={date} key={date}>{date}</time>)}</span>;
}

function SpeakerGroups({ groups, sourceLinks, showSourceDates = false }: { groups: DossierPageModel["attributedSpeakerGroups"]; sourceLinks: (ids: string[]) => ReactNode; showSourceDates?: boolean }) {
  const offsets = groups.reduce<number[]>((values, group) => [...values, values.at(-1)! + group.claims.length], [0]);
  return <div className="speaker-groups">{groups.map((group, groupIndex) => {
    const groupOffset = offsets[groupIndex];
    const statements = (claims: typeof group.claims, start: number) => <div className="speaker-statement-list">{claims.map((claim, index) => <div data-claim-zone="detail" key={`${group.speaker.name}-${start + index}`}><EventDisclosure className="speaker-statement-row"><summary><span className="speaker-statement-ordinal">{String(start + index + 1).padStart(2, "0")}</span><span className="speaker-statement-title">{claim.statement}</span>{showSourceDates && <SourceDateContext sources={claim.sources} />}<span className="event-disclosure-action" aria-hidden="true">展開資料</span></summary><div className="speaker-statement-body"><dl><div><dt>這能確認</dt><dd>{claim.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{claim.limitations.join("；")}</dd></div></dl><div className="citations">{sourceLinks(claim.sources.map(({ publicRef }) => publicRef))}</div></div></EventDisclosure></div>)}</div>;
    const summary = group.stanceSummary ?? group.claims[0]?.statement ?? "目前沒有可公開的具名說法。";
    const summaryDuplicatesStatement = showSourceDates && group.claims.some(({ statement }) => statement === summary);
    return <section className="speaker-group" key={`${group.speaker.name}-${groupIndex}`}><header><div className="speaker-group-heading"><strong>{group.speaker.name}</strong><span>{group.speaker.role}</span></div>{!summaryDuplicatesStatement && <p className="speaker-group-summary"><span>摘要</span>{summary}</p>}</header><details className="speaker-group-details"><summary>查看 {group.claims.length} 項具名說法</summary>{statements(group.claims, groupOffset)}</details></section>;
  })}</div>;
}

const evidenceCopy = {
  claims: { label: "已知資訊", eyebrow: "可核對命題", aria: "命題追溯", intro: "目前可以核對的命題；每一項仍分開標示證明範圍與限制。" },
  questions: { label: "仍待釐清", eyebrow: "調查中的問題", aria: "仍待釐清", intro: "這些項目已有公開調查或報導脈絡，但尚不能把任何一種解釋寫成根因或責任定論。" },
};

function EvidenceBoardColumn({ collection, sourceLinks, exposeBoundary, headingLevel = 3 }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode; exposeBoundary: boolean; headingLevel?: HeadingLevel }) {
  const copy = evidenceCopy[collection.id];
  return <div className={`evidence-board-column evidence-board-column--${collection.kind}`} id={collection.id === "questions" ? "questions" : undefined} role="group" aria-label={copy.aria} data-collection-id={collection.id}><header className="evidence-board-column-heading"><div><p className="eyebrow">{copy.eyebrow}</p><Heading level={headingLevel}>{copy.label}</Heading></div><span className="evidence-board-column-count">{collection.claims.length} 項</span></header><p className="evidence-board-column-intro">{copy.intro}</p><ClaimCollection collection={collection} sourceLinks={sourceLinks} exposeBoundary={exposeBoundary} /></div>;
}

function EvidenceBoard({ verified, unresolved, sourceLinks, exposeBoundary = false, headingLevel = 2 }: { verified: ClaimCollectionModel; unresolved: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode; exposeBoundary?: boolean; headingLevel?: HeadingLevel }) {
  const hasVerified = verified.claims.length > 0;
  const hasUnresolved = unresolved.claims.length > 0;
  if (!hasVerified && !hasUnresolved) return null;
  if (!hasUnresolved) {
    return <section className="evidence-board evidence-board--known-only" id="claims" aria-label={evidenceCopy.claims.aria}><EvidenceBoardColumn collection={verified} sourceLinks={sourceLinks} exposeBoundary={exposeBoundary} headingLevel={headingLevel === 2 ? 3 : headingLevel} /></section>;
  }
  const columnHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className={`evidence-board evidence-board--with-open${hasVerified ? " evidence-board--split" : " evidence-board--open-only"}`} id="claims" aria-label="已知資訊與仍待釐清"><header className="evidence-board-header"><p className="eyebrow">證據邊界</p><Heading level={headingLevel}>知道哪裡還不知道，<br />比假裝有答案更重要。</Heading><p>已知與未決內容放在同一套證據邊界中對照。</p></header><div className="evidence-board-columns">{hasVerified && <EvidenceBoardColumn collection={verified} sourceLinks={sourceLinks} exposeBoundary={exposeBoundary} headingLevel={columnHeadingLevel} />}<EvidenceBoardColumn collection={unresolved} sourceLinks={sourceLinks} exposeBoundary={exposeBoundary} headingLevel={columnHeadingLevel} /></div></section>;
}

function ProceduralReportRows({ reports, sourceLinks, headingLevel = 3 }: { reports: AttributedReportModel[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const proceduralReports = reports.filter(({ category }) => category === "procedural-report");
  if (proceduralReports.length === 0) return null;
  return <div className="procedural-report-list">{proceduralReports.map(({ claim, speaker, sourceDate }) => <article className="procedural-report-row" key={claim.sources.map(({ publicRef }) => publicRef).join("-")}>
    <header><p className="eyebrow">具名程序報告</p><p className="procedural-report-attribution">{speaker.name} · {speaker.role} · 來源日期：<time dateTime={sourceDate}>{sourceDate}</time></p></header>
    <Heading level={headingLevel}>{claim.statement}</Heading>
    <dl><div><dt>這能確認</dt><dd>{claim.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{claim.limitations.join("；")}</dd></div></dl>
    <div className="citations">{sourceLinks(claim.sources.map(({ publicRef }) => publicRef))}</div>
  </article>)}</div>;
}

function AttributedEvidenceSection({ groups, reports, sourceLinks, showSourceDates = false, headingLevel = 2 }: { groups: DossierPageModel["attributedSpeakerGroups"]; reports: AttributedReportModel[]; sourceLinks: (ids: string[]) => ReactNode; showSourceDates?: boolean; headingLevel?: HeadingLevel }) {
  return <section className="evidence-section" id="reports" aria-label="不同主體怎麼說"><div className="section-intro"><p className="eyebrow">不同主體怎麼說</p><Heading level={headingLevel}>不同主體的公開說法。</Heading><p>{showSourceDates ? "依主體與來源日期整理公開說法；機關名稱不代表不同任期、首長或執政黨的立場相同，也不代表說法已確認或完整。" : "依主體整理公開說法；不代表已確認或完整。"}</p></div><SpeakerGroups groups={groups} sourceLinks={sourceLinks} showSourceDates={showSourceDates} /><ProceduralReportRows reports={reports} sourceLinks={sourceLinks} headingLevel={nextHeadingLevel(headingLevel)} /></section>;
}

function CoverageLimitsSection({ limits, sourceLinks, headingLevel = 2 }: { limits: CoverageLimitViewModel[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  if (limits.length === 0) return null;
  return <section className="coverage-limits" id="coverage-limits" aria-labelledby="coverage-limits-title">
    <div className="coverage-limits-intro"><p className="eyebrow">公開資料界線</p><Heading level={headingLevel} id="coverage-limits-title">這份公開紀錄還缺哪些文件？</Heading><p>以下只列出公開投影已記錄的覆蓋缺口；未取得文件不等於文件不存在，也不構成責任或結果判定。</p></div>
    <ol className="coverage-limits-list">{limits.map((limit, index) => <li className="coverage-limit-row" key={`${limit.gap}-${index}`}>
      <span className="coverage-limit-ordinal">{String(index + 1).padStart(2, "0")}</span>
      <div><p className="coverage-limit-gap">{limit.gap}</p><p className="coverage-limit-reason"><strong>缺口原因</strong>{limit.gapReason}</p><div className="citations" aria-label="覆蓋缺口來源">{sourceLinks(limit.sourceRefs)}</div></div>
    </li>)}</ol>
  </section>;
}

function HsinchuChapter({ chapter, children }: { chapter: HsinchuChapterDescriptor; children: ReactNode }) {
  return <section className={`dossier-chapter dossier-chapter--${chapter.number}`} data-chapter-number={chapter.number} aria-labelledby={`dossier-chapter-${chapter.number}`}>
    <header className="dossier-chapter-heading"><span className="dossier-chapter-number" aria-hidden="true">{chapter.number}</span><h2 id={`dossier-chapter-${chapter.number}`}>{chapter.label}</h2></header>
    <div className="dossier-chapter-content">{children}</div>
    <a className="chapter-return" href="#case-contents">回到本頁目錄</a>
  </section>;
}

function PeopleSection({ people, sourceLinks, headingLevel = 2 }: { people: PublicPersonProfile[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const cardHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className="evidence-section people-section" id="people" aria-label="關鍵人物">
    <div className="section-intro"><p className="eyebrow">關鍵人物</p><Heading level={headingLevel}>先看角色，再看立場。</Heading><p>人物卡只整理公開身分、涉入關係與可回查資料；沒有直接來源的內容不補寫成個人主張。</p></div>
    <div className="people-grid">{people.map((person) => <article className="person-card" key={person.personId}>
      <header><Heading level={cardHeadingLevel}>{person.name}</Heading><p>{person.role} · {person.affiliation}</p></header>
      <dl><div><dt>時間／身分</dt><dd>{person.period}</dd></div><div><dt>與本案關係</dt><dd>{person.relationToTopic}</dd></div></dl>
      <p className="person-summary">{person.summary}</p>
      <details><summary>查看證據界線</summary><div className="person-boundary"><p><strong>這能確認</strong>{person.proofScope}</p><p><strong>這不能證明</strong>{person.limitations.join("；")}</p></div></details>
      <div className="citations">{sourceLinks(person.sources.map(({ publicRef }) => publicRef))}</div>
    </article>)}</div>
  </section>;
}

function PoliticalNarrativesSection({ narratives, sourceLinks, headingLevel = 2 }: { narratives: PoliticalNarrative[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const narrativeHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className="evidence-section narrative-section" id="narratives" aria-label="政治敘事與擴散">
    <div className="section-intro"><p className="eyebrow">政治敘事與擴散</p><Heading level={headingLevel}>同一座球場，如何成為不同的政治故事？</Heading><p>依日期、場合與發言者對照公開敘事；「擴散」只描述可回查的公開傳播，不判定主觀操弄意圖。</p><p className="narrative-disclosure">目前沒有符合原始貼文、作者、日期與封存連結門檻的社群節點，因此本段只呈現可回查的媒體與公開紀錄。</p></div>
    <div className="narrative-matrix" role="list">{narratives.map((narrative) => <article className={`narrative-row narrative-row--${narrative.status}`} key={narrative.publicKey} role="listitem">
      <header><time dateTime={narrative.occurredAt}>{narrative.occurredAt}</time><span>{narrative.arena}</span><strong>{narrative.speaker.name}</strong></header>
      <div><Heading level={narrativeHeadingLevel}>{narrative.headline}</Heading>{narrative.frameLabel && <p className="narrative-frame"><strong>框架 · TW Issues 分析</strong>{narrative.frameLabel}</p>}<p>{narrative.statement}</p><p className="narrative-status"><strong>{narrative.status === "analysis" ? "TW Issues 分析" : "具名說法"}</strong>：{narrative.status === "analysis" ? "以下為依公開資料提出的判讀，不是已確認事實。" : "只證明來源記錄此人曾如此表示。"}</p>{narrative.changeFromPrior && <p className="narrative-change"><strong>相較前一階段 · TW Issues 分析</strong>{narrative.changeFromPrior}</p>}<dl><div><dt>這能確認</dt><dd>{narrative.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{narrative.limitations.join("；")}</dd></div></dl>{narrative.amplification && narrative.amplification.length > 0 && <div className="narrative-amplification"><strong>可回查擴散</strong>{narrative.amplification.map((item) => <p key={`${item.channel}-${item.publishedAt}`}>{item.channel}（{item.publishedAt}）：{item.description} <span className="citations">{sourceLinks(item.sources.map(({ publicRef }) => publicRef))}</span></p>)}</div>}<div className="citations">{sourceLinks(narrative.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>
  </section>;
}

function SocialObservationsSection({ observations, sampleSize, sourceLinks, sourceById, isCaseDossier = false, headingLevel = 2 }: { observations: SocialObservation[]; sampleSize: number; sourceLinks: (ids: string[]) => ReactNode; sourceById: Map<string, PublicSource>; isCaseDossier?: boolean; headingLevel?: HeadingLevel }) {
  const hasKinds = observations.some(({ kind }) => kind !== undefined);
  const groups = hasKinds
    ? [
      { key: "criticism", label: "批評樣本", items: observations.filter(({ kind }) => kind !== "counterpoint") },
      { key: "counterpoint", label: "反向聲音", items: observations.filter(({ kind }) => kind === "counterpoint") },
    ].filter(({ items }) => items.length > 0)
    : [{ key: "observations", label: "公開樣本", items: observations }];

  const groupHeadingLevel = nextHeadingLevel(headingLevel);
  return <aside className="social-observation-note" id="social-observations" aria-label={isCaseDossier ? undefined : "社群反應樣本"} aria-labelledby={isCaseDossier ? "social-observation-title" : undefined}>
    <div className="social-observation-intro">{isCaseDossier ? <><p className="eyebrow">補充樣本</p><Heading level={headingLevel} id="social-observation-title">非代表性社群觀察</Heading></> : <p className="eyebrow">社群反應樣本</p>}<strong>樣本數 N = {sampleSize}</strong><p>以下整理公開貼文與媒體轉述；具備 canonical link 的樣本可回查。非隨機樣本，不能代表民意或事件真相。</p></div>
    <div className="social-observation-groups">{groups.map((group) => <section className="social-observation-group" key={group.key} aria-labelledby={`social-observation-${group.key}`}>
      <Heading level={groupHeadingLevel} id={`social-observation-${group.key}`}>{group.label}</Heading>
      <ol>{group.items.map((observation, index) => {
        const sourceIds = observation.sources && observation.sources.length > 0 ? observation.sources.map(({ publicRef }) => publicRef) : observation.sourceRefs ?? [];
        const resolvedSourceIds = sourceIds.filter((sourceId) => sourceById.has(sourceId));
        const boundary = observation.proofScope || (observation.limitations && observation.limitations.length > 0);
        return <li className="social-observation-item" key={`${group.key}-${index}`}>
          <header><span>樣本 {String.fromCharCode(65 + observations.indexOf(observation))}</span>{observation.sourceTypeLabel && <b>{observation.sourceTypeLabel}</b>}</header>
          <p>{observation.summary}</p>
          {boundary && <details className="social-observation-boundary"><summary>查看證據界線</summary><dl>{observation.proofScope && <div><dt>這能確認</dt><dd>{observation.proofScope}</dd></div>}{observation.limitations && observation.limitations.length > 0 && <div><dt>這不能證明</dt><dd>{observation.limitations.join("；")}</dd></div>}</dl></details>}
          {resolvedSourceIds.length > 0 && <div className="citations" aria-label="社群樣本來源">{sourceLinks(resolvedSourceIds)}</div>}
        </li>;
      })}</ol>
    </section>)}</div>
  </aside>;
}

function ContextOverviewSection({ overview, sourceLinks, fallbackPhases, showQuestionMap, availableSections, headingLevel = 2 }: {
  overview: ContextOverview;
  sourceLinks: (ids: string[]) => ReactNode;
  fallbackPhases: ContextOverview["phases"];
  showQuestionMap: boolean;
  availableSections: { timeline: boolean; administrationActions: boolean; proceedings: boolean; narratives: boolean; questions: boolean };
  headingLevel?: HeadingLevel;
}) {
  const caseMapQuestions = [
    ...(availableSections.timeline ? [{ href: "#progress", label: "事情怎麼發生？" }] : []),
    { href: "#responsibility-lines", label: "屬於哪條責任線？" },
    ...(availableSections.administrationActions ? [{ href: "#administration-actions", label: "市府實際做了什麼？" }] : []),
    ...(availableSections.proceedings ? [{ href: "#proceedings", label: "各程序結論了什麼？" }] : []),
    ...(availableSections.narratives ? [{ href: "#narratives", label: "政治框架怎麼變？" }] : []),
    ...(availableSections.questions ? [{ href: "#questions", label: "還有哪些事沒答案？" }] : []),
  ];
  const itemHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className="context-overview" id="context" aria-label="脈絡總覽">
    <header className="context-overview-heading"><p className="eyebrow">先把問題拆開</p><Heading level={headingLevel}>{overview.headline}</Heading><p>{overview.summary}</p></header>
    {showQuestionMap && <nav className="case-map-nav" aria-label="案情問題導覽">
      <span>從 {caseMapQuestions.length} 個問題進入</span>
      {caseMapQuestions.map(({ href, label }, index) => <a href={href} key={href}><b>{String(index + 1).padStart(2, "0")}</b>{label}</a>)}
    </nav>}
    <div className="context-lanes" id="responsibility-lines" aria-label="責任與狀態分線">{overview.lanes.map((lane) => <article className={`context-lane context-lane--${lane.kind}`} key={lane.kind}>
      <p>{lane.label}</p><Heading level={itemHeadingLevel}>{lane.finding}</Heading><details><summary>證據界線</summary><p>{lane.proofScope}</p></details><div className="citations">{sourceLinks(lane.sources.map(({ publicRef }) => publicRef))}</div>
    </article>)}</div>
    {fallbackPhases.length > 0 && <div className="context-phases" aria-label="其他事件階段">{fallbackPhases.map((phase, index) => <article className="context-phase" key={`${phase.period}-${phase.title}`}>
      <div className="context-phase-index"><span>{String(index + 1).padStart(2, "0")}</span><time>{phase.period}</time></div>
      <div><Heading level={itemHeadingLevel}>{phase.title}</Heading><p>{phase.summary}</p><p className="context-turning-point"><strong>轉折 · TW Issues 分析</strong>{phase.turningPoint}</p><div className="citations">{sourceLinks(phase.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>}
  </section>;
}

type TimelineTargetAvailability = Record<keyof typeof eventStatusCopy, boolean>;

function TimelineGroups({ groups, sourceLinks, targetAvailability, itemHeadingLevel = 4 }: {
  groups: TimelineGroup[];
  sourceLinks: (ids: string[]) => ReactNode;
  targetAvailability: TimelineTargetAvailability;
  itemHeadingLevel?: HeadingLevel;
}) {
  return <div className="event-timeline">{groups.map((group) => {
    const groupStatuses = Array.from(new Set(group.events.flatMap((event) => event.items.map((item) => item.status))));
    const hasMultipleEvents = group.events.length > 1;
    return <section className="event-date-group" data-date-key={group.key} key={group.key}>
      <header className="event-date-heading"><time dateTime={group.key}>{group.label}</time>{hasMultipleEvents && <span className="event-date-multiple-label">同日 {group.events.length} 則</span>}<span className="event-date-statuses">{groupStatuses.map((status) => <span className={`event-status-chip event-status-chip--${status}`} key={status}>{eventStatusCopy[status].label}</span>)}</span></header>
      <div className="event-date-events">{group.events.map((event) => {
        const attribution = event.items.flatMap((item) => item.speakers ?? []).map((speaker) => `${speaker.name}・${speaker.role}`).join("、");
        return <EventDisclosure key={event.publicKey}>
          <summary><span className="event-summary-meta"><span className="event-kind-label">{event.kindLabel}</span></span>{attribution && <span className="event-summary-attribution">{attribution}</span>}<span className="event-summary-title">{event.headline}</span><span className="event-disclosure-action" aria-hidden="true">展開證據</span></summary>
          <div className="event-disclosure-body">{event.items.map((item, index) => <article className={`event-item event-item--${item.status}`} key={`${event.publicKey}-${index}`}><header><span>{eventStatusCopy[item.status].label}</span>{targetAvailability[item.status] && <a href={eventStatusCopy[item.status].target}>查看完整分區</a>}</header><Heading level={itemHeadingLevel}>{item.statement}</Heading>{item.status === "attributed" && item.speakers && <p className="claim-speakers"><strong>說法歸屬</strong>{item.speakers.map((speaker) => speaker.name).join("、")}</p>}<dl><div><dt>這能確認</dt><dd>{item.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{item.limitations.join("；")}</dd></div></dl><div className="citations">{sourceLinks(item.sources.map((itemSource) => itemSource.publicRef))}</div></article>)}
            {event.commentary && <aside className="event-commentary"><p className="eyebrow">怎麼看這個轉折</p><p><strong>意義：</strong>{event.commentary.significance}</p>{event.commentary.changeFromPrior && <p><strong>與前一步的變化：</strong>{event.commentary.changeFromPrior}</p>}<p><strong>這不能證明：</strong>{event.commentary.evidenceBoundary}</p></aside>}
          </div>
        </EventDisclosure>;
      })}</div>
    </section>;
  })}</div>;
}

function ChronologySection({ phases, unphasedGroups, timelineGroups, sourceLinks, targetAvailability, headingLevel = 2 }: {
  phases: TimelinePhaseModel[];
  unphasedGroups: TimelineGroup[];
  timelineGroups: TimelineGroup[];
  sourceLinks: (ids: string[]) => ReactNode;
  targetAvailability: TimelineTargetAvailability;
  headingLevel?: HeadingLevel;
}) {
  if (phases.length === 0) return <section className="event-progress-section" id="progress" aria-label="事件進展"><div className="section-intro"><p className="eyebrow">事件進展</p><Heading level={headingLevel}>事情怎麼走到今天？</Heading></div><TimelineGroups groups={timelineGroups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} itemHeadingLevel={headingLevel === 2 ? 4 : nextHeadingLevel(headingLevel)} /></section>;
  const phaseHeadingLevel = nextHeadingLevel(headingLevel);
  const eventHeadingLevel = nextHeadingLevel(phaseHeadingLevel);
  return <section className="event-progress-section case-chronology" id="progress" aria-label="分階段事件脈絡">
    <div className="section-intro"><p className="eyebrow">完整脈絡</p><Heading level={headingLevel}>{phases.length} 個階段，串起事件的關鍵轉折。</Heading><p>階段摘要與事件時間軸合併呈現；每個「轉折」都是 TW Issues 依公開資料提出的分析，不是司法或行政機關的結論。</p></div>
    <div className="chronology-phases">{phases.map((phase, index) => <section className="chronology-phase" key={`${phase.period}-${phase.title}`}>
      <header className="chronology-phase-heading"><div><span>{String(index + 1).padStart(2, "0")}</span><time>{phase.period}</time></div><div><Heading level={phaseHeadingLevel}>{phase.title}</Heading><p>{phase.summary}</p><p className="chronology-turning-point"><strong>轉折 · TW Issues 分析</strong>{phase.turningPoint}</p><div className="citations">{sourceLinks(phase.sources.map(({ publicRef }) => publicRef))}</div></div></header>
      <TimelineGroups groups={phase.groups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} itemHeadingLevel={eventHeadingLevel} />
    </section>)}</div>
    {unphasedGroups.length > 0 && <section className="chronology-unphased"><Heading level={phaseHeadingLevel}>其他事件</Heading><TimelineGroups groups={unphasedGroups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} itemHeadingLevel={eventHeadingLevel} /></section>}
  </section>;
}

const administrationActionStatusCopy = {
  completed: "已執行",
  ongoing: "進行中",
  mixed: "已執行・結果未定",
} as const;

function AdministrationActionsSection({ actions, sourceLinks, headingLevel = 2 }: { actions: AdministrationAction[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const actionHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className="evidence-section administration-actions-section" id="administration-actions" aria-label="高虹安市府治理行動">
    <div className="section-intro"><p className="eyebrow">治理行動稽核</p><Heading level={headingLevel}>高虹安市府上任後做了什麼？</Heading><p>以下整理任期內市府或所屬機關的可回查行動；「市府做過」不等於高虹安本人親自執行，也不代表行動已經解決爭議。</p></div>
    <aside className="administration-attribution-boundary"><strong>先看執行者</strong><p>卡片逐項標示當時的市長與機關。高虹安停職期間由邱臣遠代理，該段工程與行政作業列為代理市長時期的市府行動。</p></aside>
    <div className="administration-action-matrix">{actions.map((item, index) => <article className={`administration-action-row administration-action-row--${item.status}`} key={item.publicKey}>
      <header><span>{String(index + 1).padStart(2, "0")}</span><time dateTime={item.occurredAt}>{item.period}</time><p>{item.administrationPhase}</p><strong>{administrationActionStatusCopy[item.status]}</strong></header>
      <div className="administration-action-body"><p className="administration-action-actor"><strong>{item.actor.name}</strong><span>{item.actor.role}</span></p><Heading level={actionHeadingLevel}>{item.headline}</Heading><dl><div><dt>採取行動</dt><dd>{item.action}</dd></div><div><dt>可觀察結果</dt><dd>{item.outcome}</dd></div></dl><aside><strong>證據界線</strong><p>{item.proofScope}</p><ul>{item.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></aside><div className="citations">{sourceLinks(item.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>
  </section>;
}

function ProceedingTracksSection({ tracks, sourceLinks, headingLevel = 2 }: { tracks: ProceedingTrack[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const trackHeadingLevel = nextHeadingLevel(headingLevel);
  return <section className="evidence-section proceedings-section" id="proceedings" aria-label="責任與程序結果對照">
    <div className="section-intro"><p className="eyebrow">責任與程序</p><Heading level={headingLevel}>同一爭議，{tracks.length} 個程序各自回答什麼？</Heading><p>這裡對照調查主體、問題、結論與效力。某一程序的結果，不能自動覆蓋另一條責任線。</p></div>
    <div className="proceeding-matrix">{tracks.map((track, index) => <article className={`proceeding-row proceeding-row--${track.kind}`} key={`${track.kind}-${track.label}`}>
      <header><span>{String(index + 1).padStart(2, "0")}</span><p>{track.label}</p><strong>{track.status}</strong></header>
      <div className="proceeding-body"><p className="proceeding-actor"><strong>處理主體</strong>{track.body}</p><Heading level={trackHeadingLevel}>{track.question}</Heading><dl><div><dt>已作成的結論</dt><dd>{track.conclusion}</dd></div><div><dt>程序效果</dt><dd>{track.effect}</dd></div></dl><aside><strong>這個程序沒有回答</strong><ul>{track.doesNotConclude.map((item) => <li key={item}>{item}</li>)}</ul></aside><p className="proceeding-next"><strong>下一個待確認節點</strong>{track.nextStep}</p><div className="citations">{sourceLinks(track.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>
  </section>;
}

function EditorialSection({ id, eyebrow, heading, claims, sourceLinks, headingLevel = 2 }: { id: "analysis" | "positions"; eyebrow: string; heading?: string; claims: PublicClaim[]; sourceLinks: (ids: string[]) => ReactNode; headingLevel?: HeadingLevel }) {
  const claimHeadingLevel = heading ? nextHeadingLevel(headingLevel) : 3;
  return <section className="evidence-section editorial-section" id={id} aria-label={eyebrow}>
    <div className="section-intro"><p className="eyebrow">{eyebrow}</p>{heading && <Heading level={headingLevel}>{heading}</Heading>}<p>以下是 TW Issues 依公開前提提出的判讀或主張，不是已確認事實。</p></div>
    <div className="fact-grid">{claims.map((claim, index) => <article key={`${id}-${index}`}><div className="claim-card-heading"><p>{claim.editorialLabel}</p><span className="fact-number">{String(index + 1).padStart(2, "0")}</span></div><Heading level={claimHeadingLevel}>{claim.statement}</Heading><dl>{claim.premises && <div><dt>依據前提</dt><dd>{claim.premises.join("；")}</dd></div>}{claim.inference && <div><dt>推論</dt><dd>{claim.inference}</dd></div>}{claim.uncertainty && <div><dt>不確定性</dt><dd>{claim.uncertainty}</dd></div>}{claim.falsifier && <div><dt>什麼會推翻這個判讀</dt><dd>{claim.falsifier}</dd></div>}{claim.consistentStandard && <div><dt>一致標準</dt><dd>{claim.consistentStandard}</dd></div>}</dl><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></article>)}</div>
  </section>;
}

function CaseReadingLegend() {
  return <section className="case-reading-legend" aria-labelledby="case-reading-legend-title">
    <div className="case-reading-legend-intro"><p className="eyebrow">閱讀圖例</p><h2 id="case-reading-legend-title">先辨認資料的狀態。</h2></div>
    <ul>
      <li className="case-reading-legend-item case-reading-legend-item--verified"><span aria-hidden="true" /><div><strong>已確認</strong><p>目前可以核對的命題。</p></div></li>
      <li className="case-reading-legend-item case-reading-legend-item--attributed"><span aria-hidden="true" /><div><strong>具名說法</strong><p>只證明來源記錄此人曾如此表示。</p></div></li>
      <li className="case-reading-legend-item case-reading-legend-item--unresolved"><span aria-hidden="true" /><div><strong>仍待釐清</strong><p>尚不能把任何一種解釋寫成根因或責任定論。</p></div></li>
      <li className="case-reading-legend-item case-reading-legend-item--analysis"><span aria-hidden="true" /><div><strong>TW Issues 分析</strong><p>以下為依公開資料提出的判讀，不是已確認事實。</p></div></li>
    </ul>
  </section>;
}

function PrimaryDocumentGateway({ document }: { document: PrimaryDocument }) {
  return <section className="primary-document primary-document-gateway" id="primary-document" aria-labelledby="primary-document-title">
    <header className="primary-document-heading">
      <p className="eyebrow">核心文件</p>
      <h2 id="primary-document-title">{document.title}</h2>
      <aside className="primary-document-warning" role="note" aria-label="來源與文書本別警示">
        <strong>閱讀警示</strong>
        <p>{document.warning}</p>
        <p className="primary-document-copy-boundary">「具印文」只描述影像可見外觀；不能僅由印文判定持有人紙本為正本或副本。</p>
      </aside>
      <p className="primary-document-intro">這批可見文件頁面是本頁整理與核對不起訴理由的第一依據；影像呈現具紅色騎縫印文的文件頁面原貌，{document.source.publisher} 只作為第三方社群公開管道。以下只整理可見頁面、核對過的摘錄與不能外推的界線。</p>
      <dl className="primary-document-source-meta" aria-label="文件來源與擷取資訊">
        <div><dt>公開來源：</dt><dd>{document.source.publisher}</dd></div>
        <div><dt>發布：</dt><dd><time dateTime={document.source.publishedAt}>{document.source.publishedAt}</time></dd></div>
        <div><dt>擷取：</dt><dd><time dateTime={document.capturedAt}>{document.capturedAt}</time></dd></div>
      </dl>
    </header>

    <section className="primary-document-panel primary-document-coverage" aria-labelledby="primary-document-coverage-title">
      <h3 id="primary-document-coverage-title">目前看得到哪些頁？</h3>
      <dl>
        <div><dt>可見範圍</dt><dd>文件第 {document.coverage.firstObservedPage}–{document.coverage.lastObservedPage} 頁</dd></div>
        <div><dt>前段缺頁</dt><dd>{document.coverage.missingBefore}</dd></div>
        <div><dt>後段缺頁</dt><dd>{document.coverage.missingAfter}</dd></div>
        <div><dt>遮蔽狀態</dt><dd>{document.coverage.redactionStatus}</dd></div>
      </dl>
      <div className="primary-document-actions" aria-label="核心文件查驗路徑">
        <a href={document.source.canonicalUrl} target="_blank" rel="noreferrer">開啟原始 Threads 貼文 <span aria-hidden="true">↗</span></a>
        <a href={"#" + document.source.publicRef}>查看來源登錄</a>
        <a href="#primary-document-reading">閱讀文件頁段導讀</a>
      </div>
    </section>
  </section>;
}

function PrimaryDocumentReadingSection({ document }: { document: PrimaryDocument }) {
  const documentLayerLabel = document.excerpts[0]?.label ?? "具印文頁面可見文字｜第三方公開";
  return <section className="primary-document primary-document-reading" id="primary-document-reading" aria-labelledby="primary-document-reading-title" aria-describedby="primary-document-reading-boundary">
    <header className="primary-document-heading primary-document-reading-heading">
      <p className="eyebrow">文件頁段導讀</p>
      <h3 id="primary-document-reading-title">如何閱讀這份部分文件</h3>
      <p className="primary-document-reading-intro" id="primary-document-reading-boundary">本段只整理頁段結構、核對摘錄與解讀界線；來源身分與可見頁面範圍由上方核心文件說明統一界定。</p>
      <a className="primary-document-reading-source-link" href="#primary-document">回看核心文件來源與可見頁面範圍</a>
    </header>

    <section className="primary-document-panel" aria-labelledby="primary-document-guide-title">
      <h4 id="primary-document-guide-title">先分辨文件每一段在做什麼</h4>
      <ol className="primary-document-guide">{document.guide.map((entry) => <li data-document-layer={entry.layer} key={`${entry.pageRange}-${entry.label}`}>
        <span>{entry.pageRange}</span><div><strong>{entry.label}</strong><p>{entry.summary}</p></div>
      </li>)}</ol>
    </section>

    <section className="primary-document-panel primary-document-layer-group" aria-labelledby="primary-document-layers-title">
      <h4 id="primary-document-layers-title">三個資訊層次，不能互相替代</h4>
      <ol className="primary-document-layer-list">
        <li className="primary-document-layer-item primary-document-layer-item--document">
          <section className="primary-document-layer primary-document-layer--document" aria-labelledby="primary-document-document-layer-title">
            <header className="primary-document-layer-heading">
              <span>內容層次 1／3</span>
              <h5 id="primary-document-document-layer-title">{documentLayerLabel}</h5>
            </header>
            <h6 className="primary-document-excerpt-list-title" id="primary-document-excerpt-title">核對過的關鍵摘錄</h6>
            <div className="primary-document-excerpts">{document.excerpts.map((excerpt) => <article className="primary-document-excerpt" aria-label={"文件第 " + excerpt.documentPage + " 頁核對摘錄"} key={excerpt.documentPage}>
              <header className="primary-document-excerpt-heading"><strong>{"文件第 " + excerpt.documentPage + " 頁"}</strong></header>
              <blockquote>{excerpt.text}</blockquote>
              <dl className="primary-document-excerpt-boundaries">
                <div className="primary-document-boundary-row primary-document-boundary-row--review"><dt>核對狀態</dt><dd data-review-status={excerpt.reviewStatus}>已對照具印文頁面影像</dd></div>
                <div className="primary-document-boundary-row"><dt>這能確認</dt><dd>{excerpt.proofScope}</dd></div>
                <div className="primary-document-boundary-row primary-document-boundary-row--limit"><dt>這不能證明</dt><dd><ul>{excerpt.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></dd></div>
              </dl>
            </article>)}</div>
          </section>
        </li>
        <li className="primary-document-layer-item primary-document-layer-item--attributed">
          <section className="primary-document-layer primary-document-layer--attributed" aria-labelledby="primary-document-attribution-title">
            <header className="primary-document-layer-heading">
              <span>內容層次 2／3</span>
              <h5 id="primary-document-attribution-title">{document.posterAttribution.label}</h5>
            </header>
            <p className="primary-document-layer-subject"><strong>{document.posterAttribution.speaker.name}</strong><span>{document.posterAttribution.speaker.role}</span></p>
            <p className="primary-document-layer-summary">{document.posterAttribution.summary}</p>
            <dl className="primary-document-layer-boundaries">
              <div><dt>這能確認</dt><dd>{document.posterAttribution.proofScope}</dd></div>
              <div><dt>限制</dt><dd><ul>{document.posterAttribution.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></dd></div>
            </dl>
          </section>
        </li>
        <li className="primary-document-layer-item primary-document-layer-item--analysis">
          <section className="primary-document-layer primary-document-layer--analysis" aria-labelledby="primary-document-analysis-title">
            <header className="primary-document-layer-heading">
              <span>內容層次 3／3</span>
              <h5 id="primary-document-analysis-title">{document.analysisBoundary.label}</h5>
            </header>
            <p className="primary-document-layer-subject"><strong>把第 18 頁放回正確範圍</strong></p>
            <p className="primary-document-layer-summary">{document.analysisBoundary.summary}</p>
            <dl className="primary-document-layer-boundaries">
              <div><dt>限制</dt><dd><ul>{document.analysisBoundary.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></dd></div>
            </dl>
          </section>
        </li>
      </ol>
    </section>

    <section className="primary-document-non-conclusions" aria-labelledby="primary-document-non-conclusions-title">
      <h4 id="primary-document-non-conclusions-title">這份文件不能直接推出</h4>
      <ul>{document.nonConclusions.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  </section>;
}

function ArticleNavigation({
  isCaseDossier,
  caseChapters,
  contextOverview,
  timelineGroups,
  administrationActions,
  proceedingTracks,
  politicalNarratives,
  unresolved,
  verified,
  publicPeople,
  attributedSpeakerGroups,
  analysisClaims,
  editorialPositions,
}: {
  isCaseDossier: boolean;
  caseChapters: HsinchuChapterDescriptor[];
  contextOverview?: DossierPageModel["contextOverview"];
  timelineGroups: TimelineGroup[];
  administrationActions: AdministrationAction[];
  proceedingTracks: ProceedingTrack[];
  politicalNarratives: PoliticalNarrative[];
  unresolved: ClaimCollectionModel;
  verified: ClaimCollectionModel;
  publicPeople: PublicPersonProfile[];
  attributedSpeakerGroups: DossierPageModel["attributedSpeakerGroups"];
  analysisClaims: PublicClaim[];
  editorialPositions: PublicClaim[];
}) {
  if (isCaseDossier) {
    return <nav id="case-contents" className="article-nav article-nav--case case-toc" aria-label="本頁閱讀導覽">
      <span>本頁目錄</span>
      <ol className="case-toc-list">{caseChapters.map((chapter) => <li className="case-toc-item case-toc-chapter" key={chapter.number}>
        {chapter.href ? <a className="case-toc-chapter-link" href={chapter.href}><b aria-hidden="true">{chapter.number}</b><span>{chapter.label}</span></a> : <div className="case-toc-chapter-heading"><b aria-hidden="true">{chapter.number}</b><span>{chapter.label}</span></div>}
        {chapter.links.length > 0 && <ol className="case-toc-sublist">{chapter.links.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}</ol>}
      </li>)}</ol>
    </nav>;
  }

  const contextLink = contextOverview && <a href="#context">案情地圖</a>;
  const timelineLink = timelineGroups.length > 0 && <a href="#progress">完整脈絡</a>;
  const administrationLink = administrationActions.length > 0 && <a href="#administration-actions">市府行動</a>;
  const proceedingsLink = proceedingTracks.length > 0 && <a href="#proceedings">責任與程序</a>;
  const narrativesLink = politicalNarratives.length > 0 && <a href="#narratives">政治敘事</a>;
  const questionsLink = unresolved.claims.length > 0 && <a href="#questions">未決問題</a>;
  const claimsLink = verified.claims.length > 0 && <a href="#claims">已知資訊</a>;
  const peopleLink = publicPeople.length > 0 && <a href="#people">人物索引</a>;
  const reportsLink = attributedSpeakerGroups.length > 0 && <a href="#reports">各方怎麼說</a>;
  const analysisLink = analysisClaims.length > 0 && <a href="#analysis">我們怎麼理解</a>;
  const positionsLink = editorialPositions.length > 0 && <a href="#positions">我們主張什麼</a>;
  const sourcesLink = <a href="#sources">資料來源</a>;

  return <nav className="article-nav" aria-label="本頁閱讀導覽"><span>本頁導覽</span><div>{contextLink}{timelineLink}{administrationLink}{proceedingsLink}{narrativesLink}{questionsLink}{claimsLink}{peopleLink}{reportsLink}{analysisLink}{positionsLink}{sourcesLink}</div></nav>;
}

export default function DossierPage({ model }: { model: DossierPageModel }) {
  const { topic, displayTitle, collections, attributedSpeakerGroups, attributedReports = [], coverageLimits = [], hsinchuChapters = [], primaryDocument, contextOverview, administrationActions = [], proceedingTracks = [], publicPeople = [], politicalNarratives = [], analysisClaims = [], editorialPositions = [], socialObservations = [], socialSampleSize, publicSources, sourceById, timelineGroups, timelinePhases, unphasedContextPhases, unphasedTimelineGroups } = model;
  if (!topic || !displayTitle) throw new Error("Dossier page metadata is required");
  const isCaseDossier = topic.slug === "hsinchu-baseball-stadium";
  const sourceNumberByRef = new Map(publicSources.map((source, index) => [source.publicRef, String(index + 1).padStart(2, "0")]));
  const sourceLinks = (sourceIds: string[]) => sourceIds.map((id) => {
    const source = sourceById.get(id);
    if (!source) return null;
    const number = sourceNumberByRef.get(source.publicRef) ?? "—";
    return <a className="citation" href={`#${source.publicRef}`} key={source.publicRef} aria-label={`來源 ${number}：${source.publisher}｜${source.title}（${source.publishedAt}）`}><span aria-hidden="true">{source.publisher}</span><span className="citation-tooltip" role="tooltip"><span>{source.publisher} · {source.publishedAt}</span><strong>{source.title}</strong><small>點擊跳至完整來源</small></span></a>;
  });
  const [verified, unresolved] = collections;
  const caseChapters = hsinchuChapters.length > 0 ? hsinchuChapters : getHsinchuDossierChapters(model);
  const primaryDocumentGateway = primaryDocument ? <PrimaryDocumentGateway document={primaryDocument} /> : null;
  const primaryDocumentReadingSection = primaryDocument ? <PrimaryDocumentReadingSection document={primaryDocument} /> : null;
  const contextSection = contextOverview ? <ContextOverviewSection
    overview={contextOverview}
    sourceLinks={sourceLinks}
    fallbackPhases={unphasedContextPhases}
    showQuestionMap={!isCaseDossier}
    availableSections={{
      timeline: timelineGroups.length > 0,
      administrationActions: administrationActions.length > 0,
      proceedings: proceedingTracks.length > 0,
      narratives: politicalNarratives.length > 0,
      questions: unresolved.claims.length > 0,
    }}
    headingLevel={isCaseDossier ? 3 : 2}
  /> : null;
  const chronologySection = timelineGroups.length > 0 ? <ChronologySection
    phases={timelinePhases}
    unphasedGroups={unphasedTimelineGroups}
    timelineGroups={timelineGroups}
    sourceLinks={sourceLinks}
    targetAvailability={{
      verified: verified.claims.length > 0,
      attributed: attributedSpeakerGroups.length > 0,
      unresolved: unresolved.claims.length > 0,
    }}
    headingLevel={isCaseDossier ? 3 : 2}
  /> : null;
  const sectionHeadingLevel: HeadingLevel = isCaseDossier ? 3 : 2;
  const coverageLimitsSection = isCaseDossier && coverageLimits.length > 0
    ? <CoverageLimitsSection limits={coverageLimits} sourceLinks={sourceLinks} headingLevel={3} />
    : null;
  const administrationSection = administrationActions.length > 0 ? <AdministrationActionsSection actions={administrationActions} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const proceedingsSection = proceedingTracks.length > 0 ? <ProceedingTracksSection tracks={proceedingTracks} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const narrativesSection = politicalNarratives.length > 0 ? <PoliticalNarrativesSection narratives={politicalNarratives} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const evidenceSection = <EvidenceBoard verified={verified} unresolved={unresolved} sourceLinks={sourceLinks} exposeBoundary={isCaseDossier} headingLevel={sectionHeadingLevel} />;
  const peopleSection = publicPeople.length > 0 ? <PeopleSection people={publicPeople} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const reportsSection = attributedSpeakerGroups.length > 0 || attributedReports.length > 0 ? <AttributedEvidenceSection groups={attributedSpeakerGroups} reports={attributedReports} sourceLinks={sourceLinks} showSourceDates={isCaseDossier} headingLevel={sectionHeadingLevel} /> : null;
  const analysisSection = analysisClaims.length > 0 ? <EditorialSection id="analysis" eyebrow="我們怎麼理解" heading={isCaseDossier ? "TW Issues 的分析" : undefined} claims={analysisClaims} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const positionsSection = editorialPositions.length > 0 ? <EditorialSection id="positions" eyebrow="我們主張什麼" heading={isCaseDossier ? "TW Issues 的主張" : undefined} claims={editorialPositions} sourceLinks={sourceLinks} headingLevel={sectionHeadingLevel} /> : null;
  const socialSection = socialObservations.length > 0 ? <SocialObservationsSection observations={socialObservations} sampleSize={socialSampleSize} sourceLinks={sourceLinks} sourceById={sourceById} isCaseDossier={isCaseDossier} headingLevel={sectionHeadingLevel} /> : null;

  const sourcesDisclosure = <SourcesDisclosure sourceCount={publicSources.length}>
    <section className="sources-section" aria-label="資料與來源">
      <ol className="source-list">{publicSources.map((source, index) => { const number = String(index + 1).padStart(2, "0"); const hasCalendarDate = /^\d{4}-\d{2}(?:-\d{2})?$/.test(source.publishedAt); return <li id={source.publicRef} data-source-ref={source.publicRef} tabIndex={-1} key={source.publicRef}><span>{number}</span><div><a className="source-title" href={source.canonicalUrl} target="_blank" rel="noreferrer">{source.title} <b aria-hidden="true">↗</b></a><p className="source-meta"><span>{source.publisher}</span><i />{hasCalendarDate ? <time dateTime={source.publishedAt}>{source.publishedAt}</time> : <span>{source.publishedAt}</span>}</p></div></li>; })}</ol>
    </section>
  </SourcesDisclosure>;

  const caseContent = isCaseDossier ? <>
    {caseChapters[0] && <HsinchuChapter chapter={caseChapters[0]}>{primaryDocumentReadingSection}{contextSection}{coverageLimitsSection}</HsinchuChapter>}
    {caseChapters[1] && <HsinchuChapter chapter={caseChapters[1]}>{evidenceSection}</HsinchuChapter>}
    {caseChapters[2] && <HsinchuChapter chapter={caseChapters[2]}>{chronologySection}{administrationSection}{proceedingsSection}</HsinchuChapter>}
    {caseChapters[3] && <HsinchuChapter chapter={caseChapters[3]}>{peopleSection}{reportsSection}{narrativesSection}</HsinchuChapter>}
    {caseChapters[4] && <HsinchuChapter chapter={caseChapters[4]}>{analysisSection}{positionsSection}</HsinchuChapter>}
    {caseChapters[5] && <HsinchuChapter chapter={caseChapters[5]}>{socialSection}{sourcesDisclosure}</HsinchuChapter>}
  </> : <>{contextSection}{chronologySection}{administrationSection}{proceedingsSection}{narrativesSection}{evidenceSection}{peopleSection}{reportsSection}{analysisSection}{positionsSection}{socialSection}</>;

  return <main className={`site-shell dossier-shell${isCaseDossier ? " dossier-shell--case dossier-shell--hsinchu" : ""}`}>
    <a className="skip-link" href="#main-content">跳至主要內容</a>
    <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
    <section id="main-content" tabIndex={-1} className="hero hero-detail">
      <div className="hero-detail-copy"><p className="eyebrow">深度研究 · 公開命題證據</p><h1>{displayTitle}</h1><p className="lede">更新於 {topic.lastUpdated}。{isCaseDossier ? primaryDocument ? "先核對核心文件的來源與可見範圍，再界定案情與證據邊界，並分辨已知與未決、時間與程序、人物說法，以及 TW Issues 的分析。" : "先界定案情與證據邊界，再分辨已知與未決、時間與程序、人物說法，以及 TW Issues 的分析。" : "先看事情如何發展，再分辨哪些資訊已確認、各方怎麼說，以及哪些問題仍待釐清。"}</p></div>
      {isCaseDossier ? <aside className="dossier-meta dossier-meta--case"><p>資料範圍</p><strong>{publicSources.length} 筆</strong><a href="#sources">查看已列來源</a><span>每筆均附 canonical source link；數量是資料索引，不代表完整性</span></aside> : <aside className="dossier-meta"><p>公開來源</p><strong>{String(publicSources.length).padStart(2, "0")}</strong><span>筆可核對來源</span></aside>}
    </section>
    {primaryDocumentGateway}
    {isCaseDossier && <CaseReadingLegend />}
    <ArticleNavigation
      isCaseDossier={isCaseDossier}
      caseChapters={caseChapters}
      contextOverview={contextOverview}
      timelineGroups={timelineGroups}
      administrationActions={administrationActions}
      proceedingTracks={proceedingTracks}
      politicalNarratives={politicalNarratives}
      unresolved={unresolved}
      verified={verified}
      publicPeople={publicPeople}
      attributedSpeakerGroups={attributedSpeakerGroups}
      analysisClaims={analysisClaims}
      editorialPositions={editorialPositions}
    />
    {caseContent}
    {!isCaseDossier && sourcesDisclosure}
    <section className="next-topic"><div><p className="eyebrow">繼續閱讀</p><h2>繼續探索其他議題。</h2></div><SiteLink href="/">回到議題索引 <span>→</span></SiteLink></section>
    <AiAutomationDisclaimer />
    <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
  </main>;
}
