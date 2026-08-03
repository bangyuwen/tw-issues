import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DossierPage, { UnavailableDossierPage } from "../../dossier-page";
import { buildDossierPageModel } from "../../dossier-page-model";
import {
  deepResearchTopics, publicEvidenceBySlug, getDeepResearchTopic, getPublicEvidenceProjection,
} from "../../topic-data";
import type { PublicEvidenceProjection } from "../../topic-data";
import { getTopicDisplayTitle } from "../../topic-display";

export function generateStaticParams() {
  return Array.from(new Set([...deepResearchTopics.map(({ slug }) => slug), ...Object.keys(publicEvidenceBySlug)]))
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = getDeepResearchTopic(params.slug);
  const title = topic ? getTopicDisplayTitle(params.slug, topic.title) : null;
  const projection = getPublicEvidenceProjection(params.slug);
  return {
    title: title ? `${title}｜TW Issues` : "找不到議題｜TW Issues",
    description: projection?.claims[0]?.proofScope ?? "深度研究資料補強中；公開頁暫不下結論。",
  };
}

export default function TopicPage({ params, projectionOverride }: {
  params: { slug: string }; projectionOverride?: PublicEvidenceProjection;
}) {
  const topic = getDeepResearchTopic(params.slug);
  if (!topic) notFound();
  const displayTitle = getTopicDisplayTitle(params.slug, topic.title);
  const projection = projectionOverride ?? getPublicEvidenceProjection(params.slug);
  const hasEvidence = projection && [projection.claims, projection.attributedClaims, projection.attributedSpeakerGroups ?? [], projection.openQuestions,
    projection.reportedTimeline ?? [], projection.socialObservations ?? []].some((items) => items.length > 0);
  if (!projection || !hasEvidence) return <UnavailableDossierPage topic={topic} displayTitle={displayTitle} />;
  return <DossierPage model={buildDossierPageModel(projection, { topic, displayTitle })} />;
}
