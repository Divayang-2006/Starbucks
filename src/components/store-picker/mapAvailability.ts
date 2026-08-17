/**
 * Can we show a map at all? Answered once, at module scope, because the answer
 * cannot change while the app is running.
 *
 * Two ways it comes back no, and they need different copy:
 *
 * 1. **Web.** Metro resolves `@/lib/mapbox` to `src/lib/mapbox.web.ts`, which
 *    exports `Mapbox` as `undefined` so the web bundle never pulls in
 *    @rnmapbox/maps (whose web entry imports a CSS file this project does not
 *    ship). TypeScript only ever resolves the native fork, so it believes
 *    `Mapbox` is always present — widening it here is what makes the guard
 *    below type-check honestly instead of reading as dead code.
 * 2. **No token.** A MapView without an access token renders a silent black
 *    rectangle, which is indistinguishable from a bug. Better to know up front
 *    and lead with the list.
 */

import { Mapbox } from '@/lib/mapbox';

export const MapboxSdk: typeof Mapbox | undefined = Mapbox;

export type MapUnavailableReason = 'unsupported' | 'noToken';

export const MAP_UNAVAILABLE: MapUnavailableReason | null =
   MapboxSdk === undefined
      ? 'unsupported'
      : process.env.EXPO_PUBLIC_MAPBOX_TOKEN
        ? null
        : 'noToken';
