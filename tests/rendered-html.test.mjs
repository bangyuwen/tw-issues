import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const publicEvidence = JSON.parse(await readFile(new URL("app/public-evidence.json", root), "utf8"));
const hsinchuPrimaryDocument = publicEvidence["hsinchu-baseball-stadium"].primaryDocument;
const routes = [
  "/topics/hsinchu-baseball-stadium",
  "/topics/ezway-preauthorization",
  "/topics/benzopyrene-food-safety",
  "/topics/cross-border-intimidation",
  "/topics/typhoon-governance",
  "/topics/budget-delay-governance",
  "/topics/defense-procurement",
  "/topics/self-defense-readiness",
  "/topics/taipei-tree-governance",
  "/topics/flood-budget-bottleneck",
  "/topics/japan-taiwan-alliance",
  "/topics/transnational-repression",
];

async function render(pathname) {
  const workerUrl = new URL("dist/server/index.js", root);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function claimsBoard(html) {
  const start = html.indexOf('<section class="evidence-board');
  const reports = html.indexOf('<section class="evidence-section" id="reports"', start);
  return html.slice(start, reports >= 0 ? reports : html.length);
}

function verifiedClaims(html) {
  const start = html.indexOf('data-collection-id="claims"');
  const open = html.indexOf('data-collection-id="questions"', start);
  return html.slice(start, open >= 0 ? open : html.length);
}

test("index selects the twelve most recently updated deep-research topics", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /新竹棒球場爭議/);
  assert.match(html, /EZ WAY 易利委預先委任/);
  assert.match(html, /臺北樹木治理/);
  assert.match(html, /中央總預算延宕/);
  assert.match(html, /跨境恐嚇事件/);
  assert.match(html, /食用油苯駢芘超標/);
  assert.match(html, /軍購預算政治攻防/);
  assert.match(html, /自我防衛與韌性/);
  assert.match(html, /治水預算卡關/);
  assert.match(html, /台日安全合作/);
  assert.match(html, /中共跨境鎮壓/);
  assert.doesNotMatch(html, /HIMARS 演訓嚇阻/);
  assert.doesNotMatch(html, /證據構成比較|研究總覽數字|來源角色分布|原始／制度紀錄/);
  assert.doesNotMatch(html, /research-kpis|evidence-overview|source-role-overview/);
  assert.match(html, /最近收錄/);
  assert.match(html, /事件類型/);
  assert.match(html, /已確認/);
  assert.match(html, /具名說法/);
  assert.match(html, /待釐清/);
  assert.doesNotMatch(html, /公開資料補強中/);
  assert.match(html, /公開證據可讀/);
  assert.match(html, /href="\/topics\/defense-procurement"/);
  assert.match(html, /href="\/topics\/hsinchu-baseball-stadium"/);
  assert.match(html, /href="\/topics\/taipei-tree-governance"/);
  assert.doesNotMatch(html, /href="\/topics\/energy-disinfo"/);
  assert.doesNotMatch(html, /內部議題快照|僅限內部存取|internal_only|disputed/);
});

test("Hsinchu stadium page presents people, political narratives, and evidence boundaries", async () => {
  const response = await render("/topics/hsinchu-baseball-stadium");
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const text of [
    "未正式驗收即先使用",
    "30分鐘內排水",
    "林智堅、巨佳營造及相關被告",
    "4名營造及監造人員",
    "各支付4萬元",
    "各次契約變更有具體原因",
    "不法金流",
    "B5類剩餘土石方",
    "36.245立方公尺",
    "不同主體怎麼說",
    "改善工程已竣工",
    "仍待釐清",
    "完整處分書",
    "關鍵人物",
    "政治敘事與擴散",
    "一座球場，五條責任線，不能用同一個結論回答",
    "工程與行政責任",
    "刑事偵查結果",
    "民事與契約責任",
    "政治攻防與傳播",
    "球場能否重新使用",
    "從重建計畫走到統包工程",
    "調查、改善與選舉攻防同時展開",
    "不起訴不是句點",
    "高虹安市府上任後做了什麼？",
    "不等於高虹安本人親自執行",
    "盤點缺失、暫不承接 WBC 熱身賽",
    "成立工程體檢會並委託外部場務檢測",
    "檢測服務標案另案接受檢廉調查",
    "BrightView檢測採購／疑洩密案",
    "未決／公開資料未見終結",
    "交保是偵查中強制處分，不是罪責結論",
    "解除部分球場工程契約",
    "限期移除覆土、另案決標後配合法院證據保全",
    "未見台灣省結構工程技師公會有刻意延宕",
    "邱臣遠代理市長期間",
    "邱臣遠",
    "田政弘",
    "移除超載覆土並完成清運",
    "開挖發現異物並由竹檢另行分案",
    "另案發包改善工程，重建基底、排水、結構與草皮",
    "高強度實戰壓力賽",
    "高虹安復職後",
    "與龍來終止原營運關係",
    "2025年3月已表示啟動",
    "宣布將依法提出再議，民刑事與履約程序分流",
    "工程已竣工並進入驗收",
    "原訂時程曾多次後移",
    "沈慧虹",
    "林耕仁",
    "黃國昌",
    "林為洲",
    "高虹安以「12億元棒球場」連結政黨輪替訴求",
    "楊玲宜以不起訴結果反批政治操作",
    "高虹安以「不起訴不等於工程合格」回應",
    "大規模開挖使現場已無法驗收",
    "個程序各自回答什麼",
    "市府與統包商契約爭議",
    "統包商與下包商民事案",
    "巨佳營造與下包商揚名實業間約737萬元工程款民事一審",
    "框架 · TW Issues 分析",
    "相較前一階段 · TW Issues 分析",
    "2026-08-29",
    "沒有符合原始貼文、作者、日期與封存連結門檻的社群節點",
    "非代表性社群觀察",
    "批評樣本",
    "反向聲音",
    "PTT 球迷討論把 2022 到 2026 仍在施工視為",
    "政治提款機",
    "非隨機樣本，不能代表民意或事件真相",
    "新竹棒球場案不起訴處分書具印文頁面影像",
    "公開來源：",
    "楊玲宜 Threads",
    "文件頁面可見紅色騎縫印文・由第三方社群公開・已遮蔽・僅涵蓋第 3–22 頁",
    "影像呈現具紅色騎縫印文的文件頁面原貌",
    "不能僅由印文判定持有人紙本為正本或副本。",
    "第 1–2 頁未附",
    "至少第 23–25 頁未附",
    "告發與移送內容",
    "待檢驗的主張，不是檢察官已認定的事實",
    "三個資訊層次，不能互相替代",
    "內容層次 1／3",
    "具印文頁面可見文字｜第三方公開",
    "文件第 18 頁",
    "已對照具印文頁面影像",
    "塑膠管為噴灌系統",
    "電線亦為施工公司鋪設，均非廢棄物",
    "內容層次 2／3",
    "楊玲宜貼文摘要｜具名說法",
    "內容層次 3／3",
    "TW Issues 分析｜非司法結論",
    "「大秘寶」屬政治傳播框架，不是這份處分書的法律用語",
  ]) {
    assert.match(html, new RegExp(text));
  }
  assert.match(html, /<dl class="primary-document-source-meta" aria-label="文件來源與擷取資訊">/);
  assert.match(html, /<dt>公開來源：<\/dt><dd>楊玲宜 Threads<\/dd>/);
  assert.match(html, /<ol class="primary-document-layer-list">/);
  assert.match(html, /<h5 id="primary-document-document-layer-title">具印文頁面可見文字｜第三方公開<\/h5>/);
  assert.match(html, /<h5 id="primary-document-attribution-title">楊玲宜貼文摘要｜具名說法<\/h5>/);
  assert.match(html, /<h5 id="primary-document-analysis-title">TW Issues 分析｜非司法結論<\/h5>/);
  const primaryDocumentLayers = ["內容層次 1／3", "內容層次 2／3", "內容層次 3／3"].map((label) => html.indexOf(label));
  assert.ok(primaryDocumentLayers.every((position) => position >= 0));
  assert.deepEqual(primaryDocumentLayers, [...primaryDocumentLayers].sort((left, right) => left - right));
  assert.match(html, /6<!-- --> 個程序各自回答什麼/);
  assert.match(html, /class="event-progress-section case-chronology"/);
  assert.match(html, /class="context-overview" id="context"/);
  assert.match(html, /class="context-lanes"/);
  assert.match(html, /class="chronology-phases"/);
  assert.match(html, /class="proceeding-matrix"/);
  assert.match(html, /class="administration-action-matrix"/);
  assert.equal((html.match(/class="administration-action-row/g) ?? []).length, 12);
  assert.match(html, /id="administration-actions"/);
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /id="main-content" tabindex="-1" class="hero hero-detail"/);
  assert.match(html, /class="dossier-meta dossier-meta--case"/);
  assert.match(html, /查看已列來源/);
  assert.match(html, /58<!-- --> 筆/);
  assert.match(html, /class="article-nav article-nav--case case-toc"/);
  assert.match(html, /id="case-contents"/);
  assert.match(html, /href="#primary-document-reading"[^>]*>.*?案情範圍與證據界線/);
  assert.match(html, /href="#primary-document-reading"[^>]*>文件頁段導讀/);
  const hsinchuNav = html.match(/<nav[^>]+id="case-contents"[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.doesNotMatch(hsinchuNav, /href="#primary-document"/);
  assert.match(html, /href="#context"[^>]*>.*?案情範圍/);
  assert.match(html, /href="#claims"[^>]*>.*?已知與未決/);
  assert.match(html, /href="#progress"[^>]*>.*?時間與程序/);
  assert.match(html, /href="#people"[^>]*>.*?人物與公開說法/);
  assert.match(html, /href="#analysis"[^>]*>.*?TW Issues 分析/);
  assert.match(html, /href="#social-observations"[^>]*>.*?補充社群樣本/);
  assert.doesNotMatch(html, /class="article-nav-groups"|class="case-map-nav"|案情問題導覽/);
  assert.match(html, /class="case-reading-legend"/);
  assert.match(html, /aria-label="來源 01：/);
  assert.doesNotMatch(html, /class="context-phases"/);
  const sourceFirstOrder = [
    'id="main-content"',
    'id="primary-document"',
    'class="case-reading-legend"',
    'id="case-contents"',
    'id="primary-document-reading"',
    'id="context"',
    'id="responsibility-lines"',
    'id="coverage-limits"',
  ].map((token) => html.indexOf(token));
  assert.ok(sourceFirstOrder.every((position) => position >= 0), "every source-first Hsinchu landmark is rendered");
  assert.deepEqual(sourceFirstOrder, [...sourceFirstOrder].sort((left, right) => left - right));
  assert.ok(html.indexOf('id="context"') < html.indexOf('id="claims"'), "context overview precedes known and unresolved evidence");
  assert.ok(html.indexOf('id="claims"') < html.indexOf('id="progress"'), "known and unresolved evidence precede the detailed timeline");
  assert.ok(html.indexOf('id="progress"') < html.indexOf('id="administration-actions"'), "timeline precedes the administration action audit");
  assert.ok(html.indexOf('id="administration-actions"') < html.indexOf('id="proceedings"'), "administration action audit precedes proceeding outcomes");
  assert.ok(html.indexOf('id="proceedings"') < html.indexOf('id="people"'), "procedural records precede people and public statements");
  assert.ok(html.indexOf('id="people"') < html.indexOf('id="reports"'), "people precede grouped attributed statements");
  assert.match(html, /id="reports"[\s\S]*?<h3>不同主體的公開說法。<\/h3>/);
  assert.ok(html.indexOf('id="reports"') < html.indexOf('id="narratives"'), "grouped statements precede political narratives");
  assert.ok(html.indexOf('id="narratives"') < html.indexOf('id="analysis"'), "political narratives precede editorial analysis");
  assert.match(html, /id="analysis"[\s\S]*?<h3>TW Issues 的分析<\/h3>/);
  assert.ok(html.indexOf('id="analysis"') < html.indexOf('id="social-observations"'), "editorial analysis precedes the supplemental social sample");
  assert.ok(html.indexOf('id="social-observations"') < html.indexOf('id="sources"'), "the supplemental social sample precedes sources");
  assert.ok(html.indexOf("朱立倫將球場爭議放入政黨治理攻防") < html.indexOf("高虹安把球場放入市政治理與廉能攻防"), "political narratives render in chronological order");
  assert.equal((html.match(/data-claim-zone="direct"/g) ?? []).filter(Boolean).length >= 6, true);
  assert.doesNotMatch(html, /展開其餘 2 項調查中的問題/);
  assert.match(html, /class="people-grid"/);
  assert.match(html, /class="narrative-matrix"/);
  assert.match(html, /id="people"/);
  assert.match(html, /id="narratives"/);
  assert.match(html, /不判定主觀操弄意圖/);
  assert.match(html, /class="sources-disclosure" id="sources"/);
  assert.match(html, /href="https:\/\/www\.threads\.com\/@yanglingyi2022\/post\/DcnfYAXEo-A"/);
  assert.match(html, /href="#source-58"/);
  assert.match(html, /id="source-58" data-source-ref="source-58"/);
  assert.equal((html.match(/id="source-58"/g) ?? []).length, 1);
  assert.match(html, /data-document-layer="allegation_or_referral"[^>]*><span>第 3–8 頁/);
  assert.doesNotMatch(html, /data-document-layer="prosecutorial_reasoning"[^>]*><span>第 3–8 頁/);
  assert.match(html, /data-review-status="checked_against_image"[^>]*>已對照具印文頁面影像/);
  assert.doesNotMatch(html, /第三方(?:社群)?重製|第三方重製影像/);
  assert.match(html, /這不是法院判決，也不是法官對高虹安或林智堅作成的認定/);
  assert.match(html, /頁面沒有寫高虹安本人開挖、鋪設或發現這些物件/);
  assert.doesNotMatch(html, /高虹安挖到(?:管線|電線)/);
  assert.doesNotMatch(html, /法官認定[^<]*(?:PE 網|噴灌管|電線)/);
  assert.doesNotMatch(html, /處分書(?:稱|認定)[^<]*大秘寶/);
  assert.match(html, /href="#source-49"/);
  assert.match(html, /監察院<!-- --> · <!-- -->2026-07-22/);
  assert.doesNotMatch(html, /data-claim-id|clm-|src-|internal_only|disputed/);
  assert.doesNotMatch(html, /data-date-key="2023-01-05"/);
  assert.doesNotMatch(html, /市府已提出再議|廠商已遭停權|田政弘已(?:起訴|不起訴)|BrightView案已併案/);
  assert.match(html, /不能直接等同工程驗收合格/);
  assert.match(html, /不等於職業賽事已恢復/);
});

test("every published route renders only claim projections and allowlisted sources", async () => {
  for (const pathname of routes) {
    const response = await render(pathname);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /命題追溯/);
    assert.doesNotMatch(html, /data-claim-id|clm-|src-|sourceRole|independenceGroup/);
    assert.doesNotMatch(html, /claim ID：|source role：|independence group：/);
    assert.match(html, /citation-tooltip/);
    assert.match(html, /class="sources-disclosure" id="sources"/);
    assert.match(html, /資料與來源 · (?:<!-- -->)?\d+(?:<!-- -->)? 筆/);
    assert.match(html, /class="source-title"/);
    assert.match(html, /class="source-meta"/);
    assert.doesNotMatch(html, /<time dateTime="現行規範">/);
    assert.doesNotMatch(html, /閱讀提示：/);
    assert.doesNotMatch(html, /本題證據剖面|本題來源組成|class="topic-infographic"/);
    assert.doesNotMatch(html, /current-issue|本次爭點|事實查核步驟|值得先問的問題/);
    assert.doesNotMatch(html, /internal strategy|internal_only|disputed|待補資料/);
  }
});

test("EZ WAY page explains pre-authorization without expanding the official scope", async () => {
  const response = await render("/topics/ezway-preauthorization");
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const text of [
    "EZ WAY 易利委預先委任",
    "2026 年 3 月 1 日",
    "預先確認委任",
    "申報相符",
    "申報不符",
    "實體健保卡",
    "完稅價格未逾新臺幣 5 萬元",
    "中央社 CNA",
    "空運通關體系風險",
    "不同主體怎麼說",
    "仍待釐清",
  ]) {
    assert.match(html, new RegExp(text));
  }
  assert.match(html, /財政部關務署/);
  assert.doesNotMatch(html, /個別包裹已完成通關|所有進口貨物都適用/);
  assert.doesNotMatch(html, /data-claim-id|clm-|src-/);
});

test("cross-border page publishes reviewed facts and clearly attributed statements", async () => {
  const response = await render("/topics/cross-border-intimidation");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Freedom House 發布跨國鎮壓全球追蹤報告/);
  assert.match(html, /不能證明什麼|href="#source-/);
  assert.match(html, /不同主體怎麼說|只證明陸委會採取何種行政協處/);
  assert.doesNotMatch(html, /id="src-intimidation-/);
  assert.doesNotMatch(html, /下一個就是你|個案司法責任/);
  assert.doesNotMatch(html, /src-intimidation-mac-statement/);
});

test("typhoon page publishes reviewed facts with explicit reporting boundaries", async () => {
  const response = await render("/topics/typhoon-governance");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /臺北市政府宣布 2026 年 7 月 10 日停止上班及上課/);
  assert.match(html, /不能證明什麼|id="source-/);
  assert.match(html, /市府公開提出的複合風險理由/);
  assert.doesNotMatch(html, /id="src-typhoon-/);
  assert.doesNotMatch(html, /src-typhoon-pts-report/);
});

test("budget page preserves the full chronology and separates party claims", async () => {
  const response = await render("/topics/budget-delay-governance");
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const text of [
    "19</strong><span>筆可核對來源",
    "歲出編列3兆350億元、歲入編列2兆8,623億元",
    "受限金額合計2,992億元",
    "一年所需經費335.6億元",
    "38項、約718億元",
    "民眾黨團並撤回復議案",
    "估計影響約89萬人",
    "170億元第一、第二預備金及災害準備金",
    "既有法定義務、經常性與延續性支出仍可依預算法動支",
    "文化部媒宣費並未全刪，最終決議凍結800萬元",
    "7月15、16日仍排定續審",
  ]) {
    assert.match(html, new RegExp(text));
  }
  assert.match(html, /class="event-progress-section"/);
  assert.match(html, /依主體整理公開說法；不代表已確認或完整。/);
  assert.doesNotMatch(html, /article-nav--case/);
  assert.match(html, /AI 自動製作說明/);
  assert.match(html, /請以頁面列出的原始資料與來源連結為準/);
  assert.doesNotMatch(html, /data-claim-id/);
});

test("food-safety page separates public facts, reported chronology, and open questions", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /每公斤 8.1 微克/);
  assert.match(html, /每公斤 2.0 微克/);
  assert.match(html, /href="#source-03"/);
  assert.match(html, /href="#source-02"/);
  assert.match(html, /href="#source-04"/);
  assert.doesNotMatch(html, /id="src-bap-/);
  assert.match(html, /不同主體怎麼說/);
  assert.match(html, /class="speaker-group-summary"><span>摘要<\/span>/);
  assert.match(html, /class="speaker-group-details"><summary>查看 (?:<!-- -->)?\d+(?:<!-- -->)? 項具名說法<\/summary>/);
  assert.doesNotMatch(html, /class="speaker-group-details" open/);
  assert.match(html, /臺中市政府表示，南僑 6 月 10 日發現超標/);
  assert.match(html, /石崇良・衛生福利部部長/);
  assert.match(html, /仍待釐清/);
  assert.match(html, /公開資料尚未指出污染根因/);
  assert.doesNotMatch(html, /clm-bap-|src-bap-|data-claim-id/);
  assert.doesNotMatch(html, /已證實南僑 6 月 10 日發現超標/);

  const progress = html.match(/id="progress"[\s\S]*?<section[^>]+id="claims"/)?.[0] ?? "";
  const reported = html.match(/id="reports"[\s\S]*?<\/section>/)?.[0] ?? "";
  const knownInformation = verifiedClaims(html);
  assert.ok(progress.indexOf("2026-07-04") < progress.indexOf("2026-07-17"));
  assert.doesNotMatch(progress, /event-history-disclosure/);
  assert.match(reported, /不同主體怎麼說/);
  assert.match(html, /18 項產品、30 個批號及 360 家流向業者/);
  assert.match(html, /臺中市政府/);
  assert.match(html, /未附業者間通知原件|未能取得原始通報文件/);
  assert.doesNotMatch(knownInformation, /已證實南僑/);
});

test("food-safety page integrates open questions into the known-information reading path", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  const claimsStart = html.indexOf('<section class="evidence-board');
  const reportsStart = html.indexOf('<section class="evidence-section" id="reports"');
  const claimsSection = claimsBoard(html);
  const nav = html.match(/<nav class="article-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.ok(claimsStart >= 0 && reportsStart > claimsStart);
  assert.match(claimsSection, /class="evidence-board evidence-board--with-open evidence-board--split"/);
  assert.match(claimsSection, /<h2>知道哪裡還不知道[\s\S]*?比假裝有答案更重要/);
  assert.match(claimsSection, /data-collection-id="claims"[\s\S]*?data-collection-id="questions"/);
  assert.match(claimsSection, /id="questions" role="group"/);
  assert.doesNotMatch(claimsSection, /<section[^>]+id="questions"/);
  assert.match(nav, /href="#claims">已知資訊/);
  assert.doesNotMatch(nav, /href="#questions">仍待釐清/);
});

test("food-safety page covers response and follow-up stages without promoting statements", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const text of ["專家會議", "南僑", "29 批", "第三批", "2.9 微克", "排除食油煉製", "巴西黃豆含水量過多", "乾燥與燻蒸時間延長", "烘烤熱損傷", "根因尚未定論"]) {
    assert.match(html, new RegExp(text));
  }
  const knownInformation = verifiedClaims(html);
  for (const attributedText of ["南僑稱", "29 批", "第三批", "2.9 微克", "初步研判"]) {
    assert.doesNotMatch(knownInformation, new RegExp(attributedText));
  }
  assert.doesNotMatch(html, /與製程因素有關/);
  assert.doesNotMatch(html, /claim ID：|source role：|independence group：/);

  const socialIndex = html.indexOf("社群反應樣本");
  const sourcesIndex = html.indexOf('id="sources"');
  assert.ok(socialIndex >= 0 && sourcesIndex >= 0 && socialIndex < sourcesIndex);
});

test("food-safety durable events use date groups and accessible disclosures", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  const progress = html.match(/id="progress"[\s\S]*?<section[^>]+id="claims"/)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.ok(progress.length > 0);
  assert.equal((progress.match(/class="event-date-group"/g) ?? []).length, 15);
  assert.equal((progress.match(/data-date-key="2026-07-17"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-18"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-19"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-20"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-21"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-27"/g) ?? []).length, 1);
  assert.equal((progress.match(/class="event-disclosure"/g) ?? []).length, 26);
  assert.equal((progress.match(/class="event-disclosure" open=""/g) ?? []).length, 0);
  assert.equal((progress.match(/<summary>/g) ?? []).length, 26);
  assert.doesNotMatch(progress, /event-status-summary/);
  assert.doesNotMatch(progress, /1 項公開命題|筆事件來源/);
  assert.match(progress, />已確認</);
  assert.match(progress, />具名說法</);
  assert.match(progress, /說法歸屬/);
  assert.match(progress, /主管機關/);
  assert.doesNotMatch(progress, /（authority）/);
  assert.match(progress, />仍待釐清</);
  assert.match(progress, /查證|調查發現|補救處置|主管機關說明/);
  assert.match(progress, /源頭、製程、品質、異常通報與數位管理/);
  assert.match(progress, /質疑其他縣市未像宜蘭一樣由下游資料查出漏列批次/);
  assert.match(progress, /接力絕食/);
  assert.match(progress, /否認「輪班絕食」/);
  assert.match(progress, /多項管理缺失交互影響/);
  assert.match(progress, /未發現製程設備直接生成苯\(a\)駢芘的證據/);
  assert.match(progress, /復工計畫須由臺中市政府核定/);
  assert.match(progress, /連淨七批苦茶油送驗後有四批不合格/);
  assert.match(progress, /尚待立法院審議/);
  assert.match(progress, /下架回收 824,848 公斤/);
  const knownInformation = verifiedClaims(html);
  assert.doesNotMatch(knownInformation, /排除食油煉製|初步研判|根因仍未定論/);
  assert.doesNotMatch(
    knownInformation,
    /中央「蓋牌」|源頭、製程、品質、異常通報與數位管理/,
  );

  assert.doesNotMatch(html, /claim ID：|source role：|independence group：/);
  assert.ok(html.indexOf("社群反應樣本") < html.indexOf('id="sources"'));
  for (const anchor of progress.matchAll(/href="#(source-\d+)"/g)) {
    assert.match(html, new RegExp(`id="${anchor[1]}"`));
  }
  assert.doesNotMatch(progress, /clm-bap-|src-bap-|reviewDigest/);
});

test("military procurement page includes HIMARS while preserving procurement boundaries", async () => {
  const response = await render("/topics/defense-procurement");
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const text of ["HIMARS", "3分鐘", "可能軍售", "西部防區", "訓練火箭", "軍購特別條例"]) {
    assert.match(html, new RegExp(text));
  }
  assert.doesNotMatch(html, /去中心化指管|城鎮韌性|黑鷹|捷運/);
});

test("self-defense page keeps domestic resilience separate from military procurement", async () => {
  const response = await render("/topics/self-defense-readiness");
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const text of ["去中心化指管", "城鎮韌性", "黑鷹", "捷運", "全民皆兵", "演後評鑑"]) {
    assert.match(html, new RegExp(text));
  }
  assert.doesNotMatch(html, /HIMARS|3分鐘|可能軍售|發價書/);
});

test("topic pages use concise display titles and structured claim reading blocks", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();

  assert.match(html, /<h1>食用油苯駢芘超標<\/h1>/);
  assert.doesNotMatch(html, /<h1>苯駢芘超標沙拉油食安危機<\/h1>/);
  assert.match(html, /class="claim-scope"/);
  assert.match(html, /class="claim-limit"/);
  assert.match(html, /class="evidence-claim-list evidence-claim-list--verified"/);
  assert.doesNotMatch(html, /class="fact-grid fact-grid--verified"/);
  assert.match(html, /class="evidence-claim-list evidence-claim-list--open"/);
  assert.doesNotMatch(html, /class="fact-grid fact-grid--open"/);
  assert.match(html, /class="claim-boundary"/);
  assert.match(html, /class="evidence-board-header"[\s\S]*?>證據邊界</);
  assert.match(html, />這能確認</);
  assert.match(html, />這不能證明</);
  assert.match(html, /class="claim-sources"/);
  assert.match(html, /class="sources-disclosure" id="sources"/);
  assert.match(html, /資料與來源 · (?:<!-- -->)?36(?:<!-- -->)? 筆/);
  assert.doesNotMatch(html, /class="topic-infographic"|INFOGRAPHIC · 一張圖讀懂|證據路徑矩陣/);
});

test("topic pages use one progression-first hierarchy across different issues", async () => {
  const security = await (await render("/topics/defense-procurement")).text();
  const rights = await (await render("/topics/transnational-repression")).text();
  const governance = await (await render("/topics/budget-delay-governance")).text();

  for (const html of [security, rights, governance]) {
    const navigationIndex = html.indexOf('class="article-nav"');
    const progressIndex = html.indexOf('class="event-progress-section"');
    const claimsIndex = html.indexOf('id="claims"');
    const sourcesIndex = html.indexOf('class="sources-disclosure" id="sources"');
    assert.ok(navigationIndex >= 0 && progressIndex > navigationIndex);
    assert.ok(claimsIndex > progressIndex && sourcesIndex > claimsIndex);
    assert.doesNotMatch(html, /class="topic-infographic|class="topic-evidence-chart|class="topic-source-chart/);
    assert.match(html, /資料與來源 · (?:<!-- -->)?\d+(?:<!-- -->)? 筆/);
  }
});

test("food-safety recall updates keep the July 10 and July 11 claims separate", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  const progress = html.match(/id="progress"[\s\S]*?<section[^>]+id="claims"/)?.[0] ?? "";
  const july10 = progress.match(/data-date-key="2026-07-10"[\s\S]*?(?=class="event-date-group"|<\/div>\s*<\/section>)/)?.[0] ?? "";
  const july11 = progress.match(/data-date-key="2026-07-11"[\s\S]*?(?=class="event-date-group"|<\/div>\s*<\/section>)/)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.match(july10, /29 批/);
  assert.doesNotMatch(july10, /7 月 11 日|第三批|2\.9 微克/);
  assert.match(july11, /第三批/);
  assert.match(july11, /2\.9 微克/);
});

test("food-safety page presents anonymous compact social samples without identifiers", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /社群反應樣本/);
  assert.match(html, /非隨機樣本，不能代表民意或事件真相/);
  assert.match(html, /(?:N\s*=\s*2|樣本數[^<]*2)/);
  assert.match(html, /有人質疑異常資訊傳遞後的通報與責任。/);
  assert.match(html, /有人關注商品辨識、下架與退貨資訊是否清楚。/);
  for (const privateValue of ["internal-social-source", "@private-account", "private.example", "source-private-id", "private-record-a", "private-record-b"]) {
    assert.doesNotMatch(html, new RegExp(privateValue));
  }
  const nav = html.match(/<nav class="article-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.doesNotMatch(nav, /社群反應樣本|social-observations/);
  const sources = html.match(/id="sources"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(sources, /src-bap-|social_post|開啟原始來源/);
  assert.doesNotMatch(html, /aria-label="社群樣本來源"/);
  assert.match(sources, /<a[^>]+href="https?:\/\/[^\"]+"[^>]*>[^<]*(?:政府|署|報|中心|院)/);
  assert.doesNotMatch(html, /社群共識/);

  const knownInformation = verifiedClaims(html);
  assert.doesNotMatch(knownInformation, /clm-bap-social-/);
  assert.doesNotMatch(html, /本頁只顯示[^<]*public-ready/);
});

test("sensitive candidate-allegation research has no public route", async () => {
  const response = await render("/topics/candidate-accountability");
  assert.equal(response.status, 404);
  const index = await render("/");
  const html = await index.text();
  assert.doesNotMatch(html, /候選人的過往行為與公共責任/);
});

test("index does not describe every public section as public-ready facts", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /公開頁只放其中已通過 public-ready 驗證的命題/);
  assert.match(html, /已確認資訊、具名說法與仍待釐清會分開標示/);
});

test("unpublished and legacy aliases have no public route", async () => {
  for (const pathname of [
    "/topics/taiwan-self-defense-bargaining",
    "/topics/himars-visible-readiness",
    "/topics/energy-disinfo",
    "/topics/candidate-bullying-accountability",
  ]) {
    const response = await render(pathname);
    assert.equal(response.status, 404);
  }
});

test("Hsinchu renders six chapters, complete secondary targets, and public-safe coverage limits", async () => {
  const response = await render("/topics/hsinchu-baseball-stadium");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal((html.match(/class="[^"]*\s+case-toc-chapter(?:\s|")/g) ?? []).length, 6);
  const nav = html.match(/<nav id="case-contents"[\s\S]*?<\/nav>/)?.[0] ?? "";
  for (const target of [
    "primary-document-reading", "context", "responsibility-lines", "coverage-limits", "claims", "questions", "progress",
    "administration-actions", "proceedings", "people", "reports", "narratives", "analysis",
    "social-observations", "sources",
  ]) {
    assert.match(nav, new RegExp(`href="#${target}"`));
    assert.match(html, new RegExp(`(?:id|data-target)="${target}"`));
  }
  assert.doesNotMatch(nav, /href="#primary-document"/);
  const chapterOneTargets = ["primary-document-reading", "context", "responsibility-lines", "coverage-limits"]
    .map((target) => nav.indexOf(`href="#${target}"`));
  assert.ok(chapterOneTargets.every((position) => position >= 0));
  assert.deepEqual(chapterOneTargets, [...chapterOneTargets].sort((left, right) => left - right));
  const coverage = html.match(/<section[^>]+id="coverage-limits"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(coverage.length > 0);
  const renderedOrder = [
    'id="main-content"',
    'id="primary-document"',
    'class="case-reading-legend"',
    'id="case-contents"',
    'id="primary-document-reading"',
    'id="context"',
    'id="responsibility-lines"',
    'id="coverage-limits"',
  ].map((token) => html.indexOf(token));
  assert.ok(renderedOrder.every((position) => position >= 0));
  assert.deepEqual(renderedOrder, [...renderedOrder].sort((left, right) => left - right));
  assert.match(html, /<section[^>]+id="primary-document"[^>]+aria-labelledby="primary-document-title"/);
  assert.match(html, /<h2 id="primary-document-title">新竹棒球場案不起訴處分書具印文頁面影像<\/h2>/);
  assert.match(html, /<section[^>]+id="primary-document-reading"[^>]+aria-labelledby="primary-document-reading-title"/);
  assert.match(html, /<h3 id="primary-document-reading-title">[^<]+<\/h3>/);
  assert.match(coverage, /<h3 id="coverage-limits-title">這份公開紀錄還缺哪些文件？<\/h3>/);
  const firstCoverageGap = "主案不起訴已獲公開報導；後續仍待補齊官方完整處分書、第三方公開影像未涵蓋的頁面、正式再議聲請與結果，以及刑案結束後的行政究責文件。";
  const firstCoverageGapReason = "目前可核對的是第三方社群公開之具印文處分書頁面影像第 3–22 頁；市府在不起訴消息公布後表示將提出再議。這些材料仍不能替代官方完整全文，也不能證明正式再議已送件、受理、維持或撤銷不起訴；缺口不代表任何一方沒有立場或責任。";
  assert.ok(coverage.includes(`<p class="coverage-limit-gap">${firstCoverageGap}</p>`));
  assert.ok(coverage.includes(`<p class="coverage-limit-reason"><strong>缺口原因</strong>${firstCoverageGapReason}</p>`));
  assert.equal(coverage.split(firstCoverageGap).length - 1, 1);
  assert.equal(coverage.split(firstCoverageGapReason).length - 1, 1);
  assert.ok(coverage.indexOf("主案不起訴已獲公開報導") < coverage.indexOf("市府在不起訴消息公布後表示將提出再議"));
  assert.doesNotMatch(coverage, /市府已宣布將提出再議；目前已有第三方社群公開之具印文處分書頁面影像第 3–22 頁/);
  assert.match(coverage, /BrightView檢測採購／疑洩密案的終結狀態未明/);
  assert.match(coverage, /目前未取得同時具備原始貼文、作者、日期及可封存連結的社群節點/);
  assert.doesNotMatch(coverage, /coverageStatus|actorRole|searchedAt|searchQueries|readiness|GAPS_DISCLOSED|partial|not_promoted/);
  assert.match(html, /class="speaker-statement-date"[\s\S]*?來源日期[\s\S]*?2026-08-22/);
  assert.match(html, /具名程序報告/);
  assert.match(html, /聯合報/);
  assert.match(html, /source-09/);
  assert.match(html, /機關名稱不代表不同任期、首長或執政黨的立場相同/);
  const visibleDocument = html.slice(0, html.indexOf("<script>self.__VINEXT_RSC_CHUNKS__"));
  const gatewayStart = visibleDocument.indexOf('id="primary-document"');
  const guideStart = visibleDocument.indexOf('id="primary-document-reading"');
  const contextStart = visibleDocument.indexOf('id="context"');
  const gateway = visibleDocument.slice(gatewayStart, visibleDocument.indexOf('class="case-reading-legend"'));
  const guide = visibleDocument.slice(guideStart, contextStart);
  assert.ok(gatewayStart >= 0 && guideStart >= 0 && contextStart >= 0);
  for (const gatewayOnlyText of [
    "新竹棒球場案不起訴處分書具印文頁面影像",
    "文件頁面可見紅色騎縫印文・由第三方社群公開・已遮蔽・僅涵蓋第 3–22 頁",
    "影像呈現具紅色騎縫印文的文件頁面原貌",
    "第 1–2 頁未附",
    "至少第 23–25 頁未附",
    "不能僅由印文判定持有人紙本為正本或副本。",
  ]) {
    const escaped = gatewayOnlyText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.equal(visibleDocument.split(gatewayOnlyText).length - 1, 1, `${gatewayOnlyText} has one visible owner`);
    assert.match(gateway, new RegExp(escaped));
    assert.doesNotMatch(guide, new RegExp(escaped));
  }
  assert.equal((visibleDocument.match(/class="primary-document-source-meta"/g) ?? []).length, 1);
  assert.equal((visibleDocument.match(/href="https:\/\/www\.threads\.com\/@yanglingyi2022\/post\/DcnfYAXEo-A"/g) ?? []).length, 2, "one gateway action plus one source-registry canonical link");
  assert.equal((gateway.match(/href="#source-58"/g) ?? []).length, 1);
  assert.doesNotMatch(guide, /href="#source-58"/);
  assert.match(gateway, /href="#primary-document-reading"/);
  assert.match(guide, /href="#primary-document"/);
  for (const guideOnlyText of [
    "先分辨文件每一段在做什麼",
    "已對照具印文頁面影像",
    "內容層次 1／3",
    "內容層次 2／3",
    "內容層次 3／3",
    "這份文件不能直接推出",
    "這不是法院判決，也不是法官對高虹安或林智堅作成的認定",
  ]) {
    assert.equal(visibleDocument.split(guideOnlyText).length - 1, 1, `${guideOnlyText} remains once`);
    assert.match(guide, new RegExp(guideOnlyText));
  }
  const detailedGuideValues = [
    ...hsinchuPrimaryDocument.guide.flatMap(({ pageRange, label, summary }) => [pageRange, label, summary]),
    ...hsinchuPrimaryDocument.excerpts.flatMap(({ text, proofScope, limitations }) => [text, proofScope, ...limitations]),
    hsinchuPrimaryDocument.posterAttribution.proofScope,
    ...hsinchuPrimaryDocument.posterAttribution.limitations,
    hsinchuPrimaryDocument.analysisBoundary.summary,
    ...hsinchuPrimaryDocument.analysisBoundary.limitations,
    ...hsinchuPrimaryDocument.nonConclusions,
  ];
  for (const value of new Set(detailedGuideValues)) {
    assert.equal(visibleDocument.split(value).length - 1, 1, `${value} remains once in visible HTML`);
    assert.ok(guide.includes(value), `${value} remains owned by the detailed guide`);
  }
  assert.equal((guide.match(/class="primary-document-guide"/g) ?? []).length, 1);
  assert.equal((guide.match(/data-document-layer=/g) ?? []).length, hsinchuPrimaryDocument.guide.length);
  assert.equal((guide.match(/class="primary-document-excerpt" aria-label=/g) ?? []).length, hsinchuPrimaryDocument.excerpts.length);
  assert.equal((guide.match(/class="primary-document-layer-item /g) ?? []).length, 3);
  for (const id of [
    "primary-document", "primary-document-title", "primary-document-coverage-title", "primary-document-reading",
    "primary-document-reading-title", "primary-document-guide-title", "primary-document-layers-title",
    "primary-document-document-layer-title", "primary-document-excerpt-title", "primary-document-attribution-title",
    "primary-document-analysis-title", "primary-document-non-conclusions-title", "coverage-limits",
  ]) {
    assert.equal((visibleDocument.match(new RegExp(`id="${id}"`, "g")) ?? []).length, 1, `${id} is unique`);
  }
  const cityStatement = "新竹市政府表示，改善工程已於日前竣工並自2026年8月20日起進入驗收，後續將進行場地性能測試；市府並稱人工草皮、紅土及排水系統已依國際標準調整。";
  assert.equal(visibleDocument.split(cityStatement).length - 1, 1, "mapped city-government statement should render once in visible HTML");
  assert.doesNotMatch(nav, /href="#positions"/);
  assert.doesNotMatch(html, /id="positions"/);
  const attributedSection = html.slice(html.indexOf('id="reports"'), html.indexOf('id="narratives"'));
  assert.doesNotMatch(attributedSection, /民進黨|國民黨|台灣民眾黨|民主進步黨/);
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  const headingLevels = [...visibleDocument.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    assert.ok(headingLevels[index] <= headingLevels[index - 1] + 1, `heading level jumps from h${headingLevels[index - 1]} to h${headingLevels[index]}`);
  }
  assert.doesNotMatch(html, /scrollspy|localStorage|sentiment|dashboard|filter|sticky/);
  assert.match(html, /href="#case-contents"[^>]*>回到本頁目錄/);
});

test("generic rendered topics retain the non-case navigation and disclosure contract", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /class="article-nav"/);
  assert.doesNotMatch(html, /case-toc|case-toc-chapter|dossier-shell--hsinchu|id="coverage-limits"|id="primary-document(?:-reading)?"|href="#primary-document(?:-reading)?"/);
  assert.match(html, /class="sources-disclosure" id="sources"/);
  assert.match(html, /href="#source-/);
  assert.match(html, /class="speaker-group-details"/);
  assert.doesNotMatch(html, /href="#case-contents"[^>]*>回到本頁目錄/);
});
