# Setup

Initialization notes for this project — the decisions that are not obvious from
reading `package.json`.

## Stack

| | |
| --- | --- |
| Framework | Expo SDK 57.0.11, React Native 0.86.2, New Architecture / Fabric |
| React | 19.2.3 |
| Routing | expo-router 57 (file-based, `src/app/`) |
| Animation | react-native-reanimated 4.5.1 + react-native-worklets 0.10.1 |
| Maps | @rnmapbox/maps 10.3.5 → Mapbox Maps SDK v11.23.1 |
| Search | @mapbox/search-js-core 1.6.0 |
| TypeScript | 6.0.3 |

Node 22.14.0 is fine — RN 0.86.2 requires `^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0`.

## First run

```bash
cp .env.example .env
```

Add your Mapbox `pk.*` token to `.env`, then build a dev client. **This project
cannot run in Expo Go** — two independent reasons:

1. `@rnmapbox/maps` requires custom native code.
2. Expo Go for SDK 56/57 is not published to the App Store or Play Store at all.

```bash
npx expo prebuild --clean
npx expo run:android
```

Windows has no local iOS simulator, so iOS goes through EAS:

```bash
eas build --profile development --platform ios
```

## Mapbox

### Only one token, and it is public

`EXPO_PUBLIC_MAPBOX_TOKEN` (a `pk.*` token) is the whole credential story. It is
inlined into the JS bundle and extractable from any shipped build — that is
expected for a `pk.*` token. Restrict it by URL and scope in the Mapbox
dashboard; do not try to hide it.

**There is no secret `sk.*` download token.** Mapbox removed that requirement,
and `@rnmapbox/maps` 10.3.5 marks it deprecated in both places it used to be
needed:

- config plugin: *"Download token is no longer required by Mapbox. Do not set this."*
- podspec: *"`$RNMapboxMapsDownloadToken` - *deprecated* download token is no longer required"*

Most tutorials still walk you through `.netrc`, `gradle.properties` credentials,
or a `MAPBOX_DOWNLOADS_TOKEN` EAS secret. Skip all of it. Setting
`RNMapboxMapsDownloadToken` in `app.json` is actively harmful: the plugin writes
the secret into `Podfile` and `gradle.properties`, both of which are committed.

### The plugin takes no options, on purpose

```json
"plugins": ["@rnmapbox/maps"]
```

Of the four props the plugin accepts, three (`RNMapboxMapsImpl`,
`RNMapboxMapsDownloadToken`, `RNMapboxMapsUseV11`) are deprecated or redundant.
The only live one is `RNMapboxMapsVersion`, and it is deliberately unset:

`@rnmapbox/maps` 10.3.5 declares its own tested native version as **11.23.1**
(`package.json` → `"mapbox": { "ios": "~> 11.23.1", "android": "11.23.1" }`).
Leaving `RNMapboxMapsVersion` unset means the native SDK always tracks whatever
the installed wrapper was tested against. Pinning it would silently freeze the
native version across future wrapper upgrades.

Mapbox's own latest is **11.28.0**, five minors ahead. To opt in:

```json
["@rnmapbox/maps", { "RNMapboxMapsVersion": "11.28.0" }]
```

That combination is untested by the wrapper — see the risk below before doing it.

### Styles

`Mapbox.StyleURL` still points at the previous style generation
(`streets-v11`, `dark-v10`). Mapbox Standard is the current default and has to
be referenced by URL — exported as `MAPBOX_STANDARD` from `src/lib/mapbox.ts`.
Configure it at runtime with a `<StyleImport>` child of `<MapView>`
(`lightPreset`, `show3dBuildings`, `showPointOfInterestLabels`).

### Services

Mapbox publishes **no official React Native packages**. What exists:

- **Search / geocoding** — `@mapbox/search-js-core`, installed. Verified
  RN-safe: zero `document`/`window`/`localStorage` references, and its only
  dependency is `@types/geojson`. Do **not** install `@mapbox/search-js-react`,
  which is React DOM only.
- **Directions** — plain `fetch` against `api.mapbox.com/directions/v5/...`,
  then feed `routes[0].geometry` to a `<ShapeSource>` + `<LineLayer>`.
  `@mapbox/mapbox-sdk` is stale (last publish 2025-09) and not worth the weight.
- **Offline** — built into `@rnmapbox/maps` (`offlineManager`, `TileStore`).
- **Navigation SDK / MapGPT** — no React Native path. MapGPT is private preview
  and automotive-only.

### Location permissions are deliberately minimal

The `expo-location` plugin is configured to request **when-in-use only**. The
background and motion keys are explicitly set to `false`:

```json
"locationAlwaysPermission": false,
"locationAlwaysAndWhenInUsePermission": false,
"motionUsagePermission": false
```

Left at their defaults, the plugin writes `NSLocationAlwaysUsageDescription` and
`NSLocationAlwaysAndWhenInUseUsageDescription` into `Info.plist` with generic
boilerplate. Declaring background-location intent an app does not act on is a
routine App Review rejection.

If you later add geofencing — "you're near a store" notifications, say, which
the installed `expo-notifications` would suggest is on the roadmap — flip those
to real strings and set `isIosBackgroundLocationEnabled` and
`isAndroidBackgroundLocationEnabled` to `true`. Expand deliberately; do not
start broad.

## Known risks

**`@rnmapbox/maps` 10.3.5 has not been verified against RN 0.86.2.** Its own
devDependencies target Expo ~54 / RN 0.81.1, and its peer range (`>=0.79`) is
permissive rather than a support statement. Every static check here passes
(`expo-doctor` 20/20, `tsc`, `eslint`), but those cannot catch a native
incompatibility. **Build a dev client early** — this is the highest-risk item in
the project, and it will surface at native build time, not in JS.

New Architecture is mandatory for `@rnmapbox/maps` ≥10.3.0 (old arch is a hard
build failure) and is always-on in SDK 57, so those agree.

**Hermes memory regression:** importing `react-native-reanimated` raises memory
25–30% even when unused, from a Hermes change in RN 0.85. Affects SDK 56/57;
the real fix lands in RN 0.87.

## `npm audit` — do not run `--force`

`npm install` reports 23 vulnerabilities (8 moderate, 15 high). They collapse to
**two** actual advisories; everything else is transitive fan-out:

| Advisory | Reached through | Ships in the app? |
| --- | --- | --- |
| `image-size` — ICNS/JXL/HEIF parsers loop forever on malformed input | `metro` (bundler) | No |
| `uuid` — missing buffer bounds check in v3/v5/v6 when `buf` is passed | `xcode` → `@expo/config-plugins` | No |

Both live in build tooling — the Metro bundler and the Xcode project writer.
Neither is in the runtime bundle. `npm audit` labels them "production" only
because `expo` and `react-native` are production dependencies; the vulnerable
code paths are CLI-side.

**`npm audit fix --force` would resolve these by moving `expo`, `react-native`,
and `metro` off the SDK 57 matrix and break the project.** Leave them. They
clear when Expo bumps its own pins.

## Housekeeping

- `expo-build-properties` is installed but **not** registered as a plugin —
  nothing currently needs it. Add it to `plugins` with options when you need to
  tune native build settings.
- `package.json` sets `expo.autolinking.ios.buildFromSource` for
  `react-native-reanimated` and `react-native-worklets`, carried over from
  Recreation. It makes iOS builds slower but avoids prebuilt-binary mismatches.
- `com.anonymous.starbucks` is Expo's placeholder bundle identifier / package
  name. **Change it before your first EAS build.** Do not use `com.starbucks.*`
  — that is Starbucks Corporation's namespace and would be rejected.
- Always install with `npx expo install`, never bare `npm install`, for anything
  in the SDK version map. Several packages here have an npm `latest` outside the
  SDK 57 range — `react-native-gesture-handler` most dangerously, where `latest`
  is 3.1.0 against the required 2.32.0.
