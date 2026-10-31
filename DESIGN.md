---
name: Armenia Travel OS 2.0
description: A personal Armenia travel dashboard in glass, graphite and amber.
colors:
  primary: "#efc18b"
  graphite: "#171b20"
  surface: "rgba(36,42,48,.82)"
  text: "#f4f1eb"
  muted: "#b8bdc5"
  line: "#ffffff20"
  solid-surface: "#262c34"
typography:
  display:
    fontFamily: "Onest, Manrope, sans-serif"
    fontSize: "clamp(35px,3.8vw,58px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Onest, Manrope, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "14px"
  control:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "13px"
rounded:
  surface: "16px"
  control: "9px"
  secondary-button: "8px"
  selection: "10px"
spacing:
  compact: "8px"
  regular: "16px"
  section: "24px"
  panel: "25px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#24211d"
    rounded: "{rounded.control}"
    padding: "12px 17px"
  button-secondary:
    backgroundColor: "#ffffff0b"
    textColor: "{colors.text}"
    rounded: "{rounded.secondary-button}"
    padding: "9px 11px"
  input:
    backgroundColor: "#171d24b3"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.surface}"
    padding: "25px"
---

# Design System: Armenia Travel OS 2.0

## Overview

**Creative North Star: "Glass, graphite and amber"**

The pinned direction is glass, graphite and amber: a personal travel dashboard with a photographic Armenia hero, quiet translucent surfaces and warm action accents. This document records the implemented v2 system from code and the supplied desktop and mobile screenshots; there is no approved visual comp. It applies to v2 only. The original root guide retains its existing design.

**Key Characteristics:**
- Graphite surfaces with amber actions and selected states.
- Photo-led identity with compact, readable travel tools.
- Desktop sidebar; horizontally scrolling mobile navigation.

## Colors

Amber is the primary action and selection color. Graphite is the page canvas, translucent surface is the panel material, text is warm white, and muted supports secondary content. The line token divides lists and defines glass edges. Solid surface supports reduced transparency and the backdrop-filter fallback. These are the implemented colors, not a new palette proposal.

## Typography

Onest supplies the hero and section headings; Manrope supplies interface and body copy. Both are currently loaded through Google Fonts, with the source stacks recorded above. Main travel descriptions and checklist rows use body size; muted metadata generally uses 12px and controls use 13px. Hero type becomes 42px at the 1150px breakpoint and 38px at 760px. Countdown, budget metrics and clock use tabular numerals. This is compact dashboard typography, not a long-form article measure.

## Layout

The shell is capped at 1740px with 20px outer padding, a 208px sidebar, and a 24px gap. Navigation is sticky with viewport-relative height. Main content uses a 1.55fr/1fr split; panels use 25px padding. At 1150px the sidebar becomes 175px and the content becomes one column. At 760px the shell becomes a single column with 12px outer padding; navigation becomes a sticky top strip with horizontal scrolling, panels use 20px padding, and metrics use two columns with the concert spanning both. The hero is 340px on desktop, 380px above 1500px, and at least 360px on mobile. Explicit navigation reveals and focuses the main panel, whose scroll margin accommodates the mobile header.

## Elevation & Depth

Depth comes from translucent graphite, a thin light border and 24px backdrop blur, rather than box shadows. The hero uses a dark directional overlay over the local Khor Virap photograph. Reduced transparency replaces surfaces with opaque graphite; browsers without backdrop-filter receive an opaque fallback. The current entrance is a subtle 6px vertical movement over 350ms ease-out; button surface transitions take 180ms. Reduced-motion media settings disable animations and transitions, and the hero route action avoids smooth scrolling.

## Shapes

Panels use the surface radius; controls and secondary buttons use smaller radii. Day choices and navigation selections use softly rounded rectangular shapes. Lists are divided by thin rules rather than repeated inset cards. Icons use inline SVG with a consistent 1.5px stroke; the Armenian letter in the brand is lettering.

## Components

Primary buttons identify route and add actions. Secondary buttons support print, calendar and CSV operations. Inputs share dark fills, thin borders and amber carets. Navigation selects one content section; day buttons select the overview itinerary, map and local notes. Lists support places, bookings and checklist items. Selected days and active navigation expose their state accessibly. Day and checklist rerenders restore focus; the CSV import trigger is a keyboard-operable button. Focus rings use amber with a 2px outline and 4px offset. Selection and scrollbar colors are themed.

The map requires an internet connection; its external route link is the actionable fallback. Local notes, budget, checklist and booking state live in this browser. Empty search and expense states explain recovery. Source travel facts and prices are inherited from the original guide dated 24.10.2026; they are not live inventory. The photograph retains visible attribution to Rita Willaert, CC BY 2.0. The root guide remains linked as the full source.

## Do's and Don'ts

### Do
- Do preserve the pinned glass, graphite and amber direction.
- Do keep travel facts traceable to the original guide and show their verification date.
- Do preserve visible keyboard focus, local-storage feedback and reduced-motion behavior.

### Don't
- Do not apply this v2 redesign to the original root guide.
- Do not imply that prices are live or that booking statuses purchase anything.
- Do not treat the screenshots as an approved comp or invent unseen design requirements.
