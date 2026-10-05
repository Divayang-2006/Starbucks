import { StoreList, Theme } from 'starbucks';

/**
 * The seeded store locator, verbatim from `src/data/stores.ts`.
 *
 * Two fields read oddly on purpose. `distanceKm` is measured **as if you are
 * standing in Pune**, which is why the Delhi rows are four figures — the honest
 * reading rather than the flattering one. `etaMins` is *prep* time, not travel
 * time, so a busy flagship is slower than a quiet highway kiosk 1,100 km away.
 */
const STORES = [
   {
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
   },
   {
      id: 'pune-viman-nagar',
      name: 'Phoenix Marketcity',
      area: 'Viman Nagar',
      city: 'Pune',
      coordinate: [73.9143, 18.5619],
      distanceKm: 4.8,
      etaMins: 12,
      opensAt: '10:00',
      closesAt: '23:30',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'pune-wakad-highway',
      name: 'Wakad Highway',
      area: 'Mumbai–Bengaluru Expressway',
      city: 'Pune',
      coordinate: [73.762, 18.598],
      distanceKm: 11.4,
      etaMins: 4,
      opensAt: '00:00',
      closesAt: '23:59',
      isOpen: true,
      services: ['driveThru', 'takeaway'],
   },
   {
      id: 'mumbai-horniman-circle',
      name: 'Horniman Circle',
      area: 'Fort',
      city: 'Mumbai',
      coordinate: [72.8347, 18.9322],
      distanceKm: 118.6,
      etaMins: 14,
      opensAt: '08:00',
      closesAt: '00:30',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'mumbai-linking-road',
      name: 'Linking Road',
      area: 'Bandra West',
      city: 'Mumbai',
      coordinate: [72.833, 19.0607],
      distanceKm: 127.3,
      etaMins: 9,
      opensAt: '09:00',
      closesAt: '01:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'mumbai-palladium',
      name: 'Palladium',
      area: 'Lower Parel',
      city: 'Mumbai',
      coordinate: [72.8258, 18.9945],
      distanceKm: 121.9,
      etaMins: 18,
      opensAt: '11:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'bengaluru-mg-road',
      name: 'MG Road',
      area: 'Trinity Circle',
      city: 'Bengaluru',
      coordinate: [77.6094, 12.975],
      distanceKm: 736.4,
      etaMins: 8,
      opensAt: '08:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'bengaluru-koramangala',
      name: 'Koramangala 5th Block',
      area: '80 Feet Road',
      city: 'Bengaluru',
      coordinate: [77.6112, 12.9345],
      distanceKm: 740.1,
      etaMins: 11,
      opensAt: '08:30',
      closesAt: '23:30',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'bengaluru-indiranagar',
      name: 'Indiranagar',
      area: '100 Feet Road',
      city: 'Bengaluru',
      coordinate: [77.6408, 12.9719],
      distanceKm: 737.8,
      etaMins: 7,
      opensAt: '09:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'delhi-connaught-place',
      name: 'Connaught Place',
      area: 'Block A, Inner Circle',
      city: 'New Delhi',
      coordinate: [77.2195, 28.6315],
      distanceKm: 1181.2,
      etaMins: 13,
      opensAt: '08:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'delhi-select-citywalk',
      name: 'Select Citywalk',
      area: 'Saket District Centre',
      city: 'New Delhi',
      coordinate: [77.2197, 28.5285],
      distanceKm: 1174.6,
      etaMins: 15,
      isOpen: false,
      opensAt: '10:30',
      closesAt: '22:30',
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'delhi-khan-market',
      name: 'Khan Market',
      area: 'Rabindra Nagar',
      city: 'New Delhi',
      coordinate: [77.227, 28.5995],
      distanceKm: 1178.9,
      etaMins: 5,
      opensAt: '09:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['takeaway'],
   },
];

const PUNE = STORES.slice(0, 3);
const NEW_DELHI = STORES.filter((store) => store.city === 'New Delhi');
const BANDRA = STORES.filter((store) => store.area === 'Bandra West');

/** The seed's own distances. The real screen swaps in a haversine off your fix. */
const distanceFor = (store: { distanceKm: number }) => store.distanceKm;

/**
 * The sheet the list is the floor of: white, `Radius.sheet` at the top, and a
 * definite height, because `StoreList` is `flex: 1` around a `ScrollView`.
 */
const sheet = {
   width: 390,
   height: 330,
   background: Theme.Surface.raised,
   borderTopLeftRadius: 28,
   borderTopRightRadius: 28,
   paddingTop: 16,
   overflow: 'hidden',
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * Arrival: the three Pune stores, sorted by distance, nothing typed.
 *
 * This is the face the sheet shows first rather than something behind a "view
 * list" toggle — every path through the picker, including no map at all, has to
 * end with someone able to pick a store from here.
 *
 * Store names are set in the brand sans, not Fraunces. The design system rations
 * the serif to one appearance per screen and this screen spends it on the store
 * you have actually chosen, over in `StoreDetail`.
 */
export function Default() {
   return (
      <div style={sheet}>
         <StoreList
            stores={PUNE}
            query=""
            onQueryChange={() => {}}
            distanceFor={distanceFor}
            onSelect={() => {}}
            note={null}
            bottomInset={0}
         />
      </div>
   );
}

/**
 * `note` — the one quiet line the screen is allowed about location, over the
 * unfiltered twelve.
 *
 * This is what you land on with location denied: every store in the country,
 * sorted by a distance measured from Pune, and a line saying so rather than
 * letting the numbers imply a fix we do not have. The list scrolls — only the
 * near end is in frame here, which is the point of sorting it.
 *
 * Only `driveThru` and `reserve` earn a pill on a row. Dine-in and takeaway are
 * table stakes, and showing all four would be noise on every row.
 */
export function WithLocationNote() {
   return (
      <div style={{ ...sheet, height: 480 }}>
         <StoreList
            stores={STORES}
            query=""
            onQueryChange={() => {}}
            distanceFor={distanceFor}
            onSelect={() => {}}
            note="Location is off, so distances are measured from Pune. Tap the crosshair to change that."
            bottomInset={0}
         />
      </div>
   );
}

/**
 * The far end of that same list — New Delhi, 1,100 km from where the seed says
 * you are standing.
 *
 * Two things only this end of the list shows. Distances past 10 km lose their
 * decimal and gain a thousands separator, because `847 m` precision on a
 * 1,181 km number is a lie either way. And Select Citywalk is the one seeded
 * store that is **shut**: grey dot, "Opens 10:30 am" instead of a closing time,
 * a faded disc, and an em dash where the ETA would be, because there is no
 * honest prep time for a closed store.
 */
export function FarCity() {
   return (
      <div style={sheet}>
         <StoreList
            stores={NEW_DELHI}
            query=""
            onQueryChange={() => {}}
            distanceFor={distanceFor}
            onSelect={() => {}}
            note={null}
            bottomInset={0}
         />
      </div>
   );
}

/**
 * A search in flight, and the clear button that only exists while there is
 * something to clear.
 *
 * The query escapes the city filter on purpose: typing "bandra" while looking at
 * Pune should find Bandra rather than nothing. iOS' own `clearButtonMode` is off
 * because we draw this one ourselves — leaving both on gives the field two
 * buttons that do the same thing.
 */
export function Searching() {
   return (
      <div style={{ ...sheet, height: 250 }}>
         <StoreList
            stores={BANDRA}
            query="bandra"
            onQueryChange={() => {}}
            distanceFor={distanceFor}
            onSelect={() => {}}
            note={null}
            bottomInset={0}
         />
      </div>
   );
}

/**
 * Nothing matched — the empty state, quoting the query back and offering the
 * one action that fixes it.
 *
 * The cup mark at 35% keeps the state feeling like this app rather than like a
 * generic "no results" card, and the copy names what *would* work ("try a
 * locality, or a city") instead of just reporting the failure.
 */
export function NoMatches() {
   return (
      <div style={{ ...sheet, height: 360 }}>
         <StoreList
            stores={[]}
            query="andheri"
            onQueryChange={() => {}}
            distanceFor={distanceFor}
            onSelect={() => {}}
            note={null}
            bottomInset={0}
         />
      </div>
   );
}
