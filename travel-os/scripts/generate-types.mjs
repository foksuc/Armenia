import { compileFromFile } from "json-schema-to-typescript";
import { writeFile } from "node:fs/promises";
await writeFile(
  "src/trip.generated.ts",
  await compileFromFile("schema/trip-package.schema.json", {
    bannerComment: "/* Generated from canonical schema. Do not edit. */",
    additionalProperties: false,
  }),
);
