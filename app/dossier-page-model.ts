import type { AttributedSpeakerGroup, DeepResearchTopic, PoliticalNarrative, PublicClaim, PublicEvidenceProjection, PublicPersonProfile, PublicSource, ReportedEvent } from "./topic-data";

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
  publicPeople: PublicPersonProfile[];
  politicalNarratives: PoliticalNarrative[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  socialObservations: PublicEvidenceProjection["socialObservations"];
  socialSampleSize: number;
  publicSources: PublicSource[];
  sourceById: Map<string, PublicSource>;
  timelineGroups: Array<{ key: string; label: string; events: ReportedEvent[] }>;
  latestTimelineEvent?: ReportedEvent;
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
  const timelineGroups = Array.from(timeline.reduce((groups, event) => {
    const key = eventDateKey(event);
    const group = groups.get(key) ?? { key, label: eventDateLabel(event), events: [] };
    group.events.push(event);
    groups.set(key, group);
    return groups;
  }, new Map<string, { key: string; label: string; events: ReportedEvent[] }>()).values());
  const publicSources = Array.from(new Map([
    ...collections.flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.attributedSpeakerGroups ?? []).flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.analysisClaims ?? []).flatMap(({ sources }) => sources),
    ...(projection.editorialPositions ?? []).flatMap(({ sources }) => sources),
    ...(projection.publicPeople ?? []).flatMap(({ sources }) => sources),
    ...(projection.politicalNarratives ?? []).flatMap(({ sources, amplification = [] }) => [
      ...sources,
      ...amplification.flatMap(({ sources: amplificationSources }) => amplificationSources),
    ]),
    ...timeline.flatMap(({ items }) => items.flatMap(({ sources }) => sources)),
  ].map((item) => [item.publicRef, item])).values());
  return {
    topicId: projection.topicId,
    topic: metadata?.topic,
    displayTitle: metadata?.displayTitle,
    collections,
    attributedSpeakerGroups: projection.attributedSpeakerGroups ?? [],
    publicPeople: projection.publicPeople ?? [],
    politicalNarratives: projection.politicalNarratives ?? [],
    analysisClaims: projection.analysisClaims ?? [],
    editorialPositions: projection.editorialPositions ?? [],
    socialObservations: projection.socialObservations ?? [],
    socialSampleSize: projection.socialObservationCount ?? projection.socialObservations?.length ?? 0,
    publicSources,
    sourceById: new Map(publicSources.map((item) => [item.publicRef, item])),
    timelineGroups,
    latestTimelineEvent: timeline.at(-1),
  };
}
