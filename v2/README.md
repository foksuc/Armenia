# Armenia Travel OS 2.0 · Glass

Independent redesign on `feature/armenia-glassy-v5`, based on the previous `feature/armenia-travel-os-v2`. Original root files and main stay unchanged.

## Run
Open `v2/index.html` or serve the repository with any static server. No build dependencies. For the standalone hosted preview run `python v2/build.py`; output is `dist/`, new version at `/v2/` and original guide at `/`.

## Features
- Responsive graphite/amber glass dashboard, photo bundled locally, six navigation sections.
- Six-day itinerary, selected-day embedded map centered on the first stop, multi-stop route link in Google Maps.
- Per-day local notes, calendar export (all-day itinerary event), printable full itinerary.
- Search across 13 places including all nine restaurants; original hotel tariffs in an expandable section.
- Trip estimate follows selected flight: Sochi 53,927–58,927 RUB; Krasnodar 55,057–60,057 RUB. Formula uses half the 24,601 RUB room plus 4,237 concert, 6,700 tours and 15,000–20,000 food/transport/entries. Transfers and some admission fees excluded as in original.
- Actual expenses remain separate from estimate; editable limit, create/edit/delete, CSV import/export.
- Booking statuses and preparation checklist; custom tasks; reduced transparency on desktop.
- Existing localStorage prefix `armenia-v2-` retained.

## Data limitations
Historical planning data checked on 24 October 2026, not live prices or confirmed reservations. No cross-device synchronization. Storage is scoped to browser AND site origin: a new preview address starts with empty state; expenses can be moved via CSV. Notes/checklist are local. No service worker/offline installation; downloadable source works locally, map needs internet. Google Fonts optional. Calendar export is an all-day plan, not a timed concert ticket.

Glassy Dashboard V5 is visual inspiration, not an imported paid template.

## Verification
Node syntax checks passed. Browser exercised day switching/map URL, both flight estimates, restaurant search, expense create/reload/delete and checklist toggle. Desktop and 390px iframe layouts visually reviewed; no real Android device test. Embedded map is centered on first stop, full route opens separately.
