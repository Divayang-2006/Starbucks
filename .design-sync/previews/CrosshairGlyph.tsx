import type { ReactNode } from 'react';
import { CrosshairGlyph } from 'starbucks';

const CREAM = '#F7F5F0';
const WHITE = '#FFFFFF';
const HOUSE = '#1E3932';
const ESPRESSO = '#0B1F1A';
const HAIR = '#E3DFD6';

const TERTIARY = '#79817E';
const SECONDARY = '#5C6A65';
const ACTION = '#006241';
const ON_DARK = '#FFFFFF';
const ON_DARK_MUTED = 'rgba(255,255,255,0.72)';

const CAPTION = {
   fontFamily: 'Urbanist_500Medium',
   fontSize: 11,
   letterSpacing: 0.5,
   color: TERTIARY,
   textAlign: 'center',
} as const;

function Tile({
   background,
   caption,
   border,
   children,
}: {
   background: string;
   caption: string;
   border?: string;
   children: ReactNode;
}) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
         <div
            style={{
               width: 68,
               height: 68,
               borderRadius: 16,
               background,
               border: border ? `1px solid ${border}` : '1px solid transparent',
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

/**
 * The busiest of the four marks — a ring, a filled centre and four ticks — so
 * it is the one that loses the most below its 20 default. 16 is the floor; the
 * ticks start merging into the ring under it.
 */
export function SizeRamp() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="16">
            <CrosshairGlyph size={16} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="20 · default">
            <CrosshairGlyph size={20} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="24">
            <CrosshairGlyph size={24} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="32">
            <CrosshairGlyph size={32} color={SECONDARY} />
         </Tile>
      </div>
   );
}

/**
 * Its one job: the locate control. A crosshair rather than the usual filled
 * arrow because the arrow reads as "navigate" and this button only ever means
 * "where am I". Shown as the toolbar item on light chrome and as the floating
 * control over the map, which is where it spends most of its life.
 */
export function LocateControl() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="light bar · action">
            <div
               style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: WHITE,
                  border: `1px solid ${HAIR}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CrosshairGlyph size={20} color={ACTION} />
            </div>
         </Tile>
         <Tile background={HOUSE} caption="over map · onDark">
            <div
               style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CrosshairGlyph size={20} color={ON_DARK} />
            </div>
         </Tile>
         <Tile background={ESPRESSO} caption="tracking off · muted">
            <div
               style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CrosshairGlyph size={20} color={ON_DARK_MUTED} />
            </div>
         </Tile>
      </div>
   );
}

/**
 * The four colours it is allowed to be, each on the surface that colour belongs
 * to. Location permission is denied far more often than it is granted, so the
 * muted variant is not an edge case — it is half the states this control has.
 */
export function Palette() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={WHITE} caption="action" border={HAIR}>
            <CrosshairGlyph size={24} color={ACTION} />
         </Tile>
         <Tile background={CREAM} caption="secondary">
            <CrosshairGlyph size={24} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="tertiary · denied">
            <CrosshairGlyph size={24} color={TERTIARY} />
         </Tile>
         <Tile background={HOUSE} caption="onDark">
            <CrosshairGlyph size={24} color={ON_DARK} />
         </Tile>
      </div>
   );
}
