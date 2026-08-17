# Design system

Decided 2026-08-11. Tokens live in [`src/theme/`](../src/theme); import them from `@/theme`.
This file is the *why* — the code is the source of truth for values.

Read [`APP_METADATA.md` §7](APP_METADATA.md#7-design-language-observed) first for what the
reference app actually does. This document says where we match it and where we deliberately
don't.

---

## 1. Type

**Three faces, three jobs.**

| Face | Role | Weights loaded |
|---|---|---|
| **Urbanist** | The entire UI. Hierarchy comes from weight, not family. | 400 · 500 · 600 · 700 · 800 |
| **Fraunces** | Display serif, rationed. | 400 · 600 · 700 |
| **Bebas Neue** | Loyalty card face only — stands in for embossing. | 400 |

Urbanist was kept rather than swapped for a closer SoDo Sans analogue (Figtree matches SoDo's
tall x-height and warmth more precisely) because the onboarding flow already ships it and the
churn wasn't worth the delta. If the app ever reads too cool or too wide next to real
screenshots, Figtree is the one-line swap — every call site goes through `Type`.

**Fraunces is rationed.** Rewards hero, store names, seasonal launch headers, article titles.
It never appears in a list row, a chip, a button, or a form field. Twice on one screen means
one of them is wrong. Note that `@expo-google-fonts` ships static instances, so Fraunces' SOFT
and WONK axes sit at their defaults — we get the warm old-style character but can't dial it.

This is a departure from the reference app, which is single-family throughout. It is the main
thing keeping the app from reading like generic food-delivery UI.

**Correction to `APP_METADATA.md` §7:** that doc recorded PDP product titles as a serif display
face. They aren't — screenshot 5 shows "Vietnamese Cold Brew" set in the brand sans at heavy
weight. The real app uses no serif anywhere. Ours does, by choice.

**Hard rule:** never set `fontWeight` alongside one of these families. Each file is a single
static weight; asking for one it doesn't contain makes Android smear the glyphs to fake bold
and makes iOS silently ignore it. Pick the family that already *is* the weight you want.

Scale: `TextStyles` in [`src/theme/typography.ts`](../src/theme/typography.ts).

---

## 2. Colour

Warm cream and green, faithful to the reference app, with two corrections.

### Corrections we made on purpose

1. **Secondary text.** The app's `#7C7C7C` on cream is ~3.6:1 — it fails WCAG AA for body
   copy. Ours is `#5C6A65` at 5.2:1. Same intent, legible.
2. **Shadows are green-tinted** (`rgba(30,57,50,0.10)`), never neutral black. Grey shadows on
   a cream surface are the clearest tell of a cheap clone.

Text primary is `#14231E`, a green-black, rather than `#000` — pure black buzzes against cream.

### Structure

`Brand` holds raw values and is private to the module. Components import the semantic groups —
`Surface`, `TextColor`, `Border`, `Action`, `Accent`, `Status`, `Diet`, `Tier` — so a value can
move without a find-and-replace. `TextColor` is named that way, not `Text`, so it never
collides with React Native's `Text`.

Two greens do different jobs and are not interchangeable: `Action.primary` `#006241` is for
CTAs, `Surface.inverse` / `Action.selected` `#1E3932` (House Green) is for headers, the tab
bar, and selected chips. The reference app is consistent about this and so are we.

`Diet.veg` / `Diet.nonVeg` are FSSAI-mandated indicators. Do not restyle them.

### Light only

The reference app ships no dark mode, and a grey inversion of a cream palette looks like a
different product. If a night theme ever happens it will be a deliberate "Reserve" identity —
espresso surfaces, copper and gold accents — not a computed inverse.

---

## 3. Category accent tinting

The one experimental move in the base system: **the product brings its own colour.**

A drink family tints **only**:

- the PDP hero scrim,
- that screen's section rules and kickers,
- its selected option chips,
- the favourite heart.

The tab bar, the sticky Add-to-Cart bar, and every CTA stay brand green. Merch, At-Home Coffee
and Food have **no** accent on purpose — the idea reads as intentional only while it stays
confined to drinks.

| Family | Base | Use for |
|---|---|---|
| `espresso` | `#9D5116` | hot coffee, lattes, shaken espresso |
| `coldBrew` | `#5B3A29` | cold brew, iced coffee |
| `frappuccino` | `#7E5B86` | blended |
| `matcha` | `#3E7C59` | matcha and teas |
| `refresher` | `#B23A5C` | refreshers and fruit |
| `default` | House Green | everything else |

Every `base` clears 4.5:1 on cream, so it is safe for chip labels and meta text. `deep` is for
gradient ends and scrims; `tint` for fills.

---

## 4. Shape

Pills everywhere (`Radius.pill`). The white sheet that slides over the dark green header is
`Radius.sheet` (28). Minimum tap target 44. 4pt spacing scale via `Space`.

---

## 5. Open items

- **Onboarding palette.** `src/components/onboarding/theme.ts` still carries its own `Palette`.
  Two values differ from the decided tokens (`cream` `#F2F0EB` vs `Surface.app` `#F7F5F0`,
  `ink` `#1E3932` vs `TextColor.primary` `#14231E`), so migrating it is a visual change to a
  tuned animation, not a rename. Do it as its own step.
- **Template leftovers.** `src/constants/theme.ts` (`Colors`, `Fonts`, `Spacing`) plus
  `themed-text`, `themed-view`, `hint-row`, `web-badge`, `external-link`, `animated-icon`,
  `ui/collapsible` and `hooks/use-theme` are now a **closed island** — since the tab screens
  landed, nothing under `src/app/` reaches any of them; they only import each other. Safe to
  delete wholesale. Nothing new should import them.
- ~~**Font loading** happens in `src/app/onboarding.tsx`~~ — resolved. `useFonts(APP_FONTS)` now
  runs once in `src/app/_layout.tsx`, which also owns hiding the splash. No screen loads fonts.

### Added since

- **`Status.errorOnDark`.** `Status.error` is 2.3:1 on House Green — it fails even the 3:1 floor
  for icons. Destructive rows on a dark surface (the account menu's Log Out) use the on-dark
  value instead.
- **The icon set.** `src/components/chrome/glyphs.tsx` is the one source of icons — hand-drawn
  `react-native-svg` paths on a 24pt box, stroke only, round caps. Not SF Symbols: `expo-symbols`
  gives us nothing matching on Android, so the tab bar would need two code paths. See that file's
  header for the drawing rules before adding one.
