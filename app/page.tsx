import Link from "next/link";
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

export default function DossierIndexPage() {
  const topicEvidence = deepResearchTopics.map((topic) => {
    const projection = getPublicEvidenceProjection(topic.slug);
    const model = projection ? buildDossierPageModel(projection) : undefined;
    const latestEvent = model?.latestTimelineEvent;
    const statements = latestEvent?.items.map((item) => item.statement) ?? [];
    return {
      ...topic,
      projection,
      latestEvent,
      latestDate: latestEvent ? eventDateLabel(latestEvent) : undefined,
      latestStatuses: latestEvent ? Array.from(new Set(latestEvent.items.map((item) => item.status))) : [],
      latestAttribution: latestEvent ? getEventTimelineAttribution(latestEvent.items) : "",
      latestHeadline: statements.length > 0 ? getEventTimelineHeadline(statements) : undefined,
      verifiedCount: projection?.claims.length ?? 0,
      attributedCount: projection?.attributedClaims.length ?? 0,
      openCount: projection?.openQuestions.length ?? 0,
    };
  });

  return <main className="site-shell index-shell">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">T</span> TW <em>Issues</em></Link><div className="topbar-status"><span>公開閱讀</span><i /> <span>2026</span></div></header>
    <section className="index-hero">
      <div className="index-hero-copy"><p className="eyebrow">深度研究索引</p><h1>先看事情怎麼走，<br /><em>再分辨各方怎麼說。</em></h1><p className="lede">每一題先顯示最近收錄的公開進展，再分開呈現已確認資訊、具名說法與仍待釐清的問題。數量不是完整度，也不是可信度排名。</p></div>
    </section>
    <section className="topic-index" aria-label="議題索引">
      <div className="section-heading"><div><p className="eyebrow">最近更新</p><h2>正在累積的深度研究</h2></div><p>先掃描事件進展，再進入議題展開證據與限制</p></div>
      <div className="topic-cards">{topicEvidence.map((topic, index) => {
        return <Link className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p className="topic-tag">{topic.publicEvidenceAvailable ? "公開證據可讀" : "公開資料補強中"} · 更新於 {topic.lastUpdated}</p>
            <h2>{getTopicDisplayTitle(topic.slug, topic.title)}</h2>
            {topic.latestEvent && topic.latestHeadline && topic.latestDate ? <section className="topic-card-progress" aria-label="最近收錄的公開進展">
              <header><strong>最近收錄</strong><time dateTime={topic.latestEvent.occurredAt}>{topic.latestDate}</time></header>
              <div className="topic-card-progress-meta"><span>事件類型 · {topic.latestEvent.kindLabel}</span>{topic.latestStatuses.map((status) => <span className={`topic-card-status topic-card-status--${status}`} key={status}>{eventStatusLabel[status]}</span>)}</div>
              {topic.latestAttribution && <p>{topic.latestAttribution}</p>}
              <h3>{topic.latestHeadline}</h3>
            </section> : <p className="topic-card-progress-empty">尚無可安全投影的事件進展；公開資料仍在補強。</p>}
            <TopicCountMetadata verified={topic.verifiedCount} attributed={topic.attributedCount} unresolved={topic.openCount} />
          </div>
          <b aria-hidden="true">↗</b>
        </Link>;
      })}</div>
    </section>
    <section className="index-note"><div><p className="eyebrow">怎麼閱讀</p><h2>多方說法並列，<br />不等於彼此都成立。</h2></div><p>已確認資訊、具名說法與仍待釐清會分開標示；來源與數量只幫助定位材料，不代表議題完整、可信度相同或結論已成立。</p></section>
    <footer><span>TW Issues</span><span>台灣議題脈絡的公開閱讀入口。</span></footer>
  </main>;
}
