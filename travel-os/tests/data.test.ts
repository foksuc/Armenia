import { describe, it, expect } from "vitest";
import example from "../drafts/example-italy-2028.json";
import { validateTrip, prepareImport, publicTrips } from "../src/contract";
import {
  toMinor,
  moneyTotals,
  restoreUserData,
  csvExpenses,
} from "../src/storage";
describe("canonical contract", () => {
  it("accepts supplied draft and blocks public catalog", () => {
    expect(validateTrip(example).errors).toEqual([]);
    expect(publicTrips([example])).toEqual([]);
  });
  it("rejects broken links, duplicate ids and impossible dates", () => {
    const p = structuredClone(example);
    p.itinerary[0].events[0].placeId = "unknown";
    p.itinerary[1].id = p.itinerary[0].id;
    p.itinerary[1].date = "2028-05-09";
    expect(validateTrip(p).errors.length).toBeGreaterThanOrEqual(3);
  });
  it("rejects credential URLs and unsafe data", () => {
    const p = structuredClone(
      example,
    ) as unknown as import("../src/types").TripPackage;
    p.sources = [
      {
        id: "bad-url",
        url: "https://user:pass@example.com",
        title: "x",
        checkedAt: "2026-10-31",
        type: "other",
        notes: null,
      },
    ];
    expect(validateTrip(p).errors.join()).toMatch(/URL/);
  });
  it("forces new imports to draft, is idempotent and requires revision confirmation", () => {
    expect(
      prepareImport({ ...example, status: "published" }, []).trip.status,
    ).toBe("draft");
    expect(prepareImport(example, [example]).kind).toBe("unchanged");
    expect(() => prepareImport({ ...example, name: "New" }, [example])).toThrow(
      /confirm/,
    );
  });
});
describe("money and storage", () => {
  it("uses exact minor units, currency precision and no implicit conversion", () => {
    expect(toMinor("0.29", "RUB")).toBe(29);
    expect(() => toMinor("2.001", "RUB")).toThrow();
    expect(toMinor("120", "JPY")).toBe(120);
    expect(
      moneyTotals([
        { amountMinor: 29, currency: "RUB" },
        { amountMinor: 1, currency: "RUB" },
        { amountMinor: 100, currency: "AMD" },
      ]),
    ).toEqual({ RUB: 30, AMD: 100 });
  });
  it("rejects corrupted data and isolates trips", () => {
    expect(() => restoreUserData("{", "trip-a")).toThrow();
    expect(() =>
      restoreUserData(
        JSON.stringify({
          version: 1,
          tripId: "trip-b",
          expenses: [],
          bookingStatuses: {},
          notes: "",
        }),
        "trip-a",
      ),
    ).toThrow();
  });
  it("neutralizes spreadsheet formula injection", () =>
    expect(
      csvExpenses([
        {
          id: "x",
          label: "=1+2",
          category: "food",
          currency: "RUB",
          amountMinor: 100,
          date: "2026-10-31",
          comment: "",
        },
      ]),
    ).toContain("'=1+2"));
});
it("rejects prices that cannot be represented in currency minor units", () => {
  const p = structuredClone(
    example,
  ) as unknown as import("../src/types").TripPackage;
  p.priceRecords = [
    {
      id: "test-price",
      amount: 1.234,
      currency: "EUR",
      basis: "total",
      recordedAt: "2026-10-31",
      isEstimate: true,
      sourceIds: [],
      notes: null,
    },
  ];
  expect(validateTrip(p).errors.join()).toMatch(/money/);
});
it("rejects aggregate overflow and duplicate expenses on restore", () => {
  const e = {
    id: "one",
    label: "Test",
    category: "food",
    currency: "EUR",
    date: "2026-10-31",
    comment: "",
    amountMinor: Number.MAX_SAFE_INTEGER,
  };
  expect(() =>
    restoreUserData(
      JSON.stringify({
        version: 1,
        tripId: "test",
        expenses: [e, { ...e, id: "two", amountMinor: 1 }],
        bookingStatuses: {},
        notes: "",
      }),
      "test",
    ),
  ).toThrow();
});
