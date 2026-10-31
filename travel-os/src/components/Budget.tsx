import { useEffect, useState, type FormEvent } from "react";
import { PencilSimple, Trash, DownloadSimple } from "@phosphor-icons/react";
import Exchange from "./Exchange";
import type { TripPackage } from "../types";
import {
  emptyUserData,
  restoreUserData,
  storageKey,
  toMinor,
  formatMoney,
  moneyTotals,
  csvExpenses,
  parseExpensesCsv,
  download,
  Expense,
  UserData,
  type UserData as UserState,
} from "../storage";
const categories = {
  food: "Еда",
  transport: "Транспорт",
  stay: "Жильё",
  culture: "Культура",
  other: "Другое",
};
export function useTripStorage(tripId: string) {
  const [state, setState] = useState<UserState>(() => {
    try {
      return restoreUserData(
        localStorage.getItem(storageKey(tripId)) ??
          JSON.stringify(emptyUserData(tripId)),
        tripId,
      );
    } catch {
      return emptyUserData(tripId);
    }
  });
  const [error, setError] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(tripId));
      if (raw) restoreUserData(raw, tripId);
      return "";
    } catch {
      return "Не удалось прочитать сохранённые данные. Старая копия сохранена; экспортируйте её перед восстановлением.";
    }
  });
  const [canSave, setCanSave] = useState(() => !error);
  useEffect(() => {
    if (!canSave) return;
    try {
      localStorage.setItem(storageKey(tripId), JSON.stringify(state));
    } catch {
      setError("Не удалось сохранить в браузере. Сделайте JSON-копию.");
    }
  }, [state, tripId, canSave]);
  const restore = (raw: string) => {
    const next = restoreUserData(raw, tripId);
    setState(next);
    setCanSave(true);
    setError("");
  };
  return { state, setState, error, restore, canSave };
}
export default function Budget({
  trip,
  store,
}: {
  trip: TripPackage;
  store: ReturnType<typeof useTripStorage>;
}) {
  const { state, setState, error, restore, canSave } = store;
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Expense | null>(null);
  const totals = moneyTotals(state.expenses);
  const prices = (ids: string[]) =>
    trip.priceRecords.filter((p) => ids.includes(p.id));
  const transport =
    trip.transportOptions.find((x) => x.id === state.transportId) ??
    trip.transportOptions[0];
  const hotel =
    trip.accommodationOptions.find((x) => x.id === state.hotelId) ??
    trip.accommodationOptions[0];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const currency = String(data.get("currency"));
      const e = Expense.parse({
        id:
          editing?.id ??
          Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) =>
            n.toString(16).padStart(8, "0"),
          ).join("-"),
        label: data.get("label"),
        category: data.get("category"),
        currency,
        amountMinor: toMinor(String(data.get("amount")), currency),
        date: data.get("date"),
        comment: data.get("comment"),
      });
      moneyTotals(
        editing
          ? state.expenses.map((x) => (x.id === e.id ? e : x))
          : [...state.expenses, e],
      );
      setState((s) => ({
        ...s,
        expenses: editing
          ? s.expenses.map((x) => (x.id === e.id ? e : x))
          : [...s.expenses, e],
      }));
      setEditing(null);
      form.reset();
      setMessage("Расход сохранён в этом браузере");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Проверьте поля");
    }
  };
  return (
    <section id="budget" className="chapter">
      <div className="section-head">
        <h2>Деньги под контролем.</h2>
        <p>
          План отдельно. Факт — ваши расходы.
          <br />
          Валюты считаются раздельно.
        </p>
      </div>
      <div className="budget-layout">
        <div className="panel plan">
          <h3>План поездки</h3>
          <p className="muted">
            Наблюдавшиеся цены с датой фиксации. Наличие и оплата не
            подтверждены.
          </p>
          <label>
            Вариант дороги
            <select
              value={transport?.id ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, transportId: e.target.value }))
              }
            >
              {trip.transportOptions.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Вариант проживания
            <select
              value={hotel?.id ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, hotelId: e.target.value }))
              }
            >
              {trip.accommodationOptions.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
          {[
            ...(transport
              ? prices(transport.priceIds).map((p) => ({
                  ...p,
                  displayLabel: "Дорога",
                }))
              : []),
            ...(hotel
              ? prices(hotel.priceIds).map((p) => ({
                  ...p,
                  displayLabel: "Отель",
                }))
              : []),
          ].map((p) => (
            <div className="price-row" key={p.id}>
              <div>
                {p.displayLabel} ·{" "}
                {
                  {
                    total: "за всех",
                    per_person: "на человека",
                    per_group: "на группу",
                    per_night: "за ночь",
                    per_item: "за единицу",
                  }[p.basis]
                }
                <small>{p.recordedAt}</small>
              </div>
              <strong>
                {formatMoney(toMinor(String(p.amount), p.currency), p.currency)}
              </strong>
            </div>
          ))}
          {trip.tripId === "armenia-2027" && (
            <div className="historical-budget">
              <span>Ориентир V1 · на человека</span>
              <strong>
                {transport?.id === "via-sochi"
                  ? "53 900–58 900 ₽"
                  : "55 100–60 100 ₽"}
              </strong>
              <p>
                При невозвратном номере без завтрака. Отель ≈ 12 301 ₽, концерт
                ≈ 4 237 ₽, экскурсии ≈ 6 700 ₽, еда/транспорт/входы ≈ 15 000–20
                000 ₽. Это исходный округлённый расчёт, а не сумма выбранных
                тарифов. Трансферы и возможные входные билеты в туре не учтены.
              </p>
            </div>
          )}
          <details>
            <summary>Все ценовые записи ({trip.priceRecords.length})</summary>
            {trip.priceRecords.map((p) => (
              <div className="price-record" key={p.id}>
                <strong>
                  {formatMoney(
                    toMinor(String(p.amount), p.currency),
                    p.currency,
                  )}
                </strong>{" "}
                ·{" "}
                {
                  {
                    per_person: "на человека",
                    total: "всего",
                    per_group: "на группу",
                    per_night: "за ночь",
                    per_item: "за единицу",
                  }[p.basis]
                }{" "}
                · {p.recordedAt}
                <p>{p.notes ?? p.id}</p>
              </div>
            ))}
          </details>
        </div>
        <div>
          <div className="panel">
            <h3>Мои расходы</h3>
            <p className="muted">
              Хранятся только в этом браузере. Исходные валюты считаются
              раздельно. Пересчёт доступен ниже по вашим датированным курсам.
            </p>
            <div className="totals">
              {Object.keys(totals).length ? (
                Object.entries(totals).map(([c, v]) => (
                  <strong key={c}>{formatMoney(v, c)}</strong>
                ))
              ) : (
                <span>Расходов пока нет</span>
              )}
            </div>
            <Exchange store={store} />
            <form
              onSubmit={submit}
              key={editing?.id ?? "new"}
              className="expense-form"
            >
              <label>
                Название
                <input
                  name="label"
                  maxLength={160}
                  defaultValue={editing?.label}
                  required
                  placeholder="Например, ужин"
                />
              </label>
              <div className="form-pair">
                <label>
                  Сумма
                  <input
                    name="amount"
                    inputMode="decimal"
                    defaultValue={
                      editing
                        ? String(
                            editing.amountMinor /
                              10 **
                                (new Intl.NumberFormat("ru", {
                                  style: "currency",
                                  currency: editing.currency,
                                }).resolvedOptions().maximumFractionDigits ??
                                  2),
                          )
                        : ""
                    }
                    required
                    placeholder="0,00"
                  />
                </label>
                <label>
                  Валюта
                  <select
                    name="currency"
                    defaultValue={editing?.currency ?? "RUB"}
                  >
                    {["RUB", "AMD", "USD", "EUR", "JPY", "KWD"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-pair">
                <label>
                  Категория
                  <select
                    name="category"
                    defaultValue={editing?.category ?? "food"}
                  >
                    {Object.entries(categories).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Дата
                  <input
                    name="date"
                    type="date"
                    defaultValue={
                      editing?.date ??
                      new Intl.DateTimeFormat("sv-SE", {
                        timeZone: trip.dates.timezone,
                      }).format(new Date())
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Комментарий
                <input
                  name="comment"
                  maxLength={1000}
                  defaultValue={editing?.comment}
                />
              </label>
              <div className="actions">
                <button className="button" disabled={!canSave}>
                  {editing ? "Сохранить изменения" : "Добавить расход"}
                </button>
                {editing && (
                  <button type="button" onClick={() => setEditing(null)}>
                    Отменить
                  </button>
                )}
              </div>
            </form>
            <p role="status">{message}</p>
            {error && (
              <div role="alert" className="notice">
                {error}
                <button
                  onClick={() =>
                    download(
                      `${trip.tripId}-damaged-backup.json`,
                      localStorage.getItem(storageKey(trip.tripId)) ?? "",
                    )
                  }
                >
                  Скачать старую копию
                </button>
              </div>
            )}
          </div>
          <div className="expense-list">
            {state.expenses.map((e) => (
              <article className="expense" key={e.id}>
                <div>
                  <strong>{e.label}</strong>
                  <small>
                    {categories[e.category]} · {e.date} {e.comment}
                  </small>
                </div>
                <b>{formatMoney(e.amountMinor, e.currency)}</b>
                <button
                  aria-label={`Изменить ${e.label}`}
                  onClick={() => {
                    setEditing(e);
                    document
                      .querySelector(".expense-form")
                      ?.scrollIntoView({ block: "center", behavior: "smooth" });
                  }}
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  aria-label={`Удалить ${e.label}`}
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      expenses: s.expenses.filter((x) => x.id !== e.id),
                    }))
                  }
                >
                  <Trash size={18} />
                </button>
              </article>
            ))}
          </div>
          <div className="actions exports">
            <button
              onClick={() =>
                download(
                  `${trip.tripId}-backup.json`,
                  JSON.stringify(state, null, 2),
                )
              }
            >
              <DownloadSimple /> JSON-копия
            </button>
            <button
              onClick={() =>
                download(
                  `${trip.tripId}-expenses.csv`,
                  csvExpenses(state.expenses),
                  "text/csv;charset=utf-8",
                )
              }
            >
              CSV расходов
            </button>
            <label className="file-button">
              Импорт CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={async (e) => {
                  try {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 3_000_000) throw Error("Файл слишком большой");
                    const expenses = parseExpensesCsv(await f.text());
                    if (
                      !confirm(
                        "Заменить расходы текущей поездки импортом CSV? Статусы и заметки сохранятся.",
                      )
                    )
                      return;
                    setState((s) => ({ ...s, expenses }));
                    setMessage("CSV расходов восстановлен");
                  } catch (err) {
                    setMessage(
                      err instanceof Error ? err.message : "Ошибка CSV",
                    );
                  }
                  e.target.value = "";
                }}
              />
            </label>
            <label className="file-button">
              Восстановить JSON
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  try {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 3_000_000) throw Error("Файл слишком большой");
                    const raw = await f.text();
                    UserData.parse(JSON.parse(raw));
                    if (
                      !confirm(
                        "Заменить локальные расходы, статусы и заметки данными из копии?",
                      )
                    )
                      return;
                    restore(raw);
                    setMessage("Копия восстановлена");
                  } catch (err) {
                    setMessage(
                      err instanceof Error
                        ? err.message
                        : "Ошибка восстановления",
                    );
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
