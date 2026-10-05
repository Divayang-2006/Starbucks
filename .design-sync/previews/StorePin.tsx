import { StorePin, Theme } from 'starbucks';

/** Two seeded stores, verbatim — one open, one closed. */
const KOREGAON_PARK = {
   id: 'pune-koregaon-park',
   name: 'Koregaon Park',
   area: 'North Main Road',
   city: 'Pune',
   coordinate: [73.8892, 18.5362],
   distanceKm: 1.2,
   etaMins: 6,
   opensAt: '08:00',
   closesAt: '23:00',
   isOpen: true,
   services: ['dineIn', 'takeaway', 'reserve'],
};

const SELECT_CITYWALK = {
   id: 'delhi-select-citywalk',
   name: 'Select Citywalk',
   area: 'Saket District Centre',
   city: 'New Delhi',
   coordinate: [77.2197, 28.5285],
   distanceKm: 1174.6,
   etaMins: 15,
   opensAt: '10:30',
   closesAt: '22:30',
   isOpen: false,
   services: ['dineIn', 'takeaway'],
};

/**
 * The dark green basemap a pin is only ever seen on. The 72pt box is fixed —
 * Mapbox anchors a `MarkerView` by measuring its child, so everything animates
 * inside a constant frame rather than resizing it.
 */
const map = {
   width: 184,
   height: 132,
   background: Theme.Surface.inverse,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
} as const;

/**
 * At rest, open: a solid House Green disc with a full-strength cream ring,
 * standing on a stalk with a ground dot.
 *
 * Deliberately not a teardrop — a disc on a stalk reads as "a place" without
 * borrowing the map-app vocabulary, and it gives the selected state somewhere
 * to go, because the disc can lift off its own anchor.
 */
export function Open() {
   return (
      <div style={map}>
         <StorePin store={KOREGAON_PARK} selected={false} dimmed={false} onPress={() => {}} />
      </div>
   );
}

/**
 * Selected: the pin **inverts** rather than tinting — cream disc, green cup —
 * and lifts 9pt off its stalk with a halo ring behind it.
 *
 * Inversion is the only change still obvious at a glance across twelve pins on
 * a dark green map. The stalk is a static bar drawn *behind* the disc, so the
 * lift uncovers it rather than stretching it; that is what makes the joint look
 * welded instead of assembled.
 */
export function Selected() {
   return (
      <div style={map}>
         <StorePin store={KOREGAON_PARK} selected dimmed={false} onPress={() => {}} />
      </div>
   );
}

/**
 * Closed, told by *fill* rather than by a badge: espresso disc, ring and cup
 * mark at 45%.
 *
 * At 30pt an icon would not survive; a fill change does. This is Select
 * Citywalk, the one seeded store that is shut — the seed keeps it that way so
 * the picker stays honest about the state existing.
 */
export function Closed() {
   return (
      <div style={map}>
         <StorePin store={SELECT_CITYWALK} selected={false} dimmed={false} onPress={() => {}} />
      </div>
   );
}

/**
 * Dimmed: a live search is narrowing the map and this store is not one of the
 * hits.
 *
 * It recedes to 24% opacity and 82% scale rather than disappearing, so the map
 * keeps its shape while the matches stand out — and `pointerEvents` goes to
 * `none`, so a tap near a ghost pin can only ever land on a real result.
 */
export function Dimmed() {
   return (
      <div style={map}>
         <StorePin store={KOREGAON_PARK} selected={false} dimmed onPress={() => {}} />
      </div>
   );
}
