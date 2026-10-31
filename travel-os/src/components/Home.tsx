import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Compass,
  MagnifyingGlass,
  CalendarBlank,
  MapTrifold,
  Wallet,
} from "@phosphor-icons/react";
import { trips } from "../generated/registry";
import type { TripPackage } from "../types";
import ImportTrip from "./ImportTrip";
const cover = "/media/khor-virap.webp";
const formatDate = (s: string | null) =>
  s
    ? new Intl.DateTimeFormat("ru", { day: "numeric", month: "long" }).format(
        new Date(s + "T12:00:00"),
      )
    : "Гибкие даты";
const photo = (t: TripPackage) =>
  t.tripId === "armenia-2027" ? cover : t.media.coverImage?.url;
export default function Home({
  preview,
}: {
  preview: (t: TripPackage) => void;
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Все");
  const reduce = useReducedMotion();
  const featured = trips.find((t) => t.tripId === "armenia-2027") ?? trips[0];
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
  const activeFeature = filtered[0];
  return (
    <>
      <section className="hero home-hero">
        <div className="hero-photo-frame">
          <img
            className="hero-image"
            src={cover}
            alt="Арарат и монастырь Хор Вирап"
            width={1920}
            height={1200}
            fetchPriority="high"
          />
        </div>
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <h1 aria-label="За пределы привычного.">
            <span className="title-mask">
              <span className="title-line">За пределы</span>
            </span>
            <span className="title-mask">
              <span className="title-line accent-type">привычного.</span>
            </span>
          </h1>
          <div className="hero-bottom">
            <p>
              Горы вместо рутины.
              <br />
              Новые впечатления вместо ещё одной вкладки.
            </p>
            <a className="button" href="#catalog">
              <span>Выбрать путешествие</span>
              <span className="button-icon">
                <ArrowDown size={20} />
              </span>
            </a>
          </div>
        </div>
        {featured && (
          <Link
            to={`/trips/${featured.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-trip-card"
            aria-label={`В фокусе: ${featured.destination.countryName} — открыть в новой вкладке`}
          >
            <img
              src="/media/garni.webp"
              alt="Храм Гарни"
              width={320}
              height={240}
            />
            <div>
              <span>В фокусе</span>
              <strong>{featured.destination.countryName}</strong>
              <small>
                {formatDate(featured.dates.startDate)} —{" "}
                {formatDate(featured.dates.endDate)}
              </small>
            </div>
            <ArrowUpRight size={22} />
          </Link>
        )}
        <div className="hero-caption wrap">
          <span>
            Travel OS <i /> Личное пространство путешествий
          </span>
          <a href="#catalog" aria-label="Листать к путешествиям">
            Листать дальше <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <section className="catalog paper-surface" id="catalog">
        <div className="wrap chapter">
          <div className="section-head" data-reveal>
            <h2>
              Место, которое
              <br />
              <span className="display-soft">станет историей.</span>
            </h2>
            <p>
              Не просто точки на карте.
              <br />
              Путешествия, в которых всё складывается.
            </p>
          </div>
          <div className="catalog-tools">
            <label className="search">
              <MagnifyingGlass size={22} />
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
              <button
                key={t}
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
              >
                {tag === t && (
                  <motion.span
                    className="filter-active"
                    layoutId="catalog-filter"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
                <span>{t}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {filtered.length ? (
              <motion.div
                className="featured-grid"
                key="results"
                initial={{ opacity: reduce ? 1 : 0.6, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: reduce ? 1 : 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="trip-grid">
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
                          src={photo(t)}
                          alt={
                            t.media.coverImage?.alt ?? t.destination.countryName
                          }
                          width={1200}
                          height={800}
                          loading="lazy"
                        />
                        <span className="trip-country">
                          {t.destination.countryName}
                        </span>
                        <span className="round-link">
                          <ArrowUpRight size={30} />
                        </span>
                        <div className="image-dates">
                          {formatDate(t.dates.startDate)} —{" "}
                          {formatDate(t.dates.endDate)}
                          <span>{t.dates.startDate?.slice(0, 4)}</span>
                        </div>
                      </div>
                      <div className="trip-card-content">
                        <div>
                          <h3>{t.name}</h3>
                          <p>{t.summary}</p>
                        </div>
                        <div className="card-duration">
                          <strong>
                            {String(t.dates.durationDays).padStart(2, "0")}
                          </strong>
                          <span>дней</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <span>{t.tags.join(" · ")}</span>
                        <span>
                          В путешествие <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {activeFeature && (
                  <aside className="catalog-aside">
                    <div className="aside-heading">
                      <span>Внутри маршрута</span>
                      <Compass size={22} />
                    </div>
                    {activeFeature.itinerary.slice(2, 4).map((d, i) => (
                      <Link
                        key={d.id}
                        to={`/trips/${activeFeature.slug}?day=${d.dayNumber}#days`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chapter-preview"
                      >
                        <img
                          src={
                            activeFeature.tripId === "armenia-2027"
                              ? i === 0
                                ? "/media/garni.webp"
                                : cover
                              : photo(activeFeature)
                          }
                          alt={
                            activeFeature.tripId === "armenia-2027"
                              ? i === 0
                                ? "Храм Гарни"
                                : "Хор Вирап"
                              : activeFeature.destination.countryName
                          }
                          width={500}
                          height={350}
                          loading="lazy"
                        />
                        <div>
                          <span>
                            День {d.dayNumber} · {formatDate(d.date)}
                          </span>
                          <h3>{d.title}</h3>
                          <ArrowUpRight size={22} />
                        </div>
                      </Link>
                    ))}
                  </aside>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Compass size={42} weight="light" />
                <h3>Пока нет совпадений</h3>
                <p>Попробуйте другую страну или уберите фильтр.</p>
                <button
                  className="button"
                  onClick={() => {
                    setTag("Все");
                    setQuery("");
                  }}
                >
                  Сбросить поиск <ArrowRight />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section className="scenic-story" id="about">
        <div className="scene-media">
          <img
            src="/media/garni.webp"
            width={1600}
            height={1067}
            alt="Храм Гарни над ущельем"
            loading="lazy"
          />
        </div>
        <div className="scene-shade" />
        <div className="wrap scene-copy">
          <h2>
            <span className="title-mask">
              <span className="title-line">Не откладывать.</span>
            </span>
            <span className="title-mask">
              <span className="title-line">Отправляться.</span>
            </span>
          </h2>
          <div className="scene-description">
            <p>
              Сначала — предвкушение.
              <br />
              Потом — маршрут, который становится твоим.
            </p>
            <a
              href="#catalog"
              className="circle-link"
              aria-label="Выбрать путешествие"
            >
              <ArrowUpRight size={32} />
            </a>
          </div>
          <svg
            className="editorial-line"
            viewBox="0 0 1100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 80 C 140 80, 180 5, 340 25 S 560 105, 720 45 S 960 0, 1100 28" />
          </svg>
          <div className="scene-steps">
            <span>Предвкушать</span>
            <span>Исследовать</span>
            <span>Проживать</span>
            <span>Вспоминать</span>
          </div>
        </div>
      </section>
      <section className="about-band paper-surface">
        <div className="wrap chapter">
          <div className="about-grid">
            <h2 data-reveal>
              Всё нужное.
              <br />
              <span className="display-soft">В одном ритме.</span>
            </h2>
            <div className="about-points">
              <article data-reveal>
                <CalendarBlank size={30} />
                <div>
                  <h3>Каждый день на своём месте</h3>
                  <p>
                    Программа, время и места. Переключай дни и собирай общую
                    картину.
                  </p>
                </div>
              </article>
              <article data-reveal>
                <MapTrifold size={30} />
                <div>
                  <h3>Карта с характером</h3>
                  <p>
                    Город и регион, нужные точки и связь с программой
                    путешествия.
                  </p>
                </div>
              </article>
              <article data-reveal>
                <Wallet size={30} />
                <div>
                  <h3>Впечатления без хаоса</h3>
                  <p>
                    Варианты дороги и отеля, личные расходы и заметки — всегда
                    рядом.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      <div className="import-surface">
        <div className="wrap">
          <ImportTrip onPreview={preview} />
        </div>
      </div>
    </>
  );
}
