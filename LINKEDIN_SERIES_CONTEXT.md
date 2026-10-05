# Project context — for LinkedIn post generation

Attach this file to Claude Web alongside `LINKEDIN_SERIES_PROMPT.md`.
This file is **facts only**. The prompt file is the instruction.

Everything below is true of the actual repository as of **16 Aug 2026**. Nothing
here is aspirational. If a post makes a claim, it must trace back to a line in
this document.

---

## 0. The one-line version

A ground-up UI recreation of the **Starbucks India** mobile app, built in Expo
SDK 57 — rebuilt not to copy the original, but to fix the parts of it that
people actually complain about, and to prove that a loyalty app can feel
designed rather than assembled.

---

## 1. What this is, and what it is not

| | |
|---|---|
| **Is** | An unofficial concept study. A UI/UX craft portfolio piece. |
| **Is not** | Affiliated with, endorsed by, or connected to Starbucks Corporation or Tata Starbucks. |
| **Is not** | A shipping product. There is **no backend, by design.** |
| **Is not** | A performance project. See §9 — do not claim speed. |

**This disclaimer is mandatory on anything published.** The repo's own README
carries it: *"Unofficial concept study… If any of this is published or posted
anywhere, it must be labelled as such."*

---

## 2. Why I built it

Three reasons, in order of honesty:

1. **The real app is a genuinely good product wrapped in a tired interface.**
   Coffee ordering is one of the most-repeated interactions a person has with an
   app — a few taps, several times a week, for years. That repetition is exactly
   what makes a stiff interface expensive. Nobody notices a bad checkout they do
   once a year. Everybody notices one they do on a Tuesday morning.

2. **To have an opinion, in public, that can be checked.** Most design portfolios
   show static screens. This runs. Every decision in it is written down *with the
   argument that produced it* — including the ones I later reversed, and why.

3. **To answer the reviews.** The Starbucks India app's public reviews are not
   vague. They name specific failures. Each post in this series takes one of them
   and shows what I built instead. (§3.)

**Design philosophy, stated up front:** never the generic pattern. If a screen
could be a food-delivery app with the logo swapped, it is wrong. Every mechanism
in §6 exists because the obvious version was rejected first.

---

## 3. The reviews this series answers

Real, public complaints from Google Play reviews of **Starbucks India**
(`com.starbucks.in`) and the App Store listing (`id1210203958`, ★3.9 at the time
of the reference audit, version 5.2.4).

Recurring themes, verifiable in the store listings:

| # | The complaint, in users' own framing | What in my build answers it |
|---|---|---|
| R1 | The app is unbearably slow and glitchy | Motion tokens; gesture-driven (not timeline-driven) animation; native tab bar instead of a hand-rolled one — §6.1, §6.7, §7 |
| R2 | "Worst user interface" | A real token system, one header component, a contrast fix that the original fails — §5, §6.9 |
| R3 | Errors on open; rarely reaches the landing page first try | Designed loading and absent states that are not failures — §6.10, §6.11 |
| R4 | Can't order despite granting location permission | Store-first architecture: the map is gate one, and choosing a store is not optional — §6.4 |
| R5 | Subscription section loads forever | The honest-empty-state rule: never fake data, never spin forever — §6.10 |
| R6 | Reloading money into the wallet is a bad experience | The Pay/wallet loop: amount chips, one confirm, transactions in the same place — §4 (`pay`) |

**Sourcing rule for the posts:** I will paste the exact review text I want to use
into the chat myself, from a screenshot I take of the live store listing. Claude
should **never invent, paraphrase into quotation marks, or attribute a review it
has not been given.** A fabricated review destroys the entire premise of the
series.

**Attribution rule:** use short excerpts only, never a reviewer's name or handle,
and never a full review reproduced end to end.

---

## 4. What is actually built

**137 TypeScript/TSX source files.** Expo Router, file-based.

### Navigation — three states, not a sequence

```
store-picker  ──▶  membership  ──▶  (tabs)
  the map          card sign-up      the app
 no store         store, no member  store + member
```

The two gates are **mutually exclusive `<Stack.Protected>` guards**, driven by
two booleans in `src/lib/session.tsx`. No screen navigates across a gate — a
screen updates the session and the router settles on whichever gate is now open.

Consequences: you cannot press Back into a gate you already cleared; a screen
never has to know what comes after it; the entire flow is one readable table
instead of navigation calls scattered across three files.

### Five tabs

`Home` · `Gift` · `Order` · `Pay` · `Rewards` — matching the real app's IA.
Each tab is a folder with its **own native stack**, so a detail screen pushes
*inside* the tab it belongs to and the bar stays put.

**Account is deliberately not a tab.** It is the slide-out panel (§6.1), reached
from the avatar in the Home header — which is what the real app does too.

### Screens

~34 planned including states, mapped in `docs/SCREEN_MAP.md` and grounded in six
real app screenshots. Fourteen exist in Figma. The tab screens are real chrome,
real section titles, real shapes, with content still landing.

### Component inventory

Six layers, documented in `docs/COMPONENTS.md`:

- **Layer 0 — tokens** (`@/theme`): `Surface` `TextColor` `Border` `Action`
  `Accent` `Status` `Diet` `Tier` `CategoryAccent` `Elevation` `Space` `Radius`
  `Sizes` `Type` `TextStyles` `Duration` `Ease` `Spring`
- **Layer 1 — screen skeleton**: `Screen` `ScreenHeader` `ScreenScroll`
  `Section` `Sheet` `Divider` `ActionBar` `EmptyState` `Stat`
- **Layer 2 — content chrome**: `Card` `Chip` `ListRow` `ListSection` `Rail`
  `Grid` `Tile` `Glyph` `DietMark`
- **Layer 3 — controls**: `Button` `IconButton` `Segmented` `Stepper` `Field`
- **Layer 4 — brand**: `Avatar` `Balance` `PriceTag` `ProductThumb`
  `ProductCard` `ProgressTrack` `StarBalance` `StoreRow` `LoyaltyCard`
- **Layer 5 — continuity chrome**: `SessionStrip`, `FluidMenu`

---

## 5. The design system

### Type — three faces, three jobs

| Face | Job |
|---|---|
| **Urbanist** | The entire UI. Hierarchy comes from **weight, not family**. |
| **Fraunces** | Display serif. **Rationed.** |
| **Bebas Neue** | The loyalty card face only — it stands in for embossing. |

**"Rationed" is a real rule, not a vibe.** Fraunces appears on the Rewards hero,
store names, seasonal headers, article titles. It never appears in a list row, a
chip, a button, or a form field. *Twice on one screen means one of them is wrong.*

This is a **deliberate departure** from the real app, which is single-family
throughout. It is the main thing keeping this from reading like generic
food-delivery UI.

*(Accuracy note: the code ships Fraunces. The parallel Figma system swapped to
Instrument Serif after a side-by-side. If a post names the font, name Fraunces.)*

### Colour — faithful, with two corrections I can defend

1. **Contrast.** The real app's secondary text `#7C7C7C` on cream measures
   **~3.6:1** — it fails WCAG AA for body copy. Mine is `#5C6A65` at **5.2:1**.
   Same intent, actually legible.
2. **Shadows are green-tinted** `rgba(30,57,50,0.10)`, never neutral black. Grey
   shadows on a cream surface are *the* clearest tell of a cheap clone.

Body text is `#14231E`, a green-black, not `#000` — pure black buzzes on cream.

Two greens do different jobs and are never swapped: `Action.primary` `#006241`
for CTAs, House Green `#1E3932` for headers, the tab bar, and selected chips.

**Light only, on purpose.** The reference ships no dark mode, and a grey
inversion of a cream palette looks like a different product. If a night theme
ever happens it will be a deliberate "Reserve" identity — espresso surfaces,
copper and gold — not a computed inverse.

### The experimental move — category accent tinting

**The product brings its own colour.** A drink family tints *only* the PDP hero
scrim, that screen's section rules and kickers, its selected chips, and the
favourite heart. The tab bar, the sticky Add-to-Cart bar, and every CTA stay
brand green.

| Family | Base |
|---|---|
| espresso | `#9D5116` |
| coldBrew | `#5B3A29` |
| frappuccino | `#7E5B86` |
| matcha | `#3E7C59` |
| refresher | `#B23A5C` |

Merch, At-Home Coffee and Food get **no** accent on purpose — the idea reads as
intentional only while it stays confined to drinks. Every base clears 4.5:1 on
cream.

---

## 6. The mechanisms — one post each

These are the series. Each is a real, running thing with a real argument behind it.

### 6.1 FluidMenu — the app slides away to reveal the menu
`src/components/fluid-menu/`

One shared value, `progress`, runs 0 → 1 and **everything** reads from it: the
app card's shift, scale and corner radius, the scrim, the two round controls, and
each row's staggered entrance. Nothing is sequenced against anything else.

**It is a gesture first and a button second.** Drag from the left edge and the
panel tracks your thumb, stagger and all. Stop halfway and it stops halfway.
Reverse and it reverses. A version built from `withDelay` chains looks identical
on a tap and comes apart the instant a finger is involved, because the timeline
has already committed to a direction the gesture can no longer steer.

**The card carries the live tab bar with it.** A `UITabBarController` — the real
one — slides sideways inside a transformed view. A bar left standing while the
screen slid away would say "the menu is another screen." It isn't. It's a layer
underneath the app.

Numbers derived, not guessed: scale `0.66`, shift `0.52 W`, corner radius
`24 / 0.66` (a radius scales too, so you ask for more to land on 24).

**Reversal worth telling:** I wrote three paragraphs arguing this was impossible
— that `NativeTabs` won't accept an arbitrary wrapper. The obstacle was a
category error. `FluidMenu` isn't a child of `NativeTabs`; `NativeTabs` is a
child of `FluidMenu`. The rule was real. It applied to a tree I didn't have.

### 6.2 Card-as-form onboarding
`src/components/onboarding/`

**The membership card *is* the form.** You type your name and birthday straight
onto its printed lines. It **flips over** for the phone number — onto the
signature panel, where a phone number belongs. Then it drops into a wallet while
the screen turns green for the OTP.

No sign-in/sign-up fork. No password anywhere. The card *is* the account: you
fill it in and the OTP claims it. (Matching the real app, which is phone-only.)

Five card editions — House, Forest, Jade, Sage, Reserve — each a gradient face,
darker back, magstripe, and guilloché pattern (arcs / hairlines / dots), **all
drawn in SVG. Zero image assets.**

### 6.3 The holographic welcome card
`src/components/onboarding/HoloTilt.tsx`

The claimed card follows the device's tilt (±6°, perspective-projected) and a
diagonal light band slides across the face **against** the lean. The siren
watermark catches it as it passes.

Driven by DeviceMotion **attitude**, not gyro rate, sampled ~30 Hz and retargeted
through 120 ms timing curves so it glides instead of stepping. The first reading
after the claim becomes neutral — however you're holding the phone is "flat."

**Tilt is disabled during the form, on purpose.** While you're typing, the card
is a form.

### 6.4 The map is gate one
`src/components/store-picker/` (26 files)

In India the menu, the ETA and the pricing are **all per-store**. So "which shop"
is context for the entire catalogue, not a preference to set later. Nothing
downstream is answerable without it.

Also solves a real router trap: `router.push('/store-picker')` from inside the
tabs is *silently dropped* — a closed `Stack.Protected` guard removes the route
name, and expo-router returns null for a push to a name that isn't there. No
error, no warning, nothing moves. The fix is `/change-store`: the same component,
unguarded, presented as a full-screen modal, so backing out leaves your store
intact.

### 6.5 The strip that survives tab switches
`src/components/accessory/session-strip.tsx`

Stars balance and your chosen store, on one line, above the tab bar. It's a
`UITabBarController` **bottom accessory** — it belongs to the *controller*, not
to a tab, so it is mounted once and never torn down. Everything else on screen
is rebuilt when you change tab.

**That continuity is the whole point: it's what makes five screens read as one
surface rather than five.**

Two halves, two targets: Stars opens Rewards, the store opens the store picker.
It renders twice (one copy per placement) as two React trees that share nothing —
so it holds **no state of its own**, ever.

### 6.6 The reversal I'm proudest of — deleting my own tab bar
`docs/NAVIGATION.md §3`

I built a custom floating dark pill, and argued for it: native chrome is not ours
to restyle. Then I deleted it.

The pill had no scroll-edge behaviour, no minimize, no state restoration, no
VoiceOver rotor, and a `TAB_BAR_HEIGHT` constant **every screen in the app had to
know about**. What the pill was actually for — a bar that floats clear of content
— iOS 26 now does itself with `minimizeBehavior="onScrollDown"`.

**I was hand-rolling a worse copy of a system behaviour.**

`Sizes.tabBarHeight` is deleted from the codebase and nothing may reintroduce it.

### 6.7 Motion as a token, not a habit
`src/theme/motion.ts`

The timing instincts were already there — scattered as literals with the
reasoning in comments beside them. Written down once, they stop being five
people's opinions and become **one app's tempo**: a tab switch and a sheet
arriving should feel like the same hand moved them.

`Duration.press` 90ms — short enough that your finger is still down when it lands.

### 6.8 One icon set, hand-drawn
`src/components/chrome/glyphs.tsx`

Every in-screen icon is a hand-drawn `react-native-svg` path on a 24pt box,
stroke only, round caps. Not SF Symbols — `expo-symbols` gives nothing matching
on Android, so the app would need two code paths.

### 6.9 Accessibility as a design decision, not a checkbox

- Secondary text: 3.6:1 → **5.2:1**.
- `Status.error` measures 2.3:1 on House Green — it fails even the 3:1 floor for
  icons. So destructive rows on dark (the account menu's Log Out) use a separate
  `Status.errorOnDark` token.
- Minimum tap target 44pt, everywhere.
- FSSAI diet marks (`Diet.veg` / `Diet.nonVeg`) are legally mandated indicators
  at a legal 16pt. **They are never restyled.**

### 6.10 The empty card I refused to fill
`src/components/store-picker/BusyTimes.tsx`

Mapbox documents an hourly busyness score per venue. It is the centrepiece of
their own marketing shot. **It has never once arrived** — absent for Starbucks in
Pune, absent in San Francisco, absent for Whole Foods and Blue Bottle.

So the card is built and left **empty**, and the bars are uniform and low **on
purpose**. Varying their heights would read as real data at a glance.

The two alternatives were both worse: synthesising a plausible curve would look
exactly like the marketing shot and be fiction — and a busyness chart is the kind
of fiction someone acts on, *by driving somewhere*. Dropping the card would hide
that the integration is incomplete.

**An empty card is the only version that is both honest and finished.**

The renderer for the real data is written, tested against the documented array
shape, and unused. Enabling it is passing one prop.

### 6.11 The map's absence, designed
`src/components/store-picker/MapPlate.tsx`

What fills the map's frame when there is no map — while the style loads, on web,
without a token, after an error.

It is a **plate, not an error state**: House Green with the siren bled off the
corner, the same printed-mark treatment the loyalty card uses. The screen behind
it is fully usable in every one of those cases, **so it must not read as a
failure.** It reads as the map's absence being accounted for.

### 6.12 One studio spec for every product image
`docs/PRODUCT_IMAGERY.md`

Every menu image is one shot from one shoot. Only the *product* changes between
tiles — not the light, not the angle, not the scale, not the background.
**One inconsistent tile is more visible than ten mediocre consistent ones.**

The background is `#EFECE5` — not a choice, a token. `ProductThumb` paints its
box that exact value before the photo lands, so the photo **dissolves into its
own tile**. Not white (the tile vanishes into the card). Not grey (it turns a
warm palette cold).

Two rules a generator will never guess: no baked corner radius (the tile clips
itself, and a pre-rounded image double-rounds), and keep the bottom-left ~22%
quiet, because the FSSAI diet mark sits there.

Locked spec: square 2048×2048, product at 72% frame height with the base at 86%
down — **a Short and a Venti render to the same on-canvas height.** 85mm
equivalent, straight-on, soft key upper-left at 45°, 5500K, one 12% contact
shadow. Food gets exactly one alternate angle (35° elevated) and nothing else
changes. Two locked angles across the whole catalogue, never three.

### 6.13 Thirty-one hand-drawn cards became one component
`CLAUDE_DESIGN_PROMPT_2.md`

A design-system audit of the Figma file found the loyalty card drawn **31
separate times** and the header drawn **9 separate ways**. The fix collapsed them
into components with a structural rule:

> **Use variants only for axes that change layout.** Everything that is
> show-or-hide becomes a boolean. Everything that is swap-one-thing-for-another
> becomes an instance swap. **Variants multiply; properties don't.**

Applied: the card's edition and tier looked like two independent axes → 5 × 3 × 2
= 30 variants before booleans. Folding tier into a *nested badge* and making Gold
an *edition* gets it to **14** — and matches how loyalty cards actually behave.
A Gold-tier member who picks the Jade face should get the Jade face.

The "two different apps" the audit found in the header treatments turned out to
be **one app whose two header states had been drawn as separate objects instead
of two values of one component.**

### 6.14 Real details the original gets right, that I kept

- Birth date **locks once set** and renders `DD/MM/**` with the year masked.
- Changing your phone number **re-triggers OTP verification**.
- Tiers: Green → Gold (1,000 Stars/yr) → Reserve (5,000). Earn: 1 Star per ₹10,
  Gold ×1.2, Reserve ×1.3. Milestones at 200 / 300 / 400 / 600.
- Tier validity is a rolling 12-month window with a real expiry date on screen.

These are the details that make an account screen feel like an account rather
than a form.

---

## 7. Stack

| | |
|---|---|
| Framework | **Expo SDK 57**, React Native, New Architecture (always on, not optional) |
| Routing | **expo-router** — which since SDK 56 no longer depends on react-navigation |
| Animation | **Reanimated 4** + `react-native-worklets` (`scheduleOnRN`, not `runOnJS`) |
| Gestures | `react-native-gesture-handler`, one arena at the app root |
| Tabs | `expo-router/unstable-native-tabs` — a real `UITabBarController` |
| Maps | `@rnmapbox/maps`, Mapbox Standard style |
| Type | `@expo-google-fonts` — Urbanist, Fraunces, Bebas Neue |
| Graphics | `react-native-svg` — every card face, pattern, glyph and siren |
| Language | TypeScript, `tsc --noEmit` clean |

**Expo Go does not work here** — Mapbox needs custom native code, and Expo Go
isn't published for SDK 57 at all. Development builds only. I'm on Windows, so
iOS builds go through EAS.

---

## 8. Things I got wrong and reversed (use these — they're the credible posts)

1. **The custom tab bar.** Built it, argued for it, deleted it. (§6.6)
2. **"The menu can't wrap the tabs."** Three paragraphs of correct reasoning
   about a tree I didn't have. (§6.1)
3. **The render prop.** `FluidMenu` handed content a callback via a function
   child — which rebuilt the entire tab tree on every render, because a node can
   be memoized and a function's return value cannot.
4. **`contentInsetAdjustmentBehavior="never"`.** Exactly right for the floating
   pill. The single setting that defeats the system once the bar went native.
   One word.
5. **Double bottom padding.** The scroll container and the sheet each added their
   own; they stacked to 52pt. Air below content belongs to the surface the
   content sits on.
6. **A token brief that was incomplete.** I specified only the `base` value of
   each drink accent when each has base/deep/tint — so the generated system was
   faithfully missing 15 tokens, and the PDP hero scrim was unbuildable. Twice a
   brief omission has propagated into the file. Bad instructions produce
   confident wrong output.

---

## 9. Hard limits — what a post may NOT claim

**Read this before writing anything.**

- ❌ **No performance claims.** No "3× faster," no load times, no benchmarks.
  There is **no backend**. I have not measured the real app against mine and
  cannot. Talk about clarity, feel, and structure — never speed.
- ❌ **No adoption or engagement metrics.** No users. No A/B test. No "conversion
  improved."
- ❌ **No implication of affiliation.** Never "the new Starbucks app," never
  "redesigning for Starbucks." Always *unofficial concept study*.
- ❌ **No invented reviews.** §3.
- ❌ **No claiming unbuilt screens.** ~14 of ~34 screens exist in Figma; the tab
  screens are structural. Say "building," not "built," where that's true.
- ⚠️ **The siren is a registered trademark.** It appears in the app's card face,
  the MapPlate and the product imagery. Before any screenshot is posted publicly
  I need to decide: replace the mark in public captures, or accept the exposure.
  **This is a live decision, not a solved one.** Flag it in the first post's prep.
- ⚠️ **Product images are AI-generated** from real product photos as reference,
  as layout stand-ins. They must never be presented as Starbucks marketing
  assets.

---

## 10. Who reads these posts

Mobile engineers (React Native / Expo), product designers and design-systems
people, PMs, and recruiters — mostly India and the US. They have all used the
real app. Many have shipped something with the same problems.

**They do not need the UI explained to them.** They need to be told what is
better and why it was a decision. The screenshot does the explaining.

---

## 11. Voice

First person. Specific. Confident without being pleased with myself. Short
sentences. A real number beats an adjective every time — `3.6:1 → 5.2:1` lands
where "improved contrast" doesn't.

**Never:** "🚀 Excited to share," "Here's why that matters 👇," "Let that sink
in," "I'm humbled," a hook that is a fake question, or a wall of one-line
paragraphs pretending to be profound.

**Always:** the decision, the reason, and what it cost. Willing to say I was
wrong — §8 is the strongest material in this document precisely because it is.
