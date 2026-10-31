// Integration regression: an existing published trip can have a pending draft revision.
import { readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const file = "drafts/qa-pending-armenia.json";
const marker = "QA_UNAPPROVED_REVISION_MUST_NOT_SHIP";
const source = JSON.parse(await readFile("src/data/armenia-2027.json", "utf8"));
try {
  await writeFile(
    file,
    JSON.stringify({ ...source, status: "draft", summary: marker }),
  );
  execFileSync("npm", ["run", "build"], { stdio: "inherit" });
  for (const name of await readdir("dist/assets"))
    if (
      name.endsWith(".js") &&
      (await readFile(`dist/assets/${name}`, "utf8")).includes(marker)
    )
      throw Error("Pending revision leaked");
  console.log("PASS: published ID accepted; pending revision content excluded");
} finally {
  await unlink(file).catch(() => {});
}
