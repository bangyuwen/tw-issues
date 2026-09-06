import SiteLink from "./site-link";
import { buildDossierPageModel, eventDateLabel } from "./dossier-page-model";
import { deepResearchTopics, getPublicEvidenceProjection } from "./topic-data";
import { getEventTimelineAttribution, getEventTimelineHeadline, getTopicDisplayTitle } from "./topic-display";

const eventStatusLabel = {
  verified: "已確認",
  attributed: "具名說法",
  unresolved: "仍待釐清",
} as const;

export function TopicCountMetadata({ verified, attributed, unresolved }: { verified: number; attributed: number; unresolved: number }) {
  const counts = [
    { kind: "verified", label: "已確認", count: verified },
    { kind: "attributed", label: "具名說法", count: attributed },
    { kind: "unresolved", label: "仍待釐清", count: unresolved },
  ].filter(({ count }) => count > 0);
  return <div className="topic-card-meta" aria-label="公開資料類型數量">{counts.length > 0 ? counts.map(({ kind, label, count }) => <span className={`topic-count topic-count--${kind}`} key={kind}>{label} {count}</span>) : <span>公開資料補強中</span>}</div>;
}

export function validPageDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
}

export function sortByPageUpdate<T extends { slug: string; lastUpdated?: string }>(topics: readonly T[]): T[] {
  return [...topics].sort((a, b) => {
    const aDate = validPageDate(a.lastUpdated) ? a.lastUpdated : "";
    const bDate = validPageDate(b.lastUpdated) ? b.lastUpdated : "";
    return bDate.localeCompare(aDate) || a.slug.localeCompare(b.slug);
  });
}

export function PageUpdateDate({ date }: { date?: string }) {
  return validPageDate(date) ? <span>頁面更新 <time dateTime={date}>{date}</time></span> : <span>頁面更新日期未提供</span>;
}

export default function DossierIndexPage() {
  return <main className="site-shell index-shell">
    <header className="topbar"><SiteLink className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></SiteLink><div className="topbar-status"><span>公開閱讀</span><i /> <span>2026</span></div></header>
    <section className="index-hero"><div className="index-hero-copy"><p className="eyebrow">議題索引</p><h1>先認識議題，<br /><em>再沿著來源深入。</em></h1><p className="lede">從全部議題開始閱讀，或查看最近更新的頁面。每頁區分已確認資訊、具名說法與仍待釐清的問題；數量不是完整度，也不是可信度排名。</p></div></section>
    <nav className="index-reading-nav" aria-label="議題索引導覽"><a href="#all-issues">全部議題</a><a href="#recent-updates">最近更新</a></nav>
    <section className="topic-index" id="all-issues" aria-labelledby="all-issues-title">
      <div className="section-heading"><div><p className="eyebrow">開始閱讀</p><h2 id="all-issues-title">全部議題</h2></div></div>
      <div className="topic-cards">{deepResearchTopics.map((topic, index) => <SiteLink className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><p className="topic-tag"><PageUpdateDate date={topic.lastUpdated} /></p><h3>{getTopicDisplayTitle(topic.slug, topic.title)}</h3></div><b aria-hidden="true">↗</b></SiteLink>)}</div>
    </section>
    <section className="topic-index" id="recent-updates" aria-labelledby="recent-updates-title">
      <div className="section-heading"><div><p className="eyebrow">回訪閱讀</p><h2 id="recent-updates-title">最近更新</h2></div><p>依頁面更新日期排序；事件日期另外標示。</p></div>
      <div className="topic-cards">{sortByPageUpdate(deepResearchTopics).map((topic, index) => {
        const projection = getPublicEvidenceProjection(topic.slug);
        const latestEvent = projection ? buildDossierPageModel(projection).latestTimelineEvent : undefined;
        return <article className="topic-card" key={topic.slug}>
          <span>{String(index + 1).padStart(2, "0")}</span><div>
            <p className="topic-tag">{topic.publicEvidenceAvailable ? "公開證據可讀" : "公開資料補強中"} · <PageUpdateDate date={topic.lastUpdated} /></p>
            <h3><SiteLink href={`/topics/${topic.slug}`}>{getTopicDisplayTitle(topic.slug, topic.title)}</SiteLink></h3>
            {latestEvent ? <section className="topic-card-progress" aria-label="最近收錄的公開進展">
              <header><strong>最近收錄</strong><span>事件日期 <time dateTime={latestEvent.occurredAt}>{eventDateLabel(latestEvent)}</time></span></header>
              <div className="topic-card-progress-meta"><span>事件類型 · {latestEvent.kindLabel}</span>{[...new Set(latestEvent.items.map(item => item.status))].map(status => <span className={`topic-card-status topic-card-status--${status}`} key={status}>{eventStatusLabel[status]}</span>)}</div>
              <p>{getEventTimelineAttribution(latestEvent.items)}</p>
              <p>{getEventTimelineHeadline(latestEvent.items.map((item) => item.statement))}</p>
              <details><summary>查看事件的狀態、範圍與來源</summary>{latestEvent.items.map((item, i) => <div className="index-event-boundary" key={i}>
                <strong>{eventStatusLabel[item.status]}</strong><p>{item.statement}</p>
                {item.speakers && <p>說法歸屬：{item.speakers.map((speaker) => `${speaker.name}・${speaker.role}`).join("、")}</p>}
                <p>這能確認：{item.proofScope}</p><ul>{item.limitations.map((limit, j) => <li key={j}>{limit}</li>)}</ul>
                {item.sources.map((source) => <a key={source.publicRef} href={source.canonicalUrl} target="_blank" rel="noreferrer">{source.publisher}：{source.title}（{source.publishedAt}） ↗</a>)}
              </div>)}</details>
            </section> : <p className="topic-card-progress-empty">尚無可安全投影的事件進展；公開資料仍在補強。</p>}
            <TopicCountMetadata verified={projection?.claims.length ?? 0} attributed={projection?.attributedClaims.length ?? 0} unresolved={projection?.openQuestions.length ?? 0} />
          </div><b aria-hidden="true">↗</b>
        </article>;
      })}</div>
    </section>
    <section className="index-note"><div><p className="eyebrow">怎麼閱讀</p><h2>多方說法並列，<br />不等於彼此都成立。</h2></div><p>已確認資訊、具名說法與仍待釐清會分開標示；來源與數量只幫助定位材料，不代表議題完整、可信度相同或結論已成立。</p></section>
    <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
  </main>;
}
