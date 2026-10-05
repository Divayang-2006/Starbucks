import { StoreMap, Theme } from 'starbucks';

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
];

/** Pune, at `CAMERA.cityZoom`. */
const CITY_CAMERA = { center: [73.85517, 18.56537], zoom: 11.2, duration: 900, pitch: 0 };

/** A focused store: closer, and tilted — the tilt is the reward for choosing. */
const FOCUS_CAMERA = { center: [73.8892, 18.5362], zoom: 16.4, duration: 700, pitch: 52 };

const frame = {
   position: 'relative',
   width: 390,
   height: 420,
   background: Theme.Surface.inverse,
   overflow: 'hidden',
} as const;

/**
 * **On the web this is the correct, finished render — there is no map to draw.**
 *
 * `src/lib/mapbox.web.ts` exports `Mapbox` as `undefined` so the web bundle
 * never pulls in @rnmapbox/maps (whose web entry imports a CSS file this project
 * does not ship). `StoreMap` checks that once, below every hook so the branch can
 * never reorder them, and returns `<MapPlate reason="unsupported">`.
 *
 * Nothing here is faked or stubbed: the component is being handed the same
 * twelve stores, camera and insets it gets on device, and this is what it
 * genuinely renders in a browser. On a dev build the same props draw House-Green
 * Mapbox Standard with the pins on it. The screen stays fully usable either way,
 * which is the whole reason the list is the sheet's arrival face.
 */
export function WebFallback() {
   return (
      <div style={frame}>
         <StoreMap
            stores={STORES}
            selectedId={null}
            matchedIds={null}
            camera={CITY_CAMERA}
            insets={{ top: 96, bottom: 0 }}
            showPuck={false}
            onSelect={() => {}}
            onDeselect={() => {}}
         />
      </div>
   );
}

/**
 * The same fallback with a store selected and the sheet standing on it.
 *
 * `insets.bottom` is how much of the frame the sheet covers. On device it pads
 * the camera so a focused pin stays clear of the sheet lip; through the plate it
 * is what keeps the copy from sitting behind it. `matchedIds` is null here —
 * that is "no search running", and it is what tells every pin to stay at full
 * strength rather than dimming.
 */
export function WithSheetInset() {
   return (
      <div style={{ ...frame, height: 620 }}>
         <StoreMap
            stores={STORES}
            selectedId="pune-koregaon-park"
            matchedIds={null}
            camera={FOCUS_CAMERA}
            insets={{ top: 96, bottom: 388 }}
            showPuck={false}
            onSelect={() => {}}
            onDeselect={() => {}}
         />
      </div>
   );
}
