import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const siteRoot = new URL("../", import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, siteRoot), "utf8"));
}

function isRelativeSitePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.split("/").includes("..");
}

function assertDigest(name, payload, expected) {
  const digest = createHash("sha256").update(payload).digest("hex");
  if (digest !== expected) {
    throw new Error(`${name}: public bundle digest mismatch; expected ${expected}, got ${digest}`);
  }
}

function collectForbiddenValues(value, path = "$", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectForbiddenValues(item, `${path}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (["claim_id", "source_id", "ledgerSha256", "ledger_sha256", "review_digest"].includes(key)) {
        findings.push(`${path}.${key}`);
      }
      collectForbiddenValues(item, `${path}.${key}`, findings);
    });
    return findings;
  }
  if (typeof value === "string" && /(?:context\/|account\/|\.claude\/|appgprj_|chatgpt\.site)/.test(value)) {
    findings.push(`${path}=${value}`);
  }
  return findings;
}

const highRiskClaimTypes = new Set([
  "criminal_allegation",
  "crime",
  "illegal_conduct",
  "judicial_procedure",
  "judicial_procedure_fact",
  "law_enforcement_fact",
  "legal_liability",
]);

function collectHarmRiskFindings(value, path = "$", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectHarmRiskFindings(item, `${path}[${index}]`, findings));
    return findings;
  }
  if (!value || typeof value !== "object") return findings;
  if (highRiskClaimTypes.has(value.claimType) && value.harmRisk !== "high") {
    findings.push(`${path}.harmRisk`);
  }
  Object.entries(value).forEach(([key, item]) => {
    collectHarmRiskFindings(item, `${path}.${key}`, findings);
  });
  return findings;
}

const bundle = await readJson("public-bundle.json");
if (bundle.schema_version !== "tw-issues-public-bundle/v1") {
  throw new Error("public bundle schema version is unsupported");
}
if (bundle.product_id !== "tw-issues" || bundle.product_name !== "TW Issues") {
  throw new Error("public bundle product identity is invalid");
}
if (bundle.locale !== "zh-Hant" || bundle.license_policy !== "source-specific") {
  throw new Error("public bundle metadata is incomplete");
}

const projectionEntry = bundle.projection;
const researchIndexEntry = bundle.research_index;
for (const [name, entry] of [["projection", projectionEntry], ["research_index", researchIndexEntry]]) {
  if (!entry || !isRelativeSitePath(entry.path) || !/^[a-f0-9]{64}$/.test(entry.sha256 ?? "")) {
    throw new Error(`${name}: public bundle entry is malformed`);
  }
}

const projectionBytes = await readFile(new URL(projectionEntry.path, siteRoot));
const researchIndexBytes = await readFile(new URL(researchIndexEntry.path, siteRoot));
assertDigest("projection", projectionBytes, projectionEntry.sha256);
assertDigest("research_index", researchIndexBytes, researchIndexEntry.sha256);

const projection = JSON.parse(projectionBytes);
const researchIndex = JSON.parse(researchIndexBytes);
const projectionSlugs = Object.keys(projection).sort();
const manifestSlugs = Object.keys(bundle.topics ?? {}).sort();
if (JSON.stringify(projectionSlugs) !== JSON.stringify(manifestSlugs)) {
  throw new Error("public bundle topic inventory does not match the projection");
}
if (!Array.isArray(researchIndex.topics) || researchIndex.topics.length === 0) {
  throw new Error("public research index is empty");
}
const publicIndexSlugs = researchIndex.topics
  .filter((topic) => topic.publicEvidenceAvailable)
  .map((topic) => topic.slug)
  .sort();
if (publicIndexSlugs.some((slug) => !projectionSlugs.includes(slug))) {
  throw new Error("public research index references a missing projection");
}

for (const slug of projectionSlugs) {
  const topic = bundle.topics[slug];
  if (!topic || topic.slug !== slug || typeof topic.topic_id !== "string" || !topic.topic_id) {
    throw new Error(`${slug}: public topic provenance is malformed`);
  }
  if (topic.visibility !== "public" || topic.publication_status !== "published") {
    throw new Error(`${slug}: public topic status is not publishable`);
  }
  if (typeof topic.as_of !== "string" || !topic.as_of || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(topic.as_of)) {
    throw new Error(`${slug}: public topic as_of is invalid`);
  }
  if (!/^[a-f0-9]{64}$/.test(topic.content_digest ?? "")) {
    throw new Error(`${slug}: public topic content digest is invalid`);
  }
  if (!/^(public_quality_pass|public_projection)$/.test(topic.verification_status ?? "")) {
    throw new Error(`${slug}: public topic verification status is invalid`);
  }
  if (topic.license !== "source-specific") {
    throw new Error(`${slug}: public topic license policy is invalid`);
  }
}

const forbidden = collectForbiddenValues({ bundle, projection, researchIndex });
if (forbidden.length > 0) {
  throw new Error(`public bundle contains forbidden private material: ${forbidden.slice(0, 8).join(", ")}`);
}
const harmRiskFindings = collectHarmRiskFindings(projection);
if (harmRiskFindings.length > 0) {
  throw new Error(`public bundle contains misclassified high-risk claims: ${harmRiskFindings.slice(0, 8).join(", ")}`);
}

console.log(`public bundle PASS (${projectionSlugs.length} topics)`);
