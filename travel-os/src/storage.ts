import { z } from "zod";
export const Expense = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1).max(160),
    category: z.enum(["food", "transport", "stay", "culture", "other"]),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .refine((c) => {
        try {
          return Intl.supportedValuesOf("currency").includes(c);
        } catch {
          return false;
        }
      }),
    amountMinor: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    date: z.iso.date(),
    comment: z.string().max(1000),
  })
  .strict();
export type Expense = z.infer<typeof Expense>;
export const ExchangeRate = z
  .object({
    from: z.string().regex(/^[A-Z]{3}$/),
    to: z.string().regex(/^[A-Z]{3}$/),
    rate: z
      .string()
      .max(32)
      .regex(/^\d+(?:\.\d{1,8})?$/)
      .refine((x) => Number(x) > 0),
    recordedAt: z.iso.date(),
    sourceUrl: z.url().refine((x) => {
      const u = new URL(x);
      return u.protocol === "https:" && !u.username && !u.password;
    }),
  })
  .strict();
export type ExchangeRate = z.infer<typeof ExchangeRate>;
export const UserData = z
  .object({
    version: z.literal(1),
    tripId: z.string(),
    expenses: z.array(Expense).max(10000),
    bookingStatuses: z.record(
      z.string(),
      z.enum(["not_started", "planned", "user_confirmed", "cancelled"]),
    ),
    notes: z.string().max(20000),
    transportId: z.string().optional(),
    hotelId: z.string().optional(),
    exchangeRates: z.array(ExchangeRate).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const ids = new Set<string>();
    for (const e of data.expenses) {
      if (ids.has(e.id))
        ctx.addIssue({ code: "custom", message: "Повтор ID расхода" });
      ids.add(e.id);
    }
    try {
      moneyTotals(data.expenses);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Сумма расходов слишком большая",
      });
    }
  });
export type UserData = z.infer<typeof UserData>;
export const emptyUserData = (tripId: string): UserData => ({
  version: 1,
  tripId,
  expenses: [],
  bookingStatuses: {},
  notes: "",
});
export function toMinor(input: string, currency: string) {
  const digits =
    new Intl.NumberFormat("ru", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const normalized = input.trim().replace(",", ".");
  if (
    !new RegExp(`^\\d+(?:\\.\\d{1,${Math.max(digits, 1)}})?$`).test(
      normalized,
    ) ||
    (!digits && normalized.includes("."))
  )
    throw Error("Некорректная сумма");
  const [whole, frac = ""] = normalized.split(".");
  if (frac.length > digits) throw Error("Слишком много знаков");
  const result =
    Number(whole) * 10 ** digits + Number(frac.padEnd(digits, "0"));
  if (!Number.isSafeInteger(result)) throw Error("Сумма слишком большая");
  return result;
}
export function moneyTotals(rows: { amountMinor: number; currency: string }[]) {
  const totals: Record<string, number> = {};
  for (const r of rows) {
    totals[r.currency] = (totals[r.currency] ?? 0) + r.amountMinor;
    if (!Number.isSafeInteger(totals[r.currency]))
      throw Error("Сумма слишком большая");
  }
  return totals;
}
export function formatMoney(minor: number, currency: string) {
  const digits =
    new Intl.NumberFormat("ru", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat("ru", {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
  }).format(minor / 10 ** digits);
}
export function restoreUserData(raw: string, tripId: string) {
  const data = UserData.parse(JSON.parse(raw));
  if (data.tripId !== tripId)
    throw Error("Резервная копия относится к другой поездке");
  return data;
}
export const storageKey = (id: string) => `travel-os:v1:${id}`;
export function csvExpenses(rows: Expense[]) {
  const safe = (s: unknown) =>
    `"${String(s)
      .replace(/^[=+@'-]/, "'$&")
      .replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    [
      [
        "id",
        "Дата",
        "Название",
        "Категория",
        "Сумма в мин. единицах",
        "Валюта",
        "Комментарий",
      ],
      ...rows.map((r) => [
        r.id,
        r.date,
        r.label,
        r.category,
        r.amountMinor,
        r.currency,
        r.comment,
      ]),
    ]
      .map((row) => row.map(safe).join(","))
      .join("\r\n")
  );
}
export function download(
  name: string,
  body: string,
  type = "application/json",
) {
  const u = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
export function parseExpensesCsv(raw: string): Expense[] {
  const rows: string[][] = [];
  let row: string[] = [],
    value = "",
    quoted = false;
  const input = raw.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quoted) throw Error("Незакрытая кавычка CSV");
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const header = [
    "id",
    "Дата",
    "Название",
    "Категория",
    "Сумма в мин. единицах",
    "Валюта",
    "Комментарий",
  ];
  if (JSON.stringify(rows.shift()) !== JSON.stringify(header))
    throw Error("Нужен CSV, экспортированный из Travel OS");
  const ids = new Set<string>();
  const expenses = rows
    .filter((r) => r.some(Boolean))
    .map((r) => {
      const unescape = (s: string) => s.replace(/^'(?=[=+@'-])/, "");
      const id = unescape(r[0]);
      if (r.length !== 7 || ids.has(id))
        throw Error("Повтор ID или неверное число колонок");
      ids.add(id);
      return Expense.parse({
        id,
        date: r[1],
        label: unescape(r[2]),
        category: r[3],
        amountMinor: Number(r[4]),
        currency: r[5],
        comment: unescape(r[6]),
      });
    });
  moneyTotals(expenses);
  return expenses;
}

export function convertTotals(
  rows: { amountMinor: number; currency: string }[],
  rates: ExchangeRate[],
  to: string,
) {
  let total = 0n;
  const missing = new Set<string>();
  const digits = (c: string) =>
    new Intl.NumberFormat("ru", {
      style: "currency",
      currency: c,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  for (const row of rows) {
    if (row.currency === to) {
      total += BigInt(row.amountMinor);
      continue;
    }
    const rate = rates.find((r) => r.from === row.currency && r.to === to);
    if (!rate) {
      missing.add(row.currency);
      continue;
    }
    ExchangeRate.parse(rate);
    const [whole, fraction = ""] = rate.rate.split(".");
    const numerator = BigInt(whole + fraction);
    const divisor = 10n ** BigInt(fraction.length + digits(row.currency));
    const value =
      BigInt(row.amountMinor) * numerator * 10n ** BigInt(digits(to));
    total += (value + divisor / 2n) / divisor;
  }
  if (total > BigInt(Number.MAX_SAFE_INTEGER))
    throw Error("Сумма слишком большая");
  return { totalMinor: Number(total), missing: [...missing] };
}
