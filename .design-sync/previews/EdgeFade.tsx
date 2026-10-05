import type { ReactNode } from 'react';
import { CupMark, EdgeFade } from 'starbucks';

/*
 * EdgeFade is a two-stop scrim. On its own it is invisible, so every cell
 * composes it over a stand-in for the thing it exists to sit on: the dark green
 * map, with pins under it. The panel and the pin scatter are scaffolding; the
 * pins themselves are the real `CupMark`.
 *
 * Panels are held at 296 pt. On device the fade stretches (it is pinned with
 * left/right: 0), but rendered through react-native-web the underlying <svg>
 * falls back to its 300 px intrinsic width and the gradient stops dead there —
 * a wider panel here would show a seam that does not exist on a phone.
 */
const HOUSE = '#1E3932';
const ESPRESSO = '#0B1F1A';
const CREAM = '#F7F5F0';
const TERTIARY = '#79817E';

const PANEL = 296;

const CAPTION = {
   fontFamily: 'Urbanist_500Medium',
   fontSize: 11,
   letterSpacing: 0.5,
   color: TERTIARY,
   textAlign: 'center',
} as const;

type Pin = { left: string; top: string };

/** Pin positions lifted from the Pune cluster's relative geometry. */
const PINS: Pin[] = [
   { left: '14%', top: '18%' },
   { left: '42%', top: '10%' },
   { left: '72%', top: '24%' },
   { left: '24%', top: '48%' },
   { left: '58%', top: '44%' },
   { left: '86%', top: '56%' },
   { left: '10%', top: '76%' },
   { left: '38%', top: '80%' },
   { left: '68%', top: '72%' },
];

/** The same cluster, pushed clear of the title block the top scrim backs. */
const PINS_BELOW_TITLE: Pin[] = [
   { left: '20%', top: '46%' },
   { left: '52%', top: '38%' },
   { left: '80%', top: '50%' },
   { left: '14%', top: '72%' },
   { left: '44%', top: '78%' },
   { left: '74%', top: '68%' },
];

function MapField({
   width = PANEL,
   height = 220,
   pins = PINS,
   children,
}: {
   width?: number;
   height?: number;
   pins?: Pin[];
   children?: ReactNode;
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
         }}>
         {/* Two washes so the "map" is not a flat rectangle and the scrim has
             something with tonal variation to work against. */}
         <div
            style={{
               position: 'absolute',
               inset: 0,
               background:
                  'radial-gradient(120% 90% at 20% 15%, rgba(0,168,98,0.22), rgba(0,0,0,0) 60%)',
            }}
         />
         <div
            style={{
               position: 'absolute',
               inset: 0,
               background:
                  'radial-gradient(90% 70% at 85% 85%, rgba(212,233,226,0.14), rgba(0,0,0,0) 65%)',
            }}
         />
         {pins.map((pin) => (
            <div
               key={`${pin.left}-${pin.top}`}
               style={{
                  position: 'absolute',
                  left: pin.left,
                  top: pin.top,
                  width: 30,
                  height: 30,
                  marginLeft: -15,
                  borderRadius: 999,
                  background: CREAM,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CupMark size={16} color={HOUSE} />
            </div>
         ))}
         {children}
      </div>
   );
}

function Caption({ text }: { text: string }) {
   return <span style={CAPTION}>{text}</span>;
}

/**
 * Both edges over identical pin fields. The gradient is anchored at the edge and
 * runs to fully transparent at the far end, with a midpoint stop that stops it
 * banding across a short run — visible here as the pins losing contrast smoothly
 * rather than in a step.
 */
export function EdgeSweep() {
   return (
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <MapField width={280} height={220}>
               <EdgeFade edge="top" height={120} color={ESPRESSO} opacity={0.94} />
            </MapField>
            <Caption text="edge=&quot;top&quot;" />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <MapField width={280} height={220}>
               <EdgeFade edge="bottom" height={120} color={ESPRESSO} opacity={0.94} />
            </MapField>
            <Caption text="edge=&quot;bottom&quot;" />
         </div>
      </div>
   );
}

/**
 * What the scrim is actually for. The picker's navigation bar is transparent and
 * the map runs under it to y=0, so without this the title lands on whatever the
 * camera happens to be over. These are the real values the screen passes:
 * `Surface.inverseDeep` at 0.94, tall enough to clear the header plus a gutter.
 */
export function MapChrome() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
         <MapField width={PANEL} height={260} pins={PINS_BELOW_TITLE}>
            <EdgeFade edge="top" height={132} color={ESPRESSO} opacity={0.94} />
            <div
               style={{
                  position: 'absolute',
                  top: 28,
                  left: 20,
                  right: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
               }}>
               <span style={{ fontFamily: 'Urbanist_700Bold', fontSize: 22, color: CREAM }}>
                  Choose a store
               </span>
               <span
                  style={{
                     fontFamily: 'Urbanist_400Regular',
                     fontSize: 14,
                     color: 'rgba(255,255,255,0.72)',
                  }}>
                  12 stores across 4 cities
               </span>
            </div>
         </MapField>
         <Caption text="height 132 · color inverseDeep · opacity 0.94" />
      </div>
   );
}

/**
 * `opacity` is the value at the edge itself; the far end is always fully
 * transparent. 0.94 is what the picker ships — anything lighter stops being a
 * reliable backing for white type once the camera flies over a pale block.
 */
export function OpacitySweep() {
   return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
         {[0.35, 0.65, 0.94].map((opacity) => (
            <div
               key={opacity}
               style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
               <MapField width={180} height={200}>
                  <EdgeFade edge="top" height={120} color={ESPRESSO} opacity={opacity} />
               </MapField>
               <Caption text={`opacity ${opacity}`} />
            </div>
         ))}
      </div>
   );
}

/**
 * `height` is how far the fade reaches, not how strong it is. The picker sizes
 * it to the native header plus a gutter — short enough that the map keeps most
 * of its area, long enough that the transition never reads as a band.
 */
export function HeightSweep() {
   return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
         {[64, 120, 190].map((height) => (
            <div
               key={height}
               style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
               <MapField width={180} height={220}>
                  <EdgeFade edge="top" height={height} color={ESPRESSO} opacity={0.94} />
               </MapField>
               <Caption text={`height ${height}`} />
            </div>
         ))}
      </div>
   );
}

/**
 * It fades to House Green or to espresso — never to black. This is the one place
 * a scrim could quietly reintroduce the neutral shadow the design system rules
 * out, and the difference is real: `inverse` sinks the map into the header,
 * `inverseDeep` closes it off.
 */
export function ColourTokens() {
   return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <MapField width={240} height={200}>
               <EdgeFade edge="bottom" height={150} color={HOUSE} opacity={0.94} />
            </MapField>
            <Caption text="Surface.inverse · #1E3932" />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <MapField width={240} height={200}>
               <EdgeFade edge="bottom" height={150} color={ESPRESSO} opacity={0.94} />
            </MapField>
            <Caption text="Surface.inverseDeep · #0B1F1A" />
         </div>
      </div>
   );
}
