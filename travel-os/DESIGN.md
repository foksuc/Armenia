# Travel OS — Expedition Editorial
Visual authority: user rejection of first build and Armenia V1 as minimum quality, 31.10.2026. Scope is full visual/motion revision; canonical trip values remain unchanged.

## Tokens
Evergreen #142b25; obsidian #101d19; warm paper #eeeae0; cards #faf8f1; ink #20382d; muted #657269; apricot #efb78d; pale gold #e6ca79. Accent on paper: #92502b. Typeface: self-hosted Manrope Variable (Cyrillic), display weight 800 / tracking -.04em / line-height .94; body 16px/1.7. H1 fluid 56–160px with max 2–3 lines and explicit clipping-safe masks. Cards 20px, controls 12px, compact state selectors pill-shaped. Content max 1440px.

## Layout
Home is an editorial travel cover; one real expedition, never a fake catalog. Large immersive title, colorful Armenian photos, floating glass global nav, actual excursion teasers, warm-paper catalog, full-bleed scenic scroll scene. Trip balances a cinematic cover with paper reading/workspace and green selected states. Fields, errors, source links and historical labels remain explicit.

## Interaction
All controls: visible hover background/border + icon travel + press scale; focus ring 3px. Card images zoom separately from parent lift. Day selectors and category filters carry Motion shared-layout indicator; active trip nav has moving underline. Day content slides/clips with reduced-motion equivalent. GSAP reveals type and imagery, scrubs scene depth and an abstract editorial path, resets outside viewport with hysteresis. Default HTML stays visible on JS failure. No scroll hijacking, gratuitous long pins, fake routes or endless decorative loops.
