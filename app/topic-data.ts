import projection from "./public-evidence.json";
import researchIndex from "./research-topics.json";

export type PublicEvidenceProjection = {
  topicId: string;
  claims: PublicClaim[];
  attributedClaims: PublicClaim[];
  attributedSpeakerGroups?: AttributedSpeakerGroup[];
  publicPeople?: PublicPersonProfile[];
  politicalNarratives?: PoliticalNarrative[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  openQuestions: PublicClaim[];
  socialObservations?: SocialObservation[];
  socialObservationCount?: number;
  sectionOrder?: string[];
  dossierQuality?: "PASS" | "LEGACY_PRESERVED";
  reportedTimeline?: ReportedEvent[];
  readiness?: {
    factVerdict: "PASS" | "LIMITED" | "BLOCKED";
    publicSafety: "PASS" | "BLOCKED";
    editorialReadiness: "PASS" | "LIMITED" | "BLOCKED";
  };
};

export type ReportedEvent = {
  publicKey: string;
  occurredAt: string;
  reportedAt?: string | null;
  precision: "year" | "month" | "day" | "minute";
  kindLabel: string;
  headline: string;
  sourceRefs: string[];
  items: ReportedEventItem[];
  commentary?: { significance: string; changeFromPrior?: string; evidenceBoundary: string };
};

export type ReportedEventItem = {
  status: "verified" | "attributed" | "unresolved";
  statement: string;
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
  speakers?: PublicSpeaker[];
};

export type PublicSpeaker = {
  name: string;
  role: string;
  personId?: string;
};

export type PublicPersonProfile = {
  personId: string;
  name: string;
  role: string;
  affiliation: string;
  period: string;
  relationToTopic: string;
  summary: string;
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
};

export type PoliticalNarrative = {
  publicKey: string;
  occurredAt: string;
  arena: "選舉" | "議會" | "政黨" | "媒體" | "司法" | "社群";
  headline: string;
  speaker: PublicSpeaker;
  statement: string;
  status: "attributed" | "analysis";
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
  amplification?: Array<{ channel: string; publishedAt: string; description: string; sources: PublicSource[] }>;
};

export type AttributedSpeakerGroup = {
  speaker: PublicSpeaker;
  /** Optional editorial summary of the speaker's public position. */
  stanceSummary?: string;
  claims: PublicClaim[];
};

export type PublicSource = {
  publicRef: string;
  canonicalUrl: string;
  title: string;
  publisher: string;
  publishedAt: string;
  displayRole: string;
};

export type SocialObservation = {
  summary: string;
};

export type PublicClaim = {
  statement: string;
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
  speakers?: PublicSpeaker[];
  claimType?: "fact" | "attributed_statement" | "analysis" | "stance" | "proposal";
  harmRisk?: "low" | "elevated" | "high";
  editorialLabel?: "TW Issues 分析" | "TW Issues 主張";
  premises?: string[];
  inference?: string;
  uncertainty?: string;
  falsifier?: string;
  appliesTo?: string;
  consistentStandard?: string;
  reportedTimeline?: {
    label: string;
    interpretation: string;
    evidenceBoundary: string;
    evidenceBoundarySourceRefs: string[];
    events: Array<{
      date: string;
      statement: string;
      sourceRefs: string[];
    }>;
  };
};

export const publicEvidenceBySlug = projection as Record<string, PublicEvidenceProjection>;

export type DeepResearchTopic = {
  topicId: string;
  slug: string;
  title: string;
  lastUpdated: string;
  publicEvidenceAvailable: boolean;
};

const typedResearchIndex = researchIndex as {
  topics: DeepResearchTopic[];
  allTopics?: DeepResearchTopic[];
};
export const deepResearchTopics = typedResearchIndex.topics;
const allDeepResearchTopics = typedResearchIndex.allTopics ?? deepResearchTopics;
export const deepResearchTopicBySlug = new Map(
  allDeepResearchTopics.map((topic) => [topic.slug, topic]),
);

export function getPublicEvidenceProjection(slug: string) {
  return publicEvidenceBySlug[slug];
}

export function getDeepResearchTopic(slug: string) {
  return deepResearchTopicBySlug.get(slug);
}
