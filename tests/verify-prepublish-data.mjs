import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const PUBLIC_PATHS = [
  "public-bundle.json",
  "app/public-evidence.json",
  "app/research-topics.json",
];
const RECEIPT_VERSION = "tw-issues-prepublish-data-receipt/v1";
const DISPOSITIONS = new Set([
  "CURRENT",
  "UPDATE_REQUIRED",
  "OPEN_WITH_CUTOFF",
  "MOVE_OUT_OF_OPEN_QUESTIONS",
  "BLOCKED",
]);
const OUTCOMES = new Set(["READY", "READY_WITH_OPEN_GAPS", "BLOCKED_STALE_DATA"]);
const ROLES = new Set(["official_record", "primary_document", "attributed_report", "bounded_search"]);
const FORBIDDEN_KEYS = new Set(["secret", "token", "password", "private_key", "ledger_id", "deployment_project_id"]);
const FORBIDDEN_VALUES = ["context/", "account/", ".claude/", "evidence-ledger"];
const TEMPORAL_MARKERS = ["目前", "仍", "尚未", "將", "進行中", "截至", "current", "still", "not yet", "will", "in progress", "as of"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHA = /^[a-f0-9]{40}$/;
const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export class PrepublishError extends Error {
  constructor(message) {
    super(message);
    this.name = "PrepublishError";
    this.outcome = "BLOCKED_STALE_DATA";
  }
}

function fail(message) {
  throw new PrepublishError(message);
}

function git(root, args, encoding = "utf8") {
  try {
    return execFileSync("git", ["-C", root, ...args], { encoding, stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    const detail = error.stderr?.toString().trim();
    fail(detail || `git ${args.join(" ")} failed`);
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function same(left, right) {
  return stable(left) === stable(right);
}

function isCalendarDate(value) {
  if (!DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
}

function assertKeys(value, allowed, required, label) {
  assertObject(value, label);
  const extras = Object.keys(value).filter((key) => !allowed.includes(key));
  if (extras.length) fail(`${label} has unknown keys: ${extras.join(", ")}`);
  const missing = required.filter((key) => !(key in value));
  if (missing.length) fail(`${label} is missing keys: ${missing.join(", ")}`);
}

function assertText(value, label, { allowEmpty = false } = {}) {
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) fail(`${label} must be a non-empty string`);
}

function scanForbidden(value, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbidden(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) fail(`${path}.${key} is forbidden`);
      scanForbidden(item, `${path}.${key}`);
    }
    return;
  }
  if (typeof value === "string") {
    const normalized = value.normalize("NFKC").toLowerCase();
    const match = FORBIDDEN_VALUES.find((item) => normalized.includes(item));
    if (match) fail(`${path} contains forbidden private material: ${match}`);
  }
}

function readBlob(root, revision, path) {
  const bytes = git(root, ["show", `${revision}:${path}`], null);
  return { bytes, json: JSON.parse(bytes.toString("utf8")) };
}

function topicIndex(index) {
  if (!Array.isArray(index?.topics) || !Array.isArray(index?.allTopics)) fail("research topic mirrors must be arrays");
  const toMap = (items, label) => {
    const result = new Map();
    for (const item of items) {
      if (!item || typeof item.slug !== "string" || result.has(item.slug)) fail(`${label} has a missing or duplicate slug`);
      result.set(item.slug, item);
    }
    return result;
  };
  const topics = toMap(index.topics, "topics");
  const allTopics = toMap(index.allTopics, "allTopics");
  if (topics.size !== allTopics.size || [...allTopics.keys()].some((slug) => !topics.has(slug))) {
    fail("topics/allTopics slug set mismatch");
  }
  for (const [slug, topic] of topics) {
    if (!allTopics.has(slug) || allTopics.get(slug).lastUpdated !== topic.lastUpdated) {
      fail(`${slug}: topics/allTopics lastUpdated mirror mismatch`);
    }
  }
  return topics;
}

function timelineMap(topic, slug, revisionLabel) {
  const result = new Map();
  for (const event of topic?.reportedTimeline ?? []) {
    if (!event || typeof event.publicKey !== "string" || !event.publicKey || result.has(event.publicKey)) {
      fail(`${slug}: ${revisionLabel} reportedTimeline has a missing or duplicate publicKey`);
    }
    result.set(event.publicKey, event);
  }
  return result;
}

function proposition(topicSlug, path, kind, before, after, attributed = false) {
  return { topic_slug: topicSlug, path, kind, before: before === undefined ? null : stable(before), after: after === undefined ? null : stable(after), attributed };
}

function retainsNamedAttribution(value) {
  if (Array.isArray(value)) return value.some(retainsNamedAttribution);
  if (!value || typeof value !== "object") return false;
  const named = (Array.isArray(value.speakers) && value.speakers.some((speaker) => typeof speaker?.name === "string" && speaker.name.trim()))
    || (typeof value.speaker === "string" && value.speaker.trim())
    || (typeof value.attributedTo === "string" && value.attributedTo.trim());
  if ((value.status === "attributed" || "attributedTo" in value) && named) return true;
  return Object.values(value).some(retainsNamedAttribution);
}

function isMachineKey(key) {
  const normalized = key.normalize("NFKC").replace(/[^a-z0-9]/gi, "").toLowerCase();
  return ["occurredat", "reportedat", "publishedat", "capturedat", "canonicalurl"].includes(normalized)
    || ["id", "key", "ref", "digest", "sha256", "url", "timestamp"].some((suffix) => normalized.endsWith(suffix));
}

function visibleTemporalDiff(before, after, basePath, slug, result, covered = false) {
  if (same(before, after)) return;
  if (typeof before === "string" || typeof after === "string") {
    const leaf = basePath.split(/[.\[]/).at(-1).replace(/\]$/, "");
    const strings = [before, after].filter((value) => typeof value === "string").map((value) => value.normalize("NFKC").toLowerCase());
    if (!covered && !isMachineKey(leaf) && TEMPORAL_MARKERS.some((marker) => strings.some((value) => value.includes(marker)))) {
      result.push(proposition(slug, basePath, "temporal_wording", before, after));
    }
    return;
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    const old = Array.isArray(before) ? before : [];
    const current = Array.isArray(after) ? after : [];
    for (let index = 0; index < Math.max(old.length, current.length); index += 1) visibleTemporalDiff(old[index], current[index], `${basePath}[${index}]`, slug, result, covered);
    return;
  }
  if ((before && typeof before === "object") || (after && typeof after === "object")) {
    const old = before && typeof before === "object" ? before : {};
    const current = after && typeof after === "object" ? after : {};
    for (const key of new Set([...Object.keys(old), ...Object.keys(current)])) {
      const childCovered = covered || ["openQuestions", "proceedingTracks", "reportedTimeline"].includes(key);
      visibleTemporalDiff(old[key], current[key], `${basePath}.${key}`, slug, result, childCovered);
    }
  }
}

function deriveEvidenceScope(base, head) {
  const result = [];
  const slugs = new Set([...Object.keys(base ?? {}), ...Object.keys(head ?? {})]);
  for (const slug of slugs) {
    const oldTopic = base?.[slug] ?? {};
    const newTopic = head?.[slug] ?? {};
    const oldQuestions = oldTopic.openQuestions ?? [];
    const newQuestions = newTopic.openQuestions ?? [];
    const maxQuestions = Math.max(oldQuestions.length, newQuestions.length);
    for (let index = 0; index < maxQuestions; index += 1) {
      if (!same(oldQuestions[index], newQuestions[index])) {
        result.push(proposition(slug, `app/public-evidence.json:${slug}.openQuestions[${index}]`, "open_question", oldQuestions[index], newQuestions[index], retainsNamedAttribution(newQuestions[index])));
      }
    }
    const oldTracks = oldTopic.proceedingTracks ?? [];
    const newTracks = newTopic.proceedingTracks ?? [];
    for (let index = 0; index < Math.max(oldTracks.length, newTracks.length); index += 1) {
      const oldTrack = oldTracks[index] ?? {};
      const newTrack = newTracks[index] ?? {};
      for (const field of ["status", "conclusion"]) {
        const before = oldTrack[field];
        const after = newTrack[field];
        if (!same(before, after)) result.push(proposition(slug, `app/public-evidence.json:${slug}.proceedingTracks[${index}].${field}`, "proceeding", before, after, retainsNamedAttribution(newTracks[index])));
      }
      for (const field of new Set([...Object.keys(oldTrack), ...Object.keys(newTrack)])) {
        if (!["status", "conclusion"].includes(field)) {
          visibleTemporalDiff(oldTrack[field], newTrack[field], `app/public-evidence.json:${slug}.proceedingTracks[${index}].${field}`, slug, result);
        }
      }
    }
    const oldTimeline = timelineMap(oldTopic, slug, "base");
    const newTimeline = timelineMap(newTopic, slug, "HEAD");
    const changed = [...new Set([...oldTimeline.keys(), ...newTimeline.keys()])]
      .filter((key) => !same(oldTimeline.get(key), newTimeline.get(key)))
      .map((key) => newTimeline.get(key) ?? oldTimeline.get(key))
      .sort((a, b) => [a.occurredAt ?? "", a.reportedAt ?? "", a.publicKey].join("\0").localeCompare([b.occurredAt ?? "", b.reportedAt ?? "", b.publicKey].join("\0")));
    if (changed.length) {
      const event = changed.at(-1);
      const key = event.publicKey;
      const after = newTimeline.get(key);
      result.push(proposition(slug, `app/public-evidence.json:${slug}.reportedTimeline[publicKey=${key}]`, "timeline", oldTimeline.get(key), after, retainsNamedAttribution(after)));
      for (const changedEvent of changed.slice(0, -1)) {
        const changedKey = changedEvent.publicKey;
        visibleTemporalDiff(oldTimeline.get(changedKey), newTimeline.get(changedKey), `app/public-evidence.json:${slug}.reportedTimeline[publicKey=${changedKey}]`, slug, result);
      }
    }
    visibleTemporalDiff(oldTopic, newTopic, `app/public-evidence.json:${slug}`, slug, result);
  }
  return result;
}

function deriveScope(baseDocs, headDocs) {
  const result = deriveEvidenceScope(baseDocs[1], headDocs[1]);
  const bundleSlugs = new Set([...Object.keys(baseDocs[0]?.topics ?? {}), ...Object.keys(headDocs[0]?.topics ?? {})]);
  for (const slug of bundleSlugs) {
    const oldTopic = baseDocs[0]?.topics?.[slug] ?? {};
    const newTopic = headDocs[0]?.topics?.[slug] ?? {};
    const before = oldTopic.as_of;
    const after = newTopic.as_of;
    if (!same(before, after)) result.push(proposition(slug, `public-bundle.json:topics.${slug}.as_of`, "freshness_date", before, after));
    visibleTemporalDiff(oldTopic, newTopic, `public-bundle.json:topics.${slug}`, slug, result);
  }
  const oldIndex = topicIndex(baseDocs[2]);
  const newIndex = topicIndex(headDocs[2]);
  for (const slug of new Set([...oldIndex.keys(), ...newIndex.keys()])) {
    const oldTopic = oldIndex.get(slug) ?? {};
    const newTopic = newIndex.get(slug) ?? {};
    const before = oldTopic.lastUpdated;
    const after = newTopic.lastUpdated;
    if (!same(before, after)) result.push(proposition(slug, `app/research-topics.json:topics[${slug}].lastUpdated`, "freshness_date", before, after));
    visibleTemporalDiff(oldTopic, newTopic, `app/research-topics.json:topics[${slug}]`, slug, result);
  }
  const unique = new Map();
  for (const item of result) {
    if (unique.has(item.path)) fail(`scope derivation produced duplicate path ${item.path}`);
    unique.set(item.path, item);
  }
  return [...unique.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function collectSources(value, result = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSources(item, result));
  } else if (value && typeof value === "object") {
    if (["publicRef", "publisher", "canonicalUrl", "publishedAt"].every((key) => typeof value[key] === "string")) {
      const source = { publicRef: value.publicRef, publisher: value.publisher, canonical_url: value.canonicalUrl, publication_date: value.publishedAt };
      const existing = result.get(value.publicRef);
      if (existing && !same(existing, source)) fail(`${value.publicRef}: conflicting public source metadata`);
      result.set(value.publicRef, source);
    }
    Object.values(value).forEach((item) => collectSources(item, result));
  }
  return result;
}

function valueAtPath(documents, path) {
  const [file, expression] = path.split(":", 2);
  let value = documents[PUBLIC_PATHS.indexOf(file)];
  const tokens = expression.replace(/\[([^\]]+)\]/g, ".$1").split(".").filter(Boolean);
  for (const token of tokens) {
    if (token.startsWith("kind=")) value = value?.find?.((item) => item.kind === token.slice(5));
    else if (token.startsWith("publicKey=")) value = value?.find?.((item) => item.publicKey === token.slice(10));
    else if (Array.isArray(value) && !/^\d+$/.test(token)) value = value.find((item) => item.slug === token);
    else value = value?.[/^\d+$/.test(token) ? Number(token) : token];
  }
  return value;
}

function validateSource(source, propositionItem, topic, sourceMap, cutoff) {
  const baseKeys = ["publicRef", "role", "publisher", "canonical_url", "publication_date", "proof_scope", "limitations", "retrieval_cutoff"];
  const allowed = [...baseKeys, "provenance_status", "coverage_boundary"];
  assertKeys(source, allowed, baseKeys, `source ${source?.publicRef ?? "?"}`);
  if (!ROLES.has(source.role)) fail(`${source.publicRef}: invalid source role`);
  for (const key of ["publicRef", "publisher", "canonical_url", "publication_date", "proof_scope", "limitations", "retrieval_cutoff"]) assertText(source[key], `${source.publicRef}.${key}`);
  if (!isCalendarDate(source.publication_date) || !isCalendarDate(source.retrieval_cutoff) || source.retrieval_cutoff !== cutoff) fail(`${source.publicRef}: invalid publication/retrieval date binding`);
  let url;
  try { url = new URL(source.canonical_url); } catch { fail(`${source.publicRef}: canonical_url is invalid`); }
  if (url.protocol !== "https:") fail(`${source.publicRef}: canonical_url must use HTTPS`);
  const published = sourceMap.get(source.publicRef);
  if (!published || !same(published, { publicRef: source.publicRef, publisher: source.publisher, canonical_url: source.canonical_url, publication_date: source.publication_date })) fail(`${source.publicRef}: metadata does not exactly match HEAD`);
  if (source.role === "official_record" && !url.hostname.toLowerCase().endsWith(".gov.tw")) fail(`${source.publicRef}: official_record must use a .gov.tw hostname`);
  if (source.role === "primary_document") {
    const primary = topic?.primaryDocument;
    if (!primary?.source || primary.source.publicRef !== source.publicRef || !primary.provenanceStatus || !primary.coverage
      || source.provenance_status !== primary.provenanceStatus || source.coverage_boundary !== stable(primary.coverage)) {
      fail(`${source.publicRef}: primary_document does not exactly match published provenance and coverage`);
    }
  } else if ("provenance_status" in source || "coverage_boundary" in source) {
    fail(`${source.publicRef}: provenance fields are only allowed for primary_document`);
  }
  if (source.role === "bounded_search" && propositionItem.audit.disposition !== "OPEN_WITH_CUTOFF") fail(`${source.publicRef}: bounded_search only supports OPEN_WITH_CUTOFF`);
  if ((propositionItem.kind === "proceeding" || propositionItem.audit.disposition === "MOVE_OUT_OF_OPEN_QUESTIONS") && !["official_record", "primary_document"].includes(source.role)) fail(`${source.publicRef}: proceeding outcomes require official_record or primary_document`);
  if (source.role === "attributed_report" && !propositionItem.attributed) fail(`${source.publicRef}: attributed_report cannot promote an unattributed proposition`);
}

function validateReceipt(receipt, expected, headDocs) {
  scanForbidden(receipt);
  assertKeys(receipt,
    ["schema_version", "base_revision", "head_revision", "fingerprint", "retrieval_cutoff", "outcome", "scope"],
    ["schema_version", "base_revision", "head_revision", "fingerprint", "retrieval_cutoff", "outcome", "scope"], "$receipt");
  if (receipt.schema_version !== RECEIPT_VERSION) fail("receipt schema_version is unsupported");
  if (receipt.base_revision !== expected.base || receipt.head_revision !== expected.head) fail("receipt revision binding drifted");
  if (!isCalendarDate(receipt.retrieval_cutoff ?? "")) fail("receipt retrieval_cutoff must be a valid YYYY-MM-DD calendar date");
  if (!OUTCOMES.has(receipt.outcome)) fail("receipt outcome is invalid");
  assertKeys(receipt.fingerprint, [...PUBLIC_PATHS, "combined_sha256"], [...PUBLIC_PATHS, "combined_sha256"], "fingerprint");
  if (!same(receipt.fingerprint, expected.fingerprint)) fail("receipt public-data fingerprint drifted");
  if (!Array.isArray(receipt.scope)) fail("receipt scope must be an array");
  const flattened = [];
  for (const [scopeIndex, scope] of receipt.scope.entries()) {
    assertKeys(scope, ["topic_slug", "propositions"], ["topic_slug", "propositions"], `scope[${scopeIndex}]`);
    assertText(scope.topic_slug, `scope[${scopeIndex}].topic_slug`);
    if (!Array.isArray(scope.propositions)) fail(`scope[${scopeIndex}].propositions must be an array`);
    for (const [index, item] of scope.propositions.entries()) {
      assertKeys(item, ["path", "kind", "before", "after", "audit"], ["path", "kind", "before", "after", "audit"], `proposition ${scopeIndex}.${index}`);
      assertText(item.path, `proposition ${scopeIndex}.${index}.path`);
      assertText(item.kind, `proposition ${scopeIndex}.${index}.kind`);
      if (!(item.before === null || typeof item.before === "string") || !(item.after === null || typeof item.after === "string")) fail(`${item.path}: before/after must be strings or null`);
      flattened.push({ ...item, topic_slug: scope.topic_slug });
    }
  }
  const expectedByPath = new Map(expected.scope.map((item) => [item.path, item]));
  const seen = new Set();
  for (const item of flattened) {
    if (seen.has(item.path)) fail(`${item.path}: duplicate receipt proposition`);
    seen.add(item.path);
    const candidate = expectedByPath.get(item.path);
    if (!candidate || candidate.topic_slug !== item.topic_slug || candidate.kind !== item.kind || candidate.before !== item.before || candidate.after !== item.after) fail(`${item.path}: receipt scope is missing, widened, or drifted`);
    item.attributed = candidate.attributed;
  }
  if (seen.size !== expected.scope.length || expected.scope.some((item) => !seen.has(item.path))) fail("receipt omits one or more scoped propositions");
  const sourcesByTopic = new Map(Object.entries(headDocs[1]).map(([slug, topic]) => [slug, collectSources(topic)]));
  for (const item of flattened) {
    const audit = item.audit;
    assertKeys(audit, ["disposition", "finding", "sources", "target_path", "replacement_text"], ["disposition", "finding", "sources"], `${item.path}.audit`);
    if (!DISPOSITIONS.has(audit.disposition)) fail(`${item.path}: invalid disposition`);
    assertText(audit.finding, `${item.path}.audit.finding`);
    if (!Array.isArray(audit.sources) || audit.sources.length === 0) fail(`${item.path}: audit sources must be non-empty`);
    const topic = headDocs[1]?.[item.topic_slug];
    const sourceMap = sourcesByTopic.get(item.topic_slug) ?? new Map();
    audit.sources.forEach((source) => validateSource(source, item, topic, sourceMap, receipt.retrieval_cutoff));
    if (audit.disposition === "OPEN_WITH_CUTOFF" && !audit.sources.some((source) => source.role === "bounded_search")) fail(`${item.path}: OPEN_WITH_CUTOFF requires bounded_search`);
    if (audit.disposition === "MOVE_OUT_OF_OPEN_QUESTIONS") {
      if (item.kind !== "open_question") fail(`${item.path}: MOVE_OUT_OF_OPEN_QUESTIONS only applies to open questions`);
      assertText(audit.target_path, `${item.path}.audit.target_path`);
      assertText(audit.replacement_text, `${item.path}.audit.replacement_text`);
      if (audit.target_path.includes("openQuestions")) fail(`${item.path}: move target must be outside openQuestions`);
      const target = valueAtPath(headDocs, audit.target_path);
      if (target === undefined || !stable(target).includes(audit.replacement_text)) fail(`${item.path}: move target is missing or does not contain replacement_text`);
    } else if ("target_path" in audit || "replacement_text" in audit) fail(`${item.path}: move fields are only allowed for MOVE_OUT_OF_OPEN_QUESTIONS`);
    const temporal = typeof item.after === "string" && TEMPORAL_MARKERS.some((marker) => item.after.normalize("NFKC").toLowerCase().includes(marker));
    if (temporal && audit.sources.some((source) => !source.proof_scope || !source.limitations || source.retrieval_cutoff !== receipt.retrieval_cutoff)) fail(`${item.path}: temporal wording lacks bounded current support`);
  }
  const derived = flattened.some((item) => ["UPDATE_REQUIRED", "BLOCKED"].includes(item.audit.disposition))
    ? "BLOCKED_STALE_DATA"
    : flattened.some((item) => item.audit.disposition === "OPEN_WITH_CUTOFF")
      ? "READY_WITH_OPEN_GAPS"
      : "READY";
  if (receipt.outcome !== derived) fail(`declared outcome ${receipt.outcome} does not match ${derived}`);
  return derived;
}

async function validateReceiptPath(root, receiptPath) {
  if (!receiptPath) fail("--receipt is required for a factual release");
  const supplied = resolve(receiptPath);
  const info = await lstat(supplied).catch(() => fail("receipt does not exist"));
  if (!info.isFile() || info.isSymbolicLink()) fail("receipt must be a regular non-symlink file");
  const canonicalRoot = await realpath(root);
  const canonicalReceipt = await realpath(supplied);
  const rel = relative(canonicalRoot, canonicalReceipt);
  if (!rel || (!rel.startsWith("..") && !isAbsolute(rel))) fail("receipt must be outside the canonical repository root");
  return canonicalReceipt;
}

export async function derivePrepublishData({ repoRoot = scriptRoot, baseRef } = {}) {
  const root = await realpath(repoRoot);
  if (!SHA.test(baseRef ?? "")) fail("--base-ref must be a full 40-character commit SHA");
  const base = git(root, ["rev-parse", "--verify", `${baseRef}^{commit}`]).trim();
  if (base !== baseRef) fail("--base-ref must resolve exactly to the supplied commit");
  const head = git(root, ["rev-parse", "HEAD"]).trim();
  const baseBlobs = PUBLIC_PATHS.map((path) => readBlob(root, base, path));
  const headBlobs = PUBLIC_PATHS.map((path) => readBlob(root, head, path));
  for (const [index, path] of PUBLIC_PATHS.entries()) {
    const worktree = await readFile(resolve(root, path)).catch(() => fail(`${path}: public worktree input is missing`));
    if (!worktree.equals(headBlobs[index].bytes)) fail(`${path}: public worktree input differs from HEAD`);
  }
  const fingerprint = Object.fromEntries(PUBLIC_PATHS.map((path, index) => [path, sha256(headBlobs[index].bytes)]));
  fingerprint.combined_sha256 = sha256(PUBLIC_PATHS.map((path) => `${path}\0${fingerprint[path]}`).join("\n"));
  const scope = deriveScope(baseBlobs.map((item) => item.json), headBlobs.map((item) => item.json));
  return { root, base, head, fingerprint, scope, headDocs: headBlobs.map((item) => item.json) };
}

export async function validatePrepublishData({ repoRoot = scriptRoot, baseRef, receiptPath } = {}) {
  const derived = await derivePrepublishData({ repoRoot, baseRef });
  const { root, base, head, fingerprint, scope, headDocs } = derived;
  if (scope.length === 0) return { outcome: "NOT_APPLICABLE", base, head, fingerprint, scope };
  const canonicalReceipt = await validateReceiptPath(root, receiptPath);
  const receipt = JSON.parse(await readFile(canonicalReceipt, "utf8"));
  const outcome = validateReceipt(receipt, { base, head, fingerprint, scope }, headDocs);
  return { outcome, base, head, fingerprint, scope };
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base-ref") result.baseRef = argv[++index];
    else if (argv[index] === "--receipt") result.receiptPath = argv[++index];
    else fail(`unknown argument: ${argv[index]}`);
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await validatePrepublishData(parseArgs(process.argv.slice(2)));
    console.log(`prepublish data check ${result.outcome} (${result.scope.length} propositions, ${result.head})`);
  } catch (error) {
    console.error(`prepublish data check BLOCKED_STALE_DATA: ${error.message}`);
    process.exitCode = 1;
  }
}
