/**
 * Web fork of `./mapbox`. Metro resolves `@/lib/mapbox` to this file on web,
 * so the web bundle never touches @rnmapbox/maps — whose web entry imports
 * `mapbox-gl/dist/mapbox-gl.css`, a package this project doesn't ship. Maps
 * are native-only for now; web gets a no-op with the same surface.
 */

export const MAPBOX_STANDARD = 'mapbox://styles/mapbox/standard';

export function initMapbox() {
  // No-op on web.
}

export const Mapbox = undefined;
