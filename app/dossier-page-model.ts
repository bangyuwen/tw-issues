import type { AdministrationAction, AttributedSpeakerGroup, ContextOverview, DeepResearchTopic, PoliticalNarrative, PrimaryDocument, ProceedingTrack, PublicClaim, PublicCoverageGap, PublicEvidenceProjection, PublicPersonProfile, PublicSource, ReportedEvent, PublicSpeaker } from "./topic-data";

export type ClaimCollectionModel = {
  id: "claims" | "questions";
  kind: "verified" | "open";
  label: "可核對命題" | "調查中的問題";
  claims: Array<PublicClaim & { sampleSize?: number }>;
};

export type DossierPageModel = {
  topicId: string;
  topic?: DeepResearchTopic;
  displayTitle?: string;
  collections: ClaimCollectionModel[];
  attributedSpeakerGroups: AttributedSpeakerGroup[];
  attributedReports: AttributedReportModel[];
  coverageLimits: CoverageLimitViewModel[];
  hsinchuChapters: HsinchuChapterDescriptor[];
  primaryDocument?: PrimaryDocument;
  contextOverview?: ContextOverview;
  administrationActions: AdministrationAction[];
  proceedingTracks: ProceedingTrack[];
  publicPeople: PublicPersonProfile[];
  politicalNarratives: PoliticalNarrative[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  socialObservations: NonNullable<PublicEvidenceProjection["socialObservations"]>;
  socialSampleSize: number;
  publicSources: PublicSource[];
  sourceById: Map<string, PublicSource>;
  timelineGroups: TimelineGroup[];
  timelinePhases: TimelinePhaseModel[];
  unphasedContextPhases: ContextOverview["phases"];
  unphasedTimelineGroups: TimelineGroup[];
  latestTimelineEvent?: ReportedEvent;
};

export type DossierSectionDescriptor = {
  href: `#${"primary-document" | "context" | "responsibility-lines" | "coverage-limits" | "claims" | "questions" | "progress" | "administration-actions" | "proceedings" | "people" | "reports" | "narratives" | "analysis" | "positions" | "social-observations" | "sources"}`;
  label: string;
};

export type CoverageLimitViewModel = Pick<PublicCoverageGap, "gap" | "gapReason" | "sourceRefs">;

export type AttributedReportModel = {
  category: "institutional" | "procedural-report";
  claim: PublicClaim;
  speaker: PublicSpeaker;
  sourceDate: string;
};

export type HsinchuChapterDescriptor = {
  number: string;
  label: string;
  href?: DossierSectionDescriptor["href"];
  links: DossierSectionDescriptor[];
};

export type TimelineGroup = { key: string; label: string; events: ReportedEvent[] };

export type TimelinePhaseModel = ContextOverview["phases"][number] & {
  groups: TimelineGroup[];
};

export function eventDateKey(event: ReportedEvent) {
  if (event.precision === "year") return event.occurredAt.slice(0, 4);
  if (event.precision === "month") return event.occurredAt.slice(0, 7);
  return event.occurredAt.slice(0, 10);
}

export function eventDateLabel(event: ReportedEvent) {
  const key = eventDateKey(event);
  if (event.precision === "year") return `${key} 年`;
  if (event.precision === "month") return key.replace("-", " 年 ") + " 月";
  const [year, month, day] = key.split("-").map(Number);
  return `${year} 年 ${month} 月 ${day} 日`;
}

const hsinchuSlug = "hsinchu-baseball-stadium";
const hsinchuTopicId = "hsinchu-baseball-stadium-2026";

function hasHsinchuRouteIdentity(topicId: string, topic?: DeepResearchTopic) {
  if (!topic) return topicId === hsinchuTopicId;
  return topic.slug === hsinchuSlug
    && topic.topicId === hsinchuTopicId;
}

function isHsinchuProjection(projection: PublicEvidenceProjection, metadata?: { topic: DeepResearchTopic }) {
  return hasHsinchuRouteIdentity(projection.topicId, metadata?.topic)
    && projection.topicId === hsinchuTopicId;
}

export function getEligiblePrimaryDocument(
  projection: PublicEvidenceProjection,
  metadata?: { topic: DeepResearchTopic },
) {
  return isHsinchuProjection(projection, metadata)
    && projection.primaryDocument?.source.publicRef === "source-58"
    && projection.primaryDocument.provenanceStatus === "third_party_redacted_partial_reproduction"
    ? projection.primaryDocument
    : undefined;
}

type HsinchuClaimSnapshot = {
  statement: string;
  claimType: PublicClaim["claimType"];
  harmRisk: PublicClaim["harmRisk"];
  proofScope: string;
  limitations: readonly string[];
  sourceRefs: readonly string[];
};

const approvedHsinchuProsecutorClaims: readonly HsinchuClaimSnapshot[] = [
  {
    statement: "檢方表示，工程多次追加後總工程費由原規畫3億5,300萬元增至11億5,476萬餘元，專案管理及監造服務費增至2,951萬餘元；各次契約變更有具體原因且未逾原契約50%，因而認定未違反政府採購法。",
    claimType: "attributed_statement",
    harmRisk: "elevated",
    proofScope: "只證明媒體轉述竹檢對工程追加、服務費及政府採購法適用的說明。",
    limitations: [
      "這是檢方偵查結論的媒體轉述，不是法院判決。",
      "各筆金額仍須以契約變更、補助核銷及最終結算文件逐筆核對。",
    ],
    sourceRefs: ["source-04"],
  },
  {
    statement: "檢方表示，通訊監察、金流比對、搜索及帳務分析未發現林智堅或市府人員與巨佳、艾奕康間有不法金流、收賄或圖利事證；審計及市府調查所列角色混淆、採購督導不周及驗收不妥，屬行政疏失，尚無積極證據證明刑責。",
    claimType: "attributed_statement",
    harmRisk: "high",
    proofScope: "只證明媒體轉述竹檢對偵查方法、金流結果及行政疏失與刑事證據區分的說明。",
    limitations: [
      "未發現犯罪證據是檢方偵查判斷，不等同法院已對所有工程爭議作成終局認定。",
      "目前另有第三方社群重製影像第 3–22 頁可供有限核對；官方完整不起訴處分書、缺頁及相關卷證仍待取得。",
    ],
    sourceRefs: ["source-04", "source-05"],
  },
  {
    statement: "檢方表示，工程契約及監拆計畫原本允許拆除產生的磚瓦、石塊等B5類剩餘土石方在現地破碎回填，縮時影像與證人證述未發現巨佳或力瑋自外運入廢棄物掩埋。",
    claimType: "attributed_statement",
    harmRisk: "high",
    proofScope: "只證明媒體轉述竹檢對B5類土石方契約規範及外運掩埋證據的說明。",
    limitations: [
      "檢方未認定有刑事證據，不等同於所有異物來源、工程品質或行政責任已完成獨立鑑定。",
      "工程契約、監拆計畫及完整影像證據仍應以原始文件核對。",
    ],
    sourceRefs: ["source-04"],
  },
  {
    statement: "檢方表示，球場草皮植床雖以砂、黃土施作而與需求書不符，但2022年自主檢查表已註記；實際土層厚度反高於設計標準，增加成本約347萬1,351元，難認有偷工減料獲利。",
    claimType: "attributed_statement",
    harmRisk: "elevated",
    proofScope: "只證明媒體轉述竹檢對草皮植床材料、檢查紀錄、土層厚度及成本的說明。",
    limitations: [
      "材料不符需求書與是否構成契約或行政責任，不能只由檢方不起訴結果推論。",
      "成本與土層資料仍須對照原設計、變更及驗收文件。",
    ],
    sourceRefs: ["source-04"],
  },
  {
    statement: "檢方表示，兩次開挖所見部分物件其實是依設計或施工鋪設的PE網、噴灌管線及電線，均非廢棄物；不符規範石塊約36.245立方公尺、占拆除工程產出B5類土石方約0.75%，其餘不合格掩埋物約9.006至10.446立方公尺；查無外運賣土、故意非法掩埋或詐領工程款的證據。",
    claimType: "attributed_statement",
    harmRisk: "high",
    proofScope: "只證明聯合報轉述竹檢的偵結說明，以及楊玲宜 Threads 所公開遮蔽影像第18頁的可見文字；社群影像不是檢方官方全文。",
    limitations: [
      "數量與比例是檢方公開說明的調查口徑，不能取代完整鑑定、契約核對或民事損害計算。",
      "不起訴不等同於行政缺失、契約瑕疵或公共安全疑慮不存在。",
      "Threads 附件僅涵蓋處分書第3至22頁，且姓名、公司名稱已遮蔽；不能據此補寫缺頁、確認完整文脈或還原被遮蔽內容。",
    ],
    sourceRefs: ["source-04", "source-58"],
  },
];

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function exactSourceRefs(claim: PublicClaim, expected: string) {
  return claim.sources.length === 1 && claim.sources[0]?.publicRef === expected;
}

function claimSpeaker(claim: PublicClaim, expectedName: string, expectedRole: string) {
  const speaker = claim.speakers?.length === 1 ? claim.speakers[0] : undefined;
  return speaker?.name === expectedName && speaker.role === expectedRole;
}

function sameValues(actual: readonly string[], expected: readonly string[]) {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function matchesHsinchuClaimSnapshot(claim: PublicClaim, snapshot: HsinchuClaimSnapshot) {
  return claim.statement === snapshot.statement
    && claim.claimType === snapshot.claimType
    && claim.harmRisk === snapshot.harmRisk
    && claim.proofScope === snapshot.proofScope
    && sameValues(claim.limitations, snapshot.limitations)
    && sameValues(claim.sources.map(({ publicRef }) => publicRef), snapshot.sourceRefs);
}

function sourceDate(claim: PublicClaim) {
  return uniqueValues(claim.sources.map(({ publishedAt }) => publishedAt)).join("、");
}

function mappingDrift(detail: string): never {
  throw new Error(`Hsinchu attributed mapping drift: ${detail}`);
}

/**
 * Reconcile only the owner-approved Hsinchu positions. This is deliberately
 * not a general deduplication routine: changed public positions fail closed.
 */
export function reconcileHsinchuAttributedClaims(
  attributedClaims: PublicClaim[],
  attributedSpeakerGroups: AttributedSpeakerGroup[],
) {
  const cityGroup = attributedSpeakerGroups[0];
  const prosecutionGroup = attributedSpeakerGroups[1];
  if (attributedClaims.length !== 3 || !cityGroup || !prosecutionGroup) {
    return mappingDrift("expected three standalone claims and two grouped speaker records");
  }
  if (cityGroup.speaker.name !== "新竹市政府" || cityGroup.speaker.role !== "主管機關公開說明") {
    return mappingDrift("source-06 city-government speaker changed");
  }
  if (cityGroup.claims.length !== 2) return mappingDrift("source-06 city-government claim positions changed");
  if (prosecutionGroup.speaker.name !== "新竹地方檢察署" || prosecutionGroup.speaker.role !== "檢察機關公開說明") {
    return mappingDrift("grouped prosecutor speaker changed");
  }
  if (prosecutionGroup.claims.length !== 5) return mappingDrift("grouped prosecutor statement count changed");
  prosecutionGroup.claims.forEach((claim, position) => {
    const approved = approvedHsinchuProsecutorClaims[position];
    if (!approved
      || !claimSpeaker(claim, "新竹地方檢察署", "檢察機關公開說明")
      || !matchesHsinchuClaimSnapshot(claim, approved)) {
      mappingDrift(`grouped prosecutor claim changed at position ${position}`);
    }
  });

  const cityClaims = [0, 1].map((position) => {
    const standalone = attributedClaims[position];
    const grouped = cityGroup.claims[position];
    if (!standalone || !grouped) return mappingDrift(`missing city-government pair at position ${position}`);
    if (standalone.statement !== grouped.statement || standalone.proofScope !== grouped.proofScope) {
      return mappingDrift(`statement or proof scope changed at position ${position}`);
    }
    if (!claimSpeaker(standalone, "新竹市政府", "主管機關公開說明") || !claimSpeaker(grouped, "新竹市政府", "主管機關公開說明")) {
      return mappingDrift(`speaker changed at position ${position}`);
    }
    if (!exactSourceRefs(standalone, "source-06") || !exactSourceRefs(grouped, "source-06")) {
      return mappingDrift(`source-06 reference changed at position ${position}`);
    }
    return {
      ...grouped,
      limitations: uniqueValues([...standalone.limitations, ...grouped.limitations]),
    };
  });

  const procedural = attributedClaims[2];
  if (procedural.claimType !== "attributed_procedural_report" || !exactSourceRefs(procedural, "source-09")) {
    return mappingDrift("source-09 procedural report changed");
  }
  if (!claimSpeaker(procedural, "聯合報", "媒體報導")) return mappingDrift("source-09 procedural-report speaker changed");

  const groups = attributedSpeakerGroups.map((group, index) => index === 0 ? { ...group, claims: cityClaims } : group);
  const attributedReports: AttributedReportModel[] = [
    ...cityClaims.map((claim) => ({ category: "institutional" as const, claim, speaker: claim.speakers![0], sourceDate: sourceDate(claim) })),
    { category: "procedural-report", claim: procedural, speaker: procedural.speakers![0], sourceDate: sourceDate(procedural) },
  ];
  return { groups, attributedReports };
}

export function getHsinchuDossierChapters(model: DossierPageModel): HsinchuChapterDescriptor[] {
  if (!hasHsinchuRouteIdentity(model.topicId, model.topic)) return [];
  const [verified, unresolved] = model.collections;
  const link = (href: DossierSectionDescriptor["href"], label: string, enabled: boolean) => enabled ? [{ href, label }] : [];
  const chapters: HsinchuChapterDescriptor[] = [
    {
      number: "01",
      label: "案情範圍與證據界線",
      links: [
        ...link("#primary-document", "核心文件導讀", Boolean(model.primaryDocument)),
        ...link("#context", "案情範圍", Boolean(model.contextOverview)),
        ...link("#responsibility-lines", "責任與狀態", Boolean(model.contextOverview?.lanes.length)),
        ...link("#coverage-limits", "證據覆蓋界線", model.coverageLimits.length > 0),
      ],
    },
    {
      number: "02",
      label: "已知與未決",
      links: [
        ...link("#claims", "已知資訊", verified.claims.length > 0 || unresolved.claims.length > 0),
        ...link("#questions", "仍待釐清", unresolved.claims.length > 0),
      ],
    },
    {
      number: "03",
      label: "時間與程序",
      links: [
        ...link("#progress", "完整脈絡", model.timelineGroups.length > 0),
        ...link("#administration-actions", "市府行動", model.administrationActions.length > 0),
        ...link("#proceedings", "責任與程序", model.proceedingTracks.length > 0),
      ],
    },
    {
      number: "04",
      label: "人物與公開說法",
      links: [
        ...link("#people", "人物索引", model.publicPeople.length > 0),
        ...link("#reports", "各方怎麼說", model.attributedSpeakerGroups.length > 0 || model.attributedReports.length > 0),
        ...link("#narratives", "政治敘事", model.politicalNarratives.length > 0),
      ],
    },
    {
      number: "05",
      label: "TW Issues 分析",
      links: [
        ...link("#analysis", "我們怎麼理解", (model.analysisClaims?.length ?? 0) > 0),
        ...link("#positions", "我們主張什麼", (model.editorialPositions?.length ?? 0) > 0),
      ],
    },
    {
      number: "06",
      label: "補充社群樣本",
      links: [
        ...link("#social-observations", "社群觀察", model.socialObservations.length > 0),
        { href: "#sources", label: "資料來源" },
      ],
    },
  ];
  return chapters.map((chapter) => ({ ...chapter, href: chapter.links[0]?.href }));
}

export function getHsinchuDossierSections(model: DossierPageModel): DossierSectionDescriptor[] {
  return getHsinchuDossierChapters(model).flatMap(({ links }) => links);
}

export function buildDossierPageModel(
  projection: PublicEvidenceProjection,
  metadata?: { topic: DeepResearchTopic; displayTitle: string },
): DossierPageModel {
  const collections: ClaimCollectionModel[] = [
    { id: "claims", kind: "verified", label: "可核對命題", claims: projection.claims },
    { id: "questions", kind: "open", label: "調查中的問題", claims: projection.openQuestions },
  ];
  const coverageLimits: CoverageLimitViewModel[] = (projection.coverageGaps ?? []).map(({ gap, gapReason, sourceRefs }) => ({
    gap,
    gapReason,
    sourceRefs: [...sourceRefs],
  }));
  const primaryDocument = getEligiblePrimaryDocument(projection, metadata);
  const hasAttributedInputs = projection.attributedClaims.length > 0 || (projection.attributedSpeakerGroups?.length ?? 0) > 0;
  const attribution = isHsinchuProjection(projection, metadata) && hasAttributedInputs
    ? reconcileHsinchuAttributedClaims(projection.attributedClaims, projection.attributedSpeakerGroups ?? [])
    : { groups: projection.attributedSpeakerGroups ?? [], attributedReports: [] as AttributedReportModel[] };
  const timeline = (projection.reportedTimeline ?? [])
    .map((event, ledgerIndex) => ({ event, ledgerIndex }))
    .filter(({ event }) => event.items.length > 0)
    .sort((a, b) => eventDateKey(a.event).localeCompare(eventDateKey(b.event)) || a.ledgerIndex - b.ledgerIndex)
    .map(({ event }) => event);
  const timelineGroups = Array.from(timeline.reduce((groups, event) => {
    const key = eventDateKey(event);
    const group = groups.get(key) ?? { key, label: eventDateLabel(event), events: [] };
    group.events.push(event);
    groups.set(key, group);
    return groups;
  }, new Map<string, { key: string; label: string; events: ReportedEvent[] }>()).values());
  const contextPhases = projection.contextOverview?.phases ?? [];
  const timelinePhaseEntries = contextPhases
    .map((phase, phaseIndex) => {
      const eventKeys = new Set(phase.eventKeys);
      const groups = timelineGroups.flatMap((group) => {
        const events = group.events.filter((event) => eventKeys.has(event.publicKey));
        return events.length > 0 ? [{ ...group, events }] : [];
      });
      return { phase, phaseIndex, groups };
    })
    .filter(({ groups }) => groups.length > 0);
  const timelinePhases = timelinePhaseEntries.map(({ phase, groups }) => ({ ...phase, groups }));
  const phasedEventKeys = new Set(timelinePhases.flatMap(({ eventKeys = [] }) => eventKeys));
  const representedPhaseIndexes = new Set(timelinePhaseEntries.map(({ phaseIndex }) => phaseIndex));
  const unphasedContextPhases = contextPhases.filter((_, phaseIndex) => !representedPhaseIndexes.has(phaseIndex));
  const unphasedTimelineGroups = timelinePhases.length === 0 ? timelineGroups : timelineGroups.flatMap((group) => {
    const events = group.events.filter((event) => !phasedEventKeys.has(event.publicKey));
    return events.length > 0 ? [{ ...group, events }] : [];
  });
  const politicalNarratives = (projection.politicalNarratives ?? [])
    .map((narrative, ledgerIndex) => ({ narrative, ledgerIndex }))
    .sort((a, b) => a.narrative.occurredAt.localeCompare(b.narrative.occurredAt) || a.ledgerIndex - b.ledgerIndex)
    .map(({ narrative }) => narrative);
  const administrationActions = (projection.administrationActions ?? [])
    .map((action, ledgerIndex) => ({ action, ledgerIndex }))
    .sort((a, b) => a.action.occurredAt.localeCompare(b.action.occurredAt) || a.ledgerIndex - b.ledgerIndex)
    .map(({ action }) => action);
  const publicSources = Array.from(new Map([
    ...collections.flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...attribution.groups.flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...attribution.attributedReports.flatMap(({ claim }) => claim.sources),
    ...(projection.coverageGaps ?? []).flatMap(({ sources = [] }) => sources),
    ...(projection.analysisClaims ?? []).flatMap(({ sources }) => sources),
    ...(projection.editorialPositions ?? []).flatMap(({ sources }) => sources),
    ...(projection.contextOverview?.lanes ?? []).flatMap(({ sources }) => sources),
    ...(projection.contextOverview?.phases ?? []).flatMap(({ sources }) => sources),
    ...administrationActions.flatMap(({ sources }) => sources),
    ...(projection.proceedingTracks ?? []).flatMap(({ sources }) => sources),
    ...(projection.publicPeople ?? []).flatMap(({ sources }) => sources),
    ...politicalNarratives.flatMap(({ sources, amplification = [] }) => [
      ...sources,
      ...amplification.flatMap(({ sources: amplificationSources }) => amplificationSources),
    ]),
    ...timeline.flatMap(({ items }) => items.flatMap(({ sources }) => sources)),
    ...(projection.socialObservations ?? []).flatMap(({ sources = [] }) => sources),
    ...(primaryDocument ? [primaryDocument.source] : []),
  ].map((item) => [item.publicRef, item])).values());
  const model: DossierPageModel = {
    topicId: projection.topicId,
    topic: metadata?.topic,
    displayTitle: metadata?.displayTitle,
    collections,
    attributedSpeakerGroups: attribution.groups,
    attributedReports: attribution.attributedReports,
    coverageLimits,
    hsinchuChapters: [],
    primaryDocument,
    contextOverview: projection.contextOverview,
    administrationActions,
    proceedingTracks: projection.proceedingTracks ?? [],
    publicPeople: projection.publicPeople ?? [],
    politicalNarratives,
    analysisClaims: projection.analysisClaims ?? [],
    editorialPositions: projection.editorialPositions ?? [],
    socialObservations: projection.socialObservations ?? [],
    socialSampleSize: projection.socialObservationCount ?? projection.socialObservations?.length ?? 0,
    publicSources,
    sourceById: new Map(publicSources.map((item) => [item.publicRef, item])),
    timelineGroups,
    timelinePhases,
    unphasedContextPhases,
    unphasedTimelineGroups,
    latestTimelineEvent: timeline.at(-1),
  };
  model.hsinchuChapters = getHsinchuDossierChapters(model);
  return model;
}
