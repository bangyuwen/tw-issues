import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

const outputRoot = resolve("dist/client");
const hsinchuPage = resolve(outputRoot, "topics/hsinchu-baseball-stadium/index.html");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".rsc"]);

async function collectFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(path, files);
    else files.push(path);
  }
  return files;
}

const files = await collectFiles(outputRoot);
const publicPaths = files.map((path) => relative(outputRoot, path));
assert.equal(publicPaths.some((path) => /(?:^|\/)source-archives(?:\/|$)/.test(path)), false);
assert.equal(publicPaths.some((path) => /source-58.*page-\d+\.jpg$/i.test(path)), false);

for (const path of files.filter((candidate) => textExtensions.has(candidate.slice(candidate.lastIndexOf("."))))) {
  const text = await readFile(path, "utf8");
  assert.doesNotMatch(text, /\/source-archives\//, `${relative(outputRoot, path)} links a local source archive`);
  assert.doesNotMatch(text, /source-58\/(?:manifest\.json|transcript\.md|page-\d+\.jpg)/, `${relative(outputRoot, path)} exposes a raw source-58 artifact`);
  assert.doesNotMatch(text, /source-58｜新竹棒球場案不起訴處分書社群影像轉錄/, `${relative(outputRoot, path)} exposes the full local transcript`);
}

const html = await readFile(hsinchuPage, "utf8");
assert.match(html, /第三方社群重製・不是官方完整全文・已遮蔽・僅涵蓋第 3–22 頁/);
assert.match(html, /塑膠管為噴灌系統/);
assert.match(html, /https:\/\/www\.threads\.com\/@yanglingyi2022\/post\/DcnfYAXEo-A/);

console.log("public output boundary PASS");
