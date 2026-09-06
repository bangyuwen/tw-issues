import SiteLink from "./site-link";
import { eventDateLabel, type DossierPageModel } from "./dossier-page-model";
import type { PublicClaim, PublicSpeaker } from "./topic-data";
import { ezwayCitations, ezwaySlug, findEzwayAssignment, type ReadingAssignment } from "./ezway-reading-map";
import EzwaySourceDisclosure from "./ezway-source-disclosure";

type ReadingRecord = { claim: PublicClaim; assignment: ReadingAssignment };
const statusLabels = { verified: "已確認", attributed: "具名說法", unresolved: "仍待釐清" };

// An unmapped input keeps the existing dossier renderer. Do not infer a new
// grouping, drop new material, or manufacture an identity from an array index.
export function buildEzwayReadingModel(model: DossierPageModel) {
  if (model.topic?.slug !== ezwaySlug || model.topicId !== model.topic.topicId) return undefined;
  if (model.contextOverview || model.primaryDocument || model.administrationActions.length || model.proceedingTracks.length
    || model.publicPeople.length || model.politicalNarratives.length || model.analysisClaims?.length
    || model.editorialPositions?.length || model.socialObservations.length || model.coverageLimits.length || model.attributedReports.length) return undefined;
  const records: ReadingRecord[] = [];
  const add = (claim: PublicClaim, kind: ReadingAssignment["kind"], speaker?: PublicSpeaker, eventKey?: string) => {
    const assignment = findEzwayAssignment(claim, kind, speaker, eventKey);
    if (!assignment || records.some(record => record.assignment.key === assignment.key)) return false;
    records.push({ claim, assignment });
    return true;
  };
  for (const collection of model.collections) {
    for (const claim of collection.claims) if (!add(claim, collection.id === "claims" ? "verified" : "unresolved")) return undefined;
  }
  for (const group of model.attributedSpeakerGroups) {
    for (const claim of group.claims) if (!add(claim, "attributed", group.speaker)) return undefined;
  }
  for (const group of model.timelineGroups) {
    for (const event of group.events) {
      if (event.commentary) return undefined;
      for (const item of event.items) if (!add(item, item.status, undefined, event.publicKey)) return undefined;
    }
  }
  return { records, occurrences: ezwayCitations.filter(entry => records.some(record => record.assignment.key === entry.surfaceKey)) };
}

export default function EzwayDossier({ model, reading }: { model: DossierPageModel; reading: NonNullable<ReturnType<typeof buildEzwayReadingModel>> }) {
  const { topic, displayTitle, publicSources } = model;
  if (!topic) throw new Error("EZ WAY topic metadata is required");
  const byKey = new Map(reading.records.map(record => [record.assignment.key, record]));
  const scope = ["scope", "identity", "effective-date"].flatMap(key => byKey.has(key) ? [byKey.get(key)!] : []);
  const process = ["process", "checks", "registration"].flatMap(key => byKey.has(key) ? [byKey.get(key)!] : []);
  const questions = reading.records.filter(record => record.assignment.ownerDestination === "#questions");
  const speakerGroups = model.attributedSpeakerGroups.filter(group => group.claims.length > 0);
  const events = model.timelineGroups.flatMap(group => group.events);
  const sections = [
    { id: "claims", label: "這是什麼、適用哪些情況？", present: scope.length > 0 },
    { id: "ezway-process", label: "公開流程與核對方式是什麼？", present: process.length > 0 },
    { id: "reports", label: "業者與主管機關怎麼說？", present: speakerGroups.length > 0 },
    { id: "progress", label: "制度在何時調整？", present: events.length > 0 },
    { id: "questions", label: "哪些事需要個別確認？", present: questions.length > 0 },
    { id: "sources", label: "到哪裡核對來源？", present: publicSources.length > 0 },
  ].filter(section => section.present);

  const recordBody = ({ claim, assignment }: ReadingRecord, reference = false) => {
    const related = assignment.relatedKey ? byKey.get(assignment.relatedKey) : undefined;
    return <article className="ezway-record" id={`ezway-record-${assignment.key}`} tabIndex={-1} key={assignment.key}>
      <p className={`ezway-status ezway-status--${assignment.kind}`}>{statusLabels[assignment.kind]}</p>
      {reference && related ? <p className="ezway-statement"><a href={`#ezway-record-${related.assignment.key}`}>{assignment.label}：查看完整適用條件與說明</a></p> : <p className="ezway-statement">{claim.statement}</p>}
      {claim.speakers?.length ? <p>說法歸屬：{claim.speakers.map(speaker => `${speaker.name}・${speaker.role}`).join("、")}</p> : null}
      <dl className="ezway-boundary"><div><dt>這能確認</dt><dd>{claim.proofScope}</dd></div><div><dt>這不能證明</dt><dd><ul>{claim.limitations.map(limit => <li key={limit}>{limit}</li>)}</ul></dd></div></dl>
      <div className="ezway-citations" aria-label={`${assignment.label}的來源`}>{reading.occurrences.filter(entry => entry.surfaceKey === assignment.key).map(entry => {
        const source = claim.sources.find(source => source.publicRef === entry.sourceRef)!;
        return <span className="ezway-citation" id={entry.anchorId} tabIndex={-1} key={entry.anchorId}>
          <a href={source.canonicalUrl} target="_blank" rel="noreferrer" aria-label={`${source.publisher}：${source.title}（${source.publishedAt}，另開新分頁）`}>{source.publisher}：{source.title} ↗</a>
          <a href={`#${source.publicRef}`} data-citation-inspect={entry.anchorId} aria-label={`本頁來源：${source.title}（${assignment.label}）`}>本頁來源</a>
        </span>;
      })}</div>
    </article>;
  };

  return <main className="site-shell dossier-shell dossier-shell--ezway">
    <a className="skip-link" href="#main-content">跳至主要內容</a>
    <header className="topbar topbar-detail"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><SiteLink className="back-link" href="/">← 議題索引</SiteLink></header>
    <section id="main-content" tabIndex={-1} className="hero hero-detail">
      <div className="hero-detail-copy"><p className="eyebrow">議題導讀</p><h1>{displayTitle}</h1><p className="lede">本頁整理預先委任的適用範圍、公開流程、各方說明與個案限制。</p><p>頁面更新 <time dateTime={topic.lastUpdated}>{topic.lastUpdated}</time></p></div>
      {publicSources.length > 0 && <aside className="dossier-meta"><a href="#sources">核對資料與來源</a><p>來源數量僅供索引，不代表完整性或可信度。</p></aside>}
    </section>
    <nav className="ezway-contents" id="issue-contents" tabIndex={-1} aria-label="本頁閱讀導覽"><h2>本頁目錄</h2><ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol></nav>
    {scope.length > 0 && <section className="ezway-section" id="claims" tabIndex={-1} aria-labelledby="ezway-scope-title"><h2 id="ezway-scope-title">這是什麼、適用哪些情況？</h2>{scope.map(record => recordBody(record))}</section>}
    {process.length > 0 && <section className="ezway-section" id="ezway-process" tabIndex={-1} aria-labelledby="ezway-process-title"><h2 id="ezway-process-title">公開流程與核對方式是什麼？</h2>{process.map(record => recordBody(record))}</section>}
    {speakerGroups.length > 0 && <section className="ezway-section" id="reports" tabIndex={-1} aria-labelledby="ezway-reports-title"><h2 id="ezway-reports-title">業者與主管機關怎麼說？</h2><p>不同主體怎麼說：以下保留具名說法，不能直接視為已確認結論。</p>{speakerGroups.map(group => <section className="ezway-speaker" key={group.speaker.name}><h3>{group.speaker.name}</h3><p>{group.speaker.role}</p>{group.stanceSummary && <p>{group.stanceSummary}</p>}{group.claims.map(claim => recordBody(reading.records.find(record => record.claim === claim)!))}</section>)}</section>}
    {events.length > 0 && <section className="ezway-section" id="progress" tabIndex={-1} aria-labelledby="ezway-progress-title"><h2 id="ezway-progress-title">制度在何時調整？</h2>{events.map(event => <section className="ezway-event" key={event.publicKey}><h3>{event.headline}</h3><p>事件日期 <time dateTime={event.occurredAt}>{eventDateLabel(event)}</time> · {event.kindLabel}</p>{event.reportedAt && <p>報導／公告日期 <time dateTime={event.reportedAt}>{event.reportedAt}</time></p>}{event.items.map(item => recordBody(reading.records.find(record => record.claim === item)!, true))}</section>)}</section>}
    {questions.length > 0 && <section className="ezway-section" id="questions" tabIndex={-1} aria-labelledby="ezway-questions-title"><h2 id="ezway-questions-title">哪些事需要個別確認？</h2>{questions.map(record => recordBody(record))}</section>}
    {publicSources.length > 0 && <EzwaySourceDisclosure sourceCount={publicSources.length} occurrences={reading.occurrences}>
      <section className="sources-section" aria-label="資料與來源"><ol className="source-list">{publicSources.map((source, index) => <li id={source.publicRef} data-source-ref={source.publicRef} tabIndex={-1} key={source.publicRef}><span>{String(index + 1).padStart(2, "0")}</span><div><a className="source-title" href={source.canonicalUrl} target="_blank" rel="noreferrer">{source.title} ↗</a><p className="source-meta">{source.publisher} · {/^\d{4}-\d{2}(?:-\d{2})?$/.test(source.publishedAt) ? <time dateTime={source.publishedAt}>{source.publishedAt}</time> : <span>{source.publishedAt}</span>}</p><div className="ezway-source-returns">{reading.occurrences.filter(entry => entry.sourceRef === source.publicRef).map(entry => <a href={`#${entry.anchorId}`} key={entry.anchorId}>{entry.returnLabel}</a>)}<a href="#issue-contents">回到本頁目錄</a></div></div></li>)}</ol></section>
    </EzwaySourceDisclosure>}
    <section className="next-topic"><div><p className="eyebrow">繼續閱讀</p><h2>繼續探索其他議題。</h2></div><SiteLink href="/">回到議題索引 <span>→</span></SiteLink></section>
    <aside className="ai-automation-disclaimer" role="note" aria-label="AI 自動製作說明"><strong>AI 自動製作說明</strong><p>本頁由 AI 自動整理與產生，可能仍有錯漏。請以頁面列出的原始資料與來源連結為準。</p></aside>
    <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
  </main>;
}
