import { toMinor } from "./storage";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { z } from "zod";
import schema from "../schema/trip-package.schema.json";
import type { TripPackage } from "./types";
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const check = ajv.compile(schema);
export function safeUrl(value: string) {
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !/^(localhost|127\.|0\.|\[::1\])/.test(u.hostname)
    );
  } catch {
    return false;
  }
}
export function validateTrip(value: unknown): {
  trip?: TripPackage;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [],
    warnings: string[] = [];
  if (!check(value))
    return {
      errors: (check.errors ?? []).map(
        (e) => `${e.instancePath || "/"} ${e.message}`,
      ),
      warnings,
    };
  const t = value as TripPackage;
  for (const p of t.priceRecords) {
    try {
      if (!Intl.supportedValuesOf("currency").includes(p.currency))
        throw Error();
      toMinor(String(p.amount), p.currency);
    } catch {
      errors.push(`Invalid money amount/currency: ${p.id}`);
    }
  }
  const ids = new Set<string>();
  // Hotel price and hotel option IDs are different entity namespaces in canonical schema.
  const groups = [
    t.itinerary,
    t.itinerary.flatMap((d) => d.events),
    t.places,
    t.transportOptions,
    t.transportOptions.flatMap((o) => o.legs),
    t.accommodationOptions,
    t.priceRecords,
    t.sources,
    t.unresolved,
  ];
  for (const group of groups) {
    const local = new Set<string>();
    for (const item of group) {
      if (local.has(item.id)) errors.push(`Duplicate ID ${item.id}`);
      local.add(item.id);
      ids.add(item.id);
    }
  }
  const refs = (obj: unknown) => {
    if (!obj || typeof obj !== "object") return;
    for (const [k, v] of Object.entries(obj)) {
      if (k === "placeId" && v !== null && !t.places.some((p) => p.id === v))
        errors.push(`Unknown placeId ${v}`);
      if (["priceIds", "sourceIds", "relatedIds"].includes(k)) {
        const set =
          k === "priceIds"
            ? t.priceRecords
            : k === "sourceIds"
              ? t.sources
              : null;
        for (const id of v as string[])
          if (set ? !set.some((x) => x.id === id) : !ids.has(id))
            errors.push(`Unknown ${k} ${id}`);
      }
      if (
        ["url", "sourceUrl"].includes(k) &&
        typeof v === "string" &&
        !safeUrl(v)
      )
        errors.push(`Unsafe URL in ${k}`);
      if (k === "externalLinks")
        for (const u of v as string[])
          if (!safeUrl(u)) errors.push("Unsafe URL in externalLinks");
      if (typeof v === "object") refs(v);
    }
  };
  refs(t);
  try {
    new Intl.DateTimeFormat("ru", { timeZone: t.dates.timezone });
  } catch {
    errors.push("Invalid timezone");
  }
  const date = (s: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s)) &&
    new Date(s).toISOString().slice(0, 10) === s;
  const walk = (v: unknown) => {
    if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) {
        if (
          [
            "date",
            "startDate",
            "endDate",
            "arriveDate",
            "checkIn",
            "checkOut",
            "checkedAt",
            "recordedAt",
          ].includes(k) &&
          typeof x === "string" &&
          !date(x)
        )
          errors.push(`Invalid date ${x}`);
        if (typeof x === "object") walk(x);
      }
  };
  walk(t);
  if (t.dates.kind === "fixed" && t.dates.startDate && t.dates.endDate) {
    const span =
      (Date.parse(t.dates.endDate) - Date.parse(t.dates.startDate)) / 86400000 +
      1;
    if (span !== t.dates.durationDays)
      errors.push("durationDays does not match fixed dates");
  }
  t.itinerary.forEach((d, i) => {
    if (d.dayNumber !== i + 1) errors.push("Day order must be sequential");
    if (d.date && t.dates.startDate) {
      const expected = new Date(Date.parse(t.dates.startDate) + i * 86400000)
        .toISOString()
        .slice(0, 10);
      if (d.date !== expected)
        errors.push(`Day date ${d.date} differs from ${expected}`);
    }
    for (const e of d.events)
      if (e.startTime && e.endTime && e.endTime < e.startTime)
        errors.push(`Invalid event time ${e.id}`);
  });
  if (t.itinerary.length !== t.dates.durationDays)
    errors.push("Itinerary length differs from durationDays");
  for (const o of t.accommodationOptions)
    if (o.checkIn && o.checkOut && o.checkOut <= o.checkIn)
      errors.push(`Invalid stay ${o.id}`);
  for (const o of t.transportOptions)
    for (const l of o.legs)
      if (l.date && l.arriveDate && l.arriveDate < l.date)
        errors.push(`Invalid arrival ${l.id}`);
  if (t.places.some((p) => !p.location))
    warnings.push("Часть координат отсутствует");
  if (t.geo.routeStatus !== "verified")
    warnings.push("Дорожная геометрия не проверена");
  warnings.push(...t.unresolved.map((u) => u.question));
  const strings = JSON.stringify(t);
  if (
    /sk-proj-|BEGIN PRIVATE KEY|"(?:passport|cardNumber|bookingCode|apiKey|password)"\s*:/i.test(
      strings,
    )
  )
    errors.push("Potential secret in package");
  return { trip: t, errors, warnings };
}
export const tripBoundary = z.unknown().transform((v, ctx) => {
  const r = validateTrip(v);
  if (r.errors.length) {
    ctx.addIssue({ code: "custom", message: r.errors.join("; ") });
    return z.NEVER;
  }
  return r.trip!;
});
export function publicTrips(values: unknown[]): TripPackage[] {
  return values
    .map((v) => tripBoundary.parse(v))
    .filter((t) => t.status === "published");
}
const canonical = (v: unknown): string =>
  JSON.stringify(
    v && typeof v === "object"
      ? Array.isArray(v)
        ? v.map((x) => JSON.parse(canonical(x)))
        : Object.fromEntries(
            Object.entries(v)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, x]) => [k, JSON.parse(canonical(x))]),
          )
      : v,
  );
export function prepareImport(
  value: unknown,
  existing: unknown[],
  confirm = false,
) {
  const parsed = tripBoundary.parse(value);
  const list = existing.map((x) => tripBoundary.parse(x));
  const old = list.find((t) => t.tripId === parsed.tripId);
  if (list.some((t) => t.slug === parsed.slug && t.tripId !== parsed.tripId))
    throw Error("Duplicate slug");
  const trip = { ...parsed, status: "draft" as const };
  if (old && canonical(old) === canonical(trip))
    return { trip: old, kind: "unchanged" as const, diff: [] };
  const diff = Object.keys(trip)
    .filter(
      (k) =>
        canonical(old?.[k as keyof TripPackage] ?? null) !==
        canonical(trip[k as keyof TripPackage]),
    )
    .map((k) => ({
      field: k,
      before: old?.[k as keyof TripPackage] ?? null,
      after: trip[k as keyof TripPackage],
    }));
  if (old && !confirm)
    throw Error(
      `Revision needs --confirm-update; changed: ${diff.map((d) => d.field).join(", ")}`,
    );
  return { trip, kind: old ? ("update" as const) : ("create" as const), diff };
}
