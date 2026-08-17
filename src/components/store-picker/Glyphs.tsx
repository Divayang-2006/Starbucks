import Svg, { Circle, Path } from 'react-native-svg';

/**
 * The four line glyphs this screen needs, kept together and kept tiny.
 *
 * @expo/vector-icons is not a dependency of `expo` in SDK 57 and pulling in a
 * whole icon font for four strokes would be the wrong trade. Same approach as
 * the onboarding flow's inline chevron: stroke geometry, colour as a prop.
 */

type GlyphProps = {
   size?: number;
   color: string;
};

const STROKE = 1.7;

export function SearchGlyph({ size = 18, color }: GlyphProps) {
   return (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
         <Circle cx={8.6} cy={8.6} r={5.4} stroke={color} strokeWidth={STROKE} />
         <Path
            d="M12.7 12.7 L16.6 16.6"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
         />
      </Svg>
   );
}

export function CloseGlyph({ size = 14, color }: GlyphProps) {
   return (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
         <Path
            d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
         />
      </Svg>
   );
}

/** Points down. Rotate the wrapper for the other three directions. */
export function ChevronGlyph({ size = 18, color }: GlyphProps) {
   return (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
         <Path
            d="M5 8 L10 13 L15 8"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </Svg>
   );
}

/**
 * A crosshair rather than the usual filled arrow — the arrow reads as
 * "navigate", and this button only ever means "where am I".
 */
export function CrosshairGlyph({ size = 20, color }: GlyphProps) {
   return (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
         <Circle cx={10} cy={10} r={4.4} stroke={color} strokeWidth={STROKE} />
         <Circle cx={10} cy={10} r={1.5} fill={color} />
         <Path
            d="M10 1.4 V4 M10 16 V18.6 M1.4 10 H4 M16 10 H18.6"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
         />
      </Svg>
   );
}
