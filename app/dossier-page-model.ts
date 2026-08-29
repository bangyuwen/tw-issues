import type { AttributedSpeakerGroup, ContextOverview, DeepResearchTopic, PoliticalNarrative, ProceedingTrack, PublicClaim, PublicEvidenceProjection, PublicPersonProfile, PublicSource, ReportedEvent } from "./topic-data";

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
  contextOverview?: ContextOverview;
  proceedingTracks: ProceedingTrack[];
  publicPeople: PublicPersonProfile[];
  politicalNarratives: PoliticalNarrative[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  socialObservations: PublicEvidenceProjection["socialObservations"];
  socialSampleSize: number;
  publicSources: PublicSource[];
  sourceById: Map<string, PublicSource>;
  timelineGroups: TimelineGroup[];
  timelinePhases: TimelinePhaseModel[];
  unphasedTimelineGroups: TimelineGroup[];
  latestTimelineEvent?: ReportedEvent;
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
  const timelinePhases = (projection.contextOverview?.phases ?? [])
    .filter((phase) => phase.eventKeys && phase.eventKeys.length > 0)
    .map((phase) => {
      const eventKeys = new Set(phase.eventKeys);
      const groups = timelineGroups.flatMap((group) => {
        const events = group.events.filter((event) => eventKeys.has(event.publicKey));
        return events.length > 0 ? [{ ...group, events }] : [];
      });
      return { ...phase, groups };
    })
    .filter(({ groups }) => groups.length > 0);
  const phasedEventKeys = new Set(timelinePhases.flatMap(({ eventKeys = [] }) => eventKeys));
  const unphasedTimelineGroups = timelinePhases.length === 0 ? timelineGroups : timelineGroups.flatMap((group) => {
    const events = group.events.filter((event) => !phasedEventKeys.has(event.publicKey));
    return events.length > 0 ? [{ ...group, events }] : [];
  });
  const politicalNarratives = (projection.politicalNarratives ?? [])
    .map((narrative, ledgerIndex) => ({ narrative, ledgerIndex }))
    .sort((a, b) => a.narrative.occurredAt.localeCompare(b.narrative.occurredAt) || a.ledgerIndex - b.ledgerIndex)
    .map(({ narrative }) => narrative);
  const publicSources = Array.from(new Map([
    ...collections.flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.attributedSpeakerGroups ?? []).flatMap(({ claims }) => claims.flatMap(({ sources }) => sources)),
    ...(projection.analysisClaims ?? []).flatMap(({ sources }) => sources),
    ...(projection.editorialPositions ?? []).flatMap(({ sources }) => sources),
    ...(projection.contextOverview?.lanes ?? []).flatMap(({ sources }) => sources),
    ...(projection.contextOverview?.phases ?? []).flatMap(({ sources }) => sources),
    ...(projection.proceedingTracks ?? []).flatMap(({ sources }) => sources),
    ...(projection.publicPeople ?? []).flatMap(({ sources }) => sources),
    ...politicalNarratives.flatMap(({ sources, amplification = [] }) => [
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
    contextOverview: projection.contextOverview,
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
    unphasedTimelineGroups,
    latestTimelineEvent: timeline.at(-1),
  };
}
