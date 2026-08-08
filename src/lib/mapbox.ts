import Mapbox from '@rnmapbox/maps';

/**
 * Mapbox runtime setup. Import this once, before any <MapView> mounts —
 * `src/app/_layout.tsx` is the right place.
 *
 * The access token is the only Mapbox credential this project needs. There is
 * deliberately no secret download token: Mapbox dropped that requirement, and
 * @rnmapbox/maps marks `RNMapboxMapsDownloadToken` deprecated in both its config
 * plugin and its podspec. See `.env.example`.
 */

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/**
 * Mapbox Standard — the current default style. The `StyleURL` enum bundled with
 * @rnmapbox/maps still points at the previous generation (streets-v11, dark-v10),
 * so Standard has to be referenced by URL rather than through the enum.
 *
 * Standard is configurable at runtime through a <StyleImport> child of <MapView>
 * (lightPreset: dawn/day/dusk/night, show3dBuildings, showPointOfInterestLabels).
 */
export const MAPBOX_STANDARD = 'mapbox://styles/mapbox/standard';

let initialized = false;

export function initMapbox() {
  // setAccessToken crosses the native bridge; doing it per-render is wasteful
  // and, on Android, racy against a MapView that is already attaching.
  if (initialized) return;
  initialized = true;

  if (!accessToken) {
    // Failing loudly here beats a blank grey map with no explanation, which is
    // what a missing token actually looks like at runtime.
    console.warn(
      '[mapbox] EXPO_PUBLIC_MAPBOX_TOKEN is not set — maps will render blank. ' +
        'Copy .env.example to .env and add your pk.* token, then restart the ' +
        'bundler with `npx expo start --clear` (env vars are inlined at build time).'
    );
    return;
  }

  Mapbox.setAccessToken(accessToken);

  // Opt out of Mapbox's usage telemetry. Off by default here as a privacy
  // stance; remove this line if you want the analytics.
  Mapbox.setTelemetryEnabled(false);
}

export { Mapbox };
