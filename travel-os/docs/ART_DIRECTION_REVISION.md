# Revision after user review — 31.10.2026
User rejected the first visual build: weak typography, imperceptible hover/click states, insufficient authored motion, poorer than Armenia V1. Reference visually inspected: foksuc.github.io/Armenia/. Existing data/import/storage must survive.

Pinned direction: expressive editorial travel, as committed in the original brief, with V1 as a minimum craft bar. Dark evergreen/obsidian hero, full-color real Armenian imagery, apricot display contrast, warm-paper functional surfaces, floating glass navigation. No fictitious tours, ratings, bookings or road geometry.

Composition: immersive asymmetric hero with staggered masked type, scenic image reveal and a trip discovery card; photo-led featured expedition plus actual day excursions; full-width photo interlude with scroll-linked line drawing (abstract sequence, never a geographic route); a dense usable trip workspace with active navigation, spring day selector, day portrait and timeline.

Motion contract: CSS hover/press/focus on every actionable surface; arrow translation, button fill and lift, card image zoom and hover border. Motion shared active backgrounds on filters/day tabs, AnimatePresence day change; GSAP intro timeline, image scrub/clip and bidirectional reveal with distant reset. Hover mechanics apply to mouse only; touch gets press and persistent selection. Reduced motion removes travel/scale/scrub, retains readable state and keyboard focus. No loading overlay blocks content.

Impeccable direction seed was run, degraded without catalog challengers; user-pinned editorial direction takes precedence. No fabricated quality-board approval. Inspect desktop and 390px frame, then commission fresh visual review against user criticism and V1.

## Verified outcome
- Fresh visual reviewer disposition: ship with caveats for visual/interaction revision only. Two caveats (unnamed mobile import link, muted mobile photo) were fixed; both scored resolved in bounded second pass. This is not certification of backend, performance or superiority over V1.
- Work browser confirmed active day 4, settled text rgb(251,245,228), mouse hover transform translateY(-3px), no horizontal overflow at desktop and 380px content width in 390px frame.
- 19 data/storage unit tests, typecheck, ESLint, production build and draft exclusion passed. Automated Playwright assertions expanded for hover/pill/day states; full E2E execution retains the existing unavailable-Chromium limitation. No physical Android claim.
- Added real licensed Garni image; metadata in public/media/licenses.json. No trip facts, source snapshot, canonical schema or user storage keys changed.
