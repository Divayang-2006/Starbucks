# Components — the shared inventory

Decided 2026-08-13. This is the catalogue every screen shops from. It exists so that the
answer to "I need a row with a thumbnail and a price" is a lookup, not a new file.

Read [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for the tokens and [`NAVIGATION.md`](NAVIGATION.md)
for the route tree. This document is the layer in between: the things screens are made of.

---

## 0. Why this document exists

An audit of the five tab screens, written over about a week, found the same shapes rebuilt
locally each time:

- the `sheet` / `section` / `gutter` StyleSheet triple copy-pasted **six times** — and one of
  the six quietly using a different gap, so Order's rhythm is 12pt tighter than every other
  screen and nobody noticed;
- **four** CTA buttons, at two different heights, for one visual control;
- **three** "pick one of N" controls;
- **three** treatments of the same in-card text link, when the canonical one already existed
  in `section-header.tsx`;
- the header's caps-kicker rule pasted verbatim into three screens;
- a product *tile* and a product *row* that are one object in two orientations;
- four different corner radii on the same placeholder primitive.

None of that is carelessness. It is what happens when the shared layer is thinner than the
screens need, because writing thirty lines locally is always cheaper *this once* than finding
the right abstraction. The fix is to make the shared layer thick enough that reaching for it is
the lazy option.

### The continuity argument

The reason to care is not tidiness. It is that **a component that is shared across two screens
does not have to be rebuilt when you move between them**, and one that is rebuilt is one that
can flicker, reflow, or land two points off. Five screens that each hand-roll their header band
will drift apart by a few points, and a tab switch then reads as a jump rather than a cut.

So the components below are ranked by how much continuity they buy, and the layering is
deliberate:

| Layer | Lifetime | What it buys |
|---|---|---|
| 5 — continuity chrome | never unmounts | the app reads as one surface |
| 1 — screen skeleton | remounts, identical geometry | tab switches cut cleanly |
| 2–4 — content | remounts, identical shapes | a row is a row everywhere |
| 0 — tokens | compile time | nothing drifts |

---

## 1. Status key

| Mark | Meaning |
|---|---|
| **have** | Shipped. |
| **next** | Reserved. Named here so nobody invents a second one under a different name. |

Anything marked **next** has a name already. Use that name when you build it.

### Layering

```
chrome  ←  controls  ←  brand
```

Imports point one way only. Chrome knows about layout, surfaces and the icon set, and nothing
about buttons, prices or Stars. Controls may use chrome and must not know about coffee. Brand
may use both and neither may use it.

A **slot** is how a lower layer accepts something from a higher one: `EmptyState` takes an
`action` node rather than importing `Button`. If you find yourself wanting an upward import,
you want a slot.

The test for whether something belongs in `brand/` is whether its props mention a Star, a
rupee, a store, a tier or a member. `PriceTag` does. `Button` does not, even though every price
in the app ends up next to one.

> **One name collides.** `Gutter` from `@/components/chrome` is the component that insets its
> children; `Gutter` from `@/theme` is the number it insets them by. A file needing both
> imports the token as `Gutter as GutterWidth`.

---

## Layer 0 — Tokens · `@/theme`

Not components. The vocabulary everything else is written in. Import from `@/theme`, never
from the files inside it.

| Token group | Status | Notes |
|---|---|---|
| `Surface` `TextColor` `Border` `Action` `Accent` `Status` `Diet` `Tier` `CategoryAccent` | have | `colors.ts`. Two layers — raw `Brand` values are private, screens read the semantic groups. |
| `Elevation` | have | Green-tinted shadows, never neutral black. |
| `Space` `Gutter` `Radius` `Sizes` | have | 4pt scale. |
| `Type` `TextStyles` | have | Never set `fontWeight` next to a `Type` family — the files are single-weight and the platform will synthesise. |
| `Duration` `Ease` `Spring` `Pressed` | have | `motion.ts`. The instincts were already in the codebase as comments — the tab bar's `{ 460, 0.74 }` "arrives with a settle rather than a stop" is now `Spring.travel`. Reanimated 4: `scheduleOnRN` from `react-native-worklets`, never `runOnJS`. The two spring parameterisations are mutually exclusive; don't mix them. |
| `RailCard` `IconSize` `Stroke` | have | `layout.ts`. Rail widths compact 168 / standard 236 / feature 268; glyph sizes 16–22; stroke weights 1.6 / 1.8 / 2.2. Plus `Sizes.inlineControl` (30), `markDisc` (56), `categoryDisc` (72), `trackHeight`, `dot`. Named by role, not by number. |
| `Surface.onDarkFill` | have | `rgba(255,255,255,0.14)`, previously inlined in two screens. Sits beside `Border.hairOnDark`. |
| `Sizes.tabBarHeight` | **gone** | Deleted. The native bar has no fixed height — it minimizes on scroll. Nothing may reintroduce it. |

**Rule.** If a value has a token, use the token. If it does not and you need it twice, add the
token — do not inline it the second time.

---

## Layer 1 — Screen skeleton · `@/components/chrome`

The alignment layer. Every route's first three lines come from here, which is what makes five
screens start at the same pixel.

| Component | Status | Props | What it is |
|---|---|---|---|
| `Screen` | have | `tone` `scroll` `footer` `contentContainerStyle` | The single root every route renders. Owns the app background, the `StatusBar`, and the `collapsable={false}` rule the native tab bar requires. `footer` renders inside `BottomChrome`, measured there so the safe-area part isn't counted twice against the automatic inset. |
| `ScreenHeader` | have | `title` `kicker` `tone` `left` `right` `backdrop` `sheetBelow` | The header band. One component rather than a header per tab, because the band owns the status bar — the moment two screens each pad for `insets.top` themselves, they drift. Also exports `CapsKicker`, `HeaderButton`, `AvatarButton`. |
| `ScreenScroll` | have | `contentContainerStyle` | The scroll container, rebuilt around native content insets. See the insets note below — do not "fix" its `contentInsetAdjustmentBehavior`. |
| `Section` / `Gutter` | have | `title` `kicker` `action` `onAction` `tone` `gutter` `gap` | Kills the six copy-pasted rules. `Section` is the gap block and renders its own `SectionHeader`; `Gutter` is the horizontal inset. |
| `SectionHeader` | have | `title` `kicker` `action` `tone` `gutter` | Also exports `TextAction`, the canonical in-card link with an `inverse` tone. The three local variants were the mistake, not it. |
| `Sheet` | have | `gap` | The 28pt-radius white sheet riding over the green band. **It owns the bottom air** — `ScreenScroll` used to add its own and the two stacked to 52pt. Air below content is the business of the surface the content sits on, and every screen ends its scroll in a `Sheet`. Tab-bar clearance is a content inset now, not padding. |
| `Divider` | have | `tone` `orientation` `length` `inset` | One hairline. `Border.strong` is a card outline and is not a separator. |
| `ActionBar` | have | `children` `summary` `tone` `standalone` | The sticky bottom bar — Add to Cart, Pay, Continue. |
| `EmptyState` | have | `title` `body` `glyph` `mark` `action` `tone` | Takes an `action` **node**, not a label — that is the slot rule. |
| `Stat` / `StatStrip` | have | `label` `value` `tone` | The 3-up cells in Home's header. `StatStrip` interleaves the dividers. |
| `useTopInset` `useHeaderInset` `useBottomChromeInset` `BottomChrome` | have | — | The only module that knows chrome geometry. Its rule is **ask, never compute**: nothing in it adds one number to another. `useHeaderInset` is the whole height of a transparent native header, and 0 where there is no header, so the two map routes can ask unconditionally. Replaces the hand-rolled `useTabBarInset`. |
| `KeyboardScreen` | next | | `Screen` for forms — membership, search, address entry. |

> **Insets, in one paragraph.** `NativeTabs` mounts a fresh `SafeAreaProvider` inside every tab
> screen, so `useSafeAreaInsets().bottom` already contains the tab bar *and* the home indicator —
> one number for the pair, and adding them double-counts. A scrolling screen needs none of it:
> iOS insets the first nested ScrollView itself. `ScreenScroll` therefore runs
> `contentInsetAdjustmentBehavior="automatic"` with a negative top `contentInset` cancelling the
> half we own, because `ScreenHeader` paints its band behind the status bar and pads for it. That
> bargain is load-bearing and documented in the file; leave it alone.
>
> **No screen calls `useSafeAreaInsets()` directly.**
>
> **`MenuPanel` calls it, and a panel is not a screen.** The account menu's panel is a direct
> caller now mounted in the real app, and it has to be: it lies *under* the app card rather than
> inside it, so nothing above it has already paid for the status bar. It is also the other half of
> the scale-versus-insets argument. Scale is a transform, so the shrunken card still measures a
> whole screen and still reports full-size insets, and that is the effect rather than a bug — you
> are looking at the app held at arm's length, not at a narrower app. Anything that "corrects" the
> insets to the visible size makes the card reflow mid-drag, which is the one thing that mechanism
> must never do.

---

## Layer 2 — Content chrome · `@/components/chrome`

| Component | Status | Props | What it is |
|---|---|---|---|
| `Card` | have | `onPress` | The white raised block. |
| `ListRow` | have | `title` `kicker` `kickerStyle` `subtitle` `leading` `trailing` `children` `chevron` `divided` `tone` `destructive` `surface` `align: center\|top\|stretch` `inset` `onPress` | **The single biggest dedupe win.** It is the payment-mode list, order history, transactions, tier benefits, store results and the gift-card row — all of it. It is **not** the account menu: that is `fluid-menu/MenuRow.tsx`, a bespoke row which never imports this one, because each row's entrance there is a pure function of the menu's shared `progress` value and its own index. A row animated from outside per index is a different object from a row you compose, and now that the menu has shipped this is a deliberate exception rather than a gap. `children` renders under the text stack, which is what lets a product row be a `ListRow`. `kickerStyle="micro"` for a kicker that is data rather than a label — `354 ml` must not become `354 ML`. `align="stretch"` for a leading slot that spans the row, e.g. a timeline connector. |
| `ListSection` | have | `title` `kicker` `action` `tone` `gutter` | Grouped rows on one card with internal separators. One screen used to cancel `Card`'s padding to fake this and another solved it a third way. |
| `Rail` | have | `snap` `itemWidth` `gap` `gutter` | Horizontal scroller with one gutter, peek and snap. `PlaceholderRail` is now this. |
| `Grid` | have | `columns` `gap` `gutter` | n-up wrap with consistent gaps. Replaced a `flexBasis: '48%'`. |
| `Tile` | have | `title` `media` `badge` `sub` `footer` `action` `width` `onPress` | Image head · title · sub · action. Was three near-identical variants — article card, gift card, reward card. |
| `PlaceholderBlock` | have | `radius` `height` | Structural stand-in. Its header carries the four-radius table that prompted the cleanup. |
| `Chip` / `ChipRow` | have | `tone: default\|gold\|success` `size: md\|sm` `onPress`; row adds `onSelect` `scroll` `gutter` `style` | `sm` is the status badge a screen used to hand-roll. `success` uses `Action.selected`, not `Status.success`, which is only ~4.3:1 on mint. Chrome rather than a control because half of it is not one — a badge states a fact, ignores `selected` and is not pressable, and where it usually lands is `Tile`'s `badge` slot. |
| `DietMark` | have | `veg` `size` | The FSSAI veg/non-veg indicator, mandatory on every consumable. Its two colours are regulated: do not restyle them to fit a category accent. Chrome rather than brand because its props name no Star, rupee, store, tier or member — every food app in India draws this square. |
| `Glyph` | have | `id` `size` `color` `strokeWidth` | The hand-drawn SVG set, one drawing language, for every in-screen icon. It has to be chrome: `EmptyState` and `ListRow` both draw glyphs, and a chrome component reaching up into brand for an icon is the one import the layering forbids. The tab bar uses SF Symbols instead, which is not a defeat for this set — a `UITabBar` wants real symbols. |
| `Accordion` | next | | PDP customisation groups. |
| `Carousel` | next | | Paged hero with dots. Distinct from `Rail`, which is a free scroller. |

> `ListSection` and `StatStrip` clone `divided`/`tone` onto **direct** children. A wrapper
> `<View>` around the rows silently breaks the separators.

> **Three of these are not containers**, which is why this layer is glossed by its barrel rather
> than by a shape. `Chip`, `DietMark` and `Glyph` are chrome for the reason written into each row,
> and the last one is simply the layering line in §1 read literally: chrome owns layout, surfaces
> **and the icon set**. All three were filed under the wrong layer here, pointing at barrels that
> do not export them, until the tables were checked against `chrome/index.ts`, `controls/index.ts`
> and `brand/index.ts`. The code was right throughout.

---

## Layer 3 — Controls · `@/components/controls`

| Component | Status | Props | What it is |
|---|---|---|---|
| `Button` | have | `label` `variant` `size` `glyph` `full` `disabled` `loading` `onPress` | The one that replaced all four CTAs. `primary \| secondary \| inverse \| ghost \| destructive` × `sm` (36) / `md` (52). Hugs by default; `full` is opt-in. Primary darkens on press rather than dimming — opacity on green over cream *lightens* it, which is the disabled signal. |
| `IconButton` | have | `glyph` `label` `size` `iconSize` `strokeWidth` `tone` | Circular. Hit-slop is `(Sizes.tap − size)/2`, so a 30pt button still has a 44pt target. Glyph size and stroke default from the diameter. |
| `Segmented` | have | `items` `selectedIndex` `onChange` `scroll` `gutter` | The underlined "pick one of N". Its header carries the table for **Segmented partitions, ChipRow filters** — three controls for one job is exactly what caused this document. |
| `Stepper` | have | `value` `onChange` `min` `max` `size` `label` | Quantity −/+. |
| `Field` / `SearchField` | have | `label` `error` `hint` `trailing` + `TextInput` subset; search adds `onPress` `gutter` | `SearchField`'s `onPress` makes it an actual button, which the hand-rolled version wasn't. |
| `Toggle` | next | | Wrap `@expo/ui`'s native Switch rather than drawing one. |
| `OtpInput` | have | | In `onboarding/`. Promote when a second consumer appears. |
| `PrimaryButton` | have | | In `onboarding/`. Superseded by `Button`; migrate the membership flow when it is next touched, not before. |

> `Button` vs `TextAction`: a word you tap is not a button, and giving it a height makes every
> card look like a form.

> **`Chip` / `ChipRow` used to be listed here**, as controls out of `@/components/controls`. They
> are chrome — `chrome/chip.tsx`, exported from `@/components/chrome` — and a chip is a control
> only half the time anyway. See Layer 2. `Segmented` above is the one to weigh a `ChipRow`
> against: the note in `segmented.tsx` is where that choice is written down.

---

## Layer 4 — Brand & domain · `@/components/brand`

Starbucks-specific. Generic enough to reuse, specific enough that they do not belong in chrome.

| Component | Status | Props | What it is |
|---|---|---|---|
| `StarBalance` | have | `stars` `size` `tone` `unit` | Gold star mark + number. Home header, Rewards hero, Pay, and the tab bar's bottom accessory. |
| `Balance` | have | `kicker` `value` `unit` `tone` `align` | Caps kicker + display number. Pay and Rewards built this twice. |
| `ProgressTrack` | have | `value` (0–1, clamped) `tone` `color` `height` `label` | Generic bar. The tier gauge and order progress both sit on it. |
| `PriceTag` | have | `amount` `was` `from` `size` `tone` `paise` | `₹535.50`, with strikethrough and "from" variants. |
| `ProductThumb` | have | `image` `veg` `size` `fill` `radius` `label` | The square, with the `DietMark` overlay and a fallback. |
| `ProductCard` | have | `name` `meta` `price` `was` `from` `veg` `image` `variant: tile\|row` `width` `onAdd` `trailing` | The product object in both orientations from one component. |
| `Avatar` | have | `name` `initials` `image` `size` `tier` | Initials fallback, optional tier ring. |
| `StoreRow` | have | `name` `area` `city` `distanceKm` `etaMins` `isOpen` `kicker` `tone` `display` `onChange` | Two screens built this with divergent copy. Kicker defaults to "Collecting from"; meta is `{area} · ready in {n} mins`, because a bare number doesn't say what it counts. |
| `SirenLogo` | have | | In `onboarding/`. Promote — Home's header already uses it. |
| `LoyaltyCard` · `CardFace` · `CardFront` · `CardBack` · `HoloTilt` · `CardPattern` | have | | In `onboarding/`. Promote to `@/components/card/`: membership, Pay, Account and the widget all want them. |
| `TierLadder` | next | | The Rewards tier ladder, on `ProgressTrack`. |
| `QrCode` | next | | Pay's scan code. |
| `Skeleton` | next | | `PlaceholderBlock` with shimmer, for when data is real. |
| `Receipt` | next | | Order confirmation and transaction detail. |

> **`DietMark` and `Glyph` used to be listed here**, out of `@/components/brand`. Both are chrome —
> `chrome/diet-mark.tsx` and `chrome/glyphs.tsx`, exported from `@/components/chrome` — and the
> second contradicted the layering rule in §1 outright, which gives chrome the icon set by name.
> See Layer 2 for both, and note that `ProductThumb` above overlays a `DietMark` the correct way
> round: brand importing chrome, never the reverse.

Not a component: **`src/lib/format.ts`** — `formatRupees(amount, { paise })` and
`formatIndianNumber(value)`, with hand-rolled lakh/crore grouping. Formatting is a function, and
wrapping it in a `<Text>` is how you end up unable to put a price in a label.

---

## Layer 5 — Continuity chrome

The reason the whole exercise pays off. These live **above** the screens, so a tab change does
not unmount them. Everything else on screen tears down and rebuilds; these do not, which is
what makes the app feel like one surface instead of five.

| Component | Status | What it is |
|---|---|---|
| `SessionStrip` · `@/components/accessory` | have | The `NativeTabs.BottomAccessory` (iOS 26+). Star balance and the chosen store, persistent across all five tabs, and two targets rather than one: the Stars half routes to `/rewards`, the store half to `/change-store`. Renders **twice** — once per placement, switched by `NativeTabs.BottomAccessory.usePlacement()` — and the two copies do not share state, so its state comes from session context and it contains no `useState`. Degrades to nothing below iOS 26 and on Android/web, because those paths never mount non-trigger children; the guard is structural, not a version check. |
| `FluidMenu` · `@/components/fluid-menu` | have | The slide-out account menu, wrapped around the whole tab shell in `(tabs)/_layout.tsx`. It takes the app as plain `children` — a node, not a render prop — and mounts its own `AppMenuProvider` around them, so a consumer cannot end up holding the panel without the hook that opens it. It owns one shared value, `progress`, which every part of the motion reads: the card's shift, scale and corner, the scrim, the two round controls and each row's staggered entrance. It also owns the left-edge pan that writes `progress` directly, which is the word fluid — stop halfway and it holds halfway. The app narrows that pan to Home standing at its stack root by passing `gestureEnabled`, because a pushed screen owns the left edge already and the other four tabs are horizontal rails; the lab harness leaves the prop at its default. Dismissal is the component's own job on every path, so no caller has to remember it. |
| `AppMenuProvider` / `useAppMenu` · `fluid-menu/AppMenuContext.tsx` | have | The seam that carries `openMenu` from the layout owning the panel down to Home's `AvatarButton`, past a tab controller and a stack — a navigator is not something you thread a prop through. One callback and nothing else, deliberately: `progress` stays inside `FluidMenu` because anything reading a shared value from React re-renders once a frame, and there is no `closeMenu` because a caller that can close the panel is a caller that can leave it half-closed. The hook throws rather than handing back `undefined`, naming the file that mounts the provider, so a button placed outside it fails at render instead of shipping as a dead control. |
| `LinkPreviewCard` | next | Standard content for `Link.Preview`, so every long-press peek looks like the same app. expo-router gives us `Link.Trigger` / `Link.Preview` / `Link.Menu` for free; the cost of not standardising is five different peeks. |
| `HeroContext` | next | Carries "the card the user tapped" and its measured frame, so a pushed screen can open at the same geometry. This is the manual answer to shared-element transitions — Reanimated 4 dropped them and `react-native-screens` 4.26 exposes no zoom presentation, so continuity here has to be built, not configured. |

---

## 2. Rules

1. **Look here first.** If a shape is in this table, use it. If it is marked **next**, build it
   under that name.
2. **Two occurrences is the threshold.** The first time a shape appears, write it locally. The
   second time, extract it and add a row here. Do not extract on the first — speculative
   components are worse than duplicated ones.
3. **Screens compose, they do not style.** A tab screen should be a list of components and
   data. A `StyleSheet` block longer than about thirty lines in a screen file means something
   in it belongs here.
4. **No screen reads `useSafeAreaInsets()` directly.** Insets come from `Screen` and the
   `insets` module. This is the rule the header band exists to enforce, and it now holds with no
   exceptions: `store-picker` used to be the one screen that broke it and no longer does — it asks
   `useHeaderInset()` and `useBottomChromeInset()` instead, which is what a full-bleed map under a
   transparent header needed all along. The two direct callers left are components rather than
   routes: `MenuPanel`, which lies underneath the screens rather than being one (see the insets
   note in Layer 1), and `OnboardingFlow`, which owns its own safe area and keyboard avoidance and
   is the stated reason `membership.tsx` does not wrap itself in `Screen`.
5. **New primitives go in the barrel.** Import from `@/components/chrome`, not from the file,
   so a component can be split or renamed without touching call sites.
6. **When two screens disagree, pick one and write down why.** Order's tighter sheet gap and
   the two different "no store yet" strings are both drift that survived because nobody had to
   choose out loud.

---

## 3. Known gaps

Real limits found while putting the screens onto this layer. None is urgent; all are recorded
so the next person hits a note instead of a surprise.

| Gap | Where it bites |
|---|---|
| `Tile` always puts the badge below the media and left-aligns `action`. | Rewards wanted the badge above the artwork and "Details" centred; it took the position the component offered. |
| `Button`'s `full` is `alignSelf: 'stretch'`, a cross-axis rule. | An equal-width pair in a row still needs `flex: 1` passed via `style`. Pay does this. |
| `StoreRow` can only suppress its kicker with `kicker=""`, which works on a falsy check. | Order, whose band already says "Ordering from". |
| `Rail`'s `snap` is off on the uniform rails. | Deliberate — a behaviour change, cheap to flip once someone judges it on a device. |
| `src/components/store-picker/` still has its own buttons and rows. | `ConfirmButton`, `StoreList`, `StoreDetail` predate this layer and were left alone. |
| `onboarding/`'s `PrimaryButton` and `OtpInput` are not yet `Button` / `controls`. | Deliberate; migrate when the membership flow is next touched. |
| `MenuBackdrop` is mounted for the app's lifetime — two full-screen SVG gradients behind every screen, even with the menu shut. | Considered and left alone: gating the mount needs a "not fully closed" flag that must go true on gesture *begin*, and that costs more state and more re-renders every frame of a drag than two static `Rect`s cost standing still. The card in front of them is opaque, so nothing is composited through. Recorded as a known gap rather than a bug. |
