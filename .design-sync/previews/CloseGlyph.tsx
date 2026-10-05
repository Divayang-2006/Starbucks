import type { ReactNode } from 'react';
import { CloseGlyph } from 'starbucks';

const CREAM = '#F7F5F0';
const WHITE = '#FFFFFF';
const SUNKEN = '#EFECE5';
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
 * Smaller by default than the other three glyphs — 14, not 18. A dismiss mark
 * sits inside something (a field, a chip, a sheet lip) and only ever has to be
 * findable, so it is drawn to the tap target rather than to the type.
 */
export function SizeRamp() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="12">
            <CloseGlyph size={12} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="14 · default">
            <CloseGlyph size={14} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="18">
            <CloseGlyph size={18} color={SECONDARY} />
         </Tile>
         <Tile background={CREAM} caption="24">
            <CloseGlyph size={24} color={SECONDARY} />
         </Tile>
      </div>
   );
}

/**
 * How it is actually deployed: the clear button in the store search, at 14 in
 * `TextColor.secondary`, and the same mark set into a disc for a dismiss control
 * that needs its own edge.
 */
export function ClearAffordance() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={WHITE} caption="bare · secondary" border={HAIR}>
            <CloseGlyph size={14} color={SECONDARY} />
         </Tile>
         <Tile background={WHITE} caption="sunken disc" border={HAIR}>
            <div
               style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: SUNKEN,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CloseGlyph size={14} color={SECONDARY} />
            </div>
         </Tile>
         <Tile background={HOUSE} caption="onDark disc">
            <div
               style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <CloseGlyph size={14} color={ON_DARK} />
            </div>
         </Tile>
         <Tile background={HOUSE} caption="onDark bare">
            <CloseGlyph size={16} color={ON_DARK} />
         </Tile>
      </div>
   );
}

/**
 * The mark is 14 but the target is 44 — `Sizes.tap`. The glyph never grows to
 * meet the minimum; the surrounding hit-slop does, which is why this one is
 * always drawn inside a `Pressable` with `hitSlop`, never on its own.
 */
export function TapTarget() {
   return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
         <div
            style={{
               width: 44,
               height: 44,
               borderRadius: 999,
               border: `1px dashed ${HAIR}`,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               background: WHITE,
            }}>
            <CloseGlyph size={14} color={SECONDARY} />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 14, color: PRIMARY }}>
               14 pt mark, 44 pt target
            </span>
            <span style={{ fontFamily: 'Urbanist_400Regular', fontSize: 13, color: SECONDARY }}>
               The dashed ring is Sizes.tap — hit-slop, not a border the glyph draws.
            </span>
         </div>
      </div>
   );
}
