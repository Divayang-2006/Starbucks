import { MapPlate, PickerHeader, Theme } from 'starbucks';

/**
 * `buildCityFilters(STORES)` output, verbatim — an "All stores" anchor plus one
 * per city, in first-appearance order rather than alphabetical, because the
 * seed is ordered by how close each city is to the notional user in Pune.
 *
 * `center` is the centroid of that city's stores and `zoom` comes from
 * `CAMERA`: 4.1 for the whole country, 11.2 for a city.
 */
const CITY_FILTERS = [
   { id: 'all', label: 'All stores', center: [75.38222, 19.77703], zoom: 4.1, count: 12 },
   { id: 'Pune', label: 'Pune', center: [73.85517, 18.56537], zoom: 11.2, count: 3 },
   { id: 'Mumbai', label: 'Mumbai', center: [72.83117, 18.9958], zoom: 11.2, count: 3 },
   { id: 'Bengaluru', label: 'Bengaluru', center: [77.62047, 12.96047], zoom: 11.2, count: 3 },
   { id: 'New Delhi', label: 'New Delhi', center: [77.22207, 28.5865], zoom: 11.2, count: 3 },
];

/**
 * The rail floats *on* the map and is positioned by `top`, so its frame has to
 * be a positioned box with the map's own House Green under it.
 */
const overMap = {
   position: 'relative',
   width: 390,
   height: 150,
   background: Theme.Surface.inverse,
   overflow: 'hidden',
} as const;

/**
 * The picker's default arrival state: Pune selected.
 *
 * `headerInset` is the height of the real `UINavigationBar` above — transparent
 * and blurred, with the title and the locate button in it — which is why this
 * is positioned by `top` rather than by padding: the map runs underneath the
 * bar to y=0 and only UIKit knows how tall it really is. 96 is a large-title
 * bar on a notched phone.
 *
 * The pills are translucent cream over green until selected, when they fill
 * solid — the design system's "selected chips are House Green on cream", read
 * in reverse, because here the cream is the foreground.
 */
export function Default() {
   return (
      <div style={overMap}>
         <PickerHeader
            filters={CITY_FILTERS}
            activeCityId="Pune"
            onSelectCity={() => {}}
            headerInset={96}
         />
      </div>
   );
}

/**
 * "All stores" active — the state the rail snaps to while a search is running.
 *
 * A search deliberately escapes the city filter (typing "bandra" while looking
 * at Pune should find Bandra), so the rail reads All and the widened scope is
 * visible rather than implied. The counts come from the data, so the anchor
 * pill can never disagree with the list.
 */
export function AllStores() {
   return (
      <div style={overMap}>
         <PickerHeader
            filters={CITY_FILTERS}
            activeCityId="all"
            onSelectCity={() => {}}
            headerInset={96}
         />
      </div>
   );
}

/**
 * The full top of the screen as it renders on the web: the rail over the
 * map-unavailable plate.
 *
 * This is the honest composition, not a stand-in — with no Mapbox SDK in the
 * web bundle the plate *is* what the rail floats on, and it is what the pills'
 * translucency has to hold up against. `headerInset` drops to 12 here because
 * a preview card has no navigation bar to clear.
 */
export function OverThePlate() {
   return (
      <div style={{ ...overMap, height: 300 }}>
         <MapPlate reason="unsupported" bottomInset={0} />
         <PickerHeader
            filters={CITY_FILTERS}
            activeCityId="Mumbai"
            onSelectCity={() => {}}
            headerInset={12}
         />
      </div>
   );
}
