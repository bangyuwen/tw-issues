import SiteLink from "./site-link";
import type { ReactNode } from "react";
import type { ContextOverview, DeepResearchTopic, PoliticalNarrative, ProceedingTrack, PublicClaim, PublicPersonProfile } from "./topic-data";
import type { ClaimCollectionModel, DossierPageModel, TimelineGroup, TimelinePhaseModel } from "./dossier-page-model";
import SourcesDisclosure from "./topics/[slug]/source-disclosure";
import EventDisclosure from "./event-disclosure";

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

function ClaimCollection({ collection, sourceLinks }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode }) {
  const directLimit = collection.kind === "open" ? collection.claims.length : 4;
  const direct = collection.claims.slice(0, directLimit);
  const remainder = collection.claims.slice(directLimit);
  const rows = (claims: typeof collection.claims, offset: number, zone: "direct" | "remainder") => <div className={`evidence-claim-list evidence-claim-list--${collection.kind}`}>{claims.map((claim, index) => <div data-claim-zone={zone} key={`${collection.id}-${index + offset}`}><EventDisclosure className={`evidence-claim-row evidence-claim-row--${collection.kind}`}><summary><span className="evidence-claim-ordinal">{String(index + offset + 1).padStart(2, "0")}</span><span className="evidence-claim-title">{claim.statement}</span><span className="event-disclosure-action" aria-hidden="true">展開資料</span></summary><div className="evidence-claim-body"><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></div></EventDisclosure></div>)}</div>;
  const items = rows;
  return <div className={`claim-collection claim-collection--${collection.kind}`}><div className="claim-direct">{items(direct, 0, "direct")}</div>{remainder.length > 0 && <details className="claim-remainder"><summary>展開其餘 {remainder.length} 項{collection.label}</summary>{items(remainder, directLimit, "remainder")}</details>}</div>;
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

const evidenceCopy = {
  claims: { label: "已知資訊", eyebrow: "可核對命題", aria: "命題追溯", intro: "目前可以核對的命題；每一項仍分開標示證明範圍與限制。" },
  questions: { label: "仍待釐清", eyebrow: "調查中的問題", aria: "仍待釐清", intro: "這些項目已有公開調查或報導脈絡，但尚不能把任何一種解釋寫成根因或責任定論。" },
};

function EvidenceBoardColumn({ collection, sourceLinks }: { collection: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode }) {
  const copy = evidenceCopy[collection.id];
  return <div className={`evidence-board-column evidence-board-column--${collection.kind}`} id={collection.id === "questions" ? "questions" : undefined} role="group" aria-label={copy.aria} data-collection-id={collection.id}><header className="evidence-board-column-heading"><div><p className="eyebrow">{copy.eyebrow}</p><h3>{copy.label}</h3></div><span className="evidence-board-column-count">{collection.claims.length} 項</span></header><p className="evidence-board-column-intro">{copy.intro}</p><ClaimCollection collection={collection} sourceLinks={sourceLinks} /></div>;
}

function EvidenceBoard({ verified, unresolved, sourceLinks }: { verified: ClaimCollectionModel; unresolved: ClaimCollectionModel; sourceLinks: (ids: string[]) => ReactNode }) {
  const hasVerified = verified.claims.length > 0;
  const hasUnresolved = unresolved.claims.length > 0;
  if (!hasVerified && !hasUnresolved) return null;
  if (!hasUnresolved) {
    return <section className="evidence-board evidence-board--known-only" id="claims" aria-label={evidenceCopy.claims.aria}><EvidenceBoardColumn collection={verified} sourceLinks={sourceLinks} /></section>;
  }
  return <section className={`evidence-board evidence-board--with-open${hasVerified ? " evidence-board--split" : " evidence-board--open-only"}`} id="claims" aria-label="已知資訊與仍待釐清"><header className="evidence-board-header"><p className="eyebrow">證據邊界</p><h2>知道哪裡還不知道，<br />比假裝有答案更重要。</h2><p>已知與未決內容放在同一套證據邊界中對照。</p></header><div className="evidence-board-columns">{hasVerified && <EvidenceBoardColumn collection={verified} sourceLinks={sourceLinks} />}<EvidenceBoardColumn collection={unresolved} sourceLinks={sourceLinks} /></div></section>;
}

function AttributedEvidenceSection({ groups, sourceLinks }: { groups: DossierPageModel["attributedSpeakerGroups"]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section" id="reports" aria-label="不同主體怎麼說"><div className="section-intro"><p className="eyebrow">不同主體怎麼說</p><p>依主體整理公開說法；不代表已確認或完整。</p></div><SpeakerGroups groups={groups} sourceLinks={sourceLinks} /></section>;
}

function PeopleSection({ people, sourceLinks }: { people: PublicPersonProfile[]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section people-section" id="people" aria-label="關鍵人物">
    <div className="section-intro"><p className="eyebrow">關鍵人物</p><h2>先看角色，再看立場。</h2><p>人物卡只整理公開身分、涉入關係與可回查資料；沒有直接來源的內容不補寫成個人主張。</p></div>
    <div className="people-grid">{people.map((person) => <article className="person-card" key={person.personId}>
      <header><h3>{person.name}</h3><p>{person.role} · {person.affiliation}</p></header>
      <dl><div><dt>時間／身分</dt><dd>{person.period}</dd></div><div><dt>與本案關係</dt><dd>{person.relationToTopic}</dd></div></dl>
      <p className="person-summary">{person.summary}</p>
      <details><summary>查看證據界線</summary><div className="person-boundary"><p><strong>這能確認</strong>{person.proofScope}</p><p><strong>這不能證明</strong>{person.limitations.join("；")}</p></div></details>
      <div className="citations">{sourceLinks(person.sources.map(({ publicRef }) => publicRef))}</div>
    </article>)}</div>
  </section>;
}

function PoliticalNarrativesSection({ narratives, sourceLinks }: { narratives: PoliticalNarrative[]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section narrative-section" id="narratives" aria-label="政治敘事與擴散">
    <div className="section-intro"><p className="eyebrow">政治敘事與擴散</p><h2>同一座球場，如何成為不同的政治故事？</h2><p>依日期、場合與發言者對照公開敘事；「擴散」只描述可回查的公開傳播，不判定主觀操弄意圖。</p><p className="narrative-disclosure">目前沒有符合原始貼文、作者、日期與封存連結門檻的社群節點，因此本段只呈現可回查的媒體與公開紀錄。</p></div>
    <div className="narrative-matrix" role="list">{narratives.map((narrative) => <article className={`narrative-row narrative-row--${narrative.status}`} key={narrative.publicKey} role="listitem">
      <header><time dateTime={narrative.occurredAt}>{narrative.occurredAt}</time><span>{narrative.arena}</span><strong>{narrative.speaker.name}</strong></header>
      <div><h3>{narrative.headline}</h3>{narrative.frameLabel && <p className="narrative-frame"><strong>框架 · TW Issues 分析</strong>{narrative.frameLabel}</p>}<p>{narrative.statement}</p><p className="narrative-status"><strong>{narrative.status === "analysis" ? "TW Issues 分析" : "具名說法"}</strong>：{narrative.status === "analysis" ? "以下為依公開資料提出的判讀，不是已確認事實。" : "只證明來源記錄此人曾如此表示。"}</p>{narrative.changeFromPrior && <p className="narrative-change"><strong>相較前一階段 · TW Issues 分析</strong>{narrative.changeFromPrior}</p>}<dl><div><dt>這能確認</dt><dd>{narrative.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{narrative.limitations.join("；")}</dd></div></dl>{narrative.amplification && narrative.amplification.length > 0 && <div className="narrative-amplification"><strong>可回查擴散</strong>{narrative.amplification.map((item) => <p key={`${item.channel}-${item.publishedAt}`}>{item.channel}（{item.publishedAt}）：{item.description} <span className="citations">{sourceLinks(item.sources.map(({ publicRef }) => publicRef))}</span></p>)}</div>}<div className="citations">{sourceLinks(narrative.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>
  </section>;
}

function ContextOverviewSection({ overview, sourceLinks, fallbackPhases, availableSections }: {
  overview: ContextOverview;
  sourceLinks: (ids: string[]) => ReactNode;
  fallbackPhases: ContextOverview["phases"];
  availableSections: { timeline: boolean; proceedings: boolean; narratives: boolean; questions: boolean };
}) {
  const caseMapQuestions = [
    ...(availableSections.timeline ? [{ href: "#progress", label: "事情怎麼發生？" }] : []),
    { href: "#responsibility-lines", label: "屬於哪條責任線？" },
    ...(availableSections.proceedings ? [{ href: "#proceedings", label: "各程序結論了什麼？" }] : []),
    ...(availableSections.narratives ? [{ href: "#narratives", label: "政治框架怎麼變？" }] : []),
    ...(availableSections.questions ? [{ href: "#questions", label: "還有哪些事沒答案？" }] : []),
  ];
  return <section className="context-overview" id="context" aria-label="脈絡總覽">
    <header className="context-overview-heading"><p className="eyebrow">先把問題拆開</p><h2>{overview.headline}</h2><p>{overview.summary}</p></header>
    <nav className="case-map-nav" aria-label="案情問題導覽">
      <span>從 {caseMapQuestions.length} 個問題進入</span>
      {caseMapQuestions.map(({ href, label }, index) => <a href={href} key={href}><b>{String(index + 1).padStart(2, "0")}</b>{label}</a>)}
    </nav>
    <div className="context-lanes" id="responsibility-lines" aria-label="責任與狀態分線">{overview.lanes.map((lane) => <article className={`context-lane context-lane--${lane.kind}`} key={lane.kind}>
      <p>{lane.label}</p><h3>{lane.finding}</h3><details><summary>證據界線</summary><p>{lane.proofScope}</p></details><div className="citations">{sourceLinks(lane.sources.map(({ publicRef }) => publicRef))}</div>
    </article>)}</div>
    {fallbackPhases.length > 0 && <div className="context-phases" aria-label="其他事件階段">{fallbackPhases.map((phase, index) => <article className="context-phase" key={`${phase.period}-${phase.title}`}>
      <div className="context-phase-index"><span>{String(index + 1).padStart(2, "0")}</span><time>{phase.period}</time></div>
      <div><h3>{phase.title}</h3><p>{phase.summary}</p><p className="context-turning-point"><strong>轉折 · TW Issues 分析</strong>{phase.turningPoint}</p><div className="citations">{sourceLinks(phase.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>}
  </section>;
}

type TimelineTargetAvailability = Record<keyof typeof eventStatusCopy, boolean>;

function TimelineGroups({ groups, sourceLinks, targetAvailability }: {
  groups: TimelineGroup[];
  sourceLinks: (ids: string[]) => ReactNode;
  targetAvailability: TimelineTargetAvailability;
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
          <div className="event-disclosure-body">{event.items.map((item, index) => <article className={`event-item event-item--${item.status}`} key={`${event.publicKey}-${index}`}><header><span>{eventStatusCopy[item.status].label}</span>{targetAvailability[item.status] && <a href={eventStatusCopy[item.status].target}>查看完整分區</a>}</header><h4>{item.statement}</h4>{item.status === "attributed" && item.speakers && <p className="claim-speakers"><strong>說法歸屬</strong>{item.speakers.map((speaker) => speaker.name).join("、")}</p>}<dl><div><dt>這能確認</dt><dd>{item.proofScope}</dd></div><div><dt>這不能證明</dt><dd>{item.limitations.join("；")}</dd></div></dl><div className="citations">{sourceLinks(item.sources.map((itemSource) => itemSource.publicRef))}</div></article>)}
            {event.commentary && <aside className="event-commentary"><p className="eyebrow">怎麼看這個轉折</p><p><strong>意義：</strong>{event.commentary.significance}</p>{event.commentary.changeFromPrior && <p><strong>與前一步的變化：</strong>{event.commentary.changeFromPrior}</p>}<p><strong>這不能證明：</strong>{event.commentary.evidenceBoundary}</p></aside>}
          </div>
        </EventDisclosure>;
      })}</div>
    </section>;
  })}</div>;
}

function ChronologySection({ phases, unphasedGroups, timelineGroups, sourceLinks, targetAvailability }: {
  phases: TimelinePhaseModel[];
  unphasedGroups: TimelineGroup[];
  timelineGroups: TimelineGroup[];
  sourceLinks: (ids: string[]) => ReactNode;
  targetAvailability: TimelineTargetAvailability;
}) {
  if (phases.length === 0) return <section className="event-progress-section" id="progress" aria-label="事件進展"><div className="section-intro"><p className="eyebrow">事件進展</p><h2>事情怎麼走到今天？</h2></div><TimelineGroups groups={timelineGroups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} /></section>;
  return <section className="event-progress-section case-chronology" id="progress" aria-label="分階段事件脈絡">
    <div className="section-intro"><p className="eyebrow">完整脈絡</p><h2>{phases.length} 個階段，串起事件的關鍵轉折。</h2><p>階段摘要與事件時間軸合併呈現；每個「轉折」都是 TW Issues 依公開資料提出的分析，不是司法或行政機關的結論。</p></div>
    <div className="chronology-phases">{phases.map((phase, index) => <section className="chronology-phase" key={`${phase.period}-${phase.title}`}>
      <header className="chronology-phase-heading"><div><span>{String(index + 1).padStart(2, "0")}</span><time>{phase.period}</time></div><div><h3>{phase.title}</h3><p>{phase.summary}</p><p className="chronology-turning-point"><strong>轉折 · TW Issues 分析</strong>{phase.turningPoint}</p><div className="citations">{sourceLinks(phase.sources.map(({ publicRef }) => publicRef))}</div></div></header>
      <TimelineGroups groups={phase.groups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} />
    </section>)}</div>
    {unphasedGroups.length > 0 && <section className="chronology-unphased"><h3>其他事件</h3><TimelineGroups groups={unphasedGroups} sourceLinks={sourceLinks} targetAvailability={targetAvailability} /></section>}
  </section>;
}

function ProceedingTracksSection({ tracks, sourceLinks }: { tracks: ProceedingTrack[]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section proceedings-section" id="proceedings" aria-label="責任與程序結果對照">
    <div className="section-intro"><p className="eyebrow">責任與程序</p><h2>同一爭議，{tracks.length} 個程序各自回答什麼？</h2><p>這裡對照調查主體、問題、結論與效力。某一程序的結果，不能自動覆蓋另一條責任線。</p></div>
    <div className="proceeding-matrix">{tracks.map((track, index) => <article className={`proceeding-row proceeding-row--${track.kind}`} key={`${track.kind}-${track.label}`}>
      <header><span>{String(index + 1).padStart(2, "0")}</span><p>{track.label}</p><strong>{track.status}</strong></header>
      <div className="proceeding-body"><p className="proceeding-actor"><strong>處理主體</strong>{track.body}</p><h3>{track.question}</h3><dl><div><dt>已作成的結論</dt><dd>{track.conclusion}</dd></div><div><dt>程序效果</dt><dd>{track.effect}</dd></div></dl><aside><strong>這個程序沒有回答</strong><ul>{track.doesNotConclude.map((item) => <li key={item}>{item}</li>)}</ul></aside><p className="proceeding-next"><strong>下一個待確認節點</strong>{track.nextStep}</p><div className="citations">{sourceLinks(track.sources.map(({ publicRef }) => publicRef))}</div></div>
    </article>)}</div>
  </section>;
}

function EditorialSection({ id, eyebrow, claims, sourceLinks }: { id: "analysis" | "positions"; eyebrow: string; claims: PublicClaim[]; sourceLinks: (ids: string[]) => ReactNode }) {
  return <section className="evidence-section editorial-section" id={id} aria-label={eyebrow}>
    <div className="section-intro"><p className="eyebrow">{eyebrow}</p><p>以下是 TW Issues 依公開前提提出的判讀或主張，不是已確認事實。</p></div>
    <div className="fact-grid">{claims.map((claim, index) => <article key={`${id}-${index}`}><div className="claim-card-heading"><p>{claim.editorialLabel}</p><span className="fact-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{claim.statement}</h3><dl>{claim.premises && <div><dt>依據前提</dt><dd>{claim.premises.join("；")}</dd></div>}{claim.inference && <div><dt>推論</dt><dd>{claim.inference}</dd></div>}{claim.uncertainty && <div><dt>不確定性</dt><dd>{claim.uncertainty}</dd></div>}{claim.falsifier && <div><dt>什麼會推翻這個判讀</dt><dd>{claim.falsifier}</dd></div>}{claim.consistentStandard && <div><dt>一致標準</dt><dd>{claim.consistentStandard}</dd></div>}</dl><ClaimEvidenceBody claim={claim} sourceLinks={sourceLinks} /></article>)}</div>
  </section>;
}

export default function DossierPage({ model }: { model: DossierPageModel }) {
  const { topic, displayTitle, collections, attributedSpeakerGroups, contextOverview, proceedingTracks = [], publicPeople = [], politicalNarratives = [], analysisClaims = [], editorialPositions = [], socialObservations = [], socialSampleSize, publicSources, sourceById, timelineGroups, timelinePhases, unphasedContextPhases, unphasedTimelineGroups } = model;
  if (!topic || !displayTitle) throw new Error("Dossier page metadata is required");
  const sourceLinks = (sourceIds: string[]) => sourceIds.map((id) => {
    const source = sourceById.get(id);
    return source ? <a className="citation" href={`#${source.publicRef}`} key={source.publicRef} aria-label={`查看來源：${source.publisher}`}><span aria-hidden="true">{source.publisher}</span><span className="citation-tooltip" role="tooltip"><span>{source.publisher} · {source.publishedAt}</span><strong>{source.title}</strong><small>點擊跳至完整來源</small></span></a> : null;
  });
  const [verified, unresolved] = collections;

  return <main className="site-shell dossier-shell">
    <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
    <section className="hero hero-detail">
      <div className="hero-detail-copy"><p className="eyebrow">深度研究 · 公開命題證據</p><h1>{displayTitle}</h1><p className="lede">更新於 {topic.lastUpdated}。先看事情如何發展，再分辨哪些資訊已確認、各方怎麼說，以及哪些問題仍待釐清。</p></div>
      <aside className="dossier-meta"><p>公開來源</p><strong>{String(publicSources.length).padStart(2, "0")}</strong><span>筆可核對來源</span></aside>
    </section>
    <nav className="article-nav" aria-label="本頁閱讀導覽"><span>本頁導覽</span><div>{contextOverview && <a href="#context">案情地圖</a>}{timelineGroups.length > 0 && <a href="#progress">完整脈絡</a>}{proceedingTracks.length > 0 && <a href="#proceedings">責任與程序</a>}{politicalNarratives.length > 0 && <a href="#narratives">政治敘事</a>}{unresolved.claims.length > 0 && <a href="#questions">未決問題</a>}{verified.claims.length > 0 && <a href="#claims">已知資訊</a>}{publicPeople.length > 0 && <a href="#people">人物索引</a>}{attributedSpeakerGroups.length > 0 && <a href="#reports">各方怎麼說</a>}{analysisClaims.length > 0 && <a href="#analysis">我們怎麼理解</a>}{editorialPositions.length > 0 && <a href="#positions">我們主張什麼</a>}<a href="#sources">資料來源</a></div></nav>
    {contextOverview && <ContextOverviewSection
      overview={contextOverview}
      sourceLinks={sourceLinks}
      fallbackPhases={unphasedContextPhases}
      availableSections={{
        timeline: timelineGroups.length > 0,
        proceedings: proceedingTracks.length > 0,
        narratives: politicalNarratives.length > 0,
        questions: unresolved.claims.length > 0,
      }}
    />}
    {timelineGroups.length > 0 && <ChronologySection
      phases={timelinePhases}
      unphasedGroups={unphasedTimelineGroups}
      timelineGroups={timelineGroups}
      sourceLinks={sourceLinks}
      targetAvailability={{
        verified: verified.claims.length > 0,
        attributed: attributedSpeakerGroups.length > 0,
        unresolved: unresolved.claims.length > 0,
      }}
    />}
    {proceedingTracks.length > 0 && <ProceedingTracksSection tracks={proceedingTracks} sourceLinks={sourceLinks} />}
    {politicalNarratives.length > 0 && <PoliticalNarrativesSection narratives={politicalNarratives} sourceLinks={sourceLinks} />}
    <EvidenceBoard verified={verified} unresolved={unresolved} sourceLinks={sourceLinks} />
    {publicPeople.length > 0 && <PeopleSection people={publicPeople} sourceLinks={sourceLinks} />}
    {attributedSpeakerGroups.length > 0 && <AttributedEvidenceSection groups={attributedSpeakerGroups} sourceLinks={sourceLinks} />}
    {analysisClaims.length > 0 && <EditorialSection id="analysis" eyebrow="我們怎麼理解" claims={analysisClaims} sourceLinks={sourceLinks} />}
    {editorialPositions.length > 0 && <EditorialSection id="positions" eyebrow="我們主張什麼" claims={editorialPositions} sourceLinks={sourceLinks} />}
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
