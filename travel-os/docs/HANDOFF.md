# Передача, 31.10.2026

Реализовано: каталог, generic TripPage, дни/места, исторические транспорт/отель/цены, локальные расходы/курсы/статусы/заметки, JSON/CSV, draft validation/import/preview/approval gate, custom MapLibre и GeoJSON, motion/reduced-motion, сохранённая V1.

Данные Армении не изменены. Корневые V1 файлы совпадают со snapshot. Дополнительно 10 координат в enrichment, без дорожных линий. Полный V1 доступен через Sources.

Проверки: 19 unit pass; typecheck/lint/build pass на последнем проверенном дереве. Browser Work: поиск/empty, день Армении, оба дня учебного Рима, создание/перезагрузка/редактирование/удаление расхода. Responsive frame 390px без горизонтального переполнения. Impeccable detect: [].

Незакрыто: автоматические Playwright E2E (Chromium не загружается в окружении), физический Android, WebGL-карта в поддерживаемом браузере, Web Vitals, 14 координат и дорожная геометрия. Это ограничения проверки/геослоя; не объявлять production-ready до их оценки пользователем.

Cloudflare: независимый travel-os-platform; root travel-os; npm run build; dist; production branch release/travel-os; production auto-deploy false; разрешён preview только feature/travel-os-rebuild. GitHub main read-only. Старый armenia-travel-os-preview не тронут.

Следующая поездка поступает JSON из чата 02 → trip/<slug> → validate/dry-run → draft import → local preview с generic TripPage → QA/diff → пользователь → release/travel-os. Не использовать память вместо файла.
