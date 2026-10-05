import { Accessibility, Theme } from 'starbucks';

/**
 * `accessibilityFacts()` output — the `true` attributes only, already mapped to
 * labels. What the San Francisco Starbucks record actually carries: entrance,
 * restroom and seating. `accommodation_wheelchair_accessible_parking` is in the
 * schema and was absent on every record observed.
 */
const SAN_FRANCISCO = [
   { id: 'accommodation_wheelchair_accessible_entrance', label: 'Wheelchair accessible' },
   { id: 'accommodation_wheelchair_accessible_restroom', label: 'Accessible restroom' },
   { id: 'accommodation_wheelchair_accessible_seating', label: 'Accessible seating' },
];

/** The full four the mapping table can produce, parking included. */
const EVERY_ROW = [
   { id: 'accommodation_wheelchair_accessible_entrance', label: 'Wheelchair accessible' },
   { id: 'accommodation_wheelchair_accessible_restroom', label: 'Accessible restroom' },
   { id: 'accommodation_wheelchair_accessible_parking', label: 'Accessible parking' },
   { id: 'accommodation_wheelchair_accessible_seating', label: 'Accessible seating' },
];

/** The app's cream, so the white sheet this section lives in reads as a surface. */
const page = {
   width: 390,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/** `Surface.raised` — the store sheet. */
const sheet = {
   background: Theme.Surface.raised,
   borderRadius: 20,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * A store that publishes accessibility data.
 *
 * Every row is a green tick against a `true`. Colour is not carrying the
 * meaning on its own — the tick glyph appears nowhere else in the sheet, so the
 * row is identifiable without it.
 */
export function Published() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Accessibility facts={SAN_FRANCISCO} />
         </div>
      </div>
   );
}

/**
 * **The variant that matters.** No data, and the copy refuses to turn that into
 * a negative.
 *
 * Mapbox's attributes are sparse rather than exhaustive: the Pune record
 * carries no accessibility keys at all, and that says nothing about the store.
 * So the section still renders — unlike `Amenities`, which returns null — and
 * says "unknown, not unavailable, call ahead if it matters". Rendering absence
 * as "not accessible" would be inventing data, and here it would be harmful.
 */
export function Unknown() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Accessibility facts={[]} />
         </div>
      </div>
   );
}

/**
 * All four rows, for the spacing rather than for the content.
 *
 * The list is `Space.sm` between rows and inset `Space.xs` from the section
 * head, so a long list stays a block under its title instead of drifting into
 * the section below it.
 */
export function EveryRow() {
   return (
      <div style={page}>
         <div style={sheet}>
            <Accessibility facts={EVERY_ROW} />
         </div>
      </div>
   );
}
