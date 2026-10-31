import { test, expect } from "@playwright/test";
import path from "node:path";
test("catalog search, new tab semantics and responsive layout", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "За пределы привычного." }),
  ).toBeVisible();
  const link = page.getByRole("link", {
    name: /открыть поездку в новой вкладке/,
  });
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("target", "_blank");
  await page.getByRole("searchbox").fill("неизвестно");
  await expect(
    page.getByRole("heading", { name: "Пока нет совпадений" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Сбросить поиск" }).click();
  await expect(link).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/catalog-${info.project.name}.png`,
    fullPage: true,
  });
});
test("deep URL, day, map fallback and expenses CRUD persist per trip", async ({
  page,
}, info) => {
  await page.goto("/trips/armenia-2027");
  await page.getByRole("button", { name: "День 5" }).click();
  await expect(
    page.getByRole("heading", { name: "Рукописи, Каскад и ужин" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Матенадаран", exact: false })
    .first()
    .click();
  await expect(page.locator(".map-selection")).toContainText("Матенадаран");
  await page.locator("#budget").scrollIntoViewIfNeeded();
  await page.getByLabel("Название", { exact: true }).fill("Тестовый обед");
  await page.getByLabel("Сумма", { exact: true }).fill("123,45");
  await page.getByRole("button", { name: "Добавить расход" }).click();
  await expect(page.locator(".expense")).toContainText("Тестовый обед");
  await expect(page.locator(".totals")).toContainText("123,45");
  await page.reload();
  await expect(page.locator(".expense")).toContainText("Тестовый обед");
  await page.getByRole("button", { name: "Изменить Тестовый обед" }).click();
  await page.getByLabel("Сумма", { exact: true }).fill("200");
  await page.getByRole("button", { name: "Сохранить изменения" }).click();
  await expect(page.locator(".expense")).toContainText("200");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON-копия" }).click();
  expect((await download).suggestedFilename()).toBe("armenia-2027-backup.json");
  await page.screenshot({
    path: `test-results/budget-${info.project.name}.png`,
  });
  await page.getByRole("button", { name: "Удалить Тестовый обед" }).click();
  await expect(page.locator(".expense")).toHaveCount(0);
});
test("imports second draft through same page template without exposing in catalog", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("#import input[type=file]")
    .setInputFiles(path.resolve("drafts/example-italy-2028.json"));
  await expect(page.locator(".import-result")).toContainText("Статус: draft");
  await page.getByRole("button", { name: "Открыть локальный preview" }).click();
  await expect(page).toHaveURL(/preview\/example-italy-2028/);
  await expect(
    page.getByRole("heading", { name: "ДЕМО: Рим — учебный пакет" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "День 2" }).click();
  await expect(
    page.getByRole("heading", { name: "Учебный день 2" }),
  ).toBeVisible();
  await expect(page.locator(".expense")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "ДЕМО: Рим — учебный пакет" }),
  ).toBeVisible();
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /открыть поездку в новой вкладке/ }),
  ).toHaveCount(1);
  await page.goto("/trips/example-italy-2028");
  await expect(
    page.getByRole("heading", { name: /свернули с пути/ }),
  ).toBeVisible();
});
test("up/down reveal retains visible content and reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toBeVisible();
  await page.locator(".hero").scrollIntoViewIfNeeded();
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.locator("#about").evaluate((el) => getComputedStyle(el).opacity),
    )
    .toBe("1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".hero-image")).toHaveCSS("transform", "none");
  await page.goto("/trips/not-real");
  await expect(
    page.getByRole("heading", { name: /свернули с пути/ }),
  ).toBeVisible();
});

test("visible hover, press and spring selection states", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Путешествия", exact: true }).click();
  const filter = page.getByRole("button", { name: "Горы", exact: true });
  const initial = await filter.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  await filter.hover();
  await expect
    .poll(() => filter.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(initial);
  if (info.project.name === "desktop")
    await expect
      .poll(() => filter.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(filter.locator(".filter-active")).toBeVisible();
  await page.goto("/trips/armenia-2027");
  const day = page.getByRole("button", { name: "День 3" });
  await day.click();
  await expect(day.locator(".day-active")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Гарни, Гегард, Симфония камней",
      exact: true,
    }),
  ).toBeVisible();
});
