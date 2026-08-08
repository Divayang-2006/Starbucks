# Starbucks

A concept coffee loyalty app built with Expo. Successor to the
[Runiverse](../Recreation) card-onboarding study, carrying the same stack
forward onto Expo SDK 57 with Mapbox for store location.

> **Unofficial concept study.** Not affiliated with, endorsed by, or connected
> to Starbucks Corporation or any real company. If any of this is published or
> posted anywhere, it must be labelled as such.

## Quick start

```bash
cp .env.example .env
```

Add your Mapbox `pk.*` token to `.env`, then:

```bash
npx expo prebuild --clean
```

```bash
npx expo run:android
```

**Expo Go will not work.** `@rnmapbox/maps` needs custom native code, and Expo Go
for SDK 57 is not published to the app stores anyway. You need a development
build. iOS builds go through EAS — there is no local iOS simulator on Windows:

```bash
eas build --profile development --platform ios
```

## Scripts

| | |
| --- | --- |
| `npm start` | Start the dev server |
| `npm run android` / `ios` / `web` | Start on a platform |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run doctor` | `expo-doctor` dependency/config check |
| `npm run prebuild` | Regenerate native projects (`--clean`) |
| `npm run reset-project` | Move starter code aside and start blank |

## Layout

Routes are file-based under `src/app/`. `@/*` resolves to `./src/*` and
`@/assets/*` to `./assets/*`.

```
src/
  app/          routes (expo-router)
  components/   shared UI
  constants/    theme tokens
  hooks/
  lib/          mapbox.ts — access token + Standard style
```

## Docs

[`docs/SETUP.md`](docs/SETUP.md) covers the Mapbox token model (there is only
one token, and it is public), why the map plugin takes no options, which Mapbox
services actually have a React Native path, and the known compatibility risks.
Read it before touching map or build configuration.
