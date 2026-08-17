# Routing map

Where every screen lives, and the rule that decides it. This is the file to read
before adding a route — the point is that placement is decided once, here, rather
than argued per screen.

Companion to [`SCREEN_MAP.md`](SCREEN_MAP.md), which says what each screen is
*for*. This one says where it *goes*.

---

## 0. The conflict, resolved

Three sources currently disagree about the tab bar. Naming it so nobody
rediscovers it:

| Source | Says | Status |
|---|---|---|
| `src/app/(tabs)/_layout.tsx` | **Five** native tabs — Home · Gift · Order · Pay · Rewards, on a real `UITabBarController` | **Authoritative** |
| Figma (`Item · Curtain expanded`, `Cart · Filled`) | A floating pill with **three** icons — cup, card, search | Superseded on count |
| Memory note "nav stage 2: two poles" | **Two** tabs (Products + Cart), FluidMenu as primary nav | Superseded |

**The code wins, and the reason is not inertia.** The five-tab shell is a real
`UITabBarController`: it gets scroll-edge behaviour, `minimizeBehavior`, VoiceOver
rotor support and state restoration for free. The JS pill had none of those and
the file already documents that it was "a forgery". Five is also Android's
Material ceiling, so it is the largest count that does not spill into an overflow
menu that looks like nothing else in the app.

**The Figma pill is not wrong about the look.** iOS 26's `minimizeBehavior`
collapses the native bar into a floating pill on scroll — which is what those
frames are drawing. What differs is the **count**, and that is the live decision:
the frames show three icons, the shell ships five. Either the frames gain two
icons or the shell drops two. Until that is settled, the shell is what builds.

---

## 1. The tree as it stands

```
src/app/
├── _layout.tsx                    root stack + session guards
├── membership.tsx                 card-as-form onboarding      [gate]
├── store-picker.tsx               first-run store choice       [gate]
├── change-store.tsx               the map, as a root modal
├── lab/fluid-menu.tsx             dev harness, not shipped
└── (tabs)/
    ├── _layout.tsx                NativeTabs, wrapped by FluidMenu
    ├── (home)/                    answers "/"
    ├── gift/
    ├── order/
    ├── pay/
    └── rewards/
```

`FluidMenu` wraps the **whole tab tree**, not a screen — so the card that slides
aside carries the tab bar with it. That is deliberate and argued at length in
`(tabs)/_layout.tsx`; do not move it inside a tab.

---

## 2. The placement rule

Four buckets. Every screen is exactly one of them.

**Tab root** — one of the five, and the list is closed. Adding a sixth means
removing one. Carries `Curtain / Header` at `State=Expanded`.

**Pushed inside a tab** — a detail *of that tab's subject*. The tab bar stays
visible; back returns you to the tab root. Carries `State=Title`. This is the
default: if a screen belongs to a tab's subject, it pushes there and nowhere else.

**Root modal** — interrupts the app rather than continuing it. Covers the tab bar,
dismisses down. Reserve this for: choosing a store, scanning to pay, and the
onboarding gates. A modal that isn't an interruption is a push in disguise.

**Account route** — reached from the FluidMenu, lives at the root so it is
reachable from any tab. Carries `State=Title`.

> The test for tab-vs-push: *would a person tap this more than once per session,
> from anywhere?* If no, it is not a tab.

---

## 3. Every screen, placed

Status: **built** = route exists · **next** = designed in Figma, no route ·
**later** = neither.

### Home tab — `(tabs)/(home)`

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Home | `/` | tab root | built |

### Order tab — `(tabs)/order`

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Menu / Item | `/order` | tab root | built |
| Product detail (PDP) | `/order/product/[id]` | push | next |
| Cart | `/order/cart` | push | next |
| Order history | `/order/history` | push | later |
| Order detail | `/order/history/[id]` | push | later |

PDP pushes inside Order rather than presenting as a sheet route. The Figma frame
is a bottom sheet, which is a *presentation* choice — `Stack.Screen` with
`presentation: 'formSheet'` gives that inside the tab, and keeps the URL real.

### Pay tab — `(tabs)/pay`

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Pay · Card | `/pay` | tab root | built |
| Pay · Scan | `/pay/scan` | **root modal** | next |
| Pay · Add money | `/pay/add` | push | next |
| Pay · Activity | `/pay/activity` | push | next |
| Wallet · Manage card | `/pay/manage` | push | next |
| Wallet · Card face picker | `/pay/manage/face` | push | next |

Scan is the one modal here: it takes over the screen, maxes brightness, and is
held up to a till. Everything else is a continuation of Pay and pushes.

### Gift tab — `(tabs)/gift`

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Gift · Catalogue | `/gift` | tab root | built |
| Gift · Card detail | `/gift/[id]` | push | next |

### Rewards tab — `(tabs)/rewards`

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Rewards & Stars | `/rewards` | tab root | built |
| Reward detail | `/rewards/[id]` | push | next |
| Refer & Earn | `/rewards/refer` | push | later |

Refer & Earn appears in both Rewards and the account menu in the real app. It
lives **once**, under Rewards; the menu row links to the same path.

### Account routes — reached from the FluidMenu

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Profile | `/profile` | account | next |
| Settings | `/settings` | account | next |
| Notifications | `/notifications` | account | later |
| Coffee Stories · Index | `/stories` | account | next |
| Coffee Stories · Reader | `/stories/[slug]` | push | next |
| Help & Support · Index | `/support` | account | next |
| Support · Topic | `/support/[topic]` | push | next |
| Support · Contact | `/support/contact` | push | next |
| Beverage Subscription | `/subscription` | account | later |

### Store and session

| Screen | Route | Bucket | Status |
|---|---|---|---|
| Store picker (first run) | `/store-picker` | gate | built |
| Change store | `/change-store` | root modal | built |
| Store detail | inside the picker sheet | — | built |
| Membership / sign up | `/membership` | gate | built |

Store detail is **not** a route. It is the picker sheet's second face, and it
already animates between browse and detail without remounting. Making it a route
would break that.

---

## 4. Header mapping

The `Curtain / Header` component set has three variants and they map to the four
buckets mechanically:

| Bucket | Variant |
|---|---|
| Tab root | `State=Expanded`, collapsing to `State=Collapsed` on scroll |
| Push | `State=Title` |
| Account route | `State=Title` |
| Root modal | `State=Title`, or none for the map and scan |

The map is the exception worth stating: `change-store` currently has no header at
all, and it should get `State=Title` — the audit flagged it, and the header is the
app's identity.

---

## 5. Open decisions

Live questions. Each blocks something concrete.

1. **Three tabs or five.** §0. Blocks: finalising the Figma tab bar, and whether
   Gift and Rewards keep their triggers.
2. **Does Home need its own stack yet?** `(home)` owns a `Stack` with nothing
   pushed into it. Harmless, but if nothing ever pushes there it should collapse
   to a plain screen.
3. **Notifications: route or sheet?** The bell lives in the account header. If it
   only ever shows a list with deep links, a sheet is cheaper than a route.

---

## 6. Adding a screen

1. Find its bucket in §2.
2. Add the row to §3 before writing the file — if it does not fit a bucket, that
   is the discussion, not the implementation.
3. Tab roots are closed. A sixth tab is a §0 decision, not a new folder.
4. Give it the header variant from §4.
