# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

Recall is wrong about SDK 57 in ways that break builds:

- **New Architecture is always on** and cannot be disabled. `newArchEnabled` is
  removed from the app config schema and silently ignored.
- **expo-router no longer depends on react-navigation** (since SDK 56). Any
  `@react-navigation/*` import breaks. Use `expo-router/react-navigation`,
  `expo-router/js-stack`, `expo-router/js-tabs`.
- **Reanimated 4 uses `scheduleOnRN` from `react-native-worklets`**, not
  `runOnJS`. Do not add `react-native-reanimated/plugin` to babel by hand —
  `babel-preset-expo` injects `react-native-worklets/plugin` automatically, and
  adding it manually is what causes the "It was moved to react-native-worklets"
  error.
- **`expo-av` is gone** — use `expo-audio` / `expo-video`.
- **`StyleSheet.absoluteFillObject` is not exported** — use `absoluteFill`.
- **`expo-file-system` changed API.** The default export is the new
  `File`/`Directory` API; the old one is at `expo-file-system/legacy`.
- **`@expo/vector-icons` is no longer a dependency of `expo`** — install it
  explicitly if you use it.
- **Expo Go is not published for SDK 57.** Device testing needs a dev build.

## Installing packages

Use `npx expo install`, never bare `npm install`, for anything in the SDK
version map. Several packages here have an npm `latest` outside the SDK 57
range — `react-native-gesture-handler` is a full major off (`latest` 3.1.0 vs
required 2.32.0).

## Mapbox

See [`docs/SETUP.md`](docs/SETUP.md). The short version: there is exactly one
token, it is public (`pk.*`), and **the secret `sk.*` download token that every
tutorial tells you to configure is deprecated and must not be set.**
