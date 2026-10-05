import type { ReactNode } from 'react';
import { ChevronGlyph } from 'starbucks';

const CREAM = '#F7F5F0';
const WHITE = '#FFFFFF';
const HOUSE = '#1E3932';
const HAIR = '#E3DFD6';

const TERTIARY = '#79817E';
const SECONDARY = '#5C6A65';
const PRIMARY = '#14231E';
const ON_DARK = '#FFFFFF';

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
 * Five sizes across the range the chrome uses. 18 is the default; 16 and 20 are
 * the two the store sheet and the detail header actually ask for.
 */
export function SizeRamp() {
   return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="14">
            <ChevronGlyph size={14} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="16">
            <ChevronGlyph size={16} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="18 · default">
            <ChevronGlyph size={18} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="20">
            <ChevronGlyph size={20} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="24">
            <ChevronGlyph size={24} color={SECONDARY} />
         </Tile>
      </div>
   );
}

/**
 * It points down as authored, and the other three directions come from rotating
 * the wrapper — the component ships one path on purpose. Rotation is the caller's
 * job, so the mark's optical weight is identical in all four.
 */
export function Directions() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="down · as drawn">
            <ChevronGlyph size={24} color={PRIMARY} />
         </Tile>
         <Tile background={CREAM} caption="up · 180°">
            <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
               <ChevronGlyph size={24} color={PRIMARY} />
            </div>
         </Tile>
         <Tile background={CREAM} caption="right · −90°">
            <div style={{ transform: 'rotate(-90deg)', display: 'flex' }}>
               <ChevronGlyph size={24} color={PRIMARY} />
            </div>
         </Tile>
         <Tile background={CREAM} caption="left · 90°">
            <div style={{ transform: 'rotate(90deg)', display: 'flex' }}>
               <ChevronGlyph size={24} color={PRIMARY} />
            </div>
         </Tile>
      </div>
   );
}

/**
 * The two calls that exist in the picker today, at their real size and token:
 * 16 / secondary as the "change store" affordance in the detail header, and
 * 20 / tertiary as the sheet's own expand mark, which is quieter on purpose.
 */
export function InUseSizes() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={WHITE} caption="StoreDetail · 16 · secondary" border={HAIR}>
            <div style={{ transform: 'rotate(-90deg)', display: 'flex' }}>
               <ChevronGlyph size={16} color={SECONDARY} />
            </div>
         </Tile>
         <Tile background={WHITE} caption="StoreSheet · 20 · tertiary" border={HAIR}>
            <ChevronGlyph size={20} color={TERTIARY} />
         </Tile>
         <Tile background={HOUSE} caption="on green · 20 · onDark">
            <ChevronGlyph size={20} color={ON_DARK} />
         </Tile>
      </div>
   );
}
