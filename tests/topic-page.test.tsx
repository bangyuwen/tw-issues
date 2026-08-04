import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import TopicPage from "../app/topics/[slug]/page";
import DossierIndexPage, { TopicCountMetadata } from "../app/page";
import { buildDossierPageModel } from "../app/dossier-page-model";
import { getEventTimelineAttribution, getTimelineDisplayCopy, parseTimelineStatement } from "../app/topic-display";
import { bindSourceDisclosureInteractions, revealSourceFromHash } from "../app/topics/[slug]/source-disclosure";
import { publicEvidenceBySlug } from "../app/topic-data";
import type { PublicClaim, PublicEvidenceProjection } from "../app/topic-data";

const source = {
  publicRef: "source-01",
  canonicalUrl: "https://example.com/source",
  title: "測試來源的公開說明",
  publisher: "測試來源",
  publishedAt: "2026-07-12",
  displayRole: "主管機關公開說明",
};

const claim: PublicClaim = {
  statement: "測試公開命題。",
  proofScope: "只證明測試來源曾作此說明。",
  limitations: ["不證明完整事件經過。"],
  sources: [source],
};

function projection(
  section: "attributedSpeakerGroups" | "openQuestions" | "socialObservations",
): PublicEvidenceProjection {
  return {
    topicId: "benzopyrene-food-safety-2026",
    claims: [],
    attributedClaims: [],
    attributedSpeakerGroups: section === "attributedSpeakerGroups" ? [{ speaker: { name: "測試機關", role: "主管機關" }, claims: [claim] }] : [],
    openQuestions: section === "openQuestions" ? [claim] : [],
    socialObservations: section === "socialObservations" ? [{ summary: "有人關注測試議題。" }] : [],
    socialObservationCount: section === "socialObservations" ? 1 : 0,
  };
}

for (const [section, heading] of [
  ["attributedSpeakerGroups", "不同主體怎麼說"],
  ["openQuestions", "仍待釐清"],
  ["socialObservations", "社群反應樣本"],
] as const) {
test(`topic page renders ${section} when verified claims are empty`, () => {
    const html = renderToStaticMarkup(
      <TopicPage
        params={{ slug: "benzopyrene-food-safety" }}
        projectionOverride={projection(section)}
      />,
    );

    assert.match(html, new RegExp(heading));
    if (section === "attributedSpeakerGroups") {
      assert.match(html, /測試機關/);
      assert.match(html, /主管機關/);
      assert.doesNotMatch(html, /（主管機關）/);
    }
    if (section === "socialObservations") {
      assert.match(html, /有人關注測試議題/);
      assert.doesNotMatch(html, /data-claim-id="clm-test"/);
    }
    assert.doesNotMatch(html, /data-claim-id|clm-test|src-test/);
    assert.doesNotMatch(html, /公開資料補強中/);
  });
}

test("durable event timeline groups same-day events and starts every event closed", () => {
  const attributedClaim = { ...claim, statement: "主管機關提出具名說法。", speakers: [{ name: "測試機關", role: "主管機關" }] };
  const unresolvedClaim = { ...claim, statement: "責任歸屬仍待釐清。" };
  const html = renderToStaticMarkup(
    <TopicPage
      params={{ slug: "benzopyrene-food-safety" }}
      projectionOverride={{
        topicId: "benzopyrene-food-safety-2026",
        claims: [claim],
        attributedClaims: [],
        attributedSpeakerGroups: [{ speaker: { name: "測試機關", role: "主管機關" }, claims: [attributedClaim] }],
        openQuestions: [unresolvedClaim],
        reportedTimeline: [
          {
            publicKey: "event-early",
            occurredAt: "2026-07-10",
            precision: "day",
            kindLabel: "查證",
            headline: "測試公開命題。",
            sourceRefs: ["source-01"],
            items: [{ status: "verified", statement: claim.statement, proofScope: claim.proofScope, limitations: claim.limitations, sources: [source] }],
          },
          {
            publicKey: "event-same-day-a",
            occurredAt: "2026-07-17T18:00:00+08:00",
            precision: "minute",
            kindLabel: "司法進度",
            headline: "主管機關提出具名說法。",
            sourceRefs: ["source-01"],
            items: [{ status: "attributed", statement: attributedClaim.statement, proofScope: attributedClaim.proofScope, limitations: attributedClaim.limitations, sources: [source], speakers: attributedClaim.speakers }],
          },
          {
            publicKey: "event-same-day-b",
            occurredAt: "2026-07-17T08:00:00+08:00",
            precision: "minute",
            kindLabel: "追查進度",
            headline: "責任歸屬仍待釐清。",
            sourceRefs: ["source-01"],
            commentary: { significance: "追查範圍擴大。", evidenceBoundary: "尚不能判定最終責任。" },
            items: [
              { status: "unresolved", statement: unresolvedClaim.statement, proofScope: unresolvedClaim.proofScope, limitations: unresolvedClaim.limitations, sources: [source] },
              { status: "verified", statement: claim.statement, proofScope: claim.proofScope, limitations: claim.limitations, sources: [source] },
            ],
          },
        ],
      }}
    />,
  );

  assert.equal((html.match(/class="event-date-group"/g) ?? []).length, 2);
  assert.equal((html.match(/class="event-disclosure"/g) ?? []).length, 3);
  assert.equal((html.match(/class="event-disclosure" open=""/g) ?? []).length, 0);
  assert.match(html, /class="event-progress-section" id="progress" aria-label="事件進展"/);
  assert.match(html, /class="event-progress-section" id="progress" aria-label="事件進展"><div class="section-intro"><p class="eyebrow">事件進展<\/p><p>預設顯示最近一週（以最新事件為基準）；較早進度仍保留在下方。<\/p><\/div>/);
  assert.match(html, /class="event-history-disclosure"><summary>展開較早的 1 個日期<\/summary>/);
  assert.doesNotMatch(html, /class="event-history-disclosure" open=""/);
  assert.doesNotMatch(html, /\d+ 件進展/);
  assert.match(html, /event-date-heading"><time[^>]*>2026 年 7 月 17 日<\/time><span class="event-date-multiple-label">同日 2 則<\/span><\/header>/);
  assert.doesNotMatch(html, /class="event-date-statuses"/);
  assert.match(html, /class="event-date-group" data-date-key="2026-07-17"/);
  assert.doesNotMatch(html, /event-date-group--multiple/);
  assert.match(html, /class="event-date-multiple-label">同日 2 則<\/span>/);
  assert.doesNotMatch(html, /先看事情怎麼走|再展開證據細節|日期與核心進展保持可見/);
  assert.match(html, /data-date-key="2026-07-17"/);
  assert.match(html, />已確認</);
  assert.match(html, />具名說法</);
  assert.equal((html.match(/測試機關/g) ?? []).length, 3);
  assert.doesNotMatch(html, /（主管機關）/);
  assert.match(html, />仍待釐清</);
  assert.match(html, /尚不能判定最終責任/);
  assert.doesNotMatch(html, /\d+ 項公開命題/);
  assert.doesNotMatch(html, /1 筆事件來源/);
  assert.doesNotMatch(html, /1 項公開命題/);
  assert.doesNotMatch(html, /event-status-summary/);
  assert.doesNotMatch(html, /與前一步的變化/);

  const sameDayGroup = html.match(/<section class="event-date-group" data-date-key="2026-07-17">([\s\S]*?)<\/section>/)?.[1] ?? "";
  assert.ok(sameDayGroup.indexOf("司法進度") < sameDayGroup.indexOf("追查進度"), "same-day events preserve durable ledger order");

  const singleEventGroup = html.match(/<section class="event-date-group" data-date-key="2026-07-10">([\s\S]*?)<\/section>/)?.[1] ?? "";
  assert.doesNotMatch(singleEventGroup, /event-date-multiple-label/);

  const summaries = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((match) => match[1]);
  const eventSummaries = summaries.filter((summary) => summary.includes("event-summary-meta"));
  assert.equal(eventSummaries.length, 3);
  eventSummaries.forEach((summary) => {
    assert.doesNotMatch(summary, /<(?:div|h[1-6]|p|small)\b/);
    assert.doesNotMatch(summary, /證據界線|尚不能判定最終責任/);
    assert.match(summary, /event-status-chip/);
  });
});

test("topic page separates TW Issues analysis and proposals from known facts", () => {
  const projection: PublicEvidenceProjection = {
    topicId: "editorial-sections",
    claims: [claim],
    attributedClaims: [],
    attributedSpeakerGroups: [],
    openQuestions: [],
    analysisClaims: [{
      ...claim,
      statement: "同一透明標準應雙向適用。",
      editorialLabel: "TW Issues 分析",
      premises: ["制度紀錄已公開。"],
      inference: "一致標準可降低選擇性要求。",
      uncertainty: "尚未涵蓋所有程序例外。",
      falsifier: "若雙方已有完全相同義務。",
    }],
    editorialPositions: [{
      ...claim,
      statement: "公開替代方案與延誤成本。",
      editorialLabel: "TW Issues 主張",
      premises: ["制度紀錄已公開。"],
      consistentStandard: "同一套透明標準",
    }],
  };
  const html = renderToStaticMarkup(
    <TopicPage
      params={{ slug: "benzopyrene-food-safety" }}
      projectionOverride={projection}
    />,
  );

  assert.match(html, /id="analysis"/);
  assert.match(html, /我們怎麼理解/);
  assert.match(html, /id="positions"/);
  assert.match(html, /我們主張什麼/);
  assert.match(html, /不是已確認事實/);
});

test("timeline statement parser rejects ambiguous subjects and unsafe delimiters", () => {
  assert.deepEqual(parseTimelineStatement("臺中市政府於 7 月 11 日表示，第三批油品檢出超標。"), {
    matched: true,
    attributionLabel: "臺中市政府說明",
    substantiveText: "第三批油品檢出超標。",
  });
  assert.deepEqual(parseTimelineStatement("公視報導：檢方持續追查。"), {
    matched: true,
    attributionLabel: "公視報導",
    substantiveText: "檢方持續追查。",
  });
  assert.deepEqual(parseTimelineStatement("衛福部長石崇良表示修法草案將強化異常通報。"), {
    matched: false,
    attributionLabel: "",
    substantiveText: "衛福部長石崇良表示修法草案將強化異常通報。",
  });
  assert.deepEqual(parseTimelineStatement("衛福部長石崇良6月17日在立法院表示，6項生活津貼估計影響約89萬人。"), {
    matched: true,
    attributionLabel: "衛福部長石崇良說明",
    substantiveText: "6項生活津貼估計影響約89萬人。",
  });
  for (const statement of [
    "研究指出，污染原因仍待確認。",
    "初步結果顯示：樣本仍不足。",
    "公視轉述食藥署表示，原因仍待確認。",
    "某種說法表示後續仍會追查。",
    "這份報告提到市府表示，後續仍會追查。",
    "民眾認為市府表示，後續會改善。",
    "公視報導指出，臺北市持續追查。",
    "TVBS 7 月 6 日報導稱，主管機關正在調查。",
  ]) {
    assert.deepEqual(parseTimelineStatement(statement), {
      matched: false,
      attributionLabel: "",
      substantiveText: statement,
    });
  }
  assert.equal(getTimelineDisplayCopy("研究指出，污染原因仍待確認。").title, "研究指出，污染原因仍待確認。");
});

test("structured speakers provide conservative attribution when statement parsing declines", () => {
  assert.equal(getEventTimelineAttribution([{
    status: "attributed",
    statement: "衛福部長石崇良表示修法草案將強化異常通報。",
    speakers: [{ name: "行政院與衛福部" }],
  }]), "行政院與衛福部具名說法");
  assert.equal(getEventTimelineAttribution([{
    status: "verified",
    statement: "研究指出，尚無法確定原因。",
    speakers: [{ name: "不應使用的名稱" }],
  }]), "");
});

test("index keeps attribution and status beside real attributed and mixed latest events", () => {
  const html = renderToStaticMarkup(<DossierIndexPage />);
  const foodCard = html.match(/href="\/topics\/benzopyrene-food-safety"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  const japanCard = html.match(/href="\/topics\/japan-taiwan-alliance"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  const treeCard = html.match(/href="\/topics\/taipei-tree-governance"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  assert.match(foodCard, /topic-card-status--attributed[^>]*>具名說法/);
  assert.match(foodCard, /跨局處查核達 2,179 案/);
  assert.match(japanCard, /topic-card-status--attributed[^>]*>具名說法/);
  assert.match(japanCard, /超過300家無人機/);
  assert.match(treeCard, /topic-card-status--attributed[^>]*>具名說法/);
  assert.match(treeCard, /topic-count--attributed">具名說法 5/);
});

test("index count metadata omits zero categories and has an all-zero fallback", () => {
  const partial = renderToStaticMarkup(<TopicCountMetadata verified={2} attributed={0} unresolved={1} />);
  assert.match(partial, /已確認 2/);
  assert.match(partial, /仍待釐清 1/);
  assert.doesNotMatch(partial, /具名說法/);
  assert.match(renderToStaticMarkup(<TopicCountMetadata verified={0} attributed={0} unresolved={0} />), /公開資料補強中/);
});

test("event headline separates attribution from substantive progress", () => {
  const attributedStatement = "測試機關表示，這項追查有新的公開進度，仍待更多資料。";
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [], attributedClaims: [], attributedSpeakerGroups: [{ speaker: { name: "測試機關", role: "主管機關" }, claims: [{ ...claim, statement: attributedStatement }] }], openQuestions: [],
      reportedTimeline: [{
        publicKey: "event-attributed",
        occurredAt: "2026-07-18",
        precision: "day",
        kindLabel: "追查進度",
        headline: "這項追查有新的公開進度",
        sourceRefs: ["source-01"],
        items: [{ status: "attributed", ...claim, statement: attributedStatement, speakers: [{ name: "測試機關", role: "主管機關" }] }],
      }],
    }} />,
  );

  assert.match(html, /class="event-summary-attribution">測試機關・主管機關</);
  assert.match(html, /class="event-summary-title">這項追查有新的公開進度</);
  assert.doesNotMatch(html, /class="event-summary-title">測試機關表示/);
});

test("court ruling separates the court action from the substantive outcome", () => {
  const courtStatement = "臺中地方法院 7 月 17 日裁定中聯油脂總經理羈押並禁止接見通信；此為偵查階段的程序處分，不是有罪判決。";
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [{ ...claim, statement: courtStatement }], attributedClaims: [], openQuestions: [],
      reportedTimeline: [{
        publicKey: "event-court-ruling",
        occurredAt: "2026-07-17",
        precision: "day",
        kindLabel: "司法進度",
        headline: "中聯油脂總經理遭羈押禁見",
        sourceRefs: ["source-01"],
        items: [{ status: "verified", ...claim, statement: courtStatement }],
      }],
    }} />,
  );

  assert.doesNotMatch(html, /class="event-summary-attribution">/);
  assert.match(html, /class="event-summary-title">中聯油脂總經理遭羈押禁見</);
  assert.doesNotMatch(html, /class="event-summary-title">臺中地方法院 7 月 17 日裁定/);
});

test("event headline stays authored without reconstructing claim prose", () => {
  const firstStatement = "公視 7 月 17 日報導，第一項追查進度。";
  const secondStatement = "公視 7 月 17 日報導，第二項追查進度。";
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [],
      attributedClaims: [],
      openQuestions: [],
      reportedTimeline: [{
        publicKey: "event-shared-prefix",
        occurredAt: "2026-07-17",
        precision: "day",
        kindLabel: "追查進度",
        headline: "兩項追查進度分別更新",
        sourceRefs: ["source-01"],
        items: [
          { status: "attributed", ...claim, statement: firstStatement },
          { status: "attributed", ...claim, statement: secondStatement },
        ],
      }],
    }} />,
  );

  const summary = html.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "";
  assert.equal((summary.match(/class="event-summary-attribution">/g) ?? []).length, 0);
  assert.match(summary, /class="event-summary-title">兩項追查進度分別更新/);
  assert.doesNotMatch(html, /class="infographic-flow"/);
  assert.match(html, /第一項追查進度/);
  assert.match(html, /第二項追查進度/);
  assert.doesNotMatch(summary, /\d+ 項公開命題/);
});

test("event timeline preserves partial date precision in grouping", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [claim], attributedClaims: [], openQuestions: [],
      reportedTimeline: [
        { publicKey: "year", occurredAt: "2025", precision: "year", kindLabel: "制度紀錄", headline: claim.statement, sourceRefs: ["source-01"], items: [{ status: "verified", ...claim }] },
        { publicKey: "month", occurredAt: "2026-06", precision: "month", kindLabel: "制度紀錄", headline: claim.statement, sourceRefs: ["source-01"], items: [{ status: "verified", ...claim }] },
        { publicKey: "day", occurredAt: "2026-07-17", precision: "day", kindLabel: "制度紀錄", headline: claim.statement, sourceRefs: ["source-01"], items: [{ status: "verified", ...claim }] },
        { publicKey: "minute", occurredAt: "2026-07-17T12:30:00+08:00", precision: "minute", kindLabel: "制度紀錄", headline: claim.statement, sourceRefs: ["source-01"], items: [{ status: "verified", ...claim }] },
      ],
    }} />,
  );

  assert.equal((html.match(/class="event-date-group"/g) ?? []).length, 3);
  assert.match(html, /data-date-key="2025"/);
  assert.match(html, /data-date-key="2026-06"/);
  assert.equal((html.match(/data-date-key="2026-07-17"/g) ?? []).length, 1);
});

test("event timeline defaults to the latest seven days and keeps older groups collapsed", () => {
  const event = (publicKey: string, occurredAt: string) => ({
    publicKey,
    occurredAt,
    precision: "day" as const,
    kindLabel: "制度紀錄",
    headline: claim.statement,
    sourceRefs: ["source-01"],
    items: [{ status: "verified" as const, ...claim }],
  });
  const model = buildDossierPageModel({
    topicId: "recent-timeline",
    claims: [claim],
    attributedClaims: [],
    openQuestions: [],
    reportedTimeline: [event("old", "2026-07-10"), event("boundary", "2026-07-11"), event("latest", "2026-07-17")],
  });

  assert.deepEqual(model.recentTimelineGroups.map(({ key }) => key), ["2026-07-17", "2026-07-11"]);
  assert.deepEqual(model.olderTimelineGroups.map(({ key }) => key), ["2026-07-10"]);
});

test("topic page does not invent a timeline when safe durable events are absent", () => {
  const html = renderToStaticMarkup(
    <TopicPage
      params={{ slug: "benzopyrene-food-safety" }}
      projectionOverride={{
        topicId: "benzopyrene-food-safety-2026",
        claims: [],
        attributedClaims: [],
        attributedSpeakerGroups: [{ speaker: { name: "測試機關", role: "主管機關" }, claims: [claim] }],
        openQuestions: [],
      }}
    />,
  );
  assert.doesNotMatch(html, /class="event-progress-section"/);
  assert.match(html, /id="reports"/);
  assert.match(html, /測試公開命題/);
  assert.match(html, /href="#source-01"/);
});

test("topic page leads with progression and then each evidence disposition", () => {
  const attributedClaim = { ...claim, statement: "測試機關提出具名說法。", speakers: [{ name: "測試機關", role: "主管機關" }] };
  const unresolvedClaim = { ...claim, statement: "尚缺獨立檢驗資料。", limitations: ["不能判定污染根因。", "不能判定最終責任。"] };
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [{ ...claim, sampleSize: 18 }],
      attributedClaims: [],
      attributedSpeakerGroups: [{ speaker: { name: "測試機關", role: "主管機關" }, claims: [attributedClaim] }],
      openQuestions: [unresolvedClaim],
      reportedTimeline: [{
        publicKey: "event-order",
        occurredAt: "2026-07-18",
        precision: "day",
        kindLabel: "追查進度",
        headline: "測試機關提出具名說法。",
        sourceRefs: ["source-01"],
        items: [{ status: "attributed", ...attributedClaim }],
      }],
    }} />,
  );

  const order = [
    html.indexOf("class=\"hero hero-detail\""),
    html.indexOf("class=\"article-nav\""),
    html.indexOf("class=\"event-progress-section\""),
    html.indexOf("id=\"claims\""),
    html.indexOf("id=\"reports\""),
    html.indexOf("id=\"questions\""),
    html.indexOf("id=\"sources\""),
  ];
  assert.ok(order.every((position) => position >= 0));
  assert.deepEqual(order, [...order].sort((left, right) => left - right));
  assert.doesNotMatch(html, /class="topic-infographic|class="topic-evidence-chart|class="topic-source-chart/);
  assert.doesNotMatch(html, />證據邊界</);

  for (const statement of [claim.statement, attributedClaim.statement, unresolvedClaim.statement]) {
    const cardStart = html.indexOf(statement, html.indexOf("id=\"claims\""));
    const cardEnd = html.indexOf("</article>", cardStart);
    const card = html.slice(cardStart, cardEnd);
    assert.match(card, /這能確認/);
    assert.match(card, /這不能證明/);
    assert.match(card, /href="#source-01"/);
  }
  assert.match(html, /說法歸屬[\s\S]*測試機關/);
  assert.match(html, /不能判定污染根因。；不能判定最終責任。/);
  assert.match(html, /樣本數[\s\S]*18（N = 18）/);
});

test("topic page falls back directly to evidence when no safe timeline exists", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [claim],
      attributedClaims: [],
      openQuestions: [],
    }} />,
  );

  assert.doesNotMatch(html, /class="event-progress-section|class="topic-infographic|class="topic-evidence-chart|class="topic-source-chart/);
  assert.ok(html.indexOf("class=\"article-nav\"") < html.indexOf("id=\"claims\""));
  assert.ok(html.indexOf("id=\"claims\"") < html.indexOf("id=\"sources\""));
});

test("sources use a default-collapsed native disclosure with stable targets", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "benzopyrene-food-safety-2026",
      claims: [claim],
      attributedClaims: [],
      openQuestions: [],
    }} />,
  );

  assert.match(html, /<details[^>]*class="sources-disclosure"[^>]*id="sources"/);
  assert.doesNotMatch(html, /<details[^>]*class="sources-disclosure"[^>]*open/);
  assert.match(html, /<summary>[\s\S]*資料與來源 · 1 筆[\s\S]*<\/summary>/);
  assert.doesNotMatch(html, /<section class="sources-section"[^>]*><div class="section-intro">/);
  assert.match(html, /id="source-01"[^>]*data-source-ref="source-01"[^>]*tabindex="-1"/);
  assert.match(html, /class="source-title"[^>]*>測試來源的公開說明/);
  assert.match(html, /class="source-meta"[\s\S]*>測試來源<\/span>/);
  assert.match(html, /<time dateTime="2026-07-12">2026-07-12<\/time>/);
  assert.match(html, /AI 自動製作說明/);
  assert.ok(html.indexOf("</details>") < html.indexOf("AI 自動製作說明"));
});

test("verified claims use compact timeline rows with collapsed evidence details", () => {
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
    topicId: "claim-boundary-disclosure",
    claims: [claim], attributedClaims: [], attributedSpeakerGroups: [], openQuestions: [],
  }} />);

  assert.match(html, /<details class="verified-claim-row"><summary>/);
  assert.doesNotMatch(html, /<details class="verified-claim-row" open/);
  assert.match(html, /這能確認/);
  assert.match(html, /這不能證明/);
  assert.doesNotMatch(html, /fact-grid--verified/);
  assert.doesNotMatch(html, /這一層只收錄可核對的公開命題/);
});

test("source fragment helper opens, focuses, and scrolls the exact source", () => {
  const calls: string[] = [];
  const target = {
    matches: (selector: string) => selector === "[data-source-ref]",
    focus: ({ preventScroll }: FocusOptions) => calls.push(`focus:${preventScroll}`),
    scrollIntoView: ({ block }: ScrollIntoViewOptions) => calls.push(`scroll:${block}`),
  } as HTMLElement;
  const disclosure = {
    open: false,
    contains: (candidate: unknown) => candidate === target,
    ownerDocument: { getElementById: (id: string) => id === "source-01" ? target : null },
  } as unknown as HTMLDetailsElement;

  assert.equal(revealSourceFromHash(disclosure, "#source-01", (callback) => callback()), true);
  assert.equal(disclosure.open, true);
  assert.deepEqual(calls, ["focus:true", "scroll:center"]);

  calls.length = 0;
  assert.equal(revealSourceFromHash(disclosure, "#source-01", (callback) => callback()), true);
  assert.equal(disclosure.open, true);
  assert.deepEqual(calls, ["focus:true", "scroll:center"]);
});

test("source fragment helper ignores absent and unrelated targets", () => {
  const unrelatedTarget = { matches: () => false } as unknown as HTMLElement;
  const disclosure = {
    open: false,
    matches: () => false,
    contains: (candidate: unknown) => candidate === disclosure,
    ownerDocument: { getElementById: (id: string) => id === "sources" ? disclosure : unrelatedTarget },
  } as unknown as HTMLDetailsElement;

  assert.equal(revealSourceFromHash(disclosure, "#claims", (callback) => callback()), false);
  assert.equal(revealSourceFromHash(disclosure, "#sources", (callback) => callback()), false);
  assert.equal(revealSourceFromHash(disclosure, "", (callback) => callback()), false);
  assert.equal(disclosure.open, false);
});

test("source disclosure binds initial hash, clicks, hash changes, and cleanup", () => {
  const calls: string[] = [];
  const target = {
    matches: (selector: string) => selector === "[data-source-ref]",
    focus: () => calls.push("focus"),
    scrollIntoView: () => calls.push("scroll"),
  } as unknown as HTMLElement;
  const disclosure = {
    open: false,
    contains: (candidate: unknown) => candidate === target,
    ownerDocument: { getElementById: (id: string) => id === "source-01" ? target : null },
  } as unknown as HTMLDetailsElement;
  let hash = "#source-01";
  let hashListener: (() => void) | undefined;
  let clickListener: ((event: MouseEvent) => void) | undefined;
  const environment = {
    readHash: () => hash,
    addHashChangeListener: (listener: () => void) => { hashListener = listener; },
    removeHashChangeListener: (listener: () => void) => calls.push(`remove-hash:${listener === hashListener}`),
    addClickListener: (listener: (event: MouseEvent) => void) => { clickListener = listener; },
    removeClickListener: (listener: (event: MouseEvent) => void) => calls.push(`remove-click:${listener === clickListener}`),
  };

  const cleanup = bindSourceDisclosureInteractions(disclosure, environment, (callback) => callback());
  assert.equal(disclosure.open, true);
  assert.deepEqual(calls, ["focus", "scroll"]);

  disclosure.open = false;
  hash = "#claims";
  hashListener?.();
  assert.equal(disclosure.open, false);

  const fragmentBeforeClick = hash;
  let prevented = false;
  clickListener?.({
    target: { closest: () => ({ getAttribute: () => "#source-01" }) },
    preventDefault: () => { prevented = true; },
  } as unknown as MouseEvent);
  assert.deepEqual([disclosure.open, prevented, hash], [true, false, fragmentBeforeClick]);

  cleanup();
  assert.deepEqual(calls.slice(-2), ["remove-hash:true", "remove-click:true"]);
});

test("real sparse and dense projections share density and source contracts", () => {
  const tree = buildDossierPageModel(publicEvidenceBySlug["taipei-tree-governance"]);
  const oil = buildDossierPageModel(publicEvidenceBySlug["benzopyrene-food-safety"]);
  assert.deepEqual(tree.collections.map(({ claims }) => claims.length), [4, 1]);
  assert.deepEqual(oil.collections.map(({ claims }) => claims.length), [9, 1]);
  for (const model of [tree, oil]) {
    assert.equal(model.publicSources.length, model.sourceById.size);
    assert.equal(model.latestTimelineEvent?.publicKey, model.timelineGroups[0]?.events.at(-1)?.publicKey);
  }
});

for (const [field, label] of [
  ["claims", "可核對命題"], ["openQuestions", "調查中的問題"],
] as const) test(`${field} renders four direct claims and a section-local remainder`, () => {
  const claims = Array.from({ length: 6 }, (_, index) => ({ ...claim, statement: `命題 ${index + 1}` }));
  const synthetic: PublicEvidenceProjection = { topicId: "density", claims: [], attributedClaims: [], openQuestions: [], [field]: claims };
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={synthetic} />);
  assert.match(html, new RegExp(`展開其餘 2 項${label}`));
  assert.equal((html.match(/data-claim-zone="direct"/g) ?? []).length, 4);
  const remainderOrdinal = field === "claims" ? "verified-claim-ordinal" : "fact-number";
  assert.match(html, new RegExp(`class="claim-remainder"[\\s\\S]*?${remainderOrdinal}">05<[\\s\\S]*?命題 6`));
});

test("speaker groups lead with a one-line public summary before expandable details", () => {
  const claims = Array.from({ length: 3 }, (_, index) => ({ ...claim, statement: `說法 ${index + 1}` }));
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
    topicId: "speaker-groups",
    claims: [],
    attributedClaims: [],
    attributedSpeakerGroups: [{ speaker: { name: "測試機關", role: "主管機關" }, stanceSummary: "測試機關主張先完成公開查核，再決定後續處置。", claims }],
    openQuestions: [],
  }} />);

  assert.match(html, /不同主體怎麼說/);
  assert.match(html, /class="speaker-group-summary"><span>摘要<\/span>/);
  assert.match(html, /測試機關主張先完成公開查核，再決定後續處置。/);
  assert.match(html, /<details class="speaker-group-details"><summary>查看 3 項具名說法<\/summary>/);
  assert.match(html, /class="speaker-statement-list"/);
  assert.match(html, /class="speaker-statement-row"/);
  assert.doesNotMatch(html, /fact-grid--attributed/);
  assert.equal((html.match(/data-claim-zone="detail"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /speaker-group-details" open/);
});

test("stance map connects explicitly named speakers and marks reciprocal arrows", () => {
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
    topicId: "stance-map-reciprocal",
    claims: [],
    attributedClaims: [],
    attributedSpeakerGroups: [
      { speaker: { name: "甲方", role: "公共團體" }, claims: [{ ...claim, statement: "甲方批評乙方，稱資料不透明。" }] },
      { speaker: { name: "乙方", role: "行政機關" }, claims: [{ ...claim, statement: "乙方質疑甲方，稱程序失職。" }] },
    ],
    openQuestions: [],
  }} />);

  assert.match(html, /id="stance-map"/);
  assert.match(html, /class="stance-map-canvas(?: stance-map-canvas--dense)?" role="group" aria-label="立場關係圖，3 個六角形，1 條箭頭"/);
  assert.equal((html.match(/class="stance-graph-node stance-graph-node--speaker"/g) ?? []).length, 2);
  assert.equal((html.match(/class="stance-edge stance-edge--reciprocal"/g) ?? []).length, 1);
  assert.equal((html.match(/class="stance-evidence stance-evidence-card stance-evidence-card--reciprocal"/g) ?? []).length, 2);
  assert.equal((html.match(/>互指<\/span>/g) ?? []).length, 2);
  assert.match(html, /aria-label="乙方，行政機關"/);
  assert.match(html, /aria-label="甲方，公共團體"/);
  assert.doesNotMatch(html, /stance-lane/);
});

test("published food-safety stance map connects Fu Kun-chi to the explicitly named premier", () => {
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} />);

  assert.match(html, /<span class="stance-evidence-route"><strong>傅崐萁<\/strong><b>→<\/b><strong>卓榮泰<\/strong><\/span>/);
  assert.match(html, /傅崐萁批評行政院長卓榮泰/);
  assert.match(html, /不能證明卓榮泰或行政院已被獨立調查認定負有本案責任/);
});

test("model preserves ledger order and includes a timeline-only source", () => {
  const timelineSource = { ...source, publicRef: "timeline-only", publisher: "時間軸來源" };
  const model = buildDossierPageModel({
    topicId: "timeline-contract", claims: [claim], attributedClaims: [], openQuestions: [],
    reportedTimeline: [
      { publicKey: "later-clock", occurredAt: "2026-07-17T18:00:00+08:00", precision: "minute", kindLabel: "進度", headline: "A", sourceRefs: [timelineSource.publicRef], items: [{ status: "verified", ...claim, statement: "A", sources: [timelineSource] }] },
      { publicKey: "earlier-clock", occurredAt: "2026-07-17T08:00:00+08:00", precision: "minute", kindLabel: "進度", headline: "B", sourceRefs: [source.publicRef], items: [{ status: "verified", ...claim, statement: "B" }] },
    ],
  });
  assert.deepEqual(model.timelineGroups[0].events.map(({ publicKey }) => publicKey), ["later-clock", "earlier-clock"]);
  assert.equal(model.latestTimelineEvent?.publicKey, "earlier-clock");
  assert.equal(model.sourceById.get("timeline-only")?.publisher, "時間軸來源");
});
