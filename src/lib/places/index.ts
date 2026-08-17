/**
 * Mapbox Search Box + Places. Import from `@/lib/places`, not the files inside.
 *
 * Read `types.ts` first — it records which documented fields never actually
 * arrive, which is most of what you need to know before designing against this
 * API. Read the header of `client.ts` second, for why the two endpoints are
 * called at completely different frequencies.
 */

export { cachedDetails, fetchPlaceDetails, searchStarbucks, type SearchArea } from './client';
export {
   accessibilityFacts,
   amenityFacts,
   categoryLine,
   isVerified,
   servicesFromAttributes,
   type Fact,
} from './attributes';
export {
   openStateFromPeriods,
   periodsFromOsm,
   weekRanges,
   UNKNOWN_HOURS,
   type OpenState,
} from './hours';
export { routablePoint, toStore } from './toStore';
export type { OpenPeriod, PlaceAttributes, PlaceDetails, SearchBoxFeature } from './types';
