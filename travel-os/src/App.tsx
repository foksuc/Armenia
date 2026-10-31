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
  ArrowRight,
  AirplaneTilt,
  BookmarkSimple,
  Plus,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { trips, drafts } from "./generated/registry";
import type { TripPackage } from "./types";
import { safeUrl, tripBoundary } from "./contract";
import { formatMoney, toMinor, download } from "./storage";
import Budget, { useTripStorage } from "./components/Budget";
import Home from "./components/Home";
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
      <Link
        to="/#import"
        className="nav-import"
        aria-label="Добавить поездку"
        title="Добавить поездку"
      >
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
        <External href="https://commons.wikimedia.org/wiki/File:The_Temple_of_Garni_(29365546500).jpg">
          Гарни: Clay Gilliland · CC BY-SA 2.0
        </External>
        <External href="https://creativecommons.org/licenses/by-sa/2.0/">
          Лицензия Гарни · CC BY-SA 2.0
        </External>
        <span>WebP, кадрирование</span>
      </div>
      <a href="#main">
        Наверх <ArrowUpRight size={16} />
      </a>
    </footer>
  );
}
function TripPage({ trip }: { trip: TripPackage }) {
  const store = useTripStorage(trip.tripId);
  const [day, setDay] = useState(() => {
    const requested = Number(
      new URLSearchParams(window.location.search).get("day"),
    );
    return Number.isInteger(requested) &&
      requested >= 1 &&
      requested <= trip.itinerary.length
      ? requested
      : 1;
  });
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
          <h1 aria-label={trip.name}>
            {trip.name.split(/(?<=\.)\s+/).map((line, i) => (
              <span className="title-mask" key={i}>
                <span className={i ? "title-line accent-type" : "title-line"}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="trip-summary">{trip.summary}</p>
          <div className="trip-hero-actions">
            <a className="button" href="#days">
              <span>Смотреть программу</span>
              <span className="button-icon">
                <ArrowDown size={20} />
              </span>
            </a>
            <a className="button ghost-button" href="#map">
              <MapTrifold size={20} />
              Карта путешествия
            </a>
          </div>
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
      <div className="trip-surface paper-surface">
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
                  {day === d.dayNumber && (
                    <motion.span
                      className="day-active"
                      layoutId={`active-day-${trip.tripId}`}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 320, damping: 28 }
                      }
                    />
                  )}
                  <span>День {d.dayNumber}</span>
                  <small>{dateLabel(d.date)}</small>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                className="day-detail"
                key={active.id}
                initial={{
                  opacity: reduce ? 1 : 0,
                  y: reduce ? 0 : 24,
                  filter: reduce ? "blur(0px)" : "blur(5px)",
                }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -12 }}
                transition={{
                  duration: reduce ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="day-feature">
                  <div className="day-portrait">
                    {tripCover(trip) && (
                      <img
                        src={
                          trip.tripId === "armenia-2027" && day === 3
                            ? "/media/garni.webp"
                            : tripCover(trip)
                        }
                        alt={
                          trip.tripId === "armenia-2027" && day === 3
                            ? "Храм Гарни"
                            : "Обложка путешествия"
                        }
                        width={600}
                        height={800}
                        loading="lazy"
                      />
                    )}
                    <span>
                      {dateLabel(active.date)}
                      <strong>{trip.destination.countryName}</strong>
                    </span>
                  </div>
                  <div className="day-reading">
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
                                const p = trip.priceRecords.find(
                                  (p) => p.id === id,
                                );
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
                        <p className="muted">
                          События этого дня ещё не заполнены.
                        </p>
                      )}
                    </div>
                  </div>
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
            <div
              className="filter-row"
              role="group"
              aria-label="Категории мест"
            >
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
