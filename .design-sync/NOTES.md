# design-sync notes — Starbucks (Expo / React Native)

Repo-specific gotchas for `/design-sync`. Read this before re-running.

Project: **Starbucks Recreation System** — `2d7ad306-a7a2-4491-921c-578c85199089`

## The headline: this is a React Native app, not a web component package

claude.ai/design renders React in a browser. Every component here imports
`react-native`, so the entire sync hangs on resolving that to `react-native-web`
(0.21.2, already a dependency because Expo web support is on). It works, and the
render check passes, but nothing about the setup is default.

Four pieces make it work. All four are load-bearing:

1. **`.design-sync/tsconfig.sync.json`** — a sync-only tsconfig (the app's own
   `tsconfig.json` is untouched, `npm run typecheck` is unaffected). The
   converter's `tsconfigPathsPlugin` honours *exact*, non-wildcard path keys, so
   a bare `"react-native"` key acts as a true module alias. That is the trick.
2. **`.design-sync/shims/`** — web stand-ins for native modules with no usable
   web build (expo-router, haptics, location, symbols, image, status-bar,
   safe-area-context, screens/experimental, the nine `@expo-google-fonts`
   subpaths). Each is aliased individually in the sync tsconfig.
3. **`.design-sync/overrides/bundle.mjs`** — the one lib fork. See below.
4. **`.design-sync/entry.ts`** — the published surface, hand-written.

### Traps that cost real debugging time

- **Barrel directories must be aliased explicitly.** The path plugin tries a
  bare `""` extension first, and `existsSync` is true for a *directory* — so
  `@/theme` resolved to the folder `src/theme` and esbuild died with
  `Cannot read file "src/theme": Incorrect function`. Every `@/…` import that
  points at a folder needs its own exact key naming `index.ts`. There are seven:
  accessory, brand, chrome, controls, fluid-menu, lib/places, theme. **Adding a
  new barrel means adding a key here**, or the build breaks with that message.
- **This repo's own `.web.ts` forks need naming too.** The path plugin resolves
  `@/…` before `resolveExtensions` ever runs, so Metro's platform picking does
  not happen for aliased imports. `@/lib/mapbox` → `src/lib/mapbox.web.ts` is the
  important one: the web fork exports `Mapbox` as `undefined`, and that is the
  only reason `@rnmapbox/maps` (and its `mapbox-gl` CSS import) stays out of the
  bundle. `@/hooks/use-color-scheme` is the other.
- **Metro globals do not exist under esbuild.** `.design-sync/shims/process-polyfill.ts`
  installs `process`, `__DEV__` and `global`, and it **must stay the first import
  in `entry.ts`** — ESM evaluates imports in order, and a missing `__DEV__`
  throws *while the IIFE is still evaluating*, which aborts the
  `window.StarbucksDS` assignment. The symptom is misleading: every component
  reports as missing from the global, as if discovery failed, when the real cause
  is one ReferenceError at line 1.
- **`@expo-google-fonts/*` imports are .ttf assets** and esbuild has no loader
  for them. They are stubbed to plain strings, which is faithful: those imports
  only ever populate `APP_FONTS` for `useFonts`, and `Type`/`TextStyles` name
  families by string literal. The real typefaces still ship — see Fonts below.

## Two forks of the converter's own scripts

### `package-validate.mjs` — a drop-in replacement

**This one is not optional: without it every rendering component fails.**

react-native-web injects `<style id="react-native-stylesheet">` into `<head>`.
Its id starts with `r`, so it matches the validator's mount-root selector
`querySelectorAll('#root, [id^="r"]')` — and it sorts FIRST in document order.
RNW fills that element via CSSOM `insertRule`, not text, so its `innerHTML` is
empty; the `rootEmpty` probe reads `roots[0]`, and therefore reported *every*
component as an empty render while `r0…rN` were rendering perfectly. The fork
scopes the probe to `document.body`. That is its only behavioural change.

It is a **drop-in replacement**, stored at
`.design-sync/overrides/package-validate.mjs` and copied over the staged script
before validating — it must run from `.ds-sync/` so its relative imports
(including a *dynamic* `./lib/sync-hashes.mjs` that a static grep misses) and its
bare `playwright` import resolve exactly as upstream:

```
cp .design-sync/overrides/package-validate.mjs .ds-sync/package-validate.mjs
```

Do that after every re-stage of `.ds-sync/`, and before any `resync.mjs` run —
the driver invokes `.ds-sync/package-validate.mjs` by path.

## The one lib fork

`.design-sync/overrides/bundle.mjs`, declared in `cfg.libOverrides`. The diff is
three things: the header comment, repointing `./common.mjs` at
`../../.ds-sync/lib/common.mjs`, and adding **`resolveExtensions`** with `.web.*`
entries ahead of esbuild's defaults.

The skill discourages forking `bundle.mjs` because it defines the output contract
with the app's self-check. This diff touches *resolution only* and leaves every
emitted byte's shape alone. It was unavoidable: React Native packages ship their
web implementations as `.web.js` siblings and rely on Metro's platform
resolution, so `react-native-svg`'s own `ReactNativeSVG.web.js` re-exports
`./elements` and lands on the **native** `elements.js` without it. Reanimated,
gesture-handler, safe-area-context and this repo's `animated-icon.web.tsx` all
depend on the same mechanism. There is no config knob for it.

**On re-sync:** diff the fork against the bundled `.ds-sync/lib/bundle.mjs` and
merge upstream changes. If `sharedBuildOptions` has been restructured upstream,
re-apply the `resolveExtensions` line by hand rather than keeping a stale fork.

The fork imports `esbuild` by bare name, so it needs
`ln -sfn ../.ds-sync/node_modules .design-sync/node_modules`. That symlink is
gitignored, so **recreate it on every fresh clone**.

## Headless Chrome without the 200 MB download

There was no playwright cache on this machine, but Chrome was installed. Both
`package-validate.mjs` and `package-capture.mjs` honour `DS_CHROMIUM_PATH`, so:

```
cd .ds-sync && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright
DS_CHROMIUM_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" node .ds-sync/package-validate.mjs ./ds-bundle
```

Every validate and capture run needs that env var. Without it playwright looks
for a bundled chromium that was never downloaded and fails with
`browserType.launch: Executable doesn't exist`.

## Fonts

`cfg.extraFonts` → `.design-sync/fonts.css`, which declares nine `@font-face`
rules pointing at the `.ttf`s inside `node_modules/@expo-google-fonts/`. The
converter copies them into `fonts/` and rewrites the urls, so the published DS is
self-contained with no font CDN.

The family names must match `Type` in `src/theme/typography.ts` **character for
character** (`Urbanist_600SemiBold`, not `Urbanist SemiBold`) — every TextStyle
names its family by string literal. Every rule is `font-weight: normal` on
purpose: each file is a single static weight, and typography.ts is explicit that
weight comes from the family, never from `fontWeight`.

**Adding a weight to the app means adding a rule here**, or that TextStyle
silently falls back to a system font in every published design.

## Component surface

`cfg.componentSrcMap` enumerates all 86 components explicitly. That is not
redundancy — there is no built `dist/` and no `.d.ts` tree, so with an explicit
`--entry` the converter's discovery finds nothing and exits `[ZERO_MATCH]`. The
map IS the component list. Adding a component means adding it here *and* to
`entry.ts`.

Two deliberate exclusions, both taken from the source's own instructions:

- **`AppMenuProvider`** — `src/components/fluid-menu/index.ts` states that
  nothing outside that folder should name it; `FluidMenu` mounts it around its
  own children, and a second instance silently shadows the real `openMenu`.
- **`@/theme` is exported as a namespace** (`Theme.Surface`, `Theme.Space`), not
  spread. Chrome exports a `Gutter` *component* and the theme exports a `Gutter`
  *number*; a flat `export *` from both makes the name ambiguous and ESM drops it.

Root-level Expo template leftovers (`ThemedText`, `ThemedView`, `HintRow`,
`WebBadge`, `ExternalLink`, `Collapsible`) are out of scope by choice — they are
scaffold, not this design system.

## Authoring previews — what eight parallel batches learned

**Previews cannot import React Native libraries directly.** Not
`react-native-reanimated`, not `react-native-svg`. The preview build path does
NOT get the `resolveExtensions` override the main bundle does, so those imports
resolve to their native siblings and esbuild dies on Flow syntax. Worse, the
error points at `react-native`, not at the import you actually wrote. Everything
in a preview must come from `'starbucks'` or be a plain DOM element.

**`import { Theme } from 'starbucks'` works** — `entry.ts` publishes the token
namespace, so previews use `Theme.Surface.inverse`, `Theme.Space.md`,
`Theme.RailCard.compact` rather than hardcoded hex. Prefer it; a hardcoded
value silently stops tracking the token it copied.

**A Reanimated `SharedValue` can be faked with a plain object** carrying
`_isReanimatedSharedValue: true` and a `get()`. The bundle's reanimated never
saw the worklets babel plugin, so `startMapper` subscribes to nothing and
`useAnimatedStyle`'s first run is synchronous — a pinned `progress` therefore
renders an exact resting frame. This is what makes `MenuPanel`/`MenuRow` open
states previewable at all. Related: `withTiming` *does* advance (HoloTilt's
600ms sheen lands), but short status washes do not — `OtpInput`'s 140ms ok/fail
states capture identically to idle and are deliberately not shown.

**The capture viewport is a hard 900×700 and clips rather than scales.** Cells
taller than ~650pt lose their bottoms mid-render, which reads as a broken
component. Keep authored cells under roughly 850×650; split a long list into two
narrower stories instead of one tall one.

### react-native-web divergences that bite in previews

- `accessibilityRole="button"` becomes a real `<button>`, which shrink-wraps
  inside a plain block `<div>`. Pressable rows hug their text unless the
  scaffolding div is `display:flex; flexDirection:column; alignItems:stretch`.
- `flex: 0` maps to a zero flex-*basis*, so the DS's own idiom
  (`insets.ts`, `action-bar.tsx`) collapses to zero height in normal flow. Those
  call sites only work because they pair it with `position:absolute`. In flow,
  use `{ flexGrow: 0, flexShrink: 0 }`.

### Two glyph systems, easily confused

`Glyph id="search"` (the DS's 18-key `GLYPHS` record in `chrome/glyphs.tsx`) and
`SearchGlyph` (a standalone SVG in `store-picker/Glyphs.tsx`) are different
components and are not interchangeable. The valid ids are exactly:

`home gift order pay rewards search scan plus minus chevronRight person crown
pin article heart arrowLeft close menu`

Reading them off the file is a trap: `id` and `color` appear just below the
record as *prop names* on `Glyph`. An invalid id is not a silent no-render —
`GLYPHS[id]` is undefined and the following `.map` throws, blanking the whole
card.

### Component defaults worth knowing before previewing

- **`StoreRow` defaults to `tone="inverse"`** — the only component that does. A
  bare `<StoreRow>` on white renders white-on-white and looks broken.
- **`ScreenHeader tone="inverse"` paints a 400pt green block at `top: -400`** as
  overscroll filler. Without `overflow: hidden` on the wrapper it bleeds up over
  the card above it.
- **`StoreDetail`'s `status: 'ready'` body is unreachable on web** — with no
  Mapbox token `usePlaceDetail` always settles to `unavailable`, so the
  standalone `Accessibility`/`Amenities`/`ContactRows` cards are the *only*
  coverage those sections get. Do not thin them out later assuming StoreDetail
  shows them.

### Components without a preview card, deliberately

Each returns nothing (or throws) outside a host this environment cannot provide,
so there is no honest preview to author.

| Component | Disposition | Why |
|---|---|---|
| `BuildingHighlight` | floor card | Short-circuits on `if (!MapboxSdk) return null`, and its output is `ShapeSource` + `FillExtrusionLayer` — map-layer descriptions with no DOM output even if the SDK were present. |
| `StorePicker` | floor card | `useSession must be used inside <SessionProvider>`. Unfixable from a preview: `@/lib/session` is bundled from source, so a provider wrapped in the preview is a *second* context instance and the bundle's own `useSession` still throws. It also mounts `Stack.Toolbar`, which the expo-router shim does not define. |
| `SessionStrip` | **not in `componentSrcMap`** | Calls `NativeTabs.BottomAccessory.usePlacement()`, which *throws* — so the floor-card fallback (which needs an empty render, not a thrown one) never fires and it shipped a genuinely blank card. Removing it from the component list removes the card. `entry.ts` still exports it, so it stays importable for anyone building the real native shell. NAVIGATION.md §3.1 already states it degrades to nothing on web. |

The first two render the honest typographic floor card and are NOT failures.

To give any of them a real card you would need a `cfg.provider` chain plus shims
for `expo-router/unstable-native-tabs` and `@/lib/session` — a preview-side
workaround cannot do it, because the context instance the bundle reads is the one
compiled into the bundle.

### A process trap: unscoped capture prunes every grade

`package-capture.mjs` run WITHOUT `--components` (which the `resync.mjs` driver
does) prunes and re-keys the whole grade cache. Adding the 69 `cardMode: column`
overrides counts as preview-affecting config, so a full rebuild + full capture
wiped all 83 grades at once and forced a re-grade.

The `[GRID_OVERFLOW]` warn says this explicitly and it is worth obeying: apply
presentation-only remedies with the **targeted** loop —
`node .ds-sync/lib/preview-rebuild.mjs --config … --components A,B,C` followed by
`package-capture.mjs --components A,B,C` — and grades carry forward.

## Component-level findings for the app's owner

These are real defects found while previewing. They are app-code issues, not
sync issues, and none is fixed here:

- ~~**`Grid` under-shoots `flexBasis` by a flat 2%**~~ — **FIXED.** It now chunks
  children into rows of `columns` and gives each cell `flex: 1`, so flexbox
  subtracts the row's gaps and divides the remainder; the columns are exact at
  any width and gap, with no slack constant and no container measurement.
  Measured across `columns` 2/3 x `Space.md`/`Space.lg` x 375/390pt: all 8
  correct. Before the fix only the default (2-up at `Space.md`) was right —
  which is exactly the app's one call site, `(tabs)/gift/index.tsx`, and why it
  never surfaced. `columns={2}` at `Space.lg` was collapsing to **one** column,
  worse than first reported. Ragged last rows keep their previous behaviour (a
  lone trailing tile fills the row). `.design-sync/previews/Grid.tsx` ThreeUp no
  longer needs its `gap={Space.sm}` workaround.
- **`EdgeFade` clips at 300px under react-native-web.** It pins itself
  `left:0; right:0` but passes no `width` to `Svg`, so the `<svg>` falls back to
  its 300px CSS intrinsic width and the gradient ends in a hard vertical seam.
  Web-only; `width="100%"` on the Svg would fix it.
- **`HoloTilt`'s sheen escapes its own clip** — `sheenClip`'s `overflow: hidden`
  does not trim the band under RNW, so a lit card spills a faint diagonal ~60pt
  past its right edge. Also the only component with a non-fatal page error
  (`expo-sensors: addListener is not a function`).
- **`Accessibility` draws `chevronRight` where its source comment says "green
  tick"** — the closed glyph set has no check mark, so those rows read as
  navigable when they are not.

## Known render warns

Re-syncs should treat these as expected, not new:

- `[CSS_RUNTIME]` on `styles.css` and `_ds_bundle.css` — correct and permanent.
  react-native-web injects styles at runtime, so there is no static component
  stylesheet to scrape. The tokens that matter reach designs through the JS
  bundle. Do not chase this by setting `cfg.cssEntry`.

## Re-sync risks

- **The shims are frozen pictures of native behaviour.** `useSafeAreaInsets`
  returns zeros, `expo-location` always denies, `expo-router`'s `Link` never
  navigates. If a component starts *depending* on a non-zero inset or a granted
  permission for its layout, its card will quietly render the wrong thing rather
  than fail. Re-check the shims whenever a component's native surface changes.
- **`resolveExtensions` is the single point of failure for every RN community
  package.** If a card that used to render goes blank after a dependency bump,
  suspect a package that moved its web entry before suspecting the component.
- **`SessionStrip` cannot render outside a native tab accessory.** It calls
  `NativeTabs.BottomAccessory.usePlacement()`, which throws in a preview card.
  NAVIGATION.md §3.1 explains why it exists. It needs either a provider entry or
  `cfg.overrides.SessionStrip.skip`.
- **Nothing here has been checked against a real iOS render.** The previews prove
  the components render *on web through react-native-web* — that is what
  claude.ai/design consumes, and it is not the same as an on-device screenshot.
  Shadows, blur (`expo-blur`), glass effects and Reanimated worklet timing are
  the most likely places web and device diverge.
- **`@/lib/mapbox` aliasing is what keeps mapbox-gl out.** If `StoreMap` ever
  starts importing `@rnmapbox/maps` directly rather than through
  `src/lib/mapbox`, the bundle will pull in a CSS import this project does not
  ship and the build will fail.
