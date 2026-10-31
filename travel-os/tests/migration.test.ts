import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, it, expect } from "vitest";
import trip from "../src/data/armenia-2027.json";
import original from "../src/data/armenia-original.json";
import manifest from "../public/original/armenia-v1/manifest.json";
describe("lossless V1 migration", () => {
  it("matches byte-for-byte snapshot to untouched root files", () => {
    for (const [name, hash] of Object.entries(manifest.files)) {
      const source = readFileSync(`../${name}`);
      expect(
        readFileSync(`public/original/armenia-v1/${name}`).equals(source),
      ).toBe(true);
      expect(createHash("sha256").update(source).digest("hex")).toBe(
        hash.sha256,
      );
    }
  });
  it("preserves six days, nine restaurants, two routes and four hotel tariffs", () => {
    expect(trip.itinerary).toHaveLength(6);
    expect(trip.places.filter((p) => p.category === "restaurant")).toHaveLength(
      9,
    );
    expect(trip.transportOptions).toHaveLength(2);
    expect(trip.accommodationOptions).toHaveLength(4);
    for (const o of trip.accommodationOptions)
      expect(trip.places.find((p) => p.id === o.placeId)?.category).toBe(
        "hotel",
      );
    expect(
      trip.itinerary[1].events.find((e) => e.startTime === "20:00")?.title,
    ).toBe("Концертный комплекс");
  });
  it("retains historical hotel prices and overnight Sochi return", () => {
    expect(
      trip.priceRecords
        .filter((p) =>
          [
            "hotel-basic",
            "hotel-flex",
            "hotel-breakfast",
            "hotel-breakfast-flex",
          ].includes(p.id),
        )
        .map((p) => p.amount),
    ).toEqual([24601, 28275, 37459, 40838]);
    expect(trip.transportOptions[1].legs[3].arriveDate).toBe("2027-02-19");
    expect(original.sections).toHaveLength(10);
    expect(original.sections.map((s) => s.text).join(" ")).toContain("12 858");
  });
});
