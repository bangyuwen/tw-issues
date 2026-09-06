// Explicit public record-to-navigation assignments frozen in the change inventory.
// These keys are authored identities, never generated from render order or live text.
import type { PublicClaim, PublicSpeaker } from './topic-data';

export const ezwaySlug = 'ezway-preauthorization';
export type ReadingAssignment = {
  key: string; kind: 'verified' | 'attributed' | 'unresolved'; statement: string;
  sourceRefs: readonly string[]; ownerDestination: string; label: string;
  speaker?: PublicSpeaker; eventKey?: string; relatedKey?: string;
};
export type CitationOccurrence = { surfaceKey: string; sourceRef: string; anchorId: string; returnLabel: string };
export const ezwayReadingMap: readonly ReadingAssignment[] = [
  {
    "key": "effective-date",
    "kind": "verified",
    "statement": "自 2026 年 3 月 1 日起，個人進口簡易申報快遞貨物採實名認證線上委任者，全面適用預先確認委任。",
    "sourceRefs": [
      "source-ezway-preauth"
    ],
    "ownerDestination": "#claims",
    "label": "適用制度"
  },
  {
    "key": "process",
    "kind": "verified",
    "statement": "預先委任流程由報關業者先透過 EZ WAY 易利委 APP 推播貨物資訊，收貨人確認與實際購買相符並完成線上委任後，報關業者再辦理後續報關。",
    "sourceRefs": [
      "source-ezway-preauth",
      "source-ezway-plan"
    ],
    "ownerDestination": "#ezway-process",
    "label": "委任流程"
  },
  {
    "key": "scope",
    "kind": "verified",
    "statement": "關務署 FAQ 將實名認證適用範圍列為進口快遞貨物簡易申報單（不涉輸入規定、完稅價格未逾新臺幣 5 萬元），適用對象包括中華民國國民與持居留證外籍人士。",
    "sourceRefs": [
      "source-ezway-faq"
    ],
    "ownerDestination": "#claims",
    "label": "適用範圍"
  },
  {
    "key": "checks",
    "kind": "verified",
    "statement": "EZ WAY 推播資料可讓收貨人查到報關日期、報單號碼、分提單號碼、申報金額（購買金額加運費）及貨物品項與名稱；核對無誤可點選「申報相符」，資料不符則點選「申報不符」並填列原因。",
    "sourceRefs": [
      "source-ezway-faq",
      "source-ezway-overview"
    ],
    "ownerDestination": "#ezway-process",
    "label": "資料核對"
  },
  {
    "key": "registration",
    "kind": "verified",
    "statement": "自 2025 年 10 月 28 日起，使用「簡訊認證（健保卡號）」的新註冊者須以實體健保卡插卡完成身分驗證；電信認證與晶片居留證簡訊認證程序未變。",
    "sourceRefs": [
      "source-ezway-registration"
    ],
    "ownerDestination": "#ezway-process",
    "label": "註冊驗證"
  },
  {
    "key": "identity",
    "kind": "verified",
    "statement": "一個手機門號僅能綁定一個身分證字號；EZ WAY 實名認證可用手機門號綁定身分證號或居留證號，以簡化快遞簡易申報的紙本報關委任。",
    "sourceRefs": [
      "source-ezway-overview",
      "source-ezway-registration"
    ],
    "ownerDestination": "#claims",
    "label": "實名綁定"
  },
  {
    "key": "industry-concern",
    "kind": "attributed",
    "statement": "中央社報導，台北市航空貨運承攬公會提醒，若法律、系統與配套尚未準備完成就全面實施預先委任，可能造成空運通關體系風險。",
    "sourceRefs": [
      "source-ezway-news-preauth"
    ],
    "ownerDestination": "#reports",
    "label": "台北市航空貨運承攬公會：配套疑慮",
    "speaker": {
      "name": "台北市航空貨運承攬公會",
      "role": "業者公會（經中央社報導）"
    }
  },
  {
    "key": "adoption",
    "kind": "attributed",
    "statement": "中央社報導，關務署引述截至 2025 年 11 月 30 日已有超過 300 萬人加入預先委任、預先委任比率逾八成，並說明制度自 2026 年 3 月 1 日全面實施。",
    "sourceRefs": [
      "source-ezway-news-preauth"
    ],
    "ownerDestination": "#reports",
    "label": "財政部關務署：制度說明",
    "speaker": {
      "name": "財政部關務署",
      "role": "主管機關（經中央社報導）"
    }
  },
  {
    "key": "capacity",
    "kind": "attributed",
    "statement": "中央社報導，關務署回應多數業者已在境外完成推播確認，並認為現行倉容可負荷少數未完成推播即發貨的情況。",
    "sourceRefs": [
      "source-ezway-news-preauth"
    ],
    "ownerDestination": "#reports",
    "label": "財政部關務署：倉容回應",
    "speaker": {
      "name": "財政部關務署",
      "role": "主管機關（經中央社報導）"
    }
  },
  {
    "key": "registration-count",
    "kind": "attributed",
    "statement": "中央社報導，關務署表示 2025 年 10 月 28 日起，採簡訊認證（健保卡號）的新註冊者需改以實體健保卡插卡驗證，並引述當時約 685 萬人註冊使用 EZ WAY。",
    "sourceRefs": [
      "source-ezway-news-registration"
    ],
    "ownerDestination": "#reports",
    "label": "財政部關務署：註冊說明",
    "speaker": {
      "name": "財政部關務署",
      "role": "主管機關（經中央社報導）"
    }
  },
  {
    "key": "individual-shipment",
    "kind": "unresolved",
    "statement": "個別包裹是否屬快遞簡易申報、是否會收到 EZ WAY 推播，仍需依實際申報方式與貨物條件確認。",
    "sourceRefs": [
      "source-ezway-faq"
    ],
    "ownerDestination": "#questions",
    "label": "個別包裹"
  },
  {
    "key": "mismatch-timing",
    "kind": "unresolved",
    "statement": "若推播資料不符或疑似遭冒名，重新推播與個案通關處理的時程，公開制度說明沒有提供固定期限。",
    "sourceRefs": [
      "source-ezway-preauth",
      "source-ezway-support"
    ],
    "ownerDestination": "#questions",
    "label": "處理時程"
  },
  {
    "key": "ezway-event-preauth-effective",
    "kind": "verified",
    "statement": "自 2026 年 3 月 1 日起，個人進口簡易申報快遞貨物採實名認證線上委任者，全面適用預先確認委任。",
    "sourceRefs": [
      "source-ezway-preauth"
    ],
    "ownerDestination": "#progress",
    "label": "預先確認委任全面實施",
    "eventKey": "ezway-event-preauth-effective",
    "relatedKey": "effective-date"
  },
  {
    "key": "ezway-event-registration-security",
    "kind": "verified",
    "statement": "自 2025 年 10 月 28 日起，使用「簡訊認證（健保卡號）」的新註冊者須以實體健保卡插卡完成身分驗證；電信認證與晶片居留證簡訊認證程序未變。",
    "sourceRefs": [
      "source-ezway-registration"
    ],
    "ownerDestination": "#progress",
    "label": "簡訊認證新註冊改採實體健保卡驗證",
    "eventKey": "ezway-event-registration-security",
    "relatedKey": "registration"
  },
  {
    "key": "ezway-event-preauth-announced",
    "kind": "verified",
    "statement": "關務署於 2025 年 12 月 19 日公告，規劃自 2026 年 3 月 1 日起全面實施進口快遞貨物預先委任。",
    "sourceRefs": [
      "source-ezway-plan"
    ],
    "ownerDestination": "#progress",
    "label": "關務署公告全面實施預先委任規劃",
    "eventKey": "ezway-event-preauth-announced"
  }
];

export const ezwayCitations: readonly CitationOccurrence[] = [
  {
    "surfaceKey": "effective-date",
    "sourceRef": "source-ezway-preauth",
    "anchorId": "cite-ezway-effective-date-preauth",
    "returnLabel": "回到：適用制度（來源 1）"
  },
  {
    "surfaceKey": "process",
    "sourceRef": "source-ezway-preauth",
    "anchorId": "cite-ezway-process-preauth",
    "returnLabel": "回到：委任流程（來源 1）"
  },
  {
    "surfaceKey": "process",
    "sourceRef": "source-ezway-plan",
    "anchorId": "cite-ezway-process-plan",
    "returnLabel": "回到：委任流程（來源 2）"
  },
  {
    "surfaceKey": "scope",
    "sourceRef": "source-ezway-faq",
    "anchorId": "cite-ezway-scope-faq",
    "returnLabel": "回到：適用範圍（來源 1）"
  },
  {
    "surfaceKey": "checks",
    "sourceRef": "source-ezway-faq",
    "anchorId": "cite-ezway-checks-faq",
    "returnLabel": "回到：資料核對（來源 1）"
  },
  {
    "surfaceKey": "checks",
    "sourceRef": "source-ezway-overview",
    "anchorId": "cite-ezway-checks-overview",
    "returnLabel": "回到：資料核對（來源 2）"
  },
  {
    "surfaceKey": "registration",
    "sourceRef": "source-ezway-registration",
    "anchorId": "cite-ezway-registration-registration",
    "returnLabel": "回到：註冊驗證（來源 1）"
  },
  {
    "surfaceKey": "identity",
    "sourceRef": "source-ezway-overview",
    "anchorId": "cite-ezway-identity-overview",
    "returnLabel": "回到：實名綁定（來源 1）"
  },
  {
    "surfaceKey": "identity",
    "sourceRef": "source-ezway-registration",
    "anchorId": "cite-ezway-identity-registration",
    "returnLabel": "回到：實名綁定（來源 2）"
  },
  {
    "surfaceKey": "industry-concern",
    "sourceRef": "source-ezway-news-preauth",
    "anchorId": "cite-ezway-industry-concern-news-preauth",
    "returnLabel": "回到：台北市航空貨運承攬公會：配套疑慮（來源 1）"
  },
  {
    "surfaceKey": "adoption",
    "sourceRef": "source-ezway-news-preauth",
    "anchorId": "cite-ezway-adoption-news-preauth",
    "returnLabel": "回到：財政部關務署：制度說明（來源 1）"
  },
  {
    "surfaceKey": "capacity",
    "sourceRef": "source-ezway-news-preauth",
    "anchorId": "cite-ezway-capacity-news-preauth",
    "returnLabel": "回到：財政部關務署：倉容回應（來源 1）"
  },
  {
    "surfaceKey": "registration-count",
    "sourceRef": "source-ezway-news-registration",
    "anchorId": "cite-ezway-registration-count-news-registration",
    "returnLabel": "回到：財政部關務署：註冊說明（來源 1）"
  },
  {
    "surfaceKey": "individual-shipment",
    "sourceRef": "source-ezway-faq",
    "anchorId": "cite-ezway-individual-shipment-faq",
    "returnLabel": "回到：個別包裹（來源 1）"
  },
  {
    "surfaceKey": "mismatch-timing",
    "sourceRef": "source-ezway-preauth",
    "anchorId": "cite-ezway-mismatch-timing-preauth",
    "returnLabel": "回到：處理時程（來源 1）"
  },
  {
    "surfaceKey": "mismatch-timing",
    "sourceRef": "source-ezway-support",
    "anchorId": "cite-ezway-mismatch-timing-support",
    "returnLabel": "回到：處理時程（來源 2）"
  },
  {
    "surfaceKey": "ezway-event-preauth-effective",
    "sourceRef": "source-ezway-preauth",
    "anchorId": "cite-ezway-ezway-event-preauth-effective-preauth",
    "returnLabel": "回到：預先確認委任全面實施（來源 1）"
  },
  {
    "surfaceKey": "ezway-event-registration-security",
    "sourceRef": "source-ezway-registration",
    "anchorId": "cite-ezway-ezway-event-registration-security-registration",
    "returnLabel": "回到：簡訊認證新註冊改採實體健保卡驗證（來源 1）"
  },
  {
    "surfaceKey": "ezway-event-preauth-announced",
    "sourceRef": "source-ezway-plan",
    "anchorId": "cite-ezway-ezway-event-preauth-announced-plan",
    "returnLabel": "回到：關務署公告全面實施預先委任規劃（來源 1）"
  }
];

export function findEzwayAssignment(claim: PublicClaim, kind: ReadingAssignment['kind'], speaker?: PublicSpeaker, eventKey?: string) {
  const matches = ezwayReadingMap.filter(entry => entry.kind === kind && entry.eventKey === eventKey
    && entry.speaker?.name === speaker?.name && entry.speaker?.role === speaker?.role
    && entry.statement === claim.statement && entry.sourceRefs.length === claim.sources.length
    && entry.sourceRefs.every(ref => claim.sources.some(source => source.publicRef === ref)));
  return matches.length === 1 ? matches[0] : undefined;
}
