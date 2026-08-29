const conciseTitles: Record<string, string> = {
  "hsinchu-baseball-stadium": "新竹棒球場爭議",
  "ezway-preauthorization": "EZ WAY 易利委預先委任",
  "benzopyrene-food-safety": "食用油苯駢芘超標",
  "budget-delay-governance": "中央總預算延宕",
  "taipei-tree-governance": "臺北樹木治理",
  "defense-procurement": "軍購預算政治攻防",
  "self-defense-readiness": "自我防衛與韌性",
  "cross-border-intimidation": "跨境恐嚇事件",
  "typhoon-governance": "颱風與城市治理",
  "flood-budget-bottleneck": "治水預算卡關",
  "japan-taiwan-alliance": "台日安全合作",
  "transnational-repression": "中共跨境鎮壓",
};

export function getTopicDisplayTitle(slug: string, fallback: string) {
  return conciseTitles[slug] ?? fallback;
}

const topicVisuals: Record<string, { src: string; alt: string; caption: string }> = {
  "benzopyrene-food-safety": { src: "/topic-visuals/public-health.svg", alt: "食用油檢驗、流向與風險管理的主題視覺", caption: "公共健康 · 檢驗、流向、風險管理" },
  "budget-delay-governance": { src: "/topic-visuals/governance.svg", alt: "預算審議、制度程序與治理的主題視覺", caption: "制度治理 · 程序、決策、執行" },
  "taipei-tree-governance": { src: "/topic-visuals/city-environment.svg", alt: "城市樹木、環境與治理的主題視覺", caption: "城市環境 · 樹木、空間、韌性" },
  "defense-procurement": { src: "/topic-visuals/security.svg", alt: "防衛整備、合作與區域安全的主題視覺", caption: "安全防衛 · 整備、合作、嚇阻" },
  "self-defense-readiness": { src: "/topic-visuals/security.svg", alt: "自我防衛、城鎮韌性與社會協調的主題視覺", caption: "防衛韌性 · 指管、後勤、社會協調" },
  "cross-border-intimidation": { src: "/topic-visuals/human-rights.svg", alt: "跨境恐嚇、人身安全與公共底線的主題視覺", caption: "人權安全 · 跨境壓迫、保護、追責" },
  "typhoon-governance": { src: "/topic-visuals/city-environment.svg", alt: "颱風、城市治理與韌性的主題視覺", caption: "城市環境 · 災害、治理、韌性" },
  "flood-budget-bottleneck": { src: "/topic-visuals/city-environment.svg", alt: "治水、預算與城市韌性的主題視覺", caption: "城市環境 · 治水、預算、韌性" },
  "japan-taiwan-alliance": { src: "/topic-visuals/security.svg", alt: "台日合作、區域安全與嚇阻的主題視覺", caption: "區域安全 · 合作、整備、嚇阻" },
  "transnational-repression": { src: "/topic-visuals/human-rights.svg", alt: "跨國鎮壓、人權與法律追責的主題視覺", caption: "人權安全 · 監控、壓迫、追責" },
};

export function getTopicVisual(slug: string) {
  return topicVisuals[slug] ?? topicVisuals["budget-delay-governance"];
}

const ambiguousAttributionSubjects = /^(?:這份)?(?:研究|數據|資料|結果|報告|調查|統計|證據|文件|初步結果)|(?:研究|數據|資料|結果|報告|調查|統計|證據|文件|初步結果)$/;
const nestedReportingSubjects = /(?:轉述|引述)/;
const attributionVerbs = /(?:表示|指出|說明|稱|報導|公告|顯示|裁定|判決)/;
const embeddedClauseVerbs = /(?:認為|提到|透露|聲稱|強調|批評|質疑|呼籲|要求|主張|判斷|認定)/;
const leadingAttributionVerb = /^(?:表示|指出|說明|稱|報導|公告|顯示|裁定|判決)/;

export type TimelineStatementParse = {
  matched: boolean;
  attributionLabel: string;
  substantiveText: string;
};

export function parseTimelineStatement(statement: string): TimelineStatementParse {
  const fallback = { matched: false, attributionLabel: "", substantiveText: statement };
  const match = statement.match(/^([^，,；;。：:]{2,48}?)(表示|指出|說明|稱|報導|公告|顯示|裁定|判決)([，,:：]?)(\s*)(.+)$/);
  if (!match) return fallback;

  const [, rawActorAndDate, verb, delimiter, , substantiveText] = match;
  const actor = rawActorAndDate
    .replace(/\s*(?:於\s*)?\d{1,2}\s*月\s*\d{1,2}\s*日\s*(?:在[^，,:：；;。]{2,12})?\s*$/, "")
    .trim();
  const statementVerbsNeedDelimiter = ["表示", "指出", "說明", "稱", "顯示"];
  if (
    actor.length < 2
    || actor.length > 30
    || ambiguousAttributionSubjects.test(actor)
    || nestedReportingSubjects.test(actor)
    || attributionVerbs.test(actor)
    || embeddedClauseVerbs.test(actor)
    || leadingAttributionVerb.test(substantiveText.trim())
    || (statementVerbsNeedDelimiter.includes(verb) && !delimiter)
  ) return fallback;

  const action = ["報導", "公告", "顯示", "裁定", "判決"].includes(verb) ? verb : "說明";
  return { matched: true, attributionLabel: `${actor}${action}`, substantiveText: substantiveText.trim() };
}

const conciseTimelineCopy: Record<string, { title: string; description: string }> = {
  "臺中市政府表示，南僑發現原料超標並通知福壽。": { title: "原料超標通知福壽", description: "臺中市政府稱，南僑發現原料超標後通知福壽。" },
  "臺中市政府表示，福壽通知中聯油脂。": { title: "福壽通知中聯油脂", description: "臺中市政府稱，福壽在隔日通知中聯油脂。" },
  "臺中市政府表示，中聯油脂向主管機關通報。": { title: "中聯油脂通報主管機關", description: "臺中市政府稱，中聯油脂於 6 月 30 日向主管機關通報。" },
  "官員公開說明，該批油品出廠時業者自驗合格，後由下游南僑發現異常，中聯複驗留樣後確認超標。": { title: "下游發現異常後複驗超標", description: "官員稱，油品出廠時自驗合格；南僑後續發現異常，中聯複驗留樣確認超標。" },
  "食藥署表示已召開專家會議，要求擴大檢驗 4 月起桶槽留樣，並提出原料、製程、自主監測改善及預防性下架時限。": { title: "食藥署要求擴大檢驗", description: "食藥署召開專家會議，要求檢驗 4 月起桶槽留樣，並提出改善及預防性下架時限。" },
  "公視轉述食藥署初步研判：非食油煉製，而是巴西黃豆含水量過多，造成乾燥、燻蒸時間延長及烘烤熱損傷；這是初步研判，不是根因定論，污染根因尚未定論。": { title: "初步排除食油煉製環節", description: "公視轉述食藥署初步研判：排除食油煉製，可能與巴西黃豆含水量過多、乾燥與燻蒸時間延長、烘烤熱損傷有關；污染根因仍未定論。" },
  "南僑表示已主動申報與揭露事件、自製成品檢驗符合標準，並列出預防性下架產品。": { title: "南僑公布檢驗與下架資訊", description: "南僑稱已主動申報，自製成品檢驗符合標準，並列出預防性下架產品。" },
  "臺中市政府表示已彙整並連結中聯油脂、福壽實業、南僑與聯華食品四家公司聲明。": { title: "市府彙整四家公司聲明", description: "臺中市政府彙整中聯油脂、福壽實業、南僑及聯華食品的公開聲明。" },
  "臺中市政府表示後續擴大預防性下架 29 批油品，並持續公布流向、回收及檢方偵辦進度。": { title: "預防性下架擴大至 29 批", description: "臺中市政府公布油品流向、回收情形與檢方偵辦進度。" },
  "臺中市政府 7 月 11 日表示，第三批超標油品檢出每公斤 2.9 微克，並公布其流向。": { title: "第三批油品檢出 2.9 微克", description: "臺中市政府公布第三批超標油品的檢驗數值與流向。" },
  "臺中地方法院 7 月 17 日裁定中聯油脂總經理羈押並禁止接見通信；此為偵查階段的程序處分，不是有罪判決。": { title: "中聯油脂總經理遭羈押禁見", description: "臺中地方法院裁定中聯油脂總經理羈押並禁止接見通信；這是偵查階段的程序處分，不是有罪判決。" },
  "衛福部長石崇良表示修法草案將從源頭、製程、品質、異常通報與數位管理五方面強化，並規劃自設或外部實驗室發現異常後於 24 小時內通報指定系統；截至 7 月 18 日仍是待送行政院及立法院審議的草案方向。": { title: "修法草案規劃強化異常通報", description: "衛福部長石崇良說明修法草案方向；草案仍待行政院與立法院審議。" },
};

export function getTimelineDisplayCopy(statement: string) {
  const curated = conciseTimelineCopy[statement];
  if (curated) return curated;

  const parsed = parseTimelineStatement(statement);
  const titleSource = parsed.matched
    ? parsed.substantiveText.split(/[，；。]/, 1)[0].trim()
    : statement;
  const title = titleSource.length <= 28 ? titleSource : `${titleSource.slice(0, 27)}…`;
  return { title, description: statement };
}

export function getEventTimelineHeadline(statements: string[]) {
  const titles = statements.map((statement) => getTimelineDisplayCopy(statement).title);
  return Array.from(new Set(titles)).join("；");
}

export function getEventTimelineAttribution(items: Array<{ statement: string; status?: string; speakers?: Array<{ name: string }> }>) {
  const labels = items.flatMap((item) => {
    const parsed = parseTimelineStatement(item.statement);
    if (parsed.matched) return [parsed.attributionLabel];
    if (item.status !== "attributed") return [];
    return (item.speakers ?? []).map(({ name }) => `${name}具名說法`);
  });
  return Array.from(new Set(labels)).join("、");
}
