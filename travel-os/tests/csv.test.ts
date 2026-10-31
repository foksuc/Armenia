import { it, expect } from "vitest";
import { csvExpenses, parseExpensesCsv } from "../src/storage";
it("roundtrips expenses with quotes, commas and line breaks", () => {
  const rows = [
    {
      id: "one",
      label: 'Ужин, "кафе"',
      category: "food" as const,
      currency: "RUB",
      amountMinor: 10029,
      date: "2026-10-31",
      comment: "две\nстроки",
    },
  ];
  expect(parseExpensesCsv(csvExpenses(rows))).toEqual(rows);
});
it("rejects malformed CSV and noninteger minor units", () => {
  expect(() => parseExpensesCsv("id,Дата\nwrong")).toThrow();
  expect(() =>
    parseExpensesCsv(
      "id,Дата,Название,Категория,Сумма в мин. единицах,Валюта,Комментарий\nx,2026-10-31,test,food,1.3,RUB,n",
    ),
  ).toThrow();
});
it("preserves original apostrophes and spreadsheet-sensitive IDs", () => {
  const rows = [
    {
      id: "=1+1",
      label: "'=hello",
      category: "food" as const,
      currency: "RUB",
      amountMinor: 100,
      date: "2026-10-31",
      comment: "'original",
    },
  ];
  expect(parseExpensesCsv(csvExpenses(rows))).toEqual(rows);
});
it("rejects aggregate overflow in CSV", () => {
  const e = {
    id: "one",
    label: "x",
    category: "food" as const,
    currency: "EUR",
    amountMinor: Number.MAX_SAFE_INTEGER,
    date: "2026-10-31",
    comment: "",
  };
  expect(() =>
    parseExpensesCsv(csvExpenses([e, { ...e, id: "two", amountMinor: 1 }])),
  ).toThrow();
});
it("rejects duplicate IDs after decoding", () => {
  const header =
    "id,Дата,Название,Категория,Сумма в мин. единицах,Валюта,Комментарий";
  expect(() =>
    parseExpensesCsv(
      header + "\n=x,2026-10-31,x,food,1,EUR,\n'=x,2026-10-31,y,food,1,EUR,",
    ),
  ).toThrow();
});
