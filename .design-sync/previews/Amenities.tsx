import { Amenities, Theme } from 'starbucks';

/**
 * `amenityFacts()` output — `{ id, label, glyph }`, ordered by how much each
 * one would change your mind about walking there. These are the six a US
 * Starbucks record returns first.
 */
const SAN_FRANCISCO = [
   { id: 'feature_wi_fi', label: 'Free Wi-Fi', glyph: 'scan' },
   { id: 'laptop_work_friendly', label: 'Laptop friendly', glyph: 'article' },
   { id: 'payment_type_mobile_nfc', label: 'Tap to pay', glyph: 'pay' },
   { id: 'feature_outdoor_seating', label: 'Outdoor seating', glyph: 'pin' },
   { id: 'offering_breakfast', label: 'Breakfast', glyph: 'order' },
   { id: 'group_friendly', label: 'Good for groups', glyph: 'person' },
];

/** What the Koregaon Park record actually carries. Three keys, not ten. */
const PUNE = [
   { id: 'payment_type_mobile_nfc', label: 'Tap to pay', glyph: 'pay' },
   { id: 'offering_vegetarian_options', label: 'Vegetarian options', glyph: 'heart' },
   { id: 'known_for_coffee', label: 'Known for coffee', glyph: 'rewards' },
];

/** The whole mapping table — every amenity the attribute bag can produce. */
const EVERYTHING = [
   ...SAN_FRANCISCO,
   { id: 'offering_vegetarian_options', label: 'Vegetarian options', glyph: 'heart' },
   { id: 'solo_dining_friendly', label: 'Good solo', glyph: 'person' },
   { id: 'known_for_coffee', label: 'Known for coffee', glyph: 'rewards' },
   { id: 'accommodation_high_chairs', label: 'High chairs', glyph: 'crown' },
];

/** The app's cream, so the white sheet these pills live in reads as a surface. */
const page = {
   width: 390,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/** `Surface.raised` — the store sheet. The pills recess to `Surface.sunken` on it. */
const sheet = {
   background: Theme.Surface.raised,
   borderRadius: 20,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * A well-populated US record: six pills, wrapping to two rows.
 *
 * Pills on `Surface.sunken` rather than outlined — an outline this small,
 * directly under the search field's outline, starts to look like a form.
 */
export function SanFrancisco() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Amenities facts={SAN_FRANCISCO} />
         </div>
      </div>
   );
}

/**
 * The sparse case, which is the normal one in India.
 *
 * Three pills on one row. The section is an independent block rather than a
 * fixed slot, so it simply gets shorter — nothing above or below reflows into a
 * hole, and there is no "no Wi-Fi" pill, because a missing key means unknown.
 */
export function Pune() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Amenities facts={PUNE} />
         </div>
      </div>
   );
}

/**
 * Ten facts in, six pills out — the cap, doing its job.
 *
 * `Amenities` slices at six on purpose: the full set runs to a dozen on a US
 * store, wraps to a third row, and stops being read at all. Vegetarian options,
 * Good solo, Known for coffee and High chairs are all present in the array
 * below and deliberately do not render.
 */
export function CappedAtSix() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Amenities facts={EVERYTHING} />
         </div>
      </div>
   );
}
