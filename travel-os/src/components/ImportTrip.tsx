import { useState } from "react";
import { prepareImport, validateTrip } from "../contract";
import { download } from "../storage";
import type { TripPackage } from "../types";
export default function ImportTrip({
  onPreview,
}: {
  onPreview: (trip: TripPackage) => void;
}) {
  const [trip, setTrip] = useState<TripPackage>();
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <section className="chapter" id="import">
      <div className="section-head">
        <h2>Следующее путешествие.</h2>
        <p>
          Один файл — та же система.
          <br />
          Сначала проверка, затем черновик.
        </p>
      </div>
      <div className="import-row">
        <div>
          <p>
            Загрузите trip-package.json из чата «Конструктор путешествий».
            Предпросмотр работает локально. Для добавления на сайт передайте
            проверенный пакет в чат разработки.
          </p>
          <label className="button file-button">
            Проверить JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                setTrip(undefined);
                try {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 3_000_000) throw Error("Максимум 3 МБ");
                  const value = JSON.parse(await f.text());
                  const r = validateTrip(value);
                  if (r.errors.length) {
                    setMessages(r.errors);
                    return;
                  }
                  const prepared = prepareImport(value, []).trip;
                  setTrip(prepared);
                  setMessages([
                    "Схема и связи проверены. Статус: draft.",
                    ...r.warnings,
                  ]);
                } catch (err) {
                  setMessages([
                    err instanceof Error
                      ? err.message
                      : "Не удалось прочитать файл",
                  ]);
                }
              }}
            />
          </label>
        </div>
        <div className="import-result" role="status">
          {trip && (
            <>
              <h3>{trip.name}</h3>
              <p>
                {trip.itinerary.length} дней · {trip.places.length} мест · draft
              </p>
              <div className="actions">
                <button onClick={() => onPreview(trip)}>
                  Открыть локальный preview
                </button>
                <button
                  onClick={() =>
                    download(`${trip.slug}.json`, JSON.stringify(trip, null, 2))
                  }
                >
                  Скачать draft
                </button>
              </div>
            </>
          )}
          {messages.length ? (
            messages.map((s, i) => <p key={i}>{s}</p>)
          ) : (
            <p className="muted">
              JSON Schema 1.0.0 · проверка дат, ID, источников и безопасных
              ссылок. Ничего не публикуется автоматически.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
