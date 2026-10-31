import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { validateTrip, prepareImport } from "../src/contract";
const [mode, file, ...args] = process.argv.slice(2);
const fail = (s: string): never => {
  throw Error(s);
};
if (!file)
  fail(
    "Usage: npm run validate -- path.json | npm run import:trip -- path.json [--dry-run] [--confirm-update]",
  );
const value = JSON.parse(await readFile(file, "utf8"));
const result = validateTrip(value);
console.log(
  JSON.stringify({ errors: result.errors, warnings: result.warnings }, null, 2),
);
if (result.errors.length) process.exit(1);
await mkdir("drafts", { recursive: true });
const names = (await readdir("drafts")).filter((f) => f.endsWith(".json"));
const existing = await Promise.all(
  names.map((f) => readFile(`drafts/${f}`, "utf8").then(JSON.parse)),
);
for (const f of (await readdir("src/data")).filter((f) =>
  f.endsWith(".json"),
)) {
  const p = JSON.parse(await readFile(`src/data/${f}`, "utf8"));
  if (p.schemaVersion && !existing.some((x) => x.tripId === p.tripId))
    existing.push(p);
}
if (mode === "import") {
  const branch = execFileSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).trim();
  if (
    !args.includes("--dry-run") &&
    branch !== `trip/${result.trip!.slug}` &&
    !(
      branch === "feature/travel-os-rebuild" &&
      result.trip!.tags.includes("sample-only")
    )
  )
    fail(
      `Import needs isolated trip/${result.trip!.slug} branch; main is read-only`,
    );
  const change = prepareImport(
    value,
    existing,
    args.includes("--confirm-update") || args.includes("--dry-run"),
  );
  console.log(
    JSON.stringify(
      {
        kind: change.kind,
        changedFields: change.diff,
        status: change.trip.status,
      },
      null,
      2,
    ),
  );
  if (!args.includes("--dry-run") && change.kind !== "unchanged") {
    await writeFile(
      `drafts/${change.trip.slug}.json`,
      JSON.stringify(change.trip, null, 2) + "\n",
    );
    console.log(`Saved draft: drafts/${change.trip.slug}.json`);
  }
} else if (mode === "approve") {
  const branch = execFileSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).trim();
  if (branch !== "release/travel-os")
    fail("Approval runs only in release/travel-os, never main");
  if (!args.includes("--user-approved"))
    fail("Requires explicit user approval and --user-approved");
  if (result.trip!.unresolved.some((x) => x.severity === "blocking"))
    fail("Blocking unresolved questions");
  if (result.trip!.status !== "ready")
    fail("Package must be ready after preview review");
  const published = { ...result.trip!, status: "published" };
  await writeFile(
    `src/data/${published.slug}.json`,
    JSON.stringify(published, null, 2) + "\n",
  );
  console.log(
    "Approved content hash:",
    createHash("sha256").update(JSON.stringify(published)).digest("hex"),
  );
} else if (mode !== "validate") fail("Unknown command");
