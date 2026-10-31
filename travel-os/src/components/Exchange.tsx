import { useState, type FormEvent } from "react";
import { ExchangeRate, convertTotals, formatMoney } from "../storage";
import type { useTripStorage } from "./Budget";
export default function Exchange({
  store,
}: {
  store: ReturnType<typeof useTripStorage>;
}) {
  const [target, setTarget] = useState("RUB");
  const [message, setMessage] = useState("");
  const rates = store.state.exchangeRates ?? [];
  let result;
  let conversionError = "";
  try {
    result = convertTotals(store.state.expenses, rates, target);
  } catch {
    result = { totalMinor: 0, missing: [] };
    conversionError =
      "Сумма пересчёта слишком большая. Удалите или исправьте курс.";
  }
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData(e.currentTarget);
      const rate = ExchangeRate.parse({
        from: data.get("from"),
        to: target,
        rate: String(data.get("rate")).replace(",", "."),
        recordedAt: data.get("date"),
        sourceUrl: data.get("source"),
      });
      if (rate.from === rate.to) throw Error("Выберите разные валюты");
      store.setState((s) => ({
        ...s,
        exchangeRates: [
          ...(s.exchangeRates ?? []).filter(
            (r) => r.from !== rate.from || r.to !== rate.to,
          ),
          rate,
        ],
      }));
      setMessage("Курс сохранён с датой и источником");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Проверьте курс");
    }
  };
  return (
    <details className="exchange">
      <summary>Пересчёт по моим курсам</summary>
      <p className="muted small">
        Введите проверенный курс: 1 единица исходной валюты = указанное число
        целевых. Это ваш курс, без автоматической загрузки.
      </p>
      <label>
        Валюта итога
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          {["RUB", "AMD", "USD", "EUR", "JPY", "KWD"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <p>
        <strong>{formatMoney(result.totalMinor, target)}</strong> · по
        сохранённым курсам
      </p>
      {conversionError && <p className="notice">{conversionError}</p>}
      {result.missing.length > 0 && (
        <p className="notice">
          Не включены без курса: {result.missing.join(", ")}
        </p>
      )}
      <form onSubmit={submit} className="expense-form">
        <div className="form-pair">
          <label>
            Из валюты
            <select name="from">
              {["AMD", "USD", "EUR", "RUB", "JPY", "KWD"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Курс в {target}
            <input
              name="rate"
              inputMode="decimal"
              required
              placeholder="0,0000"
            />
          </label>
        </div>
        <label>
          Дата курса
          <input name="date" type="date" required />
        </label>
        <label>
          Ссылка на источник
          <input name="source" type="url" required placeholder="https://…" />
        </label>
        <button className="button" disabled={!store.canSave}>
          Сохранить курс
        </button>
      </form>
      <p role="status" className="small">
        {message}
      </p>
      {rates.map((r) => (
        <div className="price-record" key={r.from + r.to}>
          <strong>
            1 {r.from} = {r.rate} {r.to}
          </strong>
          <p>
            {r.recordedAt} ·{" "}
            <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
              Источник
            </a>
          </p>
          <button
            onClick={() =>
              store.setState((s) => ({
                ...s,
                exchangeRates: rates.filter((x) => x !== r),
              }))
            }
          >
            Удалить курс
          </button>
        </div>
      ))}
    </details>
  );
}
