import { MapPlate } from 'starbucks';

/**
 * The plate fills its parent through `StyleSheet.absoluteFill`, so every cell
 * gives it a positioned frame the size of a map viewport to fill.
 */
const frame = {
   position: 'relative',
   width: 390,
   height: 330,
   overflow: 'hidden',
} as const;

/**
 * `unsupported` — **and this is the render you get on the web, by design.**
 *
 * `src/lib/mapbox.web.ts` exports `Mapbox` as `undefined` so the web bundle
 * never pulls in @rnmapbox/maps, `MAP_UNAVAILABLE` resolves to `'unsupported'`,
 * and every map-bearing screen falls through to this. It is not a broken map —
 * it is the map's absence being accounted for, and the store list underneath is
 * fully usable.
 *
 * Note what it is *not*: an error state. House Green with the siren bled off
 * the corner at 6% is the same printed-mark treatment the loyalty card uses.
 */
export function Unsupported() {
   return (
      <div style={frame}>
         <MapPlate reason="unsupported" bottomInset={0} />
      </div>
   );
}

/**
 * `loading` — the only reason that breathes.
 *
 * The siren pulses between 6% and 11% on a 1.6s in-out quad while the style is
 * in flight. The three terminal states below hold still on purpose: a pulsing
 * permanent state keeps promising something is about to happen.
 */
export function Loading() {
   return (
      <div style={frame}>
         <MapPlate reason="loading" bottomInset={0} />
      </div>
   );
}

/**
 * `noToken` — a MapView without an access token renders a silent black
 * rectangle, which is indistinguishable from a bug.
 *
 * So the token is checked once at module scope and the copy names the fix,
 * environment variable and `--clear` included. This is the one plate whose body
 * is addressed to a developer rather than to a customer, which is why it is
 * also the one that runs to two lines.
 */
export function NoToken() {
   return (
      <div style={frame}>
         <MapPlate reason="noToken" bottomInset={0} />
      </div>
   );
}

/**
 * `error` — the style or the tiles failed.
 *
 * `onMapLoadingError` fires for tile failures too, so `StoreMap` only escalates
 * to this when the style never loaded at all; a flaky connection after a good
 * load must not replace a working map with a plate.
 */
export function LoadError() {
   return (
      <div style={frame}>
         <MapPlate reason="error" bottomInset={0} />
      </div>
   );
}

/**
 * `bottomInset` — how much of the plate the sheet is standing on.
 *
 * The plate fills the whole map frame including the part the sheet covers, so
 * without this the copy would sit behind it. 300 is roughly the Reanimated
 * sheet's height on a 6.1" phone; the title and body ride up to clear it.
 */
export function BehindTheSheet() {
   return (
      <div style={{ ...frame, height: 560 }}>
         <MapPlate reason="unsupported" bottomInset={300} />
      </div>
   );
}
