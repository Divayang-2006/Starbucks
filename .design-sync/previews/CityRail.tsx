import type { ReactNode } from 'react';
import { CityRail, CupMark } from 'starbucks';

/*
 * The pills are translucent cream over green until selected, so a cell on white
 * would show four ghosts. Every one of these puts the rail on the surface it was
 * drawn for: the dark green map.
 *
 * The filters below are the real output of `buildCityFilters(STORES)` — first
 * appearance order, centroid per city, `CAMERA.allZoom` 4.1 for "All stores" and
 * `CAMERA.cityZoom` 11.2 for the rest. Twelve stores, three per city.
 */
const HOUSE = '#1E3932';
const CREAM = '#F7F5F0';
const TERTIARY = '#79817E';

const FILTERS = [
   { id: 'all', label: 'All stores', center: [75.38222, 19.77703] as [number, number], zoom: 4.1, count: 12 },
   { id: 'Pune', label: 'Pune', center: [73.85517, 18.56537] as [number, number], zoom: 11.2, count: 3 },
   { id: 'Mumbai', label: 'Mumbai', center: [72.83117, 18.9958] as [number, number], zoom: 11.2, count: 3 },
   { id: 'Bengaluru', label: 'Bengaluru', center: [77.62047, 12.96047] as [number, number], zoom: 11.2, count: 3 },
   { id: 'New Delhi', label: 'New Delhi', center: [77.22207, 28.5865] as [number, number], zoom: 11.2, count: 3 },
];

const CAPTION = {
   fontFamily: 'Urbanist_500Medium',
   fontSize: 11,
   letterSpacing: 0.5,
   color: TERTIARY,
} as const;

/** Pin scatter, so the rail is seen against the tonal variation it really floats on. */
const PINS = [
   { left: '12%', top: '58%' },
   { left: '40%', top: '72%' },
   { left: '66%', top: '52%' },
   { left: '88%', top: '76%' },
];

function MapField({
   width,
   height = 150,
   pins = true,
   children,
}: {
   width: number;
   height?: number;
   pins?: boolean;
   children: ReactNode;
}) {
   return (
      <div
         style={{
            position: 'relative',
            width,
            height,
            borderRadius: 20,
            overflow: 'hidden',
            background: HOUSE,
            paddingTop: 18,
         }}>
         <div
            style={{
               position: 'absolute',
               inset: 0,
               background:
                  'radial-gradient(110% 80% at 25% 20%, rgba(0,168,98,0.2), rgba(0,0,0,0) 62%)',
            }}
         />
         {(pins ? PINS : []).map((pin) => (
            <div
               key={pin.left}
               style={{
                  position: 'absolute',
                  left: pin.left,
                  top: pin.top,
                  width: 28,
                  height: 28,
                  marginLeft: -14,
                  borderRadius: 999,
                  background: CREAM,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CupMark size={15} color={HOUSE} />
            </div>
         ))}
         <div style={{ position: 'relative' }}>{children}</div>
      </div>
   );
}

/**
 * The picker's opening state: seeded distances are measured as if you are
 * standing in Pune, so Pune is the city the rail lands on. The selected pill
 * fills solid cream with green type; the rest stay translucent white over the
 * map, which is the design system's "selected chips are House Green on cream"
 * rule read in reverse, because here the cream is the foreground.
 */
export function OnTheMap() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
         <MapField width={380}>
            <CityRail filters={FILTERS} activeId="Pune" onSelect={() => {}} />
         </MapField>
         <span style={CAPTION}>activeId=&quot;Pune&quot; · 380 pt, the rail clips and scrolls</span>
      </div>
   );
}

/**
 * The selection moving across the set, at a width that keeps every pill on
 * screen so the change is unambiguous. Only one pill is ever filled, and the
 * count beside each label drops from `TextColor.onDarkMuted` to
 * `TextColor.tertiary` as it inverts — the number stays subordinate to the city
 * in both states.
 */
export function SelectionSweep() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
         {['Mumbai', 'New Delhi'].map((activeId) => (
            <div key={activeId} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
               <MapField width={580} height={70} pins={false}>
                  <CityRail filters={FILTERS} activeId={activeId} onSelect={() => {}} />
               </MapField>
               <span style={CAPTION}>activeId=&quot;{activeId}&quot;</span>
            </div>
         ))}
      </div>
   );
}

/**
 * All five pills at once, which needs about 560 pt — on a phone the rail always
 * runs off the edge, and that peek is the affordance saying it scrolls. Counts
 * come from the data, so a new store in a new city adds its pill for free and
 * the two can never disagree.
 */
export function FullSet() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
         <MapField width={580} height={70} pins={false}>
            <CityRail filters={FILTERS} activeId="all" onSelect={() => {}} />
         </MapField>
         <span style={CAPTION}>All stores 12 · Pune 3 · Mumbai 3 · Bengaluru 3 · New Delhi 3</span>
      </div>
   );
}

/**
 * A single-city dataset — what the rail looks like before the seed grows. "All
 * stores" and one city is the degenerate case, and it still reads as a rail
 * rather than as two stray chips because the counts carry the difference.
 */
export function SingleCity() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
         <MapField width={380} height={70} pins={false}>
            <CityRail
               filters={[
                  { id: 'all', label: 'All stores', center: [73.85517, 18.56537], zoom: 4.1, count: 3 },
                  { id: 'Pune', label: 'Pune', center: [73.85517, 18.56537], zoom: 11.2, count: 3 },
               ]}
               activeId="Pune"
               onSelect={() => {}}
            />
         </MapField>
         <span style={CAPTION}>Two pills, derived from three Pune stores</span>
      </div>
   );
}
