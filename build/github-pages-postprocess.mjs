import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputRoot = resolve("dist/client");
const siteBasePath = "/tw-issues";
const textFiles = new Set([".css", ".html", ".js", ".json", ".rsc", ""]);
const rootAssetPattern = /(^|["'`(=])\/assets\//gm;

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!textFiles.has(path.endsWith("_headers") ? "" : path.slice(path.lastIndexOf(".")))) continue;

    const source = await readFile(path, "utf8");
    const rewritten = source.replace(rootAssetPattern, `$1${siteBasePath}/assets/`);
    if (rootAssetPattern.test(rewritten)) {
      throw new Error(`Unprefixed asset path remains in ${path}`);
    }
    if (rewritten !== source) await writeFile(path, rewritten);
  }
}

await stat(outputRoot);
await visit(outputRoot);
await stat(resolve(outputRoot, "index.html"));
await stat(resolve(outputRoot, "topics/benzopyrene-food-safety/index.html"));

console.log(`GitHub Pages asset paths prepared under ${siteBasePath}/`);
