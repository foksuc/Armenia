# Travel OS

Новая платформа в отдельном `travel-os/`. Корневые четыре файла Armenia V1 и GitHub `main` неизменны. Источник: `a96b811bb87d0ec2ed200211215fe02a3f3a2e62`.

## Запуск

Node.js 24, npm. Из `travel-os/`:

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

Сборка: `dist/`, SPA fallback `_redirects`. `npm run build:preview` создаёт `dist-preview/` и временный registry с учебными draft. Перед deploy всегда `npm run build`: registry генерируется заново, опубликованные пакеты валидируются, итоговые файлы проверяются на отсутствие draft ID. Обычный dev использует текущий registry; после проверки draft верните production-сборку.

## Данные и импорт

Каноническая неизменённая JSON Schema — `schema/trip-package.schema.json`. TypeScript генерируется командой `npm run types:generate`. Zod использует тот же Ajv 2020-12 валидатор; второй конкурирующей схемы пакета нет. Семантика проверяет ссылки и ID, даты/дни/TZ, безопасные HTTPS URL и признаки секретов; человеческая проверка перед релизом обязательна.

```sh
npm run validate -- /path/trip-package.json
npm run import:trip -- /path/trip-package.json --dry-run
# Из корня репозитория создать изолированную ветку trip/<slug>.
npm run import:trip -- /path/trip-package.json
# Для ревизии сначала dry-run со значениями before/after, затем явное подтверждение:
npm run import:trip -- /path/trip-package.json --confirm-update
npm run build:preview
```

Новые импорты всегда `draft`, независимо от присланного статуса. Повторное содержимое идемпотентно, конфликт slug отклоняется. CLI пишет только в `drafts`, не заменяет опубликованный пакет. UI импортирует в память текущей вкладки/sessionStorage и показывает тот же TripPage, без публикации и без серверной записи. Пакеты трактуются только как данные, HTML не выполняется. Не загружайте секреты в публичный репозиторий: `draft` — статус публикации, не средство защиты GitHub-файла.

Учебный пример — синтетический `example-italy-2028`, не реальный маршрут. Он проверен на двух днях общего шаблона `/preview/example-italy-2028` в локальной preview-сборке. Отдельный JSX для Италии отсутствует. В публичный каталог/production output пример не включается.

## Релиз после одобрения

Production-ветка Cloudflare — `release/travel-os`, не `main`. Автодеплой production выключен. Первое одобрение выпуска платформы ещё не получено. Для нового тура: исправить blocking вопросы → preview → просмотр пользователя → статус `ready` в отдельной ветке → явное согласие пользователя → на `release/travel-os` выполнить `npm run approve:trip -- drafts/<slug>.json --user-approved` → тесты/build → release/deploy. Команда отказывает на main и на feature/trip-ветках; она не включает deployment автоматически. Не открывать PR в main.

## Сохранность Армении

Все четыре V1 файла сохранены байт-в-байт в `public/original/armenia-v1/`, SHA256 в manifest. Полный текст десяти разделов + все ссылки доступны в «Источники → Полный оригинал V1». Стандартизированы 6 дней, 24 места (9 заведений), 2 альтернативы транспорта, 4 тарифа отеля и 19 ценовых записей. Остальные детали (меню, условия, расписания, источники фотографий) также доступны в полном оригинале. Исходные цены/события не перепланированы.

Цены исторические, 24.10.2026. В V1 экскурсии: 2530+4150=6680 ₽, бюджет округляет до 6700 ₽; сохранены оба значения. Округлённая половина отеля 12301 ₽ и исходные диапазоны бюджета также сохранены отдельно от отдельных тарифов. Возврат через Сочи заканчивается 19.02 в 00:31, прямой рейс — 18.02 утром.

Миграция воспроизводима: `uv run --with beautifulsoup4 python scripts/migrate-armenia.py`. Геообогащение отдельно: `python scripts/enrich-geo.py` (нужен интернет). Не запускайте миграцию для переписывания согласованной программы без сравнения.

## Карта, медиа, motion

MapLibre lazy chunk + отдельный GeoJSON с 10 точками, проверенными в Wikimedia 31.10.2026, источниками и лицензиями. Original location остаётся null. Два масштаба, день/слой, fitBounds, связь точки и программы, cooperative gestures. 14 мест ещё без подтверждённых координат. Геометрия дорог отсутствует: линии маршрутов не придуманы. При недоступном WebGL — рабочий список точек/адресов.

Авторская палитра Basalt поверх базового стиля OpenFreeMap Liberty; OSM/OpenMapTiles/OpenFreeMap attribution сохранена. Условия публичного OpenFreeMap проверены 31.10.2026: https://openfreemap.org/ . Фото Rita Willaert, CC BY 2.0, Wikimedia Commons; источник и лицензия видимы в footer, изображение сжато в WebP и кадрируется CSS.

Motion — состояния дня; GSAP — скролл изображения и повторяемые входы в обе стороны. Сброс только после дальнего выхода, читаемый контент не скрывается; reduced motion отключает transform/scrub. CSS — простые hover/focus. UI не содержит fake-отзывов/бронирований/направлений.

## Личные данные

Расходы CRUD, JSON backup/restore, CSV export/import, заметки и пользовательские статусы бронирований — localStorage `travel-os:v1:<tripId>`. JSON валидируется, другой tripId отклоняется. Повреждённая копия сохраняется до восстановления. Суммы в minor units, валюты раздельно; опциональный пересчёт BigInt по введённым пользователем датированным курсам с HTTPS-источником. Серверной синхронизации нет. Пользовательский статус не подтверждает оформление у поставщика.

## QA

19 Vitest-проверок, typecheck, ESLint и production build. Playwright-сценарии desktop/Pixel 7 находятся в `tests/platform.e2e.ts`. В этой Work-среде загрузка Chromium возвращает HTML вместо архива: автоматические E2E не исполнены успешно. Выполнены браузерные проверки Work и responsive frame 390px; это не Android-эмуляция. WebGL в Work-браузере недоступен, проверен fallback; интерактивную карту нужно проверить в браузере с WebGL. Web Vitals не измерены, оценка 100/100 не заявляется.

```sh
npx playwright install --with-deps chromium
# При запущенном dev server:
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e
```

Workflow `.github/workflows/travel-os.yml`: checks → draft preview → desktop/mobile E2E → production build и scan draft. Для CI нужен доступ к официальному архиву Chromium. Старую Cloudflare V2 не используем и не изменяем.
