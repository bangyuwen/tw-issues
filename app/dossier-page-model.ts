import type { AttributedSpeakerGroup, DeepResearchTopic, PublicClaim, PublicEvidenceProjection, PublicSource, ReportedEvent } from "./topic-data";

export type ClaimCollectionModel = {
  id: "claims" | "questions";
  kind: "verified" | "open";
  label: "可核對命題" | "調查中的問題";
  claims: Array<PublicClaim & { sampleSize?: number }>;
};

export type TimelineGroup = { key: string; label: string; events: ReportedEvent[] };

export type DossierPageModel = {
  topicId: string;
  topic?: DeepResearchTopic;
  displayTitle?: string;
  collections: ClaimCollectionModel[];
  attributedSpeakerGroups: AttributedSpeakerGroup[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  socialObservations: PublicEvidenceProjection["socialObservations"];
  socialSampleSize: number;
  publicSources: PublicSource[];
  sourceById: Map<string, PublicSource>;
  timelineGroups: TimelineGroup[];
  recentTimelineGroups: TimelineGroup[];
  olderTimelineGroups: TimelineGroup[];
  latestTimelineEvent?: ReportedEvent;
};

export const RECENT_TIMELINE_DAYS = 7;

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

function eventTimelineDateKey(event: ReportedEvent) {
  const key = eventDateKey(event);
  if (event.precision === "year") return `${key}-01-01`;
  if (event.precision === "month") return `${key}-01`;
  return key;
}

function subtractDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function buildDossierPageModel(
  projection: PublicEvidenceProjection,
  metadata?: { topic: DeepResearchTopic; displayTitle: string },
): DossierPageModel {
  const collections: ClaimCollectionModel[] = [
    { id: "claims", kind: "verified", label: "可核對命題", claims: projection.claims },
    { id: "questions", kind: "open", label: "調查中的問題", claims: projection.openQuestions },
  ];
  const timeline = (projection.reportedTimeline ?? [])
    .map((event, ledgerIndex) => ({ event, ledgerIndex }))
    .filter(({ event }) => event.items.length > 0)
    .sort((a, b) => eventDateKey(a.event).localeCompare(eventDateKey(b.event)) || a.ledgerIndex - b.ledgerIndex)
    .map(({ event }) => event);
  const timelineGroupsAscending: TimelineGroup[] = Array.from(timeline.reduce((groups, event) => {
    const key = eventDateKey(event);
    const group = groups.get(key) ?? { key, label: eventDateLabel(event), events: [] };
    group.events.push(event);
    groups.set(key, group);
    return groups;
  }, new Map<string, TimelineGroup>()).values());
  const timelineGroups = timelineGroupsAscending.slice().reverse();
  const latestTimelineEvent = timeline.at(-1);
  const recentTimelineStart = latestTimelineEvent
    ? subtractDays(eventTimelineDateKey(latestTimelineEvent), RECENT_TIMELINE_DAYS - 1)
    : undefined;
  const recentTimelineGroups = recentTimelineStart
    ? timelineGroups.filter((group) => eventTimelineDateKey(group.events[0]) >= recentTimelineStart)
    : [];
  const olderTimelineGroups = timelineGroups.filter((group) => !recentTimelineGroups.includes(group));
  const publicSources = Array.from(new Map([
    ...collections.flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.attributedSpeakerGroups ?? []).flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.analysisClaims ?? []).flatMap(({ sources }) => sources),
    ...(projection.editorialPositions ?? []).flatMap(({ sources }) => sources),
    ...timeline.flatMap(({ items }) => items.flatMap(({ sources }) => sources)),
  ].map((item) => [item.publicRef, item])).values());
  return {
    topicId: projection.topicId,
    topic: metadata?.topic,
    displayTitle: metadata?.displayTitle,
    collections,
    attributedSpeakerGroups: projection.attributedSpeakerGroups ?? [],
    analysisClaims: projection.analysisClaims ?? [],
    editorialPositions: projection.editorialPositions ?? [],
    socialObservations: projection.socialObservations ?? [],
    socialSampleSize: projection.socialObservationCount ?? projection.socialObservations?.length ?? 0,
    publicSources,
    sourceById: new Map(publicSources.map((item) => [item.publicRef, item])),
    timelineGroups,
    recentTimelineGroups,
    olderTimelineGroups,
    latestTimelineEvent,
  };
}
