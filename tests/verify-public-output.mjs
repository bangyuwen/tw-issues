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
assert.match(html, /新竹棒球場案不起訴處分書影像（第 3–22 頁）/);
assert.match(html, /這批不起訴處分書影像由新竹市議員楊玲宜於 Threads 公開/);
assert.match(html, /第 18 頁明載：該頁所述的 PE 網、噴灌管與電線，檢察官認為均非廢棄物/);
assert.match(html, /頁面可見紅色騎縫印文，但「具印文」只描述影像外觀，不能僅由印文判定持有人紙本為正本或副本/);
assert.doesNotMatch(html, /primary-document-warning|文件頁面可見紅色騎縫印文・由第三方社群公開/);
assert.doesNotMatch(html, /第三方(?:社群)?重製|第三方重製影像/);
assert.match(html, /塑膠管為噴灌系統/);
assert.match(html, /https:\/\/www\.threads\.com\/@yanglingyi2022\/post\/DcnfYAXEo-A/);

console.log("public output boundary PASS");
