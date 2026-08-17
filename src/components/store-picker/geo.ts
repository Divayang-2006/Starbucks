/**
 * Everything the picker needs to know about coordinates, cities and the strings
 * we print next to them. Pure functions, no React — the components stay about
 * layout and motion.
 */

import type { Store } from '@/lib/session';

import { CAMERA } from './stage';

export const ALL_CITIES = 'all';

export type CityFilter = {
   /** `ALL_CITIES`, or the city name itself — the city *is* its own id. */
   id: string;
   label: string;
   center: [number, number];
   zoom: number;
   count: number;
};

function centroid(stores: readonly Store[]): [number, number] {
   if (stores.length === 0) return [78.9629, 20.5937];
   let lng = 0;
   let lat = 0;
   for (const store of stores) {
      lng += store.coordinate[0];
      lat += store.coordinate[1];
   }
   return [lng / stores.length, lat / stores.length];
}

/**
 * The rail is derived from the data rather than listed separately, so adding a
 * store in a new city adds the pill for free and the two can never disagree.
 * First-appearance order, not alphabetical — the seed is ordered by how close
 * the cities are to the notional user, and that is the more useful order.
 */
export function buildCityFilters(stores: readonly Store[]): readonly CityFilter[] {
   const order: string[] = [];
   const byCity = new Map<string, Store[]>();

   for (const store of stores) {
      const bucket = byCity.get(store.city);
      if (bucket) {
         bucket.push(store);
      } else {
         byCity.set(store.city, [store]);
         order.push(store.city);
      }
   }

   return [
      {
         id: ALL_CITIES,
         label: 'All stores',
         center: centroid(stores),
         zoom: CAMERA.allZoom,
         count: stores.length,
      },
      ...order.map((city) => {
         const bucket = byCity.get(city) ?? [];
         return {
            id: city,
            label: city,
            center: centroid(bucket),
            zoom: CAMERA.cityZoom,
            count: bucket.length,
         };
      }),
   ];
}

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
   return (degrees * Math.PI) / 180;
}

/**
 * Straight-line distance between two [lng, lat] pairs. Haversine rather than
 * equirectangular because the seed spans 16 degrees of latitude, where the flat
 * approximation is off by kilometres.
 */
export function haversineKm(from: [number, number], to: [number, number]): number {
   const dLat = toRadians(to[1] - from[1]);
   const dLng = toRadians(to[0] - from[0]);
   const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(from[1])) * Math.cos(toRadians(to[1])) * Math.sin(dLng / 2) ** 2;
   return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Thousands separators without touching `Intl` — Hermes' ICU support varies by
 * platform and the largest number here is four digits, where every locale
 * groups identically anyway.
 */
function groupDigits(value: number): string {
   return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatKm(km: number): string {
   // Metres are rounded to the nearest ten. A phone fix is accurate to tens of
   // metres at best, so "847 m" would be claiming precision we do not have.
   if (km < 1) return `${Math.round((km * 1000) / 10) * 10} m`;
   if (km < 10) return `${km.toFixed(1)} km`;
   return `${groupDigits(Math.round(km))} km`;
}

function to12Hour(hhmm: string): string {
   const [rawHours, rawMinutes] = hhmm.split(':');
   const hours = Number(rawHours);
   if (!Number.isFinite(hours)) return hhmm;
   const suffix = hours < 12 ? 'am' : 'pm';
   const hour12 = hours % 12 === 0 ? 12 : hours % 12;
   return `${hour12}:${rawMinutes ?? '00'} ${suffix}`;
}

/**
 * The one line that answers "can I order right now?". A store whose hours span
 * the whole clock says so instead of claiming to close at 11:59 pm.
 *
 * Empty hours are a real case, not a defensive check: three of the six live
 * Starbucks around Pune come back from Mapbox with no `open_hours` at all. Left
 * unguarded, `to12Hour('')` returns "12:undefined am".
 */
export function formatHours(store: Store): string {
   if (!store.opensAt || !store.closesAt) return 'Hours unavailable';
   if (store.opensAt === '00:00' && store.closesAt === '23:59') return 'Open 24 hours';
   if (store.isOpen) return `Open until ${to12Hour(store.closesAt)}`;
   return `Opens ${to12Hour(store.opensAt)}`;
}

/**
 * Matches name, locality and city so "bandra", "fort" and "pune" all work.
 * Callers pass the query pre-trimmed; an empty query is nobody's search.
 */
export function matchesQuery(store: Store, query: string): boolean {
   if (query.length === 0) return true;
   const needle = query.toLowerCase();
   return (
      store.name.toLowerCase().includes(needle) ||
      store.area.toLowerCase().includes(needle) ||
      store.city.toLowerCase().includes(needle)
   );
}
