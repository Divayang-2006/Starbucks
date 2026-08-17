# Navigation — Stage 1

Decided 2026-08-11. The router is [`src/app/_layout.tsx`](../src/app/_layout.tsx); read that
file's header comment first, it is the normative version. This document is the shape and the
reasoning.

Revised 2026-08-13: the tab bar became the platform's own, every tab grew a stack, the inset
system went with it, the account menu came out of `lab/` and wrapped the tab shell, and the
gesture root moved up to the app root with it. §3 and §6 previously argued for the opposite and
say so.

---

## 1. The flow

```
        ┌─────────────┐        ┌──────────────┐        ┌──────────┐
        │ store-picker│───────▶│  membership  │───────▶│  (tabs)  │
        │   the map   │        │ login/signup │        │  the app │
        └─────────────┘        └──────────────┘        └──────────┘
           no store            store, no member       store + member
```

Two gates, in this order, because each one supplies context the next screen cannot do without:

1. **The map.** In India the menu, the ETA and the pricing are all per-store, so "which shop"
   is context for the entire catalogue. Choosing a store is not a preference to be set later —
   nothing downstream is answerable without it.
2. **Membership.** There is no sign-in/sign-up fork and no separate login screen, because the
   card *is* the account: you fill the card in and the OTP claims it. A returning member never
   sees this route.

## 2. How the gates work

The three destinations are **mutually exclusive `<Stack.Protected>` guards**, not a sequence of
pushes. The two booleans in [`src/lib/session.tsx`](../src/lib/session.tsx) partition into
exactly three states, and each maps to one screen:

| `store` | `member` | reachable screen |
|---|---|---|
| — | — | `store-picker` |
| ✓ | — | `membership` |
| ✓ | ✓ | `(tabs)` |

**No screen navigates across a gate.** A screen updates the session and the router settles on
whichever gate is now open. `selectStore()` advances you; `signOut()` drops you back to the map.
Three consequences worth having:

- there is no way to press Back into a gate you have already cleared;
- a screen never has to know what comes after it, so the map is reusable as a "change store"
  screen without a flag;
- the flow is one readable table instead of navigation calls spread across three files.

Declaration order in the Stack is load-bearing: when the focused route is guarded away the
navigator falls back to the **first** screen still in the list. The gates are declared in flow
order, and `lab/` last so a prototype can never become a fallback target.

### 2.1 Changing your store — why there are two map routes

`/change-store` is the same screen as `/store-picker`, rendered by the same component in `change`
mode, declared unguarded and presented as `fullScreenModal`. It exists because of a router
constraint rather than a preference:

**`router.push('/store-picker')` from inside the tabs is silently dropped.** expo-router returns
null for a PUSH whose name is not in `state.routeNames`, and a `Stack.Protected` whose guard is
closed removes the name from exactly that list. Once you have a store, gate one is closed — so
the route you would push is the one route you cannot reach. No error, no warning, nothing moves.

Clearing the session instead (`changeStore()`) *does* work, and was what Home used to do, but it
tears down the whole `UITabBarController` to get back to the map and drops your store the moment
you open the picker rather than when you choose. The modal keeps the store set until you actually
pick one, so backing out leaves you where you were. `changeStore()` is still declared, implemented
and handed out in the provider value of [`src/lib/session.tsx`](../src/lib/session.tsx); what it no
longer has is a call site. `signOut()` is still called, because reversing both gates at once is
exactly what it means.

Three entry points, all of which survive a tab switch: the store half of `SessionStrip` (§3.1), the
"Change" link on Home, and the Store Locator row in the account menu (§4). The menu's row survives
one more completely than either of the others — the panel is mounted above `NativeTabs` rather than
inside a tab, so a tab switch does not even rebuild the thing you tapped.

`fullScreenModal`, not `modal` — `modal` is a UIKit `pageSheet`, and this screen presents a real
`.sheet` of its own for the store list. A sheet inside a sheet has its detents bounded by the
outer card and makes dismissal ordering fragile.

## 3. Tabs — the major screens

Five tabs, in this order, per [`APP_METADATA.md` §2](APP_METADATA.md#2-information-architecture).
`NativeTabs` from `expo-router/unstable-native-tabs`, which is a real `UITabBarController`.

| Route | Tab | Trigger | SF Symbol | Screen |
|---|---|---|---|---|
| `/` | Home | `(home)` | `house` / `house.fill` | The module stack from `APP_METADATA.md` §6 |
| `/gift` | Gift | `gift` | `gift` / `gift.fill` | Gift-card catalogue |
| `/order` | Order | `order` | `cup.and.saucer` / `.fill` | Menu browse for the chosen store |
| `/pay` | Pay | `pay` | `creditcard` / `creditcard.fill` | Starbucks Pay card, balance, scan |
| `/rewards` | Rewards | `rewards` | `star` / `star.fill` | Stars balance and the tier ladder |

**This section used to argue the opposite** — a floating dark pill drawn with `js-tabs` and a
custom `tabBar`, on the grounds that native chrome is not ours to restyle. That was a real
preference bought at a price nobody had costed: the pill had no scroll-edge behaviour, no
minimize, no state restoration, no VoiceOver rotor, and a `TAB_BAR_HEIGHT` constant that every
screen in the app had to know about. What the pill was actually for — a bar that floats clear
of the content rather than being welded to the edge — iOS 26 now does itself, with
`minimizeBehavior="onScrollDown"`: the bar collapses to a pill on the way into content and
expands on the way back up. We were hand-rolling a worse copy of a system behaviour.

What we set, and what we deliberately do not:

| Property | Set? | Why |
|---|---|---|
| `tintColor` | ✓ `Action.primary` | The selected-item tint. Lands on every iOS version |
| `minimizeBehavior` | ✓ `onScrollDown` | The floating-pill feel, done by the compositor |
| Icons | ✓ SF Symbols, filled when selected | The UITabBar convention; typechecked by `sf-symbols-typescript` |
| `backgroundColor`, `blurEffect`, `shadowColor`, `disableTransparentOnScrollEdge` | ✗ | iOS 26 Liquid Glass derives the bar's appearance from the content scrolling under it and discards all four. A prop the platform throws away still reads like a decision |
| `labelStyle` | ✗ | System type. A tab bar set in Urbanist is a pill again |

Two consequences worth writing down:

- **Five is the ceiling, not the current count.** Android's Material bottom navigation caps at
  five. A sixth tab does not shrink the others, it produces an overflow that looks like nothing
  else in the app. Anything that wants to be a tab has to displace one of these.
- **`Glyph` is unaffected.** [`DESIGN_SYSTEM.md` §5](DESIGN_SYSTEM.md) chose a hand-drawn SVG set
  over SF Symbols partly because the tab bar would otherwise need two code paths. The tab bar is
  no longer ours to draw, so that trade-off no longer applies *to the tab bar* — and applies
  everywhere else exactly as before. `Glyph` remains the source of every in-screen icon.

**Account is not a tab.** It is reached from the avatar in the Home header and nowhere else,
which is what the reference app does — and it is why the slide-out panel wrapped around this
whole shell (§4 for where it mounts, §6 for the argument it settled) matters as much as it does:
that panel is the entire entrance to everything outside these five.

Each tab screen is currently a structural placeholder: real chrome, real section titles, real
shapes, no finished content.

### 3.1 The bottom accessory

`<NativeTabs.BottomAccessory>` holds [`SessionStrip`](../src/components/accessory) — Stars
balance and the chosen store's name on one line, and two independent targets rather than one: the
Stars half opens `/rewards`, the store half opens `/change-store`. The store half is there because
this strip is the one place "which store am I ordering from" is on screen in all five tabs, which
makes it the one sensible place to change it from.

It is the only chrome in the app that survives a tab switch. An accessory belongs to the tab
*controller*, not to a tab, so it is mounted once and never torn down; everything else on screen
is rebuilt when you change tab. That is the whole reason it exists — it is what makes five
screens read as one surface rather than five.

Two rules it has to obey, both of which look like bugs when broken:

- **It renders twice**, once per placement, as two React trees that share nothing. So it holds no
  state of its own; everything it shows comes from `useSession()`, which is above both copies.
- **`NativeTabs.BottomAccessory.usePlacement()`** distinguishes them. `inline` is what you get
  once the bar has minimized and there is half the width: same facts, less furniture.

iOS 26 and up. Below that `react-native-screens` never mounts the subtree, and Android and web
drop non-trigger children entirely, so it degrades to nothing rather than to a crash.

## 4. Inside a tab — the stacks

Each tab is a folder with its own native `Stack`, so a detail screen pushes *inside* the tab it
belongs to and the bar stays where it is.

```
src/app/
├─ _layout.tsx              the gates from §2, the gesture root, and root modals
├─ store-picker.tsx         gate one
├─ membership.tsx           gate two
├─ change-store.tsx         the same map, unguarded, as a modal — §2.1
├─ lab/fluid-menu.tsx       §6
└─ (tabs)/
   ├─ _layout.tsx           FluidMenu → AppMenuProvider → NativeTabs, and the accessory
   ├─ (home)/               "/"          _layout.tsx + index.tsx
   ├─ gift/                 "/gift"      _layout.tsx + index.tsx
   ├─ order/                "/order"     _layout.tsx + index.tsx
   ├─ pay/                  "/pay"       _layout.tsx + index.tsx
   └─ rewards/              "/rewards"   _layout.tsx + index.tsx
```

Home is the group `(home)` rather than a path segment so it still answers `/` while owning a
stack like the other four. Trigger names follow the folders: `(home)`, `gift`, `order`, `pay`,
`rewards`.

`(tabs)/_layout.tsx` is also where the account menu mounts. `FluidMenu` takes the whole tab tree as
its children, so the card that scales down and slides right carries the live tab bar with it, and
the provider it wraps around those children carries `openMenu` down past the tab controller and
Home's stack to the `AvatarButton` in Home's header — a navigator is not something you thread a
prop through. The left-edge pan that opens it is armed only on Home standing at its stack root,
which the layout passes in as `gestureEnabled`; §6 is the argument that put the wrapper here rather
than around the root.

[`src/app/_layout.tsx`](../src/app/_layout.tsx) mounts `GestureHandlerRootView` as its outermost
element, outside both the theme and the session, because it is neither: it is the arena every
gesture in the app is resolved in, and a handler mounted outside it silently never fires.

Every per-tab layout is the default `Stack` from `expo-router`, which is already the native one
— **not** `expo-router/js-stack`, and never `@react-navigation/*`, which SDK 56 dropped as a
dependency. `headerShown: false` at the group level, because every screen draws its own
`ScreenHeader` band and that band owns the status bar.

**Where each pending screen goes.** The distinction is whether the screen should cover the tab
bar, and it is not a matter of taste — a screen that asks you to commit should not leave a live
tab bar underneath it.

| Screen | Where | Why |
|---|---|---|
| PDP, category listing | `order/` stack | Browse to detail. The bar should stay |
| Gift-card detail and its steps | `gift/` stack | Same |
| Transaction history, add money | `pay/` stack | Same |
| Reward detail, Stars activity, tier explainer | `rewards/` stack | Same |
| Cart | root Stack, `presentation: 'modal'` | Covers the bar. You are checking out, not browsing |
| Scan | root Stack, `presentation: 'modal'` | Full-screen interruption |
| The Account stack | root Stack, `presentation: 'modal'` | Not a tab (§3); a modal stack over all five |

No stubs exist for the modal three yet — the root Stack's screen list stays honest about what is
actually in the tree.

## 5. Content insets

Nothing reserves space for the tab bar by adding numbers together any more.

The old model was manual and had to be: the pill was absolutely positioned, so `TAB_BAR_HEIGHT`
plus the home indicator plus a gap was a number every scroller had to remember. All three are
gone. UIKit folds the tab bar *and* the home indicator under it into the screen's own safe area,
and the iOS 26 bar changes height as it minimizes — so a constant is not merely redundant, it is
wrong for most of the scroll.

[`src/components/chrome/insets.ts`](../src/components/chrome/insets.ts) is now the only place
that knows about screen chrome geometry, and it computes nothing:

| Export | For |
|---|---|
| `useTopInset()` | The status bar the header band paints behind |
| `useHeaderInset()` | The whole height of a `headerTransparent` native header, which the two map routes run their map underneath. Zero where there is no header, so a caller may ask unconditionally |
| `useBottomChromeInset()` | Tab bar and home indicator, as the one number UIKit reports for the pair |
| `<BottomChrome>` | Reserving that space around content that does not scroll, natively |

`BottomChrome` wraps the `SafeAreaView` from `react-native-screens/experimental` rather than
padding by a measured number, because it re-lays out on the same frame the bar does; a JS
measurement arrives a frame or two late and the last row visibly hops as the bar minimizes. Its
`insetType` prop is Android-only, defaulting to `all`.

**Scrolling screens want none of it.** `NativeTabs` turns on automatic content-inset adjustment
for the *first nested `ScrollView`* of every tab screen, which is why
[`screen-scroll.tsx`](../src/components/chrome/screen-scroll.tsx) sets
`contentInsetAdjustmentBehavior="automatic"` where it used to set `"never"`. That one word was
correct for the floating pill and is the single setting that defeats the system now. It cancels
only the *top* half of the adjustment, with a negative `contentInset.top`, because the header
band paints behind the status bar and pads for it itself.

Two rules that bite:

- the `ScrollView` must be the screen's **first descendant**. Returning `<ScreenScroll>` as the
  screen's root satisfies that; a wrapper needs `collapsable={false}` or the chain breaks and you
  silently lose the inset, scroll-to-top and minimize-on-scroll with it.
- `FlatList` is only partly supported — no scroll-to-top, no minimize-on-scroll.

## 6. `lab/` — harnesses

Routes outside the flow guards, declared last in the root Stack so one can never become a fallback
target when a gate closes.

**The premise of this section used to be adoption.** A mechanism lived here while it was being
tuned and left when it shipped, which made `lab/` a waiting room. The one entry has now shipped and
is still here, so that reading does not survive its only example. What the guards actually buy is
**opening cold**: a route outside them needs no store chosen and no membership claimed, so it is
one reload away at any moment. The shipped account menu is behind both gates by construction — you
cannot reach it without walking the map and filling in the card first — and a motion you are tuning
is a motion you want to see thirty times in a row.

| Route | What |
|---|---|
| `/lab/fluid-menu` | A `StageMock` harness for the account menu's motion, not the menu itself. The mechanism is [`src/components/fluid-menu/`](../src/components/fluid-menu) and it ships wrapped around the tab shell (§4) |

`StageMock` is assembled from the same shared components Home is, so what shrinks in the harness is
what shrinks in the app. The one thing it draws for itself is the tab pill, because the real bar is
a `UITabBarController` this route is not inside — and a card with no bar in it does not look like
the app. Its rows echo their label into the sheet rather than navigating, which stays right: the
destinations belong to the layout that mounts the real menu. It does take `openMenu` from
`useAppMenu()` rather than passing it down the one component that would do, so the seam next to the
motion is exercised by the same route that tunes the motion.

`gestureEnabled` is left at its default here, because a harness of one screen has nothing for a
left-edge drag to collide with. Reached from inside the app, though, this route is pushed **over**
the tab shell rather than instead of it, so two `FluidMenu`s are alive at once — two panels and two
pans, in the single gesture arena at the app root. What stops them arbitrating for the same drag is
that the shell's copy is disarmed: `HOME_ROOT` compares the whole focused path, and this route's
segments are not Home's. The dependency therefore runs backwards, from the shell's route test into
this harness, which is worth knowing before anyone loosens that test.

**This section used to say the menu had nowhere to go.** The claim was that `FluidMenu` could not
move into `(tabs)/_layout.tsx` and wrap the tabs — `NativeTabs` accepts triggers and an accessory
as children rather than an arbitrary wrapper, and a JS view cannot slide a `UITabBarController`
sideways — so the mechanism would have to wrap the root instead, or become the modal Account stack
from §4 and give up the slide. That was a careful reading of a real platform rule, and the rule is
worth knowing: `NativeTabs` does discard children it does not recognise. The price of applying it
here was paid in this document rather than in the code, and it was three things: an open item that
posed a choice between two options, neither of which was ever taken; a finished mechanism parked in
`lab/` where nothing in the app could open it; and a closing judgement on that item — "the one
place the native tab bar cost us something" — which is now exactly inverted, the bar being the
thing the card carries. §7 no longer lists that item; this paragraph is where it went.

The obstacle was a category error. `FluidMenu` is not a child of `NativeTabs` — `NativeTabs` is a
child of `FluidMenu` — so a rule about what a tab navigator accepts as children never applied to
it in either direction. And the `UITabBarController` does slide: it is a view controller's view
inside a transformed `Animated.View` like any other. Carrying the live bar inside the card is now
the deliberate reading of the effect rather than a compromise, because the thing being set aside is
*the app*, and an app is five tabs plus the bar that switches between them — a bar left standing
while the screen above it slid away would say the menu is another screen. That is the old
position's own terms: it wanted the panel to read as a layer underneath the app rather than a
screen beside it, and only the wrapper delivers that. `StageMock` has drawn a mock tab pill inside
the card since the first prototype frame for exactly this reason, so the picture the harness was
tuned against was always the one the shipped version now draws.

Neither predicted fallback happened. It did not wrap the root, and it did not become a modal stack.
The constraint was real; it just applied to a tree we did not have.

## 7. Open items

- **The Account stack, four rows short.** Five of the menu's nine rows now navigate: Starbucks Pay
  to `/pay`, Gift Cards to `/gift`, Rewards & Stars to `/rewards`, Store Locator to
  `/change-store`, and Log Out calls `signOut()`, which reverses both gates and lands you on the
  map. The other four — **Profile**, **Beverage Subscription**, **Coffee Stories** and **Help &
  Support** — have nothing to point at and warn in a dev build instead. They are what the root
  modal stack in §4 is for; which screens that stack contains is the part still open.
  `MENU_ROUTES` in [`src/app/(tabs)/_layout.tsx`](../src/app/(tabs)/_layout.tsx) writes all four in
  as `null` and sends its reader to this bullet, so the two have to agree.
- **Session is in-memory.** Deliberate — see the header comment in `session.tsx`. A reload puts
  you back on the map. Persistence goes behind the `hydrated` flag that already exists.
- **Unverified on device — the inset model.** Everything in §5 is read off the
  `react-native-screens` sources and the native-tabs docs; none of it has been run on an iOS 26
  device or simulator. Specifically: whether the safe-area bottom inset tracks the bar as it
  minimizes, and whether the negative top `contentInset` in `screen-scroll.tsx` nets to exactly
  zero rather than a point or two off.
- **Unverified on device — the tab bar inside the card.** Everything here follows from putting a
  live `UITabBarController` inside a scaled, clipped, shadow-casting view, and none of it can be
  judged from source. In the order they matter:
  - whether `pointerEvents="none"` on the card actually stops the native bar taking taps. Test
    this one first: if UIKit's hit-testing does not reach the prop, there is no JS-side fix and the
    shape of the wrapper is back open.
  - whether Liquid Glass still samples its backdrop correctly through a `CATransform3D` scale.
  - what `minimizeBehavior="onScrollDown"` does while the card is partly slid.
  - whether `NativeTabs.BottomAccessory` lays out, and `usePlacement()` still reports, inside the
    transformed card.
  - whether `overflow: 'hidden'` clips a child view controller to the 24pt corner, or only clips
    its React siblings.
