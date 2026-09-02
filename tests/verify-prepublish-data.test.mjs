import assert from "node:assert/strict";
import { mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { derivePrepublishData, validatePrepublishData } from "./verify-prepublish-data.mjs";

const OFFICIAL = {
  publicRef: "source-1",
  canonicalUrl: "https://agency.gov.tw/result",
  title: "Official result",
  publisher: "Agency",
  publishedAt: "2026-02-01",
  displayRole: "official record",
};
const PRIMARY = {
  publicRef: "source-2",
  canonicalUrl: "https://example.org/document",
  title: "Primary document",
  publisher: "Document publisher",
  publishedAt: "2026-02-01",
  displayRole: "published document",
};

function run(root, args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

async function writeJson(root, path, value) {
  await writeFile(join(root, path), `${JSON.stringify(value, null, 2)}\n`);
}

function documents() {
  const question = {
    statement: "結果尚未確認？",
    claimType: "open_question",
    harmRisk: "elevated",
    proofScope: "The public record is bounded.",
    limitations: ["No inference beyond the record."],
    sources: [OFFICIAL],
  };
  const timeline = [
    { publicKey: "event-a", occurredAt: "2026-01-01", reportedAt: "2026-01-02", headline: "Earlier", items: [] },
    { publicKey: "event-b", occurredAt: "2026-01-03", reportedAt: "2026-01-04", headline: "Latest", items: [] },
  ];
  return {
    bundle: { topics: { alpha: { slug: "alpha", as_of: "2026-01-01" }, beta: { slug: "beta", as_of: "2026-01-01" } } },
    evidence: {
      alpha: {
        primaryDocument: { provenanceStatus: "published_partial", coverage: { limitation: "partial" }, source: PRIMARY },
        openQuestions: [question],
        proceedingTracks: [{ kind: "judicial", status: "open", conclusion: "No conclusion", sources: [OFFICIAL] }],
        reportedTimeline: timeline,
      },
      beta: { openQuestions: [], proceedingTracks: [], reportedTimeline: [], sources: [OFFICIAL] },
    },
    index: {
      topics: [{ slug: "alpha", lastUpdated: "2026-01-01" }, { slug: "beta", lastUpdated: "2026-01-01" }],
      allTopics: [{ slug: "alpha", lastUpdated: "2026-01-01" }, { slug: "beta", lastUpdated: "2026-01-01" }],
    },
  };
}

async function writeDocuments(root, docs) {
  await writeJson(root, "public-bundle.json", docs.bundle);
  await writeJson(root, "app/public-evidence.json", docs.evidence);
  await writeJson(root, "app/research-topics.json", docs.index);
}

async function fixture(mutator = (docs) => {
  docs.bundle.topics.alpha.as_of = "2026-02-02";
  docs.evidence.alpha.openQuestions[0].statement = "結果仍待官方確認？";
  docs.index.topics[0].lastUpdated = "2026-02-02";
  docs.index.allTopics[0].lastUpdated = "2026-02-02";
}) {
  const temporaryRoot = process.platform === "darwin" ? "/private/tmp" : tmpdir();
  const parent = await mkdtemp(join(temporaryRoot, "tw-prepublish-test-"));
  const root = join(parent, "repo");
  execFileSync("mkdir", [root]);
  execFileSync("mkdir", [join(root, "app")]);
  run(root, ["init", "-q"]);
  run(root, ["config", "user.email", "test@example.com"]);
  run(root, ["config", "user.name", "Test"]);
  const baseDocs = documents();
  await writeDocuments(root, baseDocs);
  run(root, ["add", "."]);
  run(root, ["commit", "-qm", "base"]);
  const base = run(root, ["rev-parse", "HEAD"]);
  const headDocs = structuredClone(baseDocs);
  mutator(headDocs);
  await writeDocuments(root, headDocs);
  run(root, ["add", "."]);
  run(root, ["commit", "-qm", "head"]);
  return { parent, root, base, headDocs };
}

function source(role = "official_record", overrides = {}) {
  const published = role === "primary_document" ? PRIMARY : OFFICIAL;
  const result = {
    publicRef: published.publicRef,
    role,
    publisher: published.publisher,
    canonical_url: published.canonicalUrl,
    publication_date: published.publishedAt,
    proof_scope: "Direct support for only this proposition.",
    limitations: "Does not establish facts outside the cited record.",
    retrieval_cutoff: "2026-02-02",
  };
  if (role === "primary_document") {
    result.provenance_status = "published_partial";
    result.coverage_boundary = '{"limitation":"partial"}';
  }
  return { ...result, ...overrides };
}

async function receiptFor(fx, disposition = "CURRENT", sourceFactory = () => source()) {
  const derived = await derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base });
  const grouped = new Map();
  for (const item of derived.scope) {
    if (!grouped.has(item.topic_slug)) grouped.set(item.topic_slug, []);
    grouped.get(item.topic_slug).push({
      path: item.path,
      kind: item.kind,
      before: item.before,
      after: item.after,
      audit: { disposition, finding: "Checked against bounded current evidence.", sources: [sourceFactory(item)] },
    });
  }
  const receipt = {
    schema_version: "tw-issues-prepublish-data-receipt/v1",
    base_revision: derived.base,
    head_revision: derived.head,
    fingerprint: derived.fingerprint,
    retrieval_cutoff: "2026-02-02",
    outcome: disposition === "OPEN_WITH_CUTOFF" ? "READY_WITH_OPEN_GAPS" : disposition === "CURRENT" ? "READY" : "BLOCKED_STALE_DATA",
    scope: [...grouped].map(([topic_slug, propositions]) => ({ topic_slug, propositions })),
  };
  const path = join(fx.parent, "receipt.json");
  await writeJson(fx.parent, "receipt.json", receipt);
  return { path, receipt, derived };
}

async function rejects(fx, edit, pattern) {
  const built = await receiptFor(fx);
  edit(built.receipt, built);
  await writeJson(fx.parent, "receipt.json", built.receipt);
  await assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path }), pattern);
}

test("one-topic factual scope binds dates and passes without widening unchanged topics", async () => {
  const fx = await fixture();
  const built = await receiptFor(fx);
  assert.equal(built.derived.scope.length, 3);
  assert.deepEqual(new Set(built.derived.scope.map((item) => item.topic_slug)), new Set(["alpha"]));
  assert.equal((await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path })).outcome, "READY");
});

test("presentation-only change is NOT_APPLICABLE without a receipt", async () => {
  const fx = await fixture((docs) => {
    docs.evidence.alpha.contextOverview = "Layout copy without a temporal marker";
    docs.evidence.alpha.reference = { canonicalUrl: "https://agency.gov.tw/will-not-be-scoped" };
  });
  const result = await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base });
  assert.equal(result.outcome, "NOT_APPLICABLE");
});

test("removing temporal wording remains in scope while machine fields stay excluded", async () => {
  const base = documents();
  base.evidence.alpha.contextOverview = "This is still pending";
  const parent = await mkdtemp(join(process.platform === "darwin" ? "/private/tmp" : tmpdir(), "tw-prepublish-temporal-"));
  const root = join(parent, "repo");
  execFileSync("mkdir", [root]);
  execFileSync("mkdir", [join(root, "app")]);
  run(root, ["init", "-q"]); run(root, ["config", "user.email", "test@example.com"]); run(root, ["config", "user.name", "Test"]);
  await writeDocuments(root, base); run(root, ["add", "."]); run(root, ["commit", "-qm", "base"]);
  const baseRef = run(root, ["rev-parse", "HEAD"]);
  const head = structuredClone(base); head.evidence.alpha.contextOverview = "A settled description"; head.evidence.alpha.capturedAt = "will-not-be-scoped";
  await writeDocuments(root, head); run(root, ["add", "."]); run(root, ["commit", "-qm", "head"]);
  const scope = (await derivePrepublishData({ repoRoot: root, baseRef })).scope;
  assert.deepEqual(scope.map((item) => item.path), ["app/public-evidence.json:alpha.contextOverview"]);
});

test("temporal wording is scoped in every canonical public document", async (t) => {
  for (const owner of ["bundle", "index"]) {
    await t.test(owner, async () => {
      const fx = await fixture((docs) => {
        if (owner === "bundle") docs.bundle.topics.alpha.indexed_title = "Case is still pending";
        else {
          docs.index.topics[0].title = "Case is still pending";
          docs.index.allTopics[0].title = "Case is still pending";
        }
      });
      const scope = (await derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base })).scope;
      assert.deepEqual(scope.map((item) => item.path), [owner === "bundle"
        ? "public-bundle.json:topics.alpha.indexed_title"
        : "app/research-topics.json:topics[alpha].title"]);
    });
  }
});

test("timeline reorder is ignored and missing or duplicate publicKey blocks derivation", async (t) => {
  const reordered = await fixture((docs) => { docs.evidence.alpha.reportedTimeline.reverse(); });
  assert.equal((await validatePrepublishData({ repoRoot: reordered.root, baseRef: reordered.base })).outcome, "NOT_APPLICABLE");
  for (const mode of ["missing", "duplicate"]) {
    await t.test(mode, async () => {
      const fx = await fixture((docs) => {
        if (mode === "missing") delete docs.evidence.alpha.reportedTimeline[0].publicKey;
        else docs.evidence.alpha.reportedTimeline[1].publicKey = "event-a";
      });
      await assert.rejects(derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base }), /missing or duplicate publicKey/);
    });
  }
});

test("latest changed timeline uses occurredAt, reportedAt, then publicKey tie-break", async () => {
  const fx = await fixture((docs) => {
    docs.evidence.alpha.reportedTimeline[0] = { ...docs.evidence.alpha.reportedTimeline[0], occurredAt: "2026-03-01", reportedAt: "2026-03-02", headline: "Changed A" };
    docs.evidence.alpha.reportedTimeline[1] = { ...docs.evidence.alpha.reportedTimeline[1], occurredAt: "2026-03-01", reportedAt: "2026-03-02", headline: "Changed B" };
  });
  const derived = await derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base });
  assert.deepEqual(derived.scope.map((item) => item.path), ["app/public-evidence.json:alpha.reportedTimeline[publicKey=event-b]"]);
});

test("temporal scope includes non-status proceedings and non-latest changed events", async (t) => {
  await t.test("proceeding note", async () => {
    const fx = await fixture((docs) => { docs.evidence.alpha.proceedingTracks[0].note = "Review is still pending"; });
    const scope = (await derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base })).scope;
    assert.deepEqual(scope.map((item) => item.path), ["app/public-evidence.json:alpha.proceedingTracks[0].note"]);
  });
  await t.test("non-latest timeline event", async () => {
    const fx = await fixture((docs) => {
      docs.evidence.alpha.reportedTimeline[0].headline = "Earlier review is still pending";
      docs.evidence.alpha.reportedTimeline[1].headline = "Latest event changed";
    });
    const scope = (await derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base })).scope;
    assert.deepEqual(scope.map((item) => item.path), [
      "app/public-evidence.json:alpha.reportedTimeline[publicKey=event-a].headline",
      "app/public-evidence.json:alpha.reportedTimeline[publicKey=event-b]",
    ]);
  });
});

test("lastUpdated mirrors must match and freshness creates one canonical proposition", async () => {
  const fx = await fixture((docs) => { docs.index.topics[0].lastUpdated = "2026-02-02"; });
  await assert.rejects(derivePrepublishData({ repoRoot: fx.root, baseRef: fx.base }), /mirror mismatch/);
  const valid = await fixture((docs) => {
    docs.index.topics[0].lastUpdated = "2026-02-02";
    docs.index.allTopics[0].lastUpdated = "2026-02-02";
  });
  const scope = (await derivePrepublishData({ repoRoot: valid.root, baseRef: valid.base })).scope;
  assert.deepEqual(scope.map((item) => item.path), ["app/research-topics.json:topics[alpha].lastUpdated"]);
});

test("allTopics-only entries remain outside canonical public-topic scope", async () => {
  const fx = await fixture((docs) => {
    docs.index.allTopics.push({ slug: "extra", lastUpdated: "2026-02-02", title: "Review is still pending" });
  });
  const result = await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base });
  assert.equal(result.outcome, "NOT_APPLICABLE");
});

test("scope omissions, duplicates, widening, revisions, and fingerprints are blocked", async (t) => {
  const fx = await fixture();
  await t.test("omitted", () => rejects(fx, (r) => r.scope[0].propositions.pop(), /omits/));
  await t.test("duplicate", () => rejects(fx, (r) => r.scope[0].propositions.push(structuredClone(r.scope[0].propositions[0])), /duplicate/));
  await t.test("widened", () => rejects(fx, (r) => { r.scope[0].propositions[0].path += ".extra"; }, /missing, widened, or drifted/));
  await t.test("revision", () => rejects(fx, (r) => { r.head_revision = r.base_revision; }, /revision binding drifted/));
  await t.test("fingerprint", () => rejects(fx, (r) => { r.fingerprint.combined_sha256 = "0".repeat(64); }, /fingerprint drifted/));
});

test("public-path worktree drift fails before receipt evaluation", async () => {
  const fx = await fixture();
  const built = await receiptFor(fx);
  await writeFile(join(fx.root, "public-bundle.json"), "{}\n");
  await assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path }), /differs from HEAD/);
});

test("receipt must be external regular non-symlink file", async (t) => {
  const fx = await fixture();
  const built = await receiptFor(fx);
  const inside = join(fx.root, "receipt.json");
  await writeJson(fx.root, "receipt.json", built.receipt);
  await t.test("inside repo", () => assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: inside }), /outside/));
  const link = join(fx.parent, "receipt-link.json");
  await symlink(built.path, link);
  await t.test("symlink", () => assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: link }), /non-symlink/));
});

test("closed schema and every forbidden private boundary are rejected", async (t) => {
  const fx = await fixture();
  await t.test("unknown root", () => rejects(fx, (r) => { r.notes = "raw"; }, /unknown keys/));
  await t.test("unknown nested", () => rejects(fx, (r) => { r.scope[0].propositions[0].audit.sources[0].blob = "raw"; }, /unknown keys/));
  for (const key of ["secret", "token", "password", "private_key", "ledger_id", "deployment_project_id"]) {
    await t.test(key, () => rejects(fx, (r) => { r.scope[0].propositions[0].audit[key] = "x"; }, /forbidden/));
  }
  for (const value of ["context/", "account/", ".claude/", "evidence-ledger"]) {
    await t.test(value, () => rejects(fx, (r) => { r.scope[0].propositions[0].audit.finding = `contains ${value}`; }, /forbidden private material/));
  }
});

test("official, primary, attributed, cutoff, and outcome roles remain bounded", async (t) => {
  const fx = await fixture();
  await t.test("receipt calendar date", () => rejects(fx, (r) => { r.retrieval_cutoff = "2026-02-31"; }, /valid YYYY-MM-DD calendar date/));
  for (const field of ["publication_date", "retrieval_cutoff"]) {
    await t.test(`source ${field} calendar date`, () => rejects(fx, (r) => { r.scope[0].propositions[0].audit.sources[0][field] = "2026-99-99"; }, /invalid publication\/retrieval date binding/));
  }
  await t.test("official domain", () => rejects(fx, (r) => { r.scope[0].propositions[0].audit.sources[0].canonical_url = "https://example.com/result"; }, /metadata does not exactly match HEAD|\.gov\.tw/));
  await t.test("primary binding", async () => {
    const built = await receiptFor(fx, "CURRENT", () => source("primary_document"));
    assert.equal((await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path })).outcome, "READY");
  });
  await t.test("primary provenance and coverage drift", async () => {
    const built = await receiptFor(fx, "CURRENT", () => source("primary_document", { coverage_boundary: '{"limitation":"complete"}' }));
    await assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path }), /exactly match published provenance and coverage/);
  });
  await t.test("attributed non-promotion", async () => {
    const built = await receiptFor(fx, "CURRENT", () => source("attributed_report"));
    await assert.rejects(validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path }), /cannot promote/);
  });
  await t.test("named attributed open question", async () => {
    const attributedFx = await fixture((docs) => {
      docs.evidence.alpha.openQuestions[0].statement = "Agency says the result is pending.";
      docs.evidence.alpha.openQuestions[0].status = "attributed";
      docs.evidence.alpha.openQuestions[0].speakers = [{ name: "Agency" }];
    });
    const built = await receiptFor(attributedFx, "CURRENT", () => source("attributed_report"));
    assert.equal((await validatePrepublishData({ repoRoot: attributedFx.root, baseRef: attributedFx.base, receiptPath: built.path })).outcome, "READY");
  });
  await t.test("honest open cutoff", async () => {
    const built = await receiptFor(fx, "OPEN_WITH_CUTOFF", () => source("bounded_search"));
    assert.equal((await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path })).outcome, "READY_WITH_OPEN_GAPS");
  });
  await t.test("invalid outcome", () => rejects(fx, (r) => { r.outcome = "READY_WITH_OPEN_GAPS"; }, /does not match/));
});

test("proceeding evidence and move target paths require stronger bindings", async () => {
  const proceeding = await fixture((docs) => { docs.evidence.alpha.proceedingTracks[0].status = "closed"; });
  const attributed = await receiptFor(proceeding, "CURRENT", () => source("attributed_report"));
  await assert.rejects(validatePrepublishData({ repoRoot: proceeding.root, baseRef: proceeding.base, receiptPath: attributed.path }), /proceeding outcomes require/);
  const moved = await fixture((docs) => {
    docs.evidence.alpha.openQuestions[0].statement = "Resolved?";
    docs.evidence.alpha.resolution = "Official result confirmed";
  });
  const built = await receiptFor(moved, "MOVE_OUT_OF_OPEN_QUESTIONS");
  for (const item of built.receipt.scope[0].propositions) {
    item.audit.target_path = "app/public-evidence.json:alpha.resolution";
    item.audit.replacement_text = "Official result";
  }
  built.receipt.outcome = "READY";
  await writeJson(moved.parent, "receipt.json", built.receipt);
  assert.equal((await validatePrepublishData({ repoRoot: moved.root, baseRef: moved.base, receiptPath: built.path })).outcome, "READY");
  built.receipt.scope[0].propositions[0].audit.target_path = "app/public-evidence.json:alpha.openQuestions[0]";
  await writeJson(moved.parent, "receipt.json", built.receipt);
  await assert.rejects(validatePrepublishData({ repoRoot: moved.root, baseRef: moved.base, receiptPath: built.path }), /outside openQuestions/);
});

test("validator performs no network call and does not mutate the worktree", async () => {
  const fx = await fixture();
  const built = await receiptFor(fx);
  const before = run(fx.root, ["status", "--porcelain=v1"]);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("network forbidden"); };
  try {
    await validatePrepublishData({ repoRoot: fx.root, baseRef: fx.base, receiptPath: built.path });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(run(fx.root, ["status", "--porcelain=v1"]), before);
  assert.equal(await readFile(built.path, "utf8"), `${JSON.stringify(built.receipt, null, 2)}\n`);
});
