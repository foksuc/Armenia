import { lazy, Suspense, useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  Compass,
  MapTrifold,
  CalendarBlank,
  MagnifyingGlass,
  ArrowRight,
  AirplaneTilt,
  BookmarkSimple,
  Plus,
  GlobeHemisphereEast,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { trips, drafts } from "./generated/registry";
import type { TripPackage } from "./types";
import { safeUrl, tripBoundary } from "./contract";
import { formatMoney, toMinor, download } from "./storage";
import Budget, { useTripStorage } from "./components/Budget";
import ImportTrip from "./components/ImportTrip";
import { MotionScene } from "./components/MotionScene";
const JourneyMap = lazy(() => import("./components/JourneyMap"));
const Original = lazy(() => import("./components/Original"));
const cover = "/media/khor-virap.webp";
const tripCover = (t: TripPackage) =>
  t.tripId === "armenia-2027" ? cover : t.media.coverImage?.url;
export const dateLabel = (d: string | null) =>
  d
    ? new Intl.DateTimeFormat("ru", { day: "numeric", month: "long" }).format(
        new Date(d + "T12:00:00"),
      )
    : "Гибкие даты";
export function External({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return safeUrl(href) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <ArrowUpRight aria-label="В новой вкладке" size={15} />
    </a>
  ) : (
    <span>{children}</span>
  );
}
function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Travel OS — главная">
        <Compass size={30} weight="light" />
        <span>
          travel<span className="brand-os">os</span>
        </span>
      </Link>
      <nav aria-label="Главная навигация">
        <Link to="/#catalog">Путешествия</Link>
        <Link to="/#about">О пространстве</Link>
      </nav>
      <Link to="/#import" className="nav-import">
        <Plus size={17} />
        <span>Добавить поездку</span>
      </Link>
    </header>
  );
}
function Footer() {
  return (
    <footer className="footer wrap">
      <Link to="/" className="brand">
        <Compass size={28} />
        travelos
      </Link>
      <p>Меньше вкладок. Больше путешествий.</p>
      <div className="photo-credit">
        <External href="https://commons.wikimedia.org/wiki/File:Khor_Virap_-_Armenia_(2911406199).jpg">
          Фото: Rita Willaert / Wikimedia Commons
        </External>
        <External href="https://creativecommons.org/licenses/by/2.0/">
          CC BY 2.0
        </External>
        <span>WebP, кадрирование</span>
      </div>
      <a href="#main">
        Наверх <ArrowUpRight size={16} />
      </a>
    </footer>
  );
}
function Home({ preview }: { preview: (t: TripPackage) => void }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Все");
  const tags = [...new Set(trips.flatMap((t) => t.tags))];
  const filtered = trips.filter(
    (t) =>
      (!query ||
        [t.name, t.destination.countryName, ...t.destination.cities, ...t.tags]
          .join(" ")
          .toLocaleLowerCase("ru")
          .includes(query.toLocaleLowerCase("ru"))) &&
      (tag === "Все" || t.tags.includes(tag)),
  );
  return (
    <>
      <section className="hero home-hero">
        <img
          className="hero-image"
          src={cover}
          alt="Арарат и монастырь Хор Вирап в Армении"
          fetchPriority="high"
          width="1920"
          height="1200"
        />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <h1>
            Всё начинается
            <br />с любопытства.
          </h1>
          <div className="hero-bottom">
            <p>
              Путешествия, собранные со смыслом.
              <br />
              От первой идеи до последнего поворота.
            </p>
            <a href="#catalog" className="button">
              Найти свой маршрут <ArrowDown size={18} />
            </a>
          </div>
        </div>
        <div className="hero-caption wrap">
          <span>В фокусе — Армения</span>
          <span>Хор Вирап · Арарат</span>
        </div>
      </section>
      <section className="catalog wrap chapter" id="catalog" data-reveal>
        <div className="section-head">
          <h2>Куда дальше?</h2>
          <p>
            У каждого путешествия — своя история.
            <br />У всех деталей — своё место.
          </p>
        </div>
        <div className="catalog-tools">
          <label className="search">
            <MagnifyingGlass size={21} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Страна, город или настроение"
              aria-label="Поиск путешествий"
            />
          </label>
          <span>{trips.length} подготовленное путешествие</span>
        </div>
        <div className="filter-row" role="group" aria-label="Тип путешествия">
          {["Все", ...tags].map((t) => (
            <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
        {filtered.length ? (
          <div className="featured-grid">
            {filtered.map((t) => (
              <Link
                className="trip-card"
                key={t.tripId}
                to={`/trips/${t.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.name} — открыть поездку в новой вкладке`}
              >
                <div className="trip-card-image">
                  <img
                    src={tripCover(t)}
                    alt={
                      t.tripId === "armenia-2027"
                        ? "Хор Вирап на фоне Арарата"
                        : (t.media.coverImage?.alt ?? t.name)
                    }
                    loading="lazy"
                    width="1200"
                    height="750"
                  />
                  <span className="trip-country">
                    {t.destination.countryName}
                  </span>
                  <span className="round-link">
                    <ArrowUpRight size={24} />
                  </span>
                </div>
                <div className="trip-card-content">
                  <div>
                    <span className="muted">
                      {dateLabel(t.dates.startDate)} —{" "}
                      {dateLabel(t.dates.endDate)}{" "}
                      {t.dates.startDate?.slice(0, 4)}
                    </span>
                    <h3>{t.name}</h3>
                    <p>{t.summary}</p>
                  </div>
                  <div className="card-duration">
                    <strong>{t.dates.durationDays}</strong>
                    <span>дней</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span>{t.tags.join(" · ")}</span>
                  <span>
                    Открыть путешествие <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
            <aside className="catalog-aside">
              <GlobeHemisphereEast size={48} weight="thin" />
              <h3>
                Не список мест.
                <br />
                Цельная история.
              </h3>
              <p>
                Программа по дням, карта, варианты дороги и личные расходы —
                рядом, когда нужны.
              </p>
              <div className="aside-line" />
              <span>
                Новые направления добавляются
                <br />
                через единый пакет поездки.
              </span>
              <a href="#import">
                Подготовить следующую <ArrowRight size={18} />
              </a>
            </aside>
          </div>
        ) : (
          <div className="empty">
            <h3>Пока нет совпадений</h3>
            <p>Попробуйте название страны или уберите фильтр.</p>
            <button
              onClick={() => {
                setQuery("");
                setTag("Все");
              }}
            >
              Сбросить поиск
            </button>
          </div>
        )}
      </section>
      <section className="about-band" id="about" data-reveal>
        <div className="wrap about-grid">
          <h2>
            Свобода —<br />
            когда детали
            <br />
            уже собраны.
          </h2>
          <div>
            <p>
              Здесь живут путешествия, к которым хочется вернуться. С настоящими
              источниками, понятными альтернативами и местом для ваших решений.
            </p>
            <div className="about-points">
              <span>
                <CalendarBlank /> Дни связаны в маршрут
              </span>
              <span>
                <MapTrifold /> Места — на своей карте
              </span>
              <span>
                <BookmarkSimple /> Решения — под рукой
              </span>
            </div>
            <p className="muted small">
              Цены с датой проверки. Личные записи сохраняются в вашем браузере.
            </p>
          </div>
        </div>
      </section>
      <div className="wrap">
        <ImportTrip onPreview={preview} />
      </div>
    </>
  );
}
function TripPage({ trip }: { trip: TripPackage }) {
  const store = useTripStorage(trip.tripId);
  const [day, setDay] = useState(1);
  const [place, setPlace] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const reduce = useReducedMotion();
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      trip.media.themeAccent ?? "#edb287",
    );
    return () => {
      document.documentElement.style.removeProperty("--accent");
    };
  }, [trip.media.themeAccent]);
  const active = trip.itinerary[day - 1];
  const locations = trip.places.filter(
    (p) => category === "all" || p.category === category,
  );
  const categories = [...new Set(trip.places.map((p) => p.category))];
  const selectPlace = (id: string) => {
    setPlace(id);
    const d = trip.itinerary.find((d) =>
      d.events.some((e) => e.placeId === id),
    );
    if (d) setDay(d.dayNumber);
  };
  return (
    <>
      {trip.status !== "published" && (
        <div className="preview-banner" role="status">
          Локальный preview · {trip.status} · поездка не опубликована
        </div>
      )}
      <section className="hero trip-hero">
        {tripCover(trip) ? (
          <img
            className="hero-image"
            src={tripCover(trip)}
            alt={
              trip.tripId === "armenia-2027"
                ? "Хор Вирап и гора Арарат"
                : (trip.media.coverImage?.alt ?? trip.name)
            }
            width="1920"
            height="1200"
            fetchPriority="high"
          />
        ) : (
          <div className="no-cover" />
        )}
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <Link to="/" className="back-link">
            <ArrowLeft size={17} /> Все путешествия
          </Link>
          <h1>{trip.name}</h1>
          <p className="trip-summary">{trip.summary}</p>
          <div className="trip-meta">
            <span>
              <CalendarBlank />
              {dateLabel(trip.dates.startDate)} —{" "}
              {dateLabel(trip.dates.endDate)}{" "}
              {trip.dates.startDate?.slice(0, 4)}
            </span>
            <span>{trip.dates.durationDays} дней</span>
            <span>{trip.travelers.adults} взрослых</span>
            <span>{trip.dates.timezone}</span>
          </div>
        </div>
      </section>
      <nav className="trip-nav" aria-label="Разделы путешествия">
        <div className="wrap">
          {[
            ["days", "Программа"],
            ["map", "Карта"],
            ["places", "Места"],
            ["options", "Дорога и отель"],
            ["budget", "Бюджет"],
            ["bookings", "Мои решения"],
            ["sources", "Источники"],
          ].map(([id, title]) => (
            <a key={id} href={`#${id}`}>
              {title}
            </a>
          ))}
        </div>
      </nav>
      <div className="wrap">
        <section className="chapter journey" id="days" data-reveal>
          <div className="section-head">
            <h2>
              Каждый день —<br />
              новая глава.
            </h2>
            <p>
              Время — местное для пункта маршрута.
              <br />
              План можно изучать в своём темпе.
            </p>
          </div>
          <div className="day-tabs" role="group" aria-label="Дни путешествия">
            {trip.itinerary.map((d) => (
              <button
                key={d.id}
                aria-pressed={day === d.dayNumber}
                onClick={() => {
                  setDay(d.dayNumber);
                  setPlace(null);
                }}
              >
                <span>День {d.dayNumber}</span>
                <small>{dateLabel(d.date)}</small>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              className="day-detail"
              key={active.id}
              initial={{ opacity: reduce ? 1 : 0.6, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reduce ? 1 : 0.6 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            >
              <div className="day-heading">
                <span className="day-numeral">
                  {String(day).padStart(2, "0")}
                </span>
                <div>
                  <h3>{active.title}</h3>
                  <p>{active.description}</p>
                </div>
              </div>
              <div className="timeline">
                {active.events.length ? (
                  active.events.map((e) => (
                    <article
                      key={e.id}
                      id={e.id}
                      className={
                        place === e.placeId ? "event selected" : "event"
                      }
                    >
                      <span className="event-time">
                        {e.startTime ?? "По плану"}
                        {e.endTime && <small>до {e.endTime}</small>}
                      </span>
                      <div>
                        <button
                          className="event-title"
                          onClick={() => {
                            if (e.placeId) setPlace(e.placeId);
                          }}
                        >
                          {e.title}
                          <MapTrifold size={18} />
                        </button>
                        {e.description && <p>{e.description}</p>}
                        {e.priceIds.map((id) => {
                          const p = trip.priceRecords.find((p) => p.id === id);
                          return p ? (
                            <small key={id}>
                              {formatMoney(
                                toMinor(String(p.amount), p.currency),
                                p.currency,
                              )}{" "}
                              · ориентир {p.recordedAt}
                            </small>
                          ) : null;
                        })}
                        {e.externalLinks.map((url) => (
                          <External href={url} key={url}>
                            Источник события
                          </External>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="muted">События этого дня ещё не заполнены.</p>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </section>
        <section className="chapter" id="map" data-reveal>
          <div className="section-head">
            <h2>
              Места обретают
              <br />
              связь.
            </h2>
            <p>
              Выбирайте день и точку.
              <br />
              Карта и программа связаны.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="map-loading">
                Загружаем карту… Программа и список мест доступны ниже.
              </div>
            }
          >
            <JourneyMap
              trip={trip}
              day={day}
              activePlace={place}
              onSelect={selectPlace}
            />
          </Suspense>
        </section>
        <section className="chapter" id="places" data-reveal>
          <div className="section-head">
            <h2>Сохранить в памяти.</h2>
            <p>Достопримечательности, еда и точки маршрута.</p>
          </div>
          <div className="filter-row" role="group" aria-label="Категории мест">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {
                  (
                    {
                      all: "Все места",
                      restaurant: "Еда и вино",
                      landmark: "Достопримечательности",
                      hotel: "Отель",
                      museum: "Музеи",
                      concert: "Концерт",
                      transport: "Транспорт",
                      other: "Другое",
                      tour: "Экскурсии",
                      city: "Города",
                    } as Record<string, string>
                  )[c]
                }
              </button>
            ))}
          </div>
          <div className="places-grid">
            {locations.map((p) => (
              <article
                className={
                  place === p.id ? "place-item selected" : "place-item"
                }
                key={p.id}
              >
                <span className="muted small">
                  {
                    {
                      restaurant: "Еда и вино",
                      landmark: "Место маршрута",
                      hotel: "Отель",
                      concert: "Концерт",
                      museum: "Музей",
                      transport: "Транспорт",
                      other: "Другое",
                      tour: "Экскурсия",
                      city: "Город",
                    }[p.category]
                  }
                </span>
                <h3>{p.name}</h3>
                <p>{p.description ?? p.address}</p>
                <div className="actions">
                  <button
                    onClick={() => {
                      selectPlace(p.id);
                      document.getElementById("map")?.scrollIntoView({
                        behavior: reduce ? "instant" : "smooth",
                      });
                    }}
                  >
                    На карте <MapTrifold size={17} />
                  </button>
                  {p.address && (
                    <External
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
                    >
                      Открыть адрес
                    </External>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="chapter" id="options" data-reveal>
          <div className="section-head">
            <h2>
              Дорога. И место
              <br />
              для возвращения.
            </h2>
            <p>
              Альтернативы сохранены отдельно.
              <br />
              Выберите подходящую в бюджете.
            </p>
          </div>
          <div className="options-grid">
            {trip.transportOptions.map((o) => (
              <article className="panel" key={o.id}>
                <AirplaneTilt size={28} />
                <h3>{o.label}</h3>
                <p>{o.description}</p>
                <div className="legs">
                  {o.legs.map((l) => (
                    <div key={l.id}>
                      <span>
                        {dateLabel(l.date)} ·{" "}
                        {l.mode === "plane" ? "Самолёт" : "Поезд"}
                      </span>
                      <strong>
                        {l.departTime} {l.from} <ArrowRight size={16} />{" "}
                        {l.arriveTime} {l.to}
                      </strong>
                      {l.arriveDate !== l.date && (
                        <small>Прибытие {dateLabel(l.arriveDate)}</small>
                      )}
                    </div>
                  ))}
                </div>
                {o.priceIds.map((id) => {
                  const p = trip.priceRecords.find((x) => x.id === id)!;
                  return (
                    <strong className="option-price" key={id}>
                      {formatMoney(
                        toMinor(String(p.amount), p.currency),
                        p.currency,
                      )}{" "}
                      ·{" "}
                      {
                        {
                          total: "за всех",
                          per_person: "на человека",
                          per_group: "на группу",
                          per_night: "за ночь",
                          per_item: "за единицу",
                        }[p.basis]
                      }
                    </strong>
                  );
                })}
                {o.sourceIds
                  .filter((id) => id !== "v1-source")
                  .map((id) => {
                    const s = trip.sources.find((x) => x.id === id);
                    return s ? (
                      <External href={s.url} key={id}>
                        Проверить у продавца
                      </External>
                    ) : null;
                  })}
              </article>
            ))}
          </div>
          <div className="hotel-options">
            {trip.accommodationOptions.map((o, i) => (
              <article key={o.id}>
                <span className="muted">
                  Тариф {i + 1} · {dateLabel(o.checkIn)} —{" "}
                  {dateLabel(o.checkOut)}
                </span>
                <h3>{o.name}</h3>
                <p>{o.description}</p>
                {o.sourceIds
                  .filter((id) => id !== "v1-source")
                  .map((id) => {
                    const source = trip.sources.find((s) => s.id === id);
                    return source ? (
                      <External href={source.url} key={id}>
                        Проверить тариф у продавца
                      </External>
                    ) : null;
                  })}
                {o.priceIds.map((id) => {
                  const p = trip.priceRecords.find((x) => x.id === id)!;
                  return (
                    <strong key={id}>
                      {formatMoney(
                        toMinor(String(p.amount), p.currency),
                        p.currency,
                      )}{" "}
                      ·{" "}
                      {trip.tripId === "armenia-2027"
                        ? "за двоих / 5 ночей"
                        : {
                            total: "за всех",
                            per_person: "на человека",
                            per_group: "на группу",
                            per_night: "за ночь",
                            per_item: "за единицу",
                          }[p.basis]}
                    </strong>
                  );
                })}
              </article>
            ))}
          </div>
        </section>
        <Budget trip={trip} store={store} />
        <section className="chapter" id="bookings" data-reveal>
          <div className="section-head">
            <h2>Ваши решения.</h2>
            <p>
              Личные отметки, без проверки у поставщика.
              <br />
              Сохраняются только в этом браузере.
            </p>
          </div>
          <div className="booking-list">
            {[
              ...trip.transportOptions,
              ...trip.accommodationOptions,
              ...trip.itinerary.flatMap((d) =>
                d.events.filter((e) => e.priceIds.length),
              ),
            ].map((o) => (
              <label key={o.id}>
                <span>
                  <BookmarkSimple size={20} />
                  {"label" in o ? o.label : "name" in o ? o.name : o.title}
                </span>
                <select
                  disabled={!store.canSave}
                  value={store.state.bookingStatuses[o.id] ?? "not_started"}
                  onChange={(e) =>
                    store.setState((s) => ({
                      ...s,
                      bookingStatuses: {
                        ...s.bookingStatuses,
                        [o.id]: e.target.value as "planned",
                      },
                    }))
                  }
                >
                  <option value="not_started">Не оформлено</option>
                  <option value="planned">В планах</option>
                  <option value="user_confirmed">
                    Я отметил как оформленное
                  </option>
                  <option value="cancelled">Отменено</option>
                </select>
              </label>
            ))}
          </div>
          <label className="notes-label">
            Заметки путешественника
            <textarea
              disabled={!store.canSave}
              rows={4}
              maxLength={20000}
              value={store.state.notes}
              placeholder="Что взять с собой, что проверить перед поездкой…"
              onChange={(e) =>
                store.setState((s) => ({ ...s, notes: e.target.value }))
              }
            />
          </label>
          <p className="muted small">
            Не сохраняйте здесь паспортные данные, номера карт и секреты
            бронирований.
          </p>
        </section>
        <section className="chapter sources" id="sources" data-reveal>
          <div className="section-head">
            <h2>Доверять деталям.</h2>
            <p>
              Источники, дата проверки
              <br />и открытые вопросы.
            </p>
          </div>
          {trip.unresolved.map((q) => (
            <p className="notice" key={q.id}>
              {q.question}
            </p>
          ))}
          <details>
            <summary>Ссылки на источники ({trip.sources.length})</summary>
            {trip.sources.map((s) => (
              <div className="source-row" key={s.id}>
                <External href={s.url}>{s.title}</External>
                <small>{s.checkedAt}</small>
                {s.notes && <p>{s.notes}</p>}
              </div>
            ))}
          </details>
          {trip.tripId === "armenia-2027" && (
            <Suspense fallback={<p>Загрузка полного оригинала…</p>}>
              <Original />
            </Suspense>
          )}
          <button
            onClick={() =>
              download(
                `${trip.slug}-trip-package.json`,
                JSON.stringify(trip, null, 2),
              )
            }
          >
            Скачать пакет поездки
          </button>
        </section>
      </div>
    </>
  );
}
function RoutedTrip() {
  const { slug } = useParams();
  const trip = trips.find((x) => x.slug === slug);
  return trip ? <TripPage key={trip.tripId} trip={trip} /> : <NotFound />;
}
function LocalPreview() {
  const { slug } = useParams();
  let trip = drafts.find((x) => x.slug === slug);
  try {
    if (!trip) {
      const raw = sessionStorage.getItem("travel-os:preview");
      if (raw) {
        const p = tripBoundary.parse(JSON.parse(raw));
        if (p.slug === slug) trip = p;
      }
    }
  } catch {
    /* invalid local preview is not rendered */
  }
  return trip ? <TripPage key={trip.tripId} trip={trip} /> : <NotFound />;
}
function NotFound() {
  return (
    <div className="wrap not-found">
      <Compass size={60} weight="thin" />
      <h1>
        Кажется, мы
        <br />
        свернули с пути.
      </h1>
      <p>
        Такой поездки нет в каталоге. Черновики открываются только в preview.
      </p>
      <Link className="button" to="/">
        Вернуться к путешествиям <ArrowRight />
      </Link>
    </div>
  );
}
export default function App() {
  const navigate = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) {
      requestAnimationFrame(() =>
        document.getElementById(loc.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);
  const preview = (t: TripPackage) => {
    sessionStorage.setItem(
      "travel-os:preview",
      JSON.stringify({ ...t, status: "draft" }),
    );
    navigate(`/preview/${t.slug}`);
  };
  return (
    <>
      <a className="skip" href="#main">
        Перейти к содержанию
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home preview={preview} />} />
          <Route path="/trips/:slug" element={<RoutedTrip />} />
          <Route path="/preview/:slug" element={<LocalPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MotionScene routeKey={loc.pathname} />
      </main>
      <Footer />
    </>
  );
}
