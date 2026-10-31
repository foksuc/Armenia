import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const preview = process.env.TRAVEL_PREVIEW === "1";
await mkdir("src/generated", { recursive: true });
const files = (await readdir("src/data")).filter(
  (f) =>
    f.endsWith(".json") && !f.includes("original") && !f.includes("enrichment"),
);
const published = [];
const publishedIds = new Set();
const slugs = new Set();
for (const f of files) {
  const p = JSON.parse(await readFile(`src/data/${f}`, "utf8"));
  if (p.status === "published") {
    execFileSync(
      "node",
      ["--import", "tsx", "scripts/trips.ts", "validate", `src/data/${f}`],
      { stdio: "inherit" },
    );
    if (publishedIds.has(p.tripId) || slugs.has(p.slug))
      throw Error("Duplicate published tripId or slug");
    publishedIds.add(p.tripId);
    slugs.add(p.slug);
    published.push(f);
  }
}
const draftFiles = preview
  ? (await readdir("drafts")).filter((f) => f.endsWith(".json"))
  : [];
const imports = published
  .map((f, i) => `import t${i} from '../data/${f}';`)
  .concat(draftFiles.map((f, i) => `import d${i} from '../../drafts/${f}';`));
await writeFile(
  "src/generated/registry.ts",
  `${imports.join("\n")}\nimport {tripBoundary} from '../contract';\nexport const trips=[${published.map((_, i) => `t${i}`).join(",")}].map(t=>tripBoundary.parse(t));\nexport const drafts=[${draftFiles.map((_, i) => `d${i}`).join(",")}].map(t=>tripBoundary.parse(t));\n`,
);
execFileSync("npm", ["run", "typecheck"], { stdio: "inherit" });
execFileSync(
  "npx",
  ["vite", "build", "--outDir", preview ? "dist-preview" : "dist"],
  { stdio: "inherit" },
);
if (!preview) {
  const scan = async (path) => {
    for (const item of await readdir(path, { withFileTypes: true })) {
      const p = `${path}/${item.name}`;
      if (item.isDirectory()) await scan(p);
      else if (/\.(js|json|html)$/.test(p)) {
        const body = await readFile(p, "utf8");
        for (const file of await readdir("drafts")) {
          if (!file.endsWith(".json")) continue;
          const trip = JSON.parse(await readFile(`drafts/${file}`, "utf8"));
          if (!publishedIds.has(trip.tripId) && body.includes(trip.tripId))
            throw Error(`Draft leaked: ${trip.tripId} in ${p}`);
        }
      }
    }
  };
  await scan("dist");
  console.log("PASS: draft content absent from production output");
}
