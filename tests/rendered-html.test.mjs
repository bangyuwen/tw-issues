import assert from "node:assert/strict";
import test from "node:test";

const root = new URL("../", import.meta.url);
const routes = [
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

test("index selects the ten most recently updated deep-research topics", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
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
  assert.match(html, /href="\/topics\/taipei-tree-governance"/);
  assert.doesNotMatch(html, /href="\/topics\/energy-disinfo"/);
  assert.doesNotMatch(html, /內部議題快照|僅限內部存取|internal_only|disputed/);
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

  const progress = html.match(/id="progress"[\s\S]*?<section class="evidence-section" id="claims"/)?.[0] ?? "";
  const reported = html.match(/id="reports"[\s\S]*?<\/section>/)?.[0] ?? "";
  const knownInformation = html.match(/id="claims"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(progress.indexOf("2026-07-17") < progress.indexOf("2026-07-04"));
  assert.match(reported, /不同主體怎麼說/);
  assert.match(html, /18 項產品、30 個批號及 360 家流向業者/);
  assert.match(html, /臺中市政府/);
  assert.match(html, /未附業者間通知原件|未能取得原始通報文件/);
  assert.doesNotMatch(knownInformation, /已證實南僑/);
});

test("food-safety page covers response and follow-up stages without promoting statements", async () => {
  const response = await render("/topics/benzopyrene-food-safety");
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const text of ["專家會議", "南僑", "29 批", "第三批", "2.9 微克", "排除食油煉製", "巴西黃豆含水量過多", "乾燥與燻蒸時間延長", "烘烤熱損傷", "根因尚未定論"]) {
    assert.match(html, new RegExp(text));
  }
  const knownInformation = html.match(/id="claims"[\s\S]*?<\/section>/)?.[0] ?? "";
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
  const progress = html.match(/id="progress"[\s\S]*?<section class="evidence-section" id="claims"/)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.ok(progress.length > 0);
  assert.equal((progress.match(/class="event-date-group"/g) ?? []).length, 14);
  assert.equal((progress.match(/data-date-key="2026-07-17"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-18"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-19"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-20"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-21"/g) ?? []).length, 1);
  assert.equal((progress.match(/data-date-key="2026-07-27"/g) ?? []).length, 1);
  assert.ok(progress.indexOf('data-date-key="2026-07-27"') < progress.indexOf('data-date-key="2026-07-23"'));
  assert.ok(progress.indexOf('data-date-key="2026-07-23"') < progress.indexOf('data-date-key="2026-07-21"'));
  assert.match(progress, /class="event-history-disclosure"><summary>展開較早的 11 個日期<\/summary>/);
  assert.doesNotMatch(progress, /class="event-history-disclosure" open=""/);
  assert.equal((progress.match(/class="event-disclosure"/g) ?? []).length, 25);
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
  const knownInformation = html.match(/id="claims"[\s\S]*?<\/section>/)?.[0] ?? "";
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
  assert.match(html, /class="verified-claim-list"/);
  assert.doesNotMatch(html, /class="fact-grid fact-grid--verified"/);
  assert.match(html, /class="fact-grid fact-grid--open"/);
  assert.match(html, /class="claim-boundary"/);
  assert.doesNotMatch(html, />證據邊界</);
  assert.match(html, />這能確認</);
  assert.match(html, />這不能證明</);
  assert.match(html, /class="claim-sources"/);
  assert.match(html, /class="sources-disclosure" id="sources"/);
  assert.match(html, /資料與來源 · (?:<!-- -->)?35(?:<!-- -->)? 筆/);
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
  const progress = html.match(/id="progress"[\s\S]*?<section class="evidence-section" id="claims"/)?.[0] ?? "";
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
  assert.match(sources, /<a[^>]+href="https?:\/\/[^\"]+"[^>]*>[^<]*(?:政府|署|報|中心|院)/);
  assert.doesNotMatch(html, /社群共識/);

  const knownInformation = html.match(/id="claims"[\s\S]*?<\/section>/)?.[0] ?? "";
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
