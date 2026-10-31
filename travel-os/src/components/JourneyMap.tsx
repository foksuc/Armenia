import { useEffect, useRef, useState, useMemo } from "react";
import maplibregl, { type GeoJSONSource } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, ArrowsOutSimple } from "@phosphor-icons/react";
import type { TripPackage } from "../types";
import enrichment from "../data/armenia-enrichment.json";
import { External } from "../App";
export default function JourneyMap({
  trip,
  day,
  activePlace,
  onSelect,
}: {
  trip: TripPackage;
  day: number;
  activePlace: string | null;
  onSelect: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("region");
  const [scope, setScope] = useState("day");
  const [category, setCategory] = useState("all");
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const data = useMemo(() => {
    const points: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: trip.places
        .filter((p) => p.location)
        .map((p) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [p.location!.longitude, p.location!.latitude],
          },
          properties: {
            placeId: p.id,
            name: p.name,
            sourceUrl:
              trip.sources.find((s) => p.sourceIds.includes(s.id))?.url ?? "",
            checkedAt: "Из пакета",
          },
        })),
    };
    if (trip.tripId === "armenia-2027")
      points.features.push(
        ...(enrichment.features as FeatureCollection<Point>["features"]),
      );
    return points;
  }, [trip]);
  const filtered = useMemo(() => {
    const ids = new Set(trip.itinerary[day - 1].events.map((e) => e.placeId));
    return {
      ...data,
      features: data.features.filter(
        (f) =>
          (scope === "all" || ids.has(f.properties?.placeId)) &&
          (category === "all" ||
            trip.places.find((p) => p.id === f.properties?.placeId)
              ?.category === category) &&
          (mode !== "city" ||
            trip.tripId !== "armenia-2027" ||
            [
              "Матенадаран",
              "Каскад",
              "Площадь Республики",
              "Музей истории",
              "Концертный комплекс",
              "Вернисаж",
            ].includes(f.properties?.name)),
      ),
    };
  }, [data, day, scope, category, mode, trip]);
  const fit = () => {
    const m = map.current;
    if (!m || !filtered.features.length) return;
    const bounds = new maplibregl.LngLatBounds();
    for (const f of filtered.features)
      bounds.extend(f.geometry.coordinates as [number, number]);
    m.fitBounds(bounds, {
      padding: 70,
      maxZoom: mode === "city" ? 14 : 12,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 700,
    });
  };
  useEffect(() => {
    if (!container.current) return;
    let m: maplibregl.Map;
    try {
      m = new maplibregl.Map({
        container: container.current,
        style: "/maps/basalt.json",
        center: trip.tripId === "armenia-2027" ? [44.61, 40.05] : [0, 20],
        zoom: trip.tripId === "armenia-2027" ? 8 : 1,
        cooperativeGestures: true,
        attributionControl: {
          compact: true,
          customAttribution:
            '<a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
      });
      map.current = m;
      m.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
      m.on("load", () => {
        m.addSource("journey-points", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        m.addLayer({
          id: "journey-points",
          type: "circle",
          source: "journey-points",
          paint: {
            "circle-color": "#edb287",
            "circle-radius": 7,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#242b2b",
          },
        });
        m.on("click", "journey-points", (e) => {
          const id = e.features?.[0].properties?.placeId;
          if (typeof id === "string") selectRef.current(id);
        });
        m.on("mouseenter", "journey-points", () => {
          m.getCanvas().style.cursor = "pointer";
        });
        m.on("mouseleave", "journey-points", () => {
          m.getCanvas().style.cursor = "";
        });
        setReady(true);
      });
      m.on("error", () =>
        setError(
          "Часть карты не загрузилась. Можно выбрать место из списка и открыть адрес.",
        ),
      );
    } catch {
      setError(
        "Карта недоступна в этом браузере. Все места доступны в списке.",
      );
    }
    return () => {
      m?.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready || !map.current) return;
    (map.current.getSource("journey-points") as GeoJSONSource)?.setData(
      filtered,
    );
    fit();
  }, [ready, filtered]);
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    m.setPaintProperty("journey-points", "circle-radius", [
      "case",
      ["==", ["get", "placeId"], activePlace ?? ""],
      11,
      7,
    ]);
    const p = data.features.find((f) => f.properties?.placeId === activePlace);
    if (p)
      m.easeTo({
        center: p.geometry.coordinates as [number, number],
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 500,
      });
  }, [activePlace, ready, data]);
  const active = trip.places.find((p) => p.id === activePlace);
  const hasActive = data.features.some(
    (f) => f.properties?.placeId === activePlace,
  );
  return (
    <div className="map-composition">
      <div className="map-toolbar">
        <div className="segmented" role="group" aria-label="Масштаб карты">
          <button
            aria-pressed={mode === "region"}
            onClick={() => setMode("region")}
          >
            Регион
          </button>
          <button
            aria-pressed={mode === "city"}
            onClick={() => setMode("city")}
          >
            Город
          </button>
        </div>
        <label>
          Показывать
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="day">День {day}</option>
            <option value="all">Все дни</option>
          </select>
        </label>
        <label>
          Слой
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Все места</option>
            {[...new Set(trip.places.map((p) => p.category))].map((c) => (
              <option value={c} key={c}>
                {(
                  {
                    landmark: "Достопримечательности",
                    museum: "Музеи",
                    restaurant: "Еда",
                    hotel: "Отель",
                    concert: "Концерт",
                    transport: "Транспорт",
                  } as Record<string, string>
                )[c] ?? c}
              </option>
            ))}
          </select>
        </label>
        <button
          className="icon-button"
          onClick={fit}
          aria-label="Показать все выбранные точки"
        >
          <ArrowsOutSimple size={21} />
        </button>
      </div>
      <div
        className={
          error && !ready ? "map-canvas map-unavailable" : "map-canvas"
        }
        ref={container}
        role="region"
        aria-label="Карта мест путешествия"
      />
      {error && !ready && (
        <div className="map-fallback">
          <MapPin size={32} />
          <h3>Места доступны списком</h3>
          <p>
            В этом браузере не удалось включить WebGL-карту. Выберите
            проверенную точку ниже или откройте адрес в разделе «Места».
          </p>
          <div>
            {filtered.features.map((f) => (
              <button
                key={f.properties?.placeId}
                onClick={() => selectRef.current(f.properties?.placeId)}
              >
                {f.properties?.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="map-error" role="status">
          {error}
        </p>
      )}
      <div className="map-summary">
        <span>
          <MapPin size={18} />
          {filtered.features.length} проверенных точек в текущем виде
        </span>
        <span>Линии маршрута отсутствуют: дорожная геометрия не проверена</span>
      </div>
      {active && (
        <div className="map-selection" role="status">
          <strong>{active.name}</strong>
          <p>
            {hasActive
              ? "Точка выбрана на карте."
              : "Координаты этого места ещё не проверены; точка не нарисована."}
          </p>
        </div>
      )}
      {!filtered.features.length && (
        <p className="notice">
          Для текущего дня и слоя проверенных координат пока нет. Откройте «Все
          дни» или используйте адреса мест.
        </p>
      )}
      <details>
        <summary>Точки, источники и географические ограничения</summary>
        <p>
          {data.features.length} из {trip.places.length} мест имеют координаты.
          Это точки объектов, не точные входы и не дорожные маршруты.
          Непроверенные места доступны по адресам в разделе «Места».
        </p>
        {data.features.map((f) => (
          <div className="geo-source" key={f.properties?.placeId}>
            <button onClick={() => selectRef.current(f.properties?.placeId)}>
              {f.properties?.name}
            </button>
            <span>
              {f.geometry.coordinates.map((c) => c.toFixed(5)).join(", ")}
            </span>
            {f.properties?.sourceUrl && (
              <External href={f.properties.sourceUrl}>
                Источник · {f.properties.checkedAt}
              </External>
            )}
          </div>
        ))}
        <p>
          Базовая карта: OpenFreeMap / OpenMapTiles / OpenStreetMap. Данные
          Wikimedia: CC0 / CC BY-SA 4.0, источник и дата приведены для каждой
          точки.
        </p>
      </details>
    </div>
  );
}
