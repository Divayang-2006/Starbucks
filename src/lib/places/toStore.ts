/**
 * Search Box feature → the app's `Store`.
 *
 * ## Every Starbucks is called "Starbucks"
 *
 * That is the whole problem this file exists to solve. `properties.name` is
 * literally `"Starbucks"` on every single result, so a list of them is a list of
 * identical rows. The reference app labels stores by locality — "Koregaon Park",
 * "Phoenix Marketcity" — so the display name has to be *derived* from the address
 * context, and that derivation is the interesting part of the mapping.
 *
 * Preference order, best-to-worst signal:
 *
 *   1. `context.street.name`  — "Gokhale Marg", the street it is on
 *   2. `context.address.street_name`
 *   3. `context.place.name`   — falls back to the city, e.g. "Pune"
 *
 * Indian street names in this dataset routinely carry a landmark clause —
 * `"Gokhale Marg Near Fergusson College"` — which is useful in an address and far
 * too long for a title, so it is trimmed at the landmark word.
 */

import type { Store, StoreService } from '@/lib/session';

import { openStateFromPeriods } from './hours';
import type { SearchBoxFeature } from './types';

/** Landmark clauses that turn a street name into a sentence. */
const LANDMARK_CLAUSE = /\s+(near|opp\.?|opposite|behind|beside|next to|above)\s+.*$/i;

/**
 * Words that stay lowercase mid-name. Short *nouns* must not be on this list —
 * an earlier version simply skipped every word of two characters or fewer and
 * produced "Senapati Bapat rd" and "Late ga Kulkarni Path" on live Pune data,
 * because "rd" and "ga" are two characters and are not connectors.
 */
const LOWERCASE_WORDS = new Set(['of', 'and', 'the', 'at', 'on', 'to', 'de', 'da']);

/** Abbreviations that look wrong in title case. */
const UPPERCASE_WORDS = new Set(['mg', 'jm', 'sb', 'dp', 'fc', 'tp', 'nh', 'sv']);

function titleCase(value: string): string {
   return value
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word, index) => {
         if (UPPERCASE_WORDS.has(word)) return word.toUpperCase();
         if (index > 0 && LOWERCASE_WORDS.has(word)) return word;
         return word.replace(/^./, (c) => c.toUpperCase());
      })
      .join(' ');
}

function displayName(feature: SearchBoxFeature): string {
   const context = feature.properties.context;
   const raw =
      context?.street?.name ??
      context?.address?.street_name ??
      context?.place?.name ??
      feature.properties.name;

   const trimmed = raw.replace(LANDMARK_CLAUSE, '').trim();
   // Guard against a street name that is *only* a landmark clause.
   return titleCase(trimmed.length > 2 ? trimmed : raw);
}

/**
 * The locality line under the name. `place_formatted` is the API's own
 * human-readable summary and reads better than anything reassembled from parts;
 * it is only trimmed of the trailing country, which every row would repeat.
 */
function areaLine(feature: SearchBoxFeature): string {
   const { place_formatted, full_address, context } = feature.properties;
   const source = place_formatted ?? full_address ?? '';
   const country = context?.country?.name;

   const withoutCountry = country ? source.replace(new RegExp(`,?\\s*${country}\\s*$`), '') : source;
   return withoutCountry.trim() || (context?.place?.name ?? '');
}

/**
 * A prep-and-collect estimate, not an API value — Mapbox has no ETA field.
 *
 * Six minutes of barista time plus travel at roughly 20 km/h, which is an honest
 * urban-India average once traffic and parking are in it. Clamped to a floor of
 * eight so a store in the same building never claims to be ready before you could
 * physically reach the counter. Anywhere this surfaces it is prefixed "~".
 */
const PREP_MINS = 6;
const CITY_SPEED_KMH = 20;

function estimateEta(distanceKm: number): number {
   const travel = (distanceKm / CITY_SPEED_KMH) * 60;
   return Math.max(8, Math.round(PREP_MINS + travel));
}

/**
 * Services are unknown until the Places detail arrives — `/forward` carries no
 * attributes. Every Starbucks does dine-in and takeaway, so those two are assumed
 * as the floor and the real set replaces them once a sheet is opened. Drive-thru
 * is never assumed; it is rare enough that guessing it would be a lie.
 */
const ASSUMED_SERVICES: StoreService[] = ['dineIn', 'takeaway'];

export function toStore(feature: SearchBoxFeature, now: Date): Store {
   const { properties, geometry } = feature;
   const periods = properties.metadata?.open_hours?.periods;
   const open = openStateFromPeriods(periods, now);

   // Metres, and only present when the request carried a proximity.
   const distanceKm = typeof properties.distance === 'number' ? properties.distance / 1000 : 0;

   return {
      id: properties.mapbox_id,
      mapboxId: properties.mapbox_id,
      name: displayName(feature),
      area: areaLine(feature),
      city: properties.context?.place?.name ?? '',
      coordinate: geometry.coordinates,
      distanceKm,
      etaMins: estimateEta(distanceKm),
      // 24-hour, matching the contract the seeded rows set — `formatHours` in
      // `store-picker/geo.ts` parses these, and handing it a pre-formatted
      // "11:00 pm" makes it print "11:00 pm pm".
      opensAt: open.opens24,
      closesAt: open.closes24,
      isOpen: open.isOpen,
      services: ASSUMED_SERVICES,
   };
}

/**
 * The routable point is where a car can actually stop — Mapbox distinguishes it
 * from the POI centroid, which for a mall store is the middle of the mall. Use it
 * for directions and for the camera, and the plain coordinate for the pin.
 */
export function routablePoint(feature: SearchBoxFeature): [number, number] {
   const point = feature.properties.coordinates?.routable_points?.[0];
   return point ? [point.longitude, point.latitude] : feature.geometry.coordinates;
}
