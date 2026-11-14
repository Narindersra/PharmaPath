---
name: Clinical Modernism
colors:
  surface: '#f9faf7'
  surface-dim: '#d9dad7'
  surface-bright: '#f9faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#3e4947'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#7d4200'
  on-tertiary: '#ffffff'
  tertiary-container: '#a15600'
  on-tertiary-container: '#ffe6d5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f9faf7'
  on-background: '#191c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 3.75rem
    letterSpacing: -0.035em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.0625rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
  space-2xl: 3.5rem
---

## Brand & Style

This design system embodies **Clinical Modernism**: the rigor, sterility, and structural dependability of medical infrastructure balanced by the warm, tactile dignity of Swiss-style editorial typography. It bridges high-velocity operational technology (inventory indexing, dispatch logistics, and live fulfillment) with the reassuring calm of pharmaceutical care.

### Core Visual Tenets
- **Architectural Utility:** Interfaces prioritize tabular readability, scan-optimized information density, and unambiguous state signposting over decorative ornament.
- **Physical Tactility:** Surfaces reference heavy-milled paper, matte blister-pack backings, and precision lab instruments. Visual separation relies on disciplined 1px hairline rules and micro-contrasting surface tiers rather than floaty ambient blurs.
- **Controlled Urgency:** Time-sensitive states (e.g., reserve timeouts, stock depletion, locker authentication) are communicated with stark typographic contrast, high-precision tabular numerals, and restrained monochromatic alert tokens.

## Colors

The palette establishes an authoritative clinical atmosphere anchored in mineral tones and botanical medicine greens.

- **Canvas & Backdrops:** Crisp bone (`#FBFBFA`) establishes an expansive, glare-free canvas. Structural grouping uses warm layered stone tiers (`#F3F4F1` for primary card backgrounds, `#EBECE8` for nested sub-surfaces and table headers).
- **Ink & Typography:** Primary typographic hierarchy uses obsidian slate (`#111827`) for absolute legibility, paired with deep graphite (`#1E293B`) for metadata, sub-labels, and architectural framing. Muted body text shifts to balanced slate gray (`#64748B`).
- **Clinical Emerald (Primary):** Botanical teal (`#0F766E`) conveys validated institutional authority. Interactive states leverage bright pine teal (`#0D9488`), with deep pharmaceutical pine (`#115E59`) reserved for pressed states and critical badges.
- **Diagnostic Accents:** Warm amber (`#D97706`) and soft golden olive (`#FEF3C7`) signal critical batch status, pending authorizations, or prescription verification timeouts.
- **Hairlines & Boundaries:** Structural containment is handled strictly by crisp mineral hairline borders (`#E2E4DE`), avoiding drop-shadow muddiness.

## Typography

Typography prioritizes extreme typographic discipline, clinical legibility, and technical information architecture.

- **Display & Headings:** Rendered in **Plus Jakarta Sans** with negative letter-spacing (`-0.02em` to `-0.035em`) to evoke technical publication precision and structured confidence.
- **Body & Controls:** Structured in **Inter** for neutral legibility across long-form medication guides, pharmacy location directories, and dynamic stock availability counters.
- **Data & Verification:** Batch numbers, NDC codes, pickup verification PINs, and inventory timestamps utilize **JetBrains Mono** to enforce zero-ambiguity character differentiation (e.g., distinguishing `0` and `O`).
- **OpenType Engine Rules:** Enable `tnum` (tabular lining numbers) by default across all table data, pickup countdown clocks, and dose quantities to prevent layout jitter during live updates.

## Layout & Spacing

The spatial architecture leverages a strict 4px/8px modular rhythm, prioritizing dense tabular efficiency on operations views and generous editorial breathing room on public discovery surfaces.

- **Grid Architecture:** 
  - **Desktop (≥ 1024px):** 12-column layout with 28px (`1.75rem`) gutters and a max-width container of 1440px. Section margins extend to 48px (`3rem`).
  - **Tablet (768px – 1023px):** 8-column layout with 20px (`1.25rem`) gutters and 32px (`2rem`) margins.
  - **Mobile (< 768px):** 4-column layout with 16px gutters and 16px (`1rem`) outer margins.
- **Rhythm Principles:** Spacing tokens govern internal cell densities. Table rows and inventory cells use tight vertical bounds (`space-sm` to `space-md`), keeping multi-item prescriptions visible above the fold without pagination.
- **Subtle Engineering Micro-Grid:** Structural dividing lines run through 1px border tokens. Backgrounds on dashboards may feature an ultra-faint 24px CSS grid pattern (`radial-gradient(#E2E4DE 1px, transparent 1px)`) sized at 24px × 24px.

## Elevation & Depth

This system intentionally rejects floating, hyper-blurred, multi-colored drop shadows. Depth is conveyed strictly through **tonal stratification** and **razor-thin clinical borders**.

- **Surface Tiering:**
  - **Tier 0 (Base Canvas):** `#FBFBFA` — Root viewport.
  - **Tier 1 (Base Panel):** `#F3F4F1` bordered with 1px `#E2E4DE`.
  - **Tier 2 (Nested Row/Card):** `#FFFFFF` bordered with 1px `#E2E4DE` for active item selection.
  - **Tier 3 (Floating Popovers & Modals):** `#FFFFFF` with a crisp double boundary: `0 0 0 1px #E2E4DE` coupled with a high-aperture, low-opacity technical contact shadow: `0 8px 24px -4px rgba(17, 24, 39, 0.06), 0 2px 6px -1px rgba(17, 24, 39, 0.04)`.
- **Active State Elevation:** Interactive list items shift background color to `#FFFFFF` and gain an internal 2px clinical emerald left edge indicator rather than lifting outward on the Z-axis.

## Shapes

The design uses a **Soft** shape archetype (`roundedness: 1`), providing sharp architectural poise with just enough radius to avoid cold, brutalist aggression.

- **Standard Containers & Cards:** `0.25rem` (4px) or `0.5rem` (8px). Maintains linear, grid-aligned discipline across medical inventory charts and status blocks.
- **Buttons & Search Inputs:** `0.375rem` (6px). Compact, tactile touch targets.
- **Status Pills & Micro Badges:** Fully circular (`rounded-full`) to immediately differentiate categorical tags, stock alerts, and fulfillment statuses from rigid layout cards.
- **Fulfillment QR / Barcode Holders:** Explicitly bounded at `0.25rem` with a hairline stroke to ensure zero distortion for optical pharmacy scanners.

## Components

### Buttons
- **Primary:** Solid deep emerald `#0F766E`, text `#FFFFFF`, font `label-md`. Hover shifts to `#0D9488`; active state contracts with a subtle `scale(0.99)` transition to `#115E59`.
- **Secondary:** Surface `#FFFFFF`, border 1px solid `#E2E4DE`, text `#111827`. Hover applies `#F3F4F1`.
- **Ghost/Tertiary:** No background, text `#1E293B`. Hover background `#F3F4F1`.
- **Destructive/Emergency:** Background `#FEF2F2`, border 1px solid `#FCA5A5`, text `#991B1B`.

### Badges & Inventory Status Chips
- **In Stock / Verified:** Soft botanical tint background `#ECFDF5`, text `#065F46`, border 1px solid `#A7F3D0`. Includes a 6px solid green status pip.
- **Low Stock / Reserved:** Light amber background `#FFFBEB`, text `#92400E`, border 1px solid `#FDE68A`.
- **Out of Stock:** Soft neutral `#F1F5F9`, text `#475569`, border 1px solid `#CBD5E1`.
- **Geometry:** Height 24px, padding 0 8px, font `label-sm`, uppercase tracking `0.04em`.

### Data Tables & Inventory Lists
- **Header:** Background `#EBECE8`, text `#475569`, border-bottom 1px solid `#E2E4DE`, height 36px, font `label-sm` with tabular alignment.
- **Rows:** Alternating rows forbidden. Background `#FFFFFF`, divider line 1px solid `#E2E4DE`. Hover triggers background `#F8FAF8`.
- **Cell Content:** Monospace figures for dosages (e.g., `500 mg`), quantities (`x30`), and lot codes.

### Inputs & Prescription Search
- **Container:** Background `#FFFFFF`, 1px solid `#E2E4DE`, height 40px, font `body-md`.
- **Focus State:** Border color shifts to `#0F766E` accompanied by a sharp, crisp focus ring: `box-shadow: 0 0 0 1px #0F766E`. No fuzzy glow.
- **Affixes:** Prefixed with clean monoline icons or location tags in `#64748B`.

### Cards & Pickup Lockers
- **Dispense Locker Tile:** Background `#F3F4F1`, 1px border `#E2E4DE`. Contains an embedded top status bar indicating locker status (e.g., "Ready for PIN Entry" in `#0F766E`).
- **Prescription Summary Card:** High-contrast layout with clear vertical hierarchy: drug brand name (bold `headline-sm`), generic scientific classification (`body-sm` in `#64748B`), and ready timestamp in `code-sm`.