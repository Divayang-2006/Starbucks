/**
 * Must be the first import in `.design-sync/entry.ts`.
 *
 * React Native code is bundled by Metro, which always provides a `process`
 * global. esbuild does not, and the converter only defines `process.env.NODE_ENV`
 * — so any *other* `process.env.*` read (this repo has `EXPO_PUBLIC_MAPBOX_TOKEN`,
 * and react-native-web has a few of its own) throws `ReferenceError: process is
 * not defined` while the IIFE is still evaluating. That aborts the module before
 * it can assign `window.StarbucksDS`, which surfaces as every component being
 * missing from the global rather than as the render error it actually is.
 *
 * ESM evaluates imports in source order, so importing this first guarantees the
 * global exists before any component module is touched.
 */

const g = globalThis as unknown as {
   process?: { env: Record<string, string | undefined> };
   __DEV__?: boolean;
   global?: unknown;
};

g.process ??= { env: {} };
g.process.env ??= {};

/**
 * Metro injects `__DEV__` into every module. React Native and react-native-web
 * branch on it directly (`if (__DEV__) { …warn… }`), so an undefined binding is
 * a hard ReferenceError rather than a falsy skip.
 *
 * `false` on purpose: previews are a production-shaped render, and dev mode adds
 * per-render validation noise to the console that would bury real errors in the
 * render check.
 */
g.__DEV__ ??= false;

/** RN code says `global.foo`; on the web that's `globalThis`. */
g.global ??= globalThis;

export {};
