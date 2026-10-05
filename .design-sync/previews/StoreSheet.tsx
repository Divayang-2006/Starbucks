import { MapPlate, StoreSheet, Theme } from 'starbucks';

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

const distanceFor = (store: { distanceKm: number }) => store.distanceKm;

/** `sheetHeight(844)` — 46% of the window, clamped to [316, 396]. */
const SHEET_HEIGHT = 388;

/**
 * A phone-sized stage. The sheet is absolutely positioned to the bottom of its
 * parent, and `MapPlate` behind it is not scenery — on the web it is literally
 * what the sheet stands on.
 */
const phone = {
   position: 'relative',
   width: 390,
   height: 620,
   background: Theme.Surface.inverse,
   overflow: 'hidden',
} as const;

const handlers = {
   onQueryChange: () => {},
   onSelect: () => {},
   onConfirm: () => {},
   onBack: () => {},
   onToggleCollapsed: () => {},
   distanceFor,
};

/**
 * Browsing — the list face forward, the collapse chevron in the header.
 *
 * Both faces are always mounted and only ever transformed, so nothing
 * re-lays-out during the turn between them and the map's fly-to can run on the
 * same beat. The chevron is drawn as a button rather than as a grabber because
 * the sheet is deliberately **not** draggable: a pan starting here would race
 * @rnmapbox's own gesture recogniser.
 */
export function Browsing() {
   return (
      <div style={phone}>
         <MapPlate reason="unsupported" bottomInset={SHEET_HEIGHT} />
         <StoreSheet
            height={SHEET_HEIGHT}
            bottomInset={0}
            selected={null}
            collapsed={false}
            collapsible
            stores={STORES}
            query=""
            note={null}
            {...handlers}
         />
      </div>
   );
}

/**
 * A pin was tapped: the detail face is forward and the header has swapped its
 * chevron for "All stores".
 *
 * One shared driver runs both — the list slides up and out while the card slides
 * up and in, crossing in the middle, so it reads as the sheet turning to look at
 * you rather than as a modal snapping over it. The serif name appears here and
 * only here.
 */
export function StoreSelected() {
   return (
      <div style={phone}>
         <MapPlate reason="unsupported" bottomInset={SHEET_HEIGHT} />
         <StoreSheet
            height={SHEET_HEIGHT}
            bottomInset={0}
            selected={STORES[0]}
            collapsed={false}
            collapsible
            stores={STORES}
            query=""
            note={null}
            {...handlers}
         />
      </div>
   );
}

/**
 * Peeked: `collapsed` translates the sheet down to a 92pt strip so the map can be
 * read, and rotates the chevron 180° to say how to get it back.
 *
 * It moves by `translateY` rather than by an animated `height` — animating the
 * height would re-lay-out the list's `ScrollView` on every frame. The list is
 * still mounted and still scrolled where you left it, just below the fold.
 *
 * `collapsible` is false when there is no map worth peeking at, which on the web
 * is always — the real screen passes `HAS_MAP`, so this control is hidden there
 * and the sheet keeps its full height over the plate.
 */
export function Peeked() {
   return (
      <div style={phone}>
         <MapPlate reason="unsupported" bottomInset={92} />
         <StoreSheet
            height={SHEET_HEIGHT}
            bottomInset={0}
            selected={null}
            collapsed
            collapsible
            stores={STORES}
            query=""
            note="Distances are measured from where you are now."
            {...handlers}
         />
      </div>
   );
}
