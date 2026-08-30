import projection from "./public-evidence.json";
import researchIndex from "./research-topics.json";

export type PublicEvidenceProjection = {
  topicId: string;
  primaryDocument?: PrimaryDocument;
  claims: PublicClaim[];
  attributedClaims: PublicClaim[];
  attributedSpeakerGroups?: AttributedSpeakerGroup[];
  contextOverview?: ContextOverview;
  administrationActions?: AdministrationAction[];
  proceedingTracks?: ProceedingTrack[];
  publicPeople?: PublicPersonProfile[];
  politicalNarratives?: PoliticalNarrative[];
  analysisClaims?: PublicClaim[];
  editorialPositions?: PublicClaim[];
  openQuestions: PublicClaim[];
  socialObservations?: SocialObservation[];
  socialObservationCount?: number;
  coverageGaps?: PublicCoverageGap[];
  sectionOrder?: string[];
  dossierQuality?: "PASS" | "LEGACY_PRESERVED";
  reportedTimeline?: ReportedEvent[];
  readiness?: {
    factVerdict: "PASS" | "LIMITED" | "BLOCKED";
    publicSafety: "PASS" | "BLOCKED";
    editorialReadiness: "PASS" | "LIMITED" | "BLOCKED";
  };
};

export type PrimaryDocumentCoverage = {
  firstObservedPage: number;
  lastObservedPage: number;
  missingBefore: string;
  missingAfter: string;
  redactionStatus: string;
  copyStatus: string;
};

export type PrimaryDocumentGuideEntry = {
  pageRange: string;
  label: string;
  summary: string;
  layer: "allegation_or_referral" | "legal_standard" | "prosecutorial_reasoning";
};

export type PrimaryDocumentExcerpt = {
  documentPage: number;
  label: "文件頁面核對";
  text: string;
  reviewStatus: "checked_against_image";
  proofScope: string;
  limitation: string;
};


export type PrimaryDocumentAnalysisBoundary = {
  label: "TW Issues 對第 18 頁的解讀";
  summary: string;
};

export type PrimaryDocument = {
  publicKey: string;
  title: string;
  documentKind: "non_prosecution_disposition";
  provenanceStatus: "third_party_published_stamped_redacted_partial_document_images";
  lead: string;
  directSupportSummary: string;
  source: PublicSource;
  capturedAt: string;
  coverage: PrimaryDocumentCoverage;
  guide: PrimaryDocumentGuideEntry[];
  excerpts: PrimaryDocumentExcerpt[];
  analysisBoundary: PrimaryDocumentAnalysisBoundary;
};

/** Public projection fields approved for visible coverage-limit presentation. */
export type PublicCoverageGap = {
  gap: string;
  gapReason: string;
  sourceRefs: string[];
  sources?: PublicSource[];
};

export type ContextOverview = {
  headline: string;
  summary: string;
  lanes: Array<{
    kind: "administrative" | "criminal" | "civil" | "political" | "operational";
    label: string;
    finding: string;
    proofScope: string;
    sources: PublicSource[];
  }>;
  phases: Array<{
    period: string;
    title: string;
    summary: string;
    turningPoint: string;
    eventKeys?: string[];
    sources: PublicSource[];
  }>;
};

export type AdministrationAction = {
  publicKey: string;
  occurredAt: string;
  period: string;
  administrationPhase: string;
  actor: PublicSpeaker;
  headline: string;
  action: string;
  outcome: string;
  status: "completed" | "ongoing" | "mixed";
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
};

export type ProceedingTrack = {
  kind: "administrative" | "criminal" | "civil" | "contract" | "operational";
  label: string;
  body: string;
  question: string;
  conclusion: string;
  effect: string;
  doesNotConclude: string[];
  status: string;
  nextStep: string;
  sources: PublicSource[];
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
  frameLabel?: string;
  changeFromPrior?: string;
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
  kind?: "criticism" | "counterpoint";
  sourceTypeLabel?: string;
  proofScope?: string;
  limitations?: string[];
  sources?: PublicSource[];
  sourceRefs?: string[];
  sampleSourceCount?: number;
};

export type PublicClaim = {
  statement: string;
  proofScope: string;
  limitations: string[];
  sources: PublicSource[];
  speakers?: PublicSpeaker[];
  claimType?: "fact" | "attributed_statement" | "attributed_procedural_report" | "analysis" | "stance" | "proposal";
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
