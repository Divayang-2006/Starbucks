import { StoreDetail, Theme } from 'starbucks';

/** Seeded stores, verbatim. No `mapboxId`, so no Places record to fetch. */
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

const WAKAD_HIGHWAY = {
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
 * The same store with a `mapboxId` — a live Search Box result rather than a
 * seeded row, which is the only kind that has a Places record to go and get.
 */
const LIVE_HORNIMAN_CIRCLE = {
   id: 'dXJuOm1ieHBvaTo0YTNlYzJlMi0yZjNhLTQ5MTAtOWU5NC1hMmZkMDdjMjIxZjE',
   mapboxId: 'dXJuOm1ieHBvaTo0YTNlYzJlMi0yZjNhLTQ5MTAtOWU5NC1hMmZkMDdjMjIxZjE',
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
};

/**
 * The detail face fills the sheet and pins its confirm footer to the bottom, so
 * it needs a definite height to be `flex: 1` inside.
 */
const sheet = {
   width: 390,
   height: 380,
   background: Theme.Surface.raised,
   borderTopLeftRadius: 28,
   borderTopRightRadius: 28,
   paddingTop: 12,
   overflow: 'hidden',
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * A chosen store. **This is the screen's one licensed use of Fraunces.**
 *
 * The design system rations the serif to a handful of jobs and warns that two on
 * a screen means one is wrong — so the list rows opposite are set in the brand
 * sans and the name only becomes display type once you have picked it out. The
 * switch is the reward.
 *
 * Under it: the open dot and closing time, the two metrics hairlined top and
 * bottom (distance and *prep* time, not travel time), the service pills, and a
 * confirm footer that is a sibling of the scroll rather than inside it.
 */
export function Default() {
   return (
      <div style={sheet}>
         <StoreDetail
            store={KOREGAON_PARK}
            distanceKm={1.2}
            onConfirm={() => {}}
            bottomInset={0}
         />
      </div>
   );
}

/**
 * `onBack` — the "All stores" row, which only the **native** sheet passes.
 *
 * The Reanimated sheet draws its own header with the back control in it, because
 * that header also owns a collapse chevron that has to sit on the same line. A
 * `UISheetPresentationController` has no such strip — UIKit owns it and puts a
 * grabber there — so on iOS the affordance has to live in the content instead.
 *
 * Wakad Highway also shows the 24-hour reading: hours that span the clock say
 * "Open 24 hours" rather than claiming to close at 11:59 pm.
 */
export function WithBackRow() {
   return (
      <div style={sheet}>
         <StoreDetail
            store={WAKAD_HIGHWAY}
            distanceKm={11.4}
            onConfirm={() => {}}
            bottomInset={0}
            onBack={() => {}}
         />
      </div>
   );
}

/**
 * A closed store, which is still a choosable store.
 *
 * Three things change together and none of them is a block: the dot goes grey,
 * the hours line becomes "Opens 10:30 am", and the footer grows a caution line
 * above a CTA that now reads **Set as my store** instead of *Order from here*.
 * Picking your local while it is shut is a normal thing to want to do.
 */
export function Closed() {
   return (
      <div style={sheet}>
         <StoreDetail
            store={SELECT_CITYWALK}
            distanceKm={1174.6}
            onConfirm={() => {}}
            bottomInset={0}
         />
      </div>
   );
}

/**
 * A live store whose Places lookup came back empty.
 *
 * A `mapboxId` is what makes the sheet spend one record of the 1,000-a-month
 * preview quota, and it is spent only here — a sheet being open is the app's
 * proof that someone wants this store's details. When the record does not exist
 * the sheet says so in one `micro` line and stops. There are no skeletons on
 * purpose: the half above is already complete and useful, and a shimmer under it
 * would imply the store is only half-loaded.
 */
export function NoPlacesRecord() {
   return (
      <div style={sheet}>
         <StoreDetail
            store={LIVE_HORNIMAN_CIRCLE}
            distanceKm={118.6}
            onConfirm={() => {}}
            bottomInset={0}
         />
      </div>
   );
}
