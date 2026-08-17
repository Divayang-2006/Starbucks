/**
 * The Mapbox Search Box + Places client.
 *
 * Plain `fetch`, not `@mapbox/search-js-core`. The installed 1.6.0 exposes only
 * `suggest`, `retrieve`, `category` and `reverse` — there is no `forward`, which
 * is the one endpoint that takes a brand query without a session token. And the
 * Places API postdates the package entirely. So both calls are hand-rolled, the
 * same conclusion `docs/SETUP.md` reached for Directions.
 *
 * ## The quota is the design constraint
 *
 * The two endpoints are billed completely differently, and the whole shape of
 * this module follows from that:
 *
 * - **Search Box `/forward`** — billed per *request*, no session token needed,
 *   and does **not** touch the Places record quota. Cheap. This is what fills the
 *   map with pins, and it can run on every viewport change.
 * - **Places `/details/retrieve`** — billed per *record*, against a **1,000 per
 *   month, per account** preview quota. One opened store sheet is one record. At
 *   30 pins a full map refresh would be 30 records, so details are fetched
 *   **only** when a sheet actually opens, and cached for the rest of the session
 *   so reopening the same store is free.
 *
 * ## Cache is memory-only, on purpose
 *
 * Mapbox's terms say "storage of location data … requires a separate agreement".
 * A `Map` that dies with the process is not storage, so this sidesteps the
 * licensing question entirely rather than quietly taking a position on it. It
 * also means the quota resets its usefulness on every cold start — the tradeoff
 * is deliberate and it is the safe direction to be wrong in.
 */

import type {
   PlaceDetails,
   SearchBoxFeature,
   SearchBoxResponse,
} from './types';

const SEARCH_BOX = 'https://api.mapbox.com/search/searchbox/v1/forward';
const PLACES = 'https://api.mapbox.com/places/v1/details/retrieve';

/** Matched against `brand_id`, which is stable and unlocalised. */
const BRAND_ID = 'starbucks';

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/** Session-lifetime caches. See the note above on why nothing hits disk. */
const detailsCache = new Map<string, PlaceDetails>();
const searchCache = new Map<string, SearchBoxFeature[]>();

/** Details we asked for and Mapbox had nothing for. Stops us paying twice. */
const detailsMisses = new Set<string>();

export type SearchArea = {
   /** `[longitude, latitude]`. Biases and enables `distance` on each result. */
   proximity: [number, number];
   /** Hard cap is 10 on this endpoint. */
   limit?: number;
};

function requireToken(): string | null {
   if (token) return token;
   console.warn('[places] EXPO_PUBLIC_MAPBOX_TOKEN is not set — falling back to seeded stores.');
   return null;
}

/**
 * Quantised so panning the map a few metres reuses the cached result instead of
 * paying for a near-identical request. Two decimal places is ~1.1 km, which is
 * finer than the zoom levels this screen flies between.
 */
function areaKey(area: SearchArea): string {
   const [lng, lat] = area.proximity;
   return `${lng.toFixed(2)},${lat.toFixed(2)}:${area.limit ?? 10}`;
}

/**
 * Starbucks POIs near a point.
 *
 * Results are filtered by `brand_id` rather than trusted from the query: `q` is
 * fuzzy and will happily return a "Starbucks Cafe Road" address or an unrelated
 * café. Anything without the brand id is dropped.
 */
export async function searchStarbucks(area: SearchArea): Promise<SearchBoxFeature[]> {
   const key = areaKey(area);
   const cached = searchCache.get(key);
   if (cached) return cached;

   const accessToken = requireToken();
   if (!accessToken) return [];

   const url =
      `${SEARCH_BOX}?q=Starbucks` +
      `&proximity=${area.proximity[0]},${area.proximity[1]}` +
      `&limit=${area.limit ?? 10}` +
      `&types=poi` +
      `&access_token=${accessToken}`;

   try {
      const response = await fetch(url);
      if (!response.ok) {
         console.warn(`[places] search failed: ${response.status} ${response.statusText}`);
         return [];
      }

      const body = (await response.json()) as SearchBoxResponse;
      const features = (body.features ?? []).filter(
         (feature) =>
            feature.properties?.feature_type === 'poi' &&
            feature.properties?.brand_id?.includes(BRAND_ID),
      );

      searchCache.set(key, features);
      return features;
   } catch (error) {
      // Offline, DNS, a captive portal. The caller falls back to seeded stores.
      console.warn('[places] search error', error);
      return [];
   }
}

/**
 * Full record for one place. **Costs one record against the monthly quota** on a
 * cache miss, so call it when a sheet opens and never speculatively.
 */
export async function fetchPlaceDetails(mapboxId: string): Promise<PlaceDetails | null> {
   const cached = detailsCache.get(mapboxId);
   if (cached) return cached;
   if (detailsMisses.has(mapboxId)) return null;

   const accessToken = requireToken();
   if (!accessToken) return null;

   try {
      const response = await fetch(`${PLACES}/${mapboxId}?access_token=${accessToken}`);

      if (!response.ok) {
         // 404 means no record exists; 429 means the quota is spent. Both are
         // permanent enough for one session that retrying would only waste more.
         console.warn(`[places] details failed: ${response.status} ${response.statusText}`);
         detailsMisses.add(mapboxId);
         return null;
      }

      const details = (await response.json()) as PlaceDetails;
      // A 200 with no id is a malformed record, not a place.
      if (!details?.mapbox_id) {
         detailsMisses.add(mapboxId);
         return null;
      }

      detailsCache.set(mapboxId, details);
      return details;
   } catch (error) {
      console.warn('[places] details error', error);
      return null;
   }
}

/** Already-paid-for record, if we have it. Lets the UI render before awaiting. */
export function cachedDetails(mapboxId: string): PlaceDetails | undefined {
   return detailsCache.get(mapboxId);
}
