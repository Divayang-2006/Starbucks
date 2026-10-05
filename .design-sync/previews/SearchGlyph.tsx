import type { ReactNode } from 'react';
import { SearchGlyph } from 'starbucks';

/*
 * An 18pt stroke on a white card is invisible, so every cell here puts the mark
 * on a real surface token at a size you can actually judge.
 */
const CREAM = '#F7F5F0';
const WHITE = '#FFFFFF';
const SUNKEN = '#EFECE5';
const HOUSE = '#1E3932';
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
 * The four sizes the picker asks for. 18 is the default and the one the search
 * row uses; the stroke is 1.7 in a 20-unit viewBox, so it thickens with the mark
 * rather than staying hairline — which is why it still reads at 14.
 */
export function SizeRamp() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="14">
            <SearchGlyph size={14} color={TERTIARY} />
         </Tile>
         <Tile background={CREAM} caption="18 · default">
            <SearchGlyph size={18} color={TERTIARY} />
         </Tile>
         <Tile background={CREAM} caption="24">
            <SearchGlyph size={24} color={TERTIARY} />
         </Tile>
         <Tile background={CREAM} caption="32">
            <SearchGlyph size={32} color={TERTIARY} />
         </Tile>
      </div>
   );
}

/**
 * The light surfaces it sits on, each with the text token that belongs there.
 * `TextColor.tertiary` is the resting weight — the glyph is a placeholder-mate,
 * not a control, so it matches the placeholder rather than the label.
 */
export function LightSurfaces() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <Tile background={CREAM} caption="app · tertiary">
            <SearchGlyph size={22} color={TERTIARY} />
         </Tile>
         <Tile background={WHITE} caption="raised · secondary" border={HAIR}>
            <SearchGlyph size={22} color={SECONDARY} />
         </Tile>
         <Tile background={SUNKEN} caption="sunken · tertiary">
            <SearchGlyph size={22} color={TERTIARY} />
         </Tile>
         <Tile background={WHITE} caption="raised · action" border={HAIR}>
            <SearchGlyph size={22} color={ACTION} />
         </Tile>
      </div>
   );
}

/**
 * The picker's chrome floats over a dark green map, so the same mark has to hold
 * at `onDark`. On green it is usually set into a translucent white disc rather
 * than laid on the surface bare — an opaque tile would shift as the map moves.
 */
export function OnHouseGreen() {
   return (
      <div
         style={{
            background: HOUSE,
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            gap: 24,
            alignItems: 'center',
         }}>
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
            <SearchGlyph size={20} color={ON_DARK} />
         </div>
         <SearchGlyph size={20} color={ON_DARK} />
         <SearchGlyph size={20} color={ON_DARK_MUTED} />
         <span
            style={{
               fontFamily: 'Urbanist_500Medium',
               fontSize: 12,
               color: ON_DARK_MUTED,
               letterSpacing: 0.3,
            }}>
            onDark · onDarkMuted
         </span>
      </div>
   );
}
