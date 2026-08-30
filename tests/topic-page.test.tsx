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
    if (section === "openQuestions") {
      assert.match(html, /class="evidence-board evidence-board--with-open evidence-board--open-only"/);
      assert.doesNotMatch(html, /data-collection-id="claims"/);
      assert.match(html, /data-collection-id="questions"/);
    }
    assert.doesNotMatch(html, /data-claim-id|clm-test|src-test/);
    assert.doesNotMatch(html, /公開資料補強中/);
  });
}

test("topic page publishes a proceeding-track-only projection", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "proceeding-only",
      claims: [],
      attributedClaims: [],
      openQuestions: [],
      proceedingTracks: [
        {
          kind: "administrative",
          label: "行政調查",
          body: "測試機關",
          question: "程序回答什麼？",
          conclusion: "已作成測試結論。",
          effect: "要求改善。",
          doesNotConclude: ["不等於刑事有罪。"],
          status: "已公布",
          nextStep: "追查改善結果",
          sources: [source],
        },
        {
          kind: "criminal",
          label: "刑事偵查",
          body: "測試地檢署",
          question: "證據是否足以起訴？",
          conclusion: "已作成偵查處分。",
          effect: "偵查終結。",
          doesNotConclude: ["不處理行政責任。"],
          status: "已偵結",
          nextStep: "確認後續程序",
          sources: [source],
        },
      ],
    }} />,
  );

  assert.match(html, /同一爭議，2 個程序各自回答什麼/);
  assert.match(html, /程序回答什麼/);
  assert.match(html, /證據是否足以起訴/);
  assert.equal(html.match(/class="proceeding-row /g)?.length, 2);
  assert.doesNotMatch(html, /公開資料補強中/);
});

test("topic page publishes an administration-action-only projection with actor and evidence boundaries", () => {
  const actionSource = { ...source, publicRef: "action-source", publisher: "行動來源" };
  const evidence: PublicEvidenceProjection = {
    topicId: "administration-action-only",
    claims: [],
    attributedClaims: [],
    openQuestions: [],
    administrationActions: [
      {
        publicKey: "action-late",
        occurredAt: "2025-09-11",
        period: "2025 年 9 月",
        administrationPhase: "代理市長期間",
        actor: { name: "測試市政府", role: "主管機關" },
        headline: "另案辦理改善工程",
        action: "市府完成工程決標並安排開工。",
        outcome: "工程已開工，驗收仍待完成。",
        status: "ongoing",
        proofScope: "只證明市府完成決標與開工程序。",
        limitations: ["不等於工程已驗收合格。"],
        sources: [actionSource],
      },
      {
        publicKey: "action-early",
        occurredAt: "2023-02-15",
        period: "2023 年 2 月",
        administrationPhase: "市長在任期間",
        actor: { name: "測試市政府", role: "主管機關" },
        headline: "成立工程體檢會",
        action: "市府邀集專家檢視工程與採購問題。",
        outcome: "體檢會已成立。",
        status: "completed",
        proofScope: "只證明體檢會成立及任務範圍。",
        limitations: ["不等於體檢結論已獲法院採認。"],
        sources: [actionSource],
      },
    ],
  };
  const model = buildDossierPageModel(evidence);
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={evidence} />);

  assert.deepEqual(model.administrationActions.map(({ publicKey }) => publicKey), ["action-early", "action-late"]);
  assert.equal(model.sourceById.get("action-source")?.publisher, "行動來源");
  assert.match(html, /高虹安市府上任後做了什麼？/);
  assert.match(html, /以下整理任期內市府或所屬機關的可回查行動/);
  assert.match(html, /測試市政府/);
  assert.match(html, /工程已開工，驗收仍待完成。/);
  assert.match(html, /href="#administration-actions"/);
  assert.doesNotMatch(html, /id="proceedings"/);
});

test("topic page does not treat unrendered attributedClaims as evidence", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "unrendered-attributed-only",
      claims: [],
      attributedClaims: [claim],
      openQuestions: [],
    }} />,
  );

  assert.match(html, /公開資料補強中/);
  assert.doesNotMatch(html, /測試公開命題/);
});

test("topic page publishes an eligible Hsinchu primary-document-only projection", () => {
  const primaryDocument = publicEvidenceBySlug["hsinchu-baseball-stadium"].primaryDocument;
  assert.ok(primaryDocument);
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "hsinchu-baseball-stadium" }} projectionOverride={{
      topicId: "hsinchu-baseball-stadium-2026",
      primaryDocument,
      claims: [],
      attributedClaims: [],
      openQuestions: [],
    }} />,
  );

  assert.match(html, /id="primary-document"/);
  assert.match(html, /id="primary-document-reading"/);
  assert.match(html, /href="#primary-document-reading"/);
  assert.match(html, /href="#primary-document"/);
  assert.match(html, /新竹棒球場案不起訴處分書具印文頁面影像/);
  assert.match(html, /<dl class="primary-document-source-meta" aria-label="文件來源與擷取資訊">/);
  assert.match(html, /不能僅由印文判定持有人紙本為正本或副本。/);
  assert.match(html, /已對照具印文頁面影像/);
  for (const label of ["內容層次 1／3", "內容層次 2／3", "內容層次 3／3"]) {
    assert.match(html, new RegExp(label));
  }
  assert.doesNotMatch(html, /公開資料補強中/);
});

test("topic page rejects non-Hsinchu and ineligible primary-document-only projections", () => {
  const primaryDocument = publicEvidenceBySlug["hsinchu-baseball-stadium"].primaryDocument;
  assert.ok(primaryDocument);
  const nonHsinchuHtml = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "another-topic",
      primaryDocument,
      claims: [],
      attributedClaims: [],
      openQuestions: [],
    }} />,
  );
  const ineligibleHsinchuHtml = renderToStaticMarkup(
    <TopicPage params={{ slug: "hsinchu-baseball-stadium" }} projectionOverride={{
      topicId: "hsinchu-baseball-stadium-2026",
      primaryDocument: {
        ...primaryDocument,
        source: { ...primaryDocument.source, publicRef: "source-57" },
      },
      claims: [],
      attributedClaims: [],
      openQuestions: [],
    }} />,
  );

  for (const html of [nonHsinchuHtml, ineligibleHsinchuHtml]) {
    assert.match(html, /公開資料補強中/);
    assert.doesNotMatch(html, /id="primary-document"/);
    assert.doesNotMatch(html, /id="primary-document-reading"/);
    assert.doesNotMatch(html, /href="#primary-document(?:-reading)?"/);
  }
});

test("timeline-only projection omits links to absent evidence sections", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      topicId: "timeline-only",
      claims: [],
      attributedClaims: [],
      openQuestions: [],
      reportedTimeline: [{
        publicKey: "timeline-only-event",
        occurredAt: "2026-07-17",
        precision: "day",
        kindLabel: "程序進度",
        headline: "只有時間軸的公開事件",
        sourceRefs: [source.publicRef],
        items: [
          { status: "verified", statement: "已確認的事件項目。", proofScope: claim.proofScope, limitations: claim.limitations, sources: [source] },
          { status: "attributed", statement: "具名的事件項目。", proofScope: claim.proofScope, limitations: claim.limitations, sources: [source], speakers: [{ name: "測試機關", role: "主管機關" }] },
          { status: "unresolved", statement: "待釐清的事件項目。", proofScope: claim.proofScope, limitations: claim.limitations, sources: [source] },
        ],
      }],
    }} />,
  );

  assert.match(html, /id="progress"/);
  assert.match(html, /只有時間軸的公開事件/);
  assert.doesNotMatch(html, /href="#claims"/);
  assert.doesNotMatch(html, /href="#reports"/);
  assert.doesNotMatch(html, /href="#questions"/);
});

test("evidence board collapses to one known-information column without open questions", () => {
  const html = renderToStaticMarkup(
    <TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
      ...projection("socialObservations"),
      claims: [claim],
    }} />,
  );

  assert.match(html, /class="evidence-board evidence-board--known-only"/);
  assert.match(html, /data-collection-id="claims"/);
  assert.doesNotMatch(html, /data-collection-id="questions"/);
  assert.doesNotMatch(html, /evidence-board--with-open/);
});

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
  assert.match(html, /class="event-progress-section" id="progress" aria-label="事件進展"><div class="section-intro"><p class="eyebrow">事件進展<\/p><h2>事情怎麼走到今天？<\/h2><\/div>/);
  assert.doesNotMatch(html, /\d+ 件進展/);
  assert.match(html, /event-date-heading"><time[^>]*>2026 年 7 月 17 日<\/time><span class="event-date-multiple-label">同日 2 則<\/span><span class="event-date-statuses">/);
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
  assert.match(html, /href="#claims">查看完整分區/);
  assert.match(html, /href="#reports">查看完整分區/);
  assert.match(html, /href="#questions">查看完整分區/);
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
    assert.doesNotMatch(summary, /event-status-chip/);
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
  const stadiumCard = html.match(/href="\/topics\/hsinchu-baseball-stadium"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  const foodCard = html.match(/href="\/topics\/benzopyrene-food-safety"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  const japanCard = html.match(/href="\/topics\/japan-taiwan-alliance"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  const treeCard = html.match(/href="\/topics\/taipei-tree-governance"[\s\S]*?<b aria-hidden="true">↗<\/b>/)?.[0] ?? "";
  assert.match(stadiumCard, /topic-card-status--attributed[^>]*>具名說法/);
  assert.match(stadiumCard, /高虹安與新竹市政府說明、楊玲宜具名說法/);
  assert.match(stadiumCard, /事件類型 · 再議意向與政治回應/);
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
    html.indexOf("id=\"questions\""),
    html.indexOf("id=\"reports\""),
    html.indexOf("id=\"sources\""),
  ];
  assert.ok(order.every((position) => position >= 0));
  assert.deepEqual(order, [...order].sort((left, right) => left - right));
  assert.doesNotMatch(html, /class="topic-infographic|class="topic-evidence-chart|class="topic-source-chart/);
  assert.match(html, /class="evidence-board-header"[\s\S]*?>證據邊界</);

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

test("known and unresolved claims expose proof boundaries before collapsed source details", () => {
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "hsinchu-baseball-stadium" }} projectionOverride={{
    topicId: "hsinchu-claim-boundary-disclosure",
    claims: [claim], attributedClaims: [], attributedSpeakerGroups: [], openQuestions: [{ ...claim, statement: "待釐清命題。" }],
  }} />);

  assert.match(html, /<article class="evidence-claim-card evidence-claim-card--verified"/);
  assert.match(html, /<article class="evidence-claim-card evidence-claim-card--open"/);
  assert.match(html, /<details class="evidence-claim-row evidence-claim-row--verified"><summary>/);
  assert.match(html, /<details class="evidence-claim-row evidence-claim-row--open"><summary>/);
  assert.doesNotMatch(html, /<details class="evidence-claim-row evidence-claim-row--(?:verified|open)" open/);
  for (const kind of ["verified", "open"] as const) {
    const card = html.match(new RegExp(`<article class="evidence-claim-card evidence-claim-card--${kind}"[\\s\\S]*?<\\/article>`))?.[0] ?? "";
    assert.ok(card.indexOf('class="claim-boundary"') >= 0);
    assert.ok(card.indexOf('class="claim-boundary"') < card.indexOf(`<details class="evidence-claim-row evidence-claim-row--${kind}">`));
    assert.match(card, /這能確認/);
    assert.match(card, /這不能證明/);
    assert.match(card, /href="#source-01"/);
  }
  assert.doesNotMatch(html, /fact-grid--(?:verified|open)/);
  assert.doesNotMatch(html, /這一層只收錄可核對的公開命題/);

  const generic = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{
    topicId: "generic-claim-boundary-disclosure",
    claims: [claim], attributedClaims: [], attributedSpeakerGroups: [], openQuestions: [],
  }} />);
  assert.match(generic, /<div data-claim-zone="direct"><details class="evidence-claim-row evidence-claim-row--verified"><summary><span class="evidence-claim-ordinal">/);
  assert.doesNotMatch(generic, /evidence-claim-card|evidence-claim-status/);
  assert.ok(generic.indexOf('class="evidence-claim-row evidence-claim-row--verified"') < generic.indexOf('class="claim-boundary"'));
});

test("Hsinchu uses one downstream-only table of contents without changing generic navigation", () => {
  const hsinchu = renderToStaticMarkup(
    <TopicPage
      params={{ slug: "hsinchu-baseball-stadium" }}
      projectionOverride={publicEvidenceBySlug["hsinchu-baseball-stadium"]}
    />,
  );
  const generic = renderToStaticMarkup(
    <TopicPage
      params={{ slug: "benzopyrene-food-safety" }}
      projectionOverride={{ topicId: "generic-navigation", claims: [claim], attributedClaims: [], openQuestions: [] }}
    />,
  );

  assert.match(hsinchu, /class="article-nav article-nav--case case-toc"/);
  assert.match(hsinchu, /id="case-contents"/);
  assert.doesNotMatch(hsinchu, /article-nav-groups|case-map-nav|案情問題導覽/);
  const nav = hsinchu.match(/<nav[^>]+id="case-contents"[\s\S]*?<\/nav>/)?.[0] ?? "";
  const chapterOneTargets = ["primary-document-reading", "context", "responsibility-lines", "coverage-limits"];
  const chapterOneLinkPositions = chapterOneTargets.map((id) => nav.indexOf(`href="#${id}"`));
  assert.ok(chapterOneLinkPositions.every((position) => position >= 0));
  assert.doesNotMatch(nav, /href="#primary-document"/);
  assert.deepEqual(chapterOneLinkPositions, [...chapterOneLinkPositions].sort((left, right) => left - right));
  assert.match(nav, /href="#primary-document-reading"[^>]*>文件頁段導讀/);
  const order = ["primary-document", "case-contents", "primary-document-reading", "context", "responsibility-lines", "coverage-limits", "claims", "progress", "administration-actions", "proceedings", "people", "reports", "narratives", "analysis", "social-observations", "sources"]
    .map((id) => hsinchu.indexOf(`id="${id}"`));
  assert.ok(order.every((position) => position >= 0));
  assert.deepEqual(order, [...order].sort((left, right) => left - right));

  assert.match(generic, /class="article-nav"/);
  assert.doesNotMatch(generic, /article-nav--case|case-toc|case-map-nav/);
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

test("source fragment helper opens the source section from its navigation anchor", () => {
  const calls: string[] = [];
  const summary = { focus: ({ preventScroll }: FocusOptions) => calls.push(`focus-summary:${preventScroll}`) } as unknown as HTMLElement;
  const disclosure = {
    open: false,
    scrollIntoView: ({ block }: ScrollIntoViewOptions) => calls.push(`scroll:${block}`),
    querySelector: (selector: string) => selector === "summary" ? summary : null,
  } as unknown as HTMLDetailsElement;

  assert.equal(revealSourceFromHash(disclosure, "#sources", (callback) => callback()), true);
  assert.equal(disclosure.open, true);
  assert.deepEqual(calls, ["scroll:start", "focus-summary:true"]);
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
  assert.equal(revealSourceFromHash(disclosure, "#not-a-source", (callback) => callback()), false);
  assert.equal(revealSourceFromHash(disclosure, "", (callback) => callback()), false);
  assert.equal(disclosure.open, false);
});

test("source disclosure binds initial hash, clicks, Back/Forward hash changes, and cleanup", () => {
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
    scrollIntoView: () => calls.push("scroll-sources"),
    querySelector: (selector: string) => selector === "summary" ? { focus: () => calls.push("focus-summary") } : null,
  } as unknown as HTMLDetailsElement;
  let hash = "#source-01";
  let hashListener: (() => void) | undefined;
  let clickListener: ((event: MouseEvent) => void) | undefined;
  const environment = {
    readHash: () => hash,
    updateHash: (nextHash: string) => { hash = nextHash; calls.push(`update-hash:${nextHash}`); },
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

  disclosure.open = false;
  clickListener?.({
    target: { closest: () => ({ getAttribute: () => "#sources" }) },
    preventDefault: () => { prevented = true; },
  } as unknown as MouseEvent);
  assert.deepEqual([disclosure.open, prevented, hash], [true, true, "#sources"]);

  hash = "#reports";
  hashListener?.();
  disclosure.open = false;
  hash = "#source-01";
  hashListener?.();
  assert.equal(disclosure.open, true, "Back restores the source disclosure when returning to a source fragment");
  assert.deepEqual(calls.slice(-2), ["focus", "scroll"]);

  hash = "#reports";
  hashListener?.();
  assert.equal(hash, "#reports", "Forward preserves the non-source fragment without rewriting browser history");

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
    assert.equal(model.latestTimelineEvent?.publicKey, model.timelineGroups.at(-1)?.events.at(-1)?.publicKey);
  }
});

test("verified claims render four direct claims and a section-local remainder", () => {
  const claims = Array.from({ length: 6 }, (_, index) => ({ ...claim, statement: `命題 ${index + 1}` }));
  const synthetic: PublicEvidenceProjection = { topicId: "density", claims, attributedClaims: [], openQuestions: [] };
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={synthetic} />);
  assert.match(html, /展開其餘 2 項可核對命題/);
  assert.equal((html.match(/data-claim-zone="direct"/g) ?? []).length, 4);
  const remainderOrdinal = "evidence-claim-ordinal";
  assert.match(html, new RegExp(`class="claim-remainder"[\\s\\S]*?${remainderOrdinal}">05<[\\s\\S]*?命題 6`));
});

test("open questions keep every title directly visible", () => {
  const questions = Array.from({ length: 6 }, (_, index) => ({ ...claim, statement: `未決問題 ${index + 1}` }));
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={{ topicId: "open-density", claims: [], attributedClaims: [], openQuestions: questions }} />);
  assert.equal((html.match(/data-claim-zone="direct"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /class="claim-remainder"/);
  assert.match(html, /未決問題 6/);
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

test("published food-safety page keeps attributed evidence without automatic stance mapping", () => {
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} />);

  assert.doesNotMatch(html, /id="stance-map"|stance-edge|stance-graph-node|攻防關係圖/);
  assert.match(html, /傅崐萁批評行政院長卓榮泰/);
  assert.match(html, /不同主體怎麼說/);
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

test("model collects person and narrative sources including amplification", () => {
  const personSource = { ...source, publicRef: "person-source", publisher: "人物來源" };
  const amplificationSource = { ...source, publicRef: "amplification-source", publisher: "擴散來源" };
  const model = buildDossierPageModel({
    topicId: "people-narratives",
    claims: [claim],
    attributedClaims: [],
    openQuestions: [],
    publicPeople: [{
      personId: "person-a",
      name: "人物甲",
      role: "候選人",
      affiliation: "政黨甲",
      period: "2022",
      relationToTopic: "選舉攻防",
      summary: "公開身分",
      proofScope: "只證明身分",
      limitations: ["不證明責任"],
      sources: [personSource],
    }],
    politicalNarratives: [{
      publicKey: "narrative-a",
      occurredAt: "2022-11-16",
      arena: "選舉",
      headline: "敘事",
      speaker: { name: "人物甲", role: "候選人", personId: "person-a" },
      statement: "具名說法",
      status: "attributed",
      proofScope: "只證明曾如此表示",
      limitations: ["不證明真相"],
      sources: [source],
      amplification: [{ channel: "媒體", publishedAt: "2022-11-16", description: "轉述", sources: [amplificationSource] }],
    }],
  });
  assert.equal(model.publicPeople.length, 1);
  assert.equal(model.politicalNarratives.length, 1);
  assert.equal(model.sourceById.get("person-source")?.publisher, "人物來源");
  assert.equal(model.sourceById.get("amplification-source")?.publisher, "擴散來源");
});

test("model collects social observation sources without promoting the samples", () => {
  const socialSource = { ...source, publicRef: "social-source", publisher: "社群來源" };
  const model = buildDossierPageModel({
    topicId: "social-samples",
    claims: [],
    attributedClaims: [],
    openQuestions: [],
    socialObservations: [{
      kind: "criticism",
      summary: "公開討論中的批評樣本。",
      proofScope: "只證明該討論出現這種批評。",
      limitations: ["不代表整體民意。"],
      sources: [socialSource],
    }],
    socialObservationCount: 1,
  });
  assert.equal(model.socialObservations.length, 1);
  assert.equal(model.socialSampleSize, 1);
  assert.equal(model.sourceById.get("social-source")?.publisher, "社群來源");
  assert.equal(model.publicSources.length, 1);
});

test("legacy social source references do not create phantom public citations", () => {
  const model = buildDossierPageModel({
    topicId: "legacy-social-samples",
    claims: [],
    attributedClaims: [],
    openQuestions: [],
    socialObservations: [{ summary: "沒有 canonical metadata 的 legacy 樣本。", sourceRefs: ["legacy-social"] }],
    socialObservationCount: 1,
  });
  assert.equal(model.publicSources.length, 0);
  assert.equal(model.sourceById.has("legacy-social"), false);
});

test("model preserves context overview and collects lane and phase sources", () => {
  const laneSource = { ...source, publicRef: "context-lane", publisher: "責任線來源" };
  const phaseSource = { ...source, publicRef: "context-phase", publisher: "階段來源" };
  const proceedingSource = { ...source, publicRef: "proceeding-source", publisher: "程序來源" };
  const evidence: PublicEvidenceProjection = {
    topicId: "context-overview",
    claims: [claim],
    attributedClaims: [],
    openQuestions: [],
    contextOverview: {
      headline: "先拆開問題",
      summary: "不同程序回答不同問題。",
      lanes: [{ kind: "administrative", label: "行政", finding: "有行政缺失", proofScope: "不等於刑事責任", sources: [laneSource] }],
      phases: [
        { period: "2022", title: "第一階段：程序建檔", summary: "公開事件", turningPoint: "程序不同", eventKeys: ["event-phase"], sources: [phaseSource] },
        { period: "2023", title: "沒有事件鍵的補充階段", summary: "仍應出現在脈絡總覽。", turningPoint: "保留舊資料相容性", sources: [phaseSource] },
        { period: "2024", title: "第二階段：程序追蹤", summary: "另一個公開事件", turningPoint: "進入後續程序", eventKeys: ["event-phase-two"], sources: [phaseSource] },
      ],
    },
    proceedingTracks: [{ kind: "administrative", label: "行政調查", body: "測試機關", question: "有無行政缺失？", conclusion: "已作成調查結論。", effect: "要求改善。", doesNotConclude: ["不等於刑事有罪。"], status: "已公布", nextStep: "追查改善", sources: [proceedingSource] }],
    reportedTimeline: [
      { publicKey: "event-phase", occurredAt: "2022-07", precision: "month", kindLabel: "調查", headline: "爭議爆發", sourceRefs: [phaseSource.publicRef], items: [{ status: "verified", ...claim, sources: [phaseSource] }] },
      { publicKey: "event-phase-two", occurredAt: "2024-01", precision: "month", kindLabel: "追蹤", headline: "後續程序", sourceRefs: [phaseSource.publicRef], items: [{ status: "verified", ...claim, sources: [phaseSource] }] },
    ],
  };
  const model = buildDossierPageModel(evidence);
  const html = renderToStaticMarkup(<TopicPage params={{ slug: "benzopyrene-food-safety" }} projectionOverride={evidence} />);

  assert.equal(model.contextOverview?.phases.length, 3);
  assert.equal(model.timelinePhases.length, 2);
  assert.equal(model.timelinePhases[0]?.groups[0]?.events[0]?.publicKey, "event-phase");
  assert.equal(model.timelinePhases[1]?.groups[0]?.events[0]?.publicKey, "event-phase-two");
  assert.deepEqual(model.unphasedContextPhases.map(({ title }) => title), ["沒有事件鍵的補充階段"]);
  assert.equal(model.unphasedTimelineGroups.length, 0);
  assert.match(html, /2 個階段，串起事件的關鍵轉折/);
  assert.equal(html.match(/第一階段：程序建檔/g)?.length, 1);
  assert.equal(html.match(/沒有事件鍵的補充階段/g)?.length, 1);
  assert.equal(html.match(/第二階段：程序追蹤/g)?.length, 1);
  assert.equal(html.match(/轉折 · TW Issues 分析/g)?.length, 3);
  assert.match(html, /從 3 個問題進入/);
  assert.match(html, /href="#progress"/);
  assert.match(html, /href="#responsibility-lines"/);
  assert.match(html, /href="#proceedings"/);
  assert.doesNotMatch(html, /href="#administration-actions"/);
  assert.doesNotMatch(html, /href="#narratives"/);
  assert.doesNotMatch(html, /href="#questions"/);
  assert.equal(model.sourceById.get("context-lane")?.publisher, "責任線來源");
  assert.equal(model.sourceById.get("context-phase")?.publisher, "階段來源");
  assert.equal(model.sourceById.get("proceeding-source")?.publisher, "程序來源");
});

test("model orders political narratives by occurrence date while preserving same-day ledger order", () => {
  const narrative = (publicKey: string, occurredAt: string): NonNullable<PublicEvidenceProjection["politicalNarratives"]>[number] => ({ publicKey, occurredAt, arena: "選舉", headline: publicKey, speaker: { name: "測試人物", role: "候選人" }, statement: "具名說法", status: "attributed", proofScope: "只證明曾如此表示", limitations: ["不證明真相"], sources: [source] });
  const model = buildDossierPageModel({ topicId: "narrative-order", claims: [], attributedClaims: [], openQuestions: [], politicalNarratives: [narrative("late", "2022-11-25"), narrative("same-a", "2022-11-16"), narrative("early", "2022-11-02"), narrative("same-b", "2022-11-16")] });
  assert.deepEqual(model.politicalNarratives.map(({ publicKey }) => publicKey), ["early", "same-a", "same-b", "late"]);
});

test("every publicRef uses one canonical source metadata record within its projection", () => {
  const sourceFingerprints = (value: unknown, records = new Map<string, Set<string>>()) => {
    if (Array.isArray(value)) {
      value.forEach((item) => sourceFingerprints(item, records));
      return records;
    }
    if (!value || typeof value !== "object") return records;
    const candidate = value as Record<string, unknown>;
    if (["publicRef", "canonicalUrl", "title", "publisher", "publishedAt", "displayRole"].every((key) => typeof candidate[key] === "string")) {
      const publicRef = candidate.publicRef as string;
      const fingerprints = records.get(publicRef) ?? new Set<string>();
      fingerprints.add(JSON.stringify([
        candidate.canonicalUrl,
        candidate.title,
        candidate.publisher,
        candidate.publishedAt,
        candidate.displayRole,
      ]));
      records.set(publicRef, fingerprints);
    }
    Object.values(candidate).forEach((item) => sourceFingerprints(item, records));
    return records;
  };

  for (const [slug, evidence] of Object.entries(publicEvidenceBySlug)) {
    for (const [publicRef, fingerprints] of sourceFingerprints(evidence)) {
      assert.equal(fingerprints.size, 1, `${slug}:${publicRef} has conflicting source metadata`);
    }
  }
});

test("Hsinchu model exposes the primary document, public-safe coverage limits, and six complete chapter groups", () => {
  const model = buildDossierPageModel(
    publicEvidenceBySlug["hsinchu-baseball-stadium"],
    { topic: { slug: "hsinchu-baseball-stadium", title: "新竹棒球場爭議", topicId: "hsinchu-baseball-stadium-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true }, displayTitle: "新竹棒球場爭議" },
  );

  assert.deepEqual(model.coverageLimits.map(({ gap, gapReason, sourceRefs, ...rest }) => ({ gap, gapReason, sourceRefs, rest })), [
    {
      gap: "主案不起訴已獲公開報導；後續仍待補齊官方完整處分書、第三方公開影像未涵蓋的頁面、正式再議聲請與結果，以及刑案結束後的行政究責文件。",
      gapReason: "目前可核對的是第三方社群公開之具印文處分書頁面影像第 3–22 頁；市府在不起訴消息公布後表示將提出再議。這些材料仍不能替代官方完整全文，也不能證明正式再議已送件、受理、維持或撤銷不起訴；缺口不代表任何一方沒有立場或責任。",
      sourceRefs: ["source-01", "source-09", "source-34"],
      rest: {},
    },
    {
      gap: "BrightView檢測採購／疑洩密案的終結狀態未明，且不得與2026年林智堅等人主案處分混寫。",
      gapReason: "只找到2024年搜索、約談、交保及當時偵辦中的報導；未找到可辨識的起訴、不起訴、併案或再議處分。這是公開資料限制，不是絕對證明案件尚未處分。",
      sourceRefs: ["source-37", "source-36"],
      rest: {},
    },
    {
      gap: "目前未取得同時具備原始貼文、作者、日期及可封存連結的社群節點；因此只呈現可回查的媒體傳播，不把轉發量當成民意或事實證據。",
      gapReason: "目前未取得同時具備原始貼文、作者、日期及可封存連結的社群節點；因此只呈現可回查的媒體傳播，不把轉發量當成民意或事實證據。",
      sourceRefs: ["source-10", "source-11"],
      rest: {},
    },
  ]);
  assert.notEqual(model.coverageLimits[0].gap, model.coverageLimits[0].gapReason);
  for (const limit of model.coverageLimits) {
    for (const internalField of ["coverageStatus", "actorRole", "searchedAt", "searchQueries", "readiness"]) {
      assert.equal(internalField in limit, false, `${internalField} must not enter the public-safe view model`);
    }
  }

  assert.equal(model.primaryDocument?.source.publicRef, "source-58");
  assert.equal(model.primaryDocument?.coverage.firstObservedPage, 3);
  assert.equal(model.primaryDocument?.coverage.lastObservedPage, 22);
  assert.equal(model.publicSources.length, 58);
  assert.equal(model.publicSources.filter(({ publicRef }) => publicRef === "source-58").length, 1);
  assert.equal(model.hsinchuChapters.length, 6);
  assert.deepEqual(model.hsinchuChapters.map(({ href }) => href), [
    "#primary-document-reading", "#claims", "#progress", "#people", "#analysis", "#social-observations",
  ]);
  assert.deepEqual(model.hsinchuChapters.flatMap(({ links }) => links.map(({ href }) => href)), [
    "#primary-document-reading", "#context", "#responsibility-lines", "#coverage-limits",
    "#claims", "#questions",
    "#progress", "#administration-actions", "#proceedings",
    "#people", "#reports", "#narratives",
    "#analysis",
    "#social-observations", "#sources",
  ]);
  assert.equal(model.editorialPositions?.length, 0);
  assert.doesNotMatch(JSON.stringify(model.hsinchuChapters), /positions/);
});

test("primary-document data is omitted from sparse and non-Hsinchu models", () => {
  const primaryDocument = publicEvidenceBySlug["hsinchu-baseball-stadium"].primaryDocument;
  assert.ok(primaryDocument);
  const sparseHsinchu = buildDossierPageModel({
    topicId: "hsinchu-baseball-stadium-2026",
    claims: [],
    attributedClaims: [],
    openQuestions: [],
  });
  const nonHsinchu = buildDossierPageModel({
    topicId: "another-topic",
    primaryDocument,
    claims: [],
    attributedClaims: [],
    openQuestions: [],
  });

  assert.equal(sparseHsinchu.primaryDocument, undefined);
  assert.doesNotMatch(JSON.stringify(sparseHsinchu.hsinchuChapters), /primary-document/);
  assert.equal(nonHsinchu.primaryDocument, undefined);
  assert.equal(nonHsinchu.hsinchuChapters.length, 0);
  assert.equal(nonHsinchu.sourceById.has("source-58"), false);
  for (const model of [sparseHsinchu, nonHsinchu]) {
    const chapterLinks = model.hsinchuChapters.flatMap(({ href, links }) => [href, ...links.map((link) => link.href)]);
    assert.doesNotMatch(JSON.stringify(chapterLinks), /#primary-document(?:-reading)?/);
  }
});

test("Hsinchu attribution reconciliation is positional, time-bounded, and preserves limitation variants", () => {
  const projection = publicEvidenceBySlug["hsinchu-baseball-stadium"];
  const model = buildDossierPageModel(projection, {
    topic: { slug: "hsinchu-baseball-stadium", title: "新竹棒球場爭議", topicId: "hsinchu-baseball-stadium-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true },
    displayTitle: "新竹棒球場爭議",
  });
  const cityClaims = model.attributedSpeakerGroups[0]?.claims ?? [];
  assert.equal(cityClaims.length, 2);
  assert.deepEqual(cityClaims[0]?.limitations, [
    "市府說法不是驗收合格證書，也不證明球場已重新開放職棒賽事。",
    "衝擊吸收、垂直變形、能量返還及球滾動等測試的完整原始報告仍待公開。",
    "完整性能測試報告仍待公開。",
  ]);
  assert.deepEqual(cityClaims[1]?.limitations, [
    "市府提出告發或求償不等於司法機關已認定廠商有罪或應負最終金額。",
    "未取得完整結算、求償起訴狀及停權審查結果，不能把主張寫成確定責任。",
    "提出告發或求償不等於司法機關已認定廠商有罪或應負最終金額。",
    "完整結算、求償及停權結果仍待取得。",
  ]);
  assert.deepEqual(model.attributedReports.map(({ category, claim }) => [category, claim.sources.map(({ publicRef }) => publicRef)]), [
    ["institutional", ["source-06"]],
    ["institutional", ["source-06"]],
    ["procedural-report", ["source-09"]],
  ]);
  assert.equal(model.attributedReports[2]?.claim.speakers?.[0]?.name, "聯合報");

  const drifted = structuredClone(projection) as typeof projection;
  drifted.attributedClaims[0].statement = "漂移後的市府說法。";
  assert.throws(
    () => buildDossierPageModel(drifted, {
      topic: { slug: "hsinchu-baseball-stadium", title: "新竹棒球場爭議", topicId: "hsinchu-baseball-stadium-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true },
      displayTitle: "新竹棒球場爭議",
    }),
    /Hsinchu attributed mapping drift/,
  );

  for (const [label, mutate] of [
    ["statement", (candidate: typeof projection) => { candidate.attributedSpeakerGroups![1].claims[0].statement = "漂移後的檢方說法。"; }],
    ["proof scope", (candidate: typeof projection) => { candidate.attributedSpeakerGroups![1].claims[0].proofScope = "漂移後的證明範圍。"; }],
    ["limitations", (candidate: typeof projection) => { candidate.attributedSpeakerGroups![1].claims[0].limitations.push("漂移後的限制。"); }],
    ["source reference", (candidate: typeof projection) => { candidate.attributedSpeakerGroups![1].claims[0].sources[0].publicRef = "source-drift"; }],
  ] as const) {
    const prosecutorDrift = structuredClone(projection) as typeof projection;
    mutate(prosecutorDrift);
    assert.throws(
      () => buildDossierPageModel(prosecutorDrift, {
        topic: { slug: "hsinchu-baseball-stadium", title: "新竹棒球場爭議", topicId: "hsinchu-baseball-stadium-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true },
        displayTitle: "新竹棒球場爭議",
      }),
      /Hsinchu attributed mapping drift/,
      `must fail closed when prosecutor ${label} drifts`,
    );
  }
});

test("Hsinchu reconciliation requires metadata and projection identities to agree", () => {
  const projection = publicEvidenceBySlug["hsinchu-baseball-stadium"];
  const model = buildDossierPageModel(projection, {
    topic: { slug: "benzopyrene-food-safety", title: "苯駢芘食安", topicId: "benzopyrene-food-safety-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true },
    displayTitle: "苯駢芘食安",
  });

  assert.deepEqual(model.attributedSpeakerGroups, projection.attributedSpeakerGroups);
  assert.deepEqual(model.attributedReports, []);
});

test("Hsinchu preserves all 16 timeline events and 17 inner items with their evidence boundaries", () => {
  const sourceProjection = publicEvidenceBySlug["hsinchu-baseball-stadium"];
  const model = buildDossierPageModel(sourceProjection, {
    topic: { slug: "hsinchu-baseball-stadium", title: "新竹棒球場爭議", topicId: "hsinchu-baseball-stadium-2026", lastUpdated: "2026-08-29", publicEvidenceAvailable: true },
    displayTitle: "新竹棒球場爭議",
  });
  const items = model.timelineGroups.flatMap(({ events }) => events.flatMap(({ items: eventItems }) => eventItems));
  assert.equal(model.timelineGroups.flatMap(({ events }) => events).length, 16);
  assert.equal(items.length, 17);
  assert.deepEqual(items, sourceProjection.reportedTimeline?.flatMap(({ items: eventItems }) => eventItems));
  assert.deepEqual(model.collections.map(({ claims }) => claims.length), [12, 8]);
  assert.equal(model.administrationActions.length, 12);
  assert.equal(model.proceedingTracks.length, 6);
  assert.equal(model.publicPeople.length, 13);
  assert.equal(model.politicalNarratives.length, 9);
  assert.equal(model.analysisClaims?.length, 5);
  assert.equal(model.socialObservations.length, 10);
  assert.equal(model.publicSources.length, 58);
});
