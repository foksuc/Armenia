import { it, expect } from "vitest";
import { convertTotals } from "../src/storage";
it("converts minor units with dated rates and currency-specific precision", () => {
  expect(
    convertTotals(
      [
        { amountMinor: 100, currency: "USD" },
        { amountMinor: 100, currency: "JPY" },
      ],
      [
        {
          from: "USD",
          to: "RUB",
          rate: "90.1234",
          recordedAt: "2026-10-31",
          sourceUrl: "https://www.cbr.ru/",
        },
        {
          from: "JPY",
          to: "RUB",
          rate: "0.6",
          recordedAt: "2026-10-31",
          sourceUrl: "https://www.cbr.ru/",
        },
      ],
      "RUB",
    ),
  ).toEqual({ totalMinor: 15012, missing: [] });
});
it("does not invent a rate for missing currency", () =>
  expect(
    convertTotals([{ amountMinor: 100, currency: "AMD" }], [], "RUB"),
  ).toEqual({ totalMinor: 0, missing: ["AMD"] }));
