import type { ReactNode } from 'react';
import { CupMark } from 'starbucks';

/*
 * A cup silhouette, not the siren. The real `SirenLogo` is one ~8,000-character
 * path — right at 40pt+, mud at pin size. This mark is two primitives and reads
 * instantly inside a House Green disc, which is where it almost always lives.
 */
const CREAM = '#F7F5F0';
const WHITE = '#FFFFFF';
const HOUSE = '#1E3932';
const ESPRESSO = '#0B1F1A';
const HAIR = '#E3DFD6';
const TERTIARY = '#79817E';
const PRIMARY = '#14231E';

const CAPTION = {
   fontFamily: 'Urbanist_500Medium',
   fontSize: 11,
   letterSpacing: 0.5,
   color: TERTIARY,
   textAlign: 'center',
} as const;

/** A cream tile under the mark, so even a 0.35 cup has a defined ground. */
function Swatch({ caption, children }: { caption: string; children: ReactNode }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
         <div
            style={{
               width: 88,
               height: 88,
               borderRadius: 16,
               background: CREAM,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            {children}
         </div>
         <span style={CAPTION}>{caption}</span>
      </div>
   );
}

function Disc({
   size,
   background,
   ring,
   opacity,
   children,
}: {
   size: number;
   background: string;
   ring?: string;
   opacity?: number;
   children: ReactNode;
}) {
   return (
      <div
         style={{
            width: size,
            height: size,
            borderRadius: 999,
            background,
            border: ring ? `${Math.max(1.5, size / 20)}px solid ${ring}` : undefined,
            boxSizing: 'border-box',
            opacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         {children}
      </div>
   );
}

/**
 * The pin, at its real 30pt disc and again magnified so the geometry is
 * judgeable. Open and closed are told apart by *fill*, never by a badge, and
 * selection **inverts** the pin rather than tinting it — cream disc, green cup —
 * because inversion is the only change still obvious across twelve pins.
 *
 * The cream ring is what keeps a House Green disc off a House Green basemap, so
 * the panel here is the dark map rather than flat green: on flat green the open
 * pin would look like it had no disc at all, which is exactly the failure the
 * ring exists to prevent.
 */
export function PinDiscs() {
   return (
      <div
         style={{
            position: 'relative',
            background: ESPRESSO,
            borderRadius: 20,
            padding: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
         }}>
         <div
            style={{
               position: 'absolute',
               inset: 0,
               background:
                  'radial-gradient(120% 90% at 25% 20%, rgba(0,168,98,0.24), rgba(0,0,0,0) 62%)',
            }}
         />

         <div style={{ position: 'relative', display: 'flex', gap: 28, alignItems: 'center' }}>
            <Disc size={60} background={HOUSE} ring="rgba(247,245,240,0.92)">
               <CupMark size={32} color={CREAM} />
            </Disc>
            <Disc size={60} background={CREAM} ring={CREAM}>
               <CupMark size={32} color={HOUSE} />
            </Disc>
            <Disc size={60} background={ESPRESSO} ring="rgba(247,245,240,0.42)">
               <CupMark size={32} color={CREAM} opacity={0.45} />
            </Disc>
            <span
               style={{
                  fontFamily: 'Urbanist_500Medium',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.72)',
               }}>
               magnified 2×
            </span>
         </div>

         <div style={{ position: 'relative', display: 'flex', gap: 28, alignItems: 'center' }}>
            <Disc size={30} background={HOUSE} ring="rgba(247,245,240,0.92)">
               <CupMark size={16} color={CREAM} />
            </Disc>
            <Disc size={30} background={CREAM} ring={CREAM}>
               <CupMark size={16} color={HOUSE} />
            </Disc>
            <Disc size={30} background={ESPRESSO} ring="rgba(247,245,240,0.42)">
               <CupMark size={16} color={CREAM} opacity={0.45} />
            </Disc>
            <span
               style={{
                  fontFamily: 'Urbanist_500Medium',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.72)',
               }}>
               open · selected · closed, at 30 pt
            </span>
         </div>
      </div>
   );
}

/**
 * Every size the app asks for, in order: 15 in a list row's disc, 16 in a map
 * pin, 24 for a section mark, 40 for the "nothing here by that name" empty
 * state. Nothing in between — four calls, four decisions.
 */
export function SizeRamp() {
   return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Swatch caption="15 · list row">
            <CupMark size={15} color={HOUSE} />
         </Swatch>
         <Swatch caption="16 · map pin">
            <CupMark size={16} color={HOUSE} />
         </Swatch>
         <Swatch caption="24">
            <CupMark size={24} color={HOUSE} />
         </Swatch>
         <Swatch caption="40 · empty state">
            <CupMark size={40} color={HOUSE} />
         </Swatch>
      </div>
   );
}

/**
 * `opacity` is a prop rather than a wrapper style so the mark can dim without
 * the disc under it dimming too. Three real values: full, the 0.5 a closed
 * store's list row uses, and the 0.35 the empty state sets so the mark stays a
 * watermark instead of becoming an illustration.
 */
export function OpacityRamp() {
   return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Swatch caption="1 · open">
            <CupMark size={44} color={HOUSE} />
         </Swatch>
         <Swatch caption="0.5 · closed">
            <CupMark size={44} color={HOUSE} opacity={0.5} />
         </Swatch>
         <Swatch caption="0.35 · empty state">
            <CupMark size={44} color={TERTIARY} opacity={0.35} />
         </Swatch>
      </div>
   );
}

/**
 * The list row's leading disc, both states side by side. 34pt disc, 15pt mark in
 * `Surface.app` — the cup is cut out of the green rather than drawn on it, which
 * is why the colour passed in is a *surface* token and not a text one.
 */
export function ListRowDisc() {
   return (
      <div
         style={{
            background: WHITE,
            border: `1px solid ${HAIR}`,
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            gap: 28,
            alignItems: 'center',
         }}>
         <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Disc size={34} background={HOUSE}>
               <CupMark size={15} color={CREAM} />
            </Disc>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 14, color: PRIMARY }}>
               Koregaon Park
            </span>
         </div>
         <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Disc size={34} background={ESPRESSO} opacity={0.55}>
               <CupMark size={15} color={CREAM} opacity={0.5} />
            </Disc>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 14, color: TERTIARY }}>
               Select Citywalk
            </span>
         </div>
      </div>
   );
}
