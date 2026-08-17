/**
 * The app's icon set: hand-drawn `react-native-svg` paths, one drawing language.
 *
 * Why not SF Symbols. `expo-symbols` would hand us glyphs for free on iOS and
 * nothing usable on Android — the fallback there is Material Symbols, a heavier
 * geometric family reached through an async image source, so the two platforms
 * would not match and the tab bar would need two code paths. One vector set
 * costs twenty lines of path data and renders identically everywhere. (The PNGs
 * in `assets/images/tabIcons/` are a dead end regardless: there are two of them
 * and the tab bar needs five.)
 *
 * Drawing rules, matching the chevron in the onboarding flow so the app has one
 * icon voice: 24pt box, stroke only, round caps and joins, no fills.
 */

import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { IconSize, Stroke } from '@/theme';

export const GLYPHS = {
   /** House. */
   home: [
      'M3.6 10.3 L12 3.5 L20.4 10.3 V19.2 A1.2 1.2 0 0 1 19.2 20.4 H4.8 A1.2 1.2 0 0 1 3.6 19.2 Z',
      'M9.5 20.4 V14.3 H14.5 V20.4',
   ],
   /** Gift box: lid, body, ribbon, two bow loops. */
   gift: [
      'M3.4 7.9 H20.6 V11.5 H3.4 Z',
      'M4.9 11.5 V19.8 H19.1 V11.5',
      'M12 7.9 V19.8',
      'M12 7.9 Q7.4 7.7 7.4 5.6 Q7.4 3.7 9.7 4.2 Q12 4.8 12 7.9',
      'M12 7.9 Q16.6 7.7 16.6 5.6 Q16.6 3.7 14.3 4.2 Q12 4.8 12 7.9',
   ],
   /**
    * A tapered cup with a sleeve band. §2 maps the Order tab to the web app's
    * `menu.svg`, but three stacked lines are indistinguishable from a settings
    * glyph at 23pt; the cup says "order a drink" with no label at all.
    */
   order: [
      'M5.6 4.2 H18.4 V6.5 H5.6 Z',
      'M6.9 6.5 L8.3 19.5 Q8.45 20.7 9.6 20.7 H14.4 Q15.55 20.7 15.7 19.5 L17.1 6.5',
      'M7.5 11.4 H16.5',
   ],
   /** Payment card. */
   pay: [
      'M2.9 6.3 A2.1 2.1 0 0 1 5 4.2 H19 A2.1 2.1 0 0 1 21.1 6.3 V17.7 A2.1 2.1 0 0 1 19 19.8 H5 A2.1 2.1 0 0 1 2.9 17.7 Z',
      'M2.9 9.4 H21.1',
      'M6.3 15.1 H10.4',
   ],
   /** Star — the Stars currency, so this is the one glyph that has to be literal. */
   rewards: [
      'M12 3.4 L14.29 8.84 L20.18 9.34 L15.71 13.21 L17.05 18.96 L12 15.9 L6.95 18.96 L8.29 13.21 L3.82 9.34 L9.71 8.84 Z',
   ],
   search: ['M4.2 10.6 A6.4 6.4 0 1 1 17 10.6 A6.4 6.4 0 1 1 4.2 10.6 Z', 'M15.4 15.4 L20.2 20.2'],
   /** Corner brackets — scan-to-pay. */
   scan: [
      'M4 9 V6 A2 2 0 0 1 6 4 H9',
      'M15 4 H18 A2 2 0 0 1 20 6 V9',
      'M20 15 V18 A2 2 0 0 1 18 20 H15',
      'M9 20 H6 A2 2 0 0 1 4 18 V15',
      'M4 12 H20',
   ],
   plus: ['M12 5 V19', 'M5 12 H19'],
   /** The other half of a `Stepper`. Same bar as `plus`, so the pair reads as one control. */
   minus: ['M5 12 H19'],
   chevronRight: ['M9.5 5 L16 12 L9.5 19'],

   // ── Account menu ──────────────────────────────────────────────────────────
   // The set behind the avatar. Nothing here appears in the tab bar, so these
   // are drawn for 22–24pt rows rather than for 23pt with a label under it.

   /** Profile. */
   person: [
      'M12 4.3 A3.45 3.45 0 1 1 12 11.2 A3.45 3.45 0 1 1 12 4.3 Z',
      'M4.9 20.3 Q4.9 13.9 12 13.9 Q19.1 13.9 19.1 20.3',
   ],
   /**
    * Beverage Subscription. A crown, because the row is a standing arrangement
    * rather than a purchase — a repeat-arrow glyph reads as "refresh".
    */
   crown: ['M3.7 17.7 L5.3 7.5 L9.4 12.1 L12 5.7 L14.6 12.1 L18.7 7.5 L20.3 17.7 Z', 'M5.4 20.4 H18.6'],
   /** Store Locator. */
   pin: [
      'M12 20.8 Q18.9 13.5 18.9 9.6 A6.9 6.9 0 1 0 5.1 9.6 Q5.1 13.5 12 20.8 Z',
      'M12 7.3 A2.35 2.35 0 1 1 12 12 A2.35 2.35 0 1 1 12 7.3 Z',
   ],
   /** Coffee Stories — a page with a pull-quote block. */
   article: [
      'M3.9 5.7 H20.1 V18.3 H3.9 Z',
      'M6.7 9.1 H12.4',
      'M6.7 12 H12.4',
      'M6.7 14.9 H10.6',
      'M14.7 9.1 H17.3 V14.9 H14.7 Z',
   ],
   /** Help & Support. The reference app uses a heart here and so do we. */
   heart: ['M12 20.2 Q3.7 15.1 3.7 9.6 A4.45 4.45 0 0 1 12 7.4 A4.45 4.45 0 0 1 20.3 9.6 Q20.3 15.1 12 20.2 Z'],
   /** Log Out. Points left — out, not forward. */
   arrowLeft: ['M10.4 6.4 L4.8 12 L10.4 17.6', 'M4.8 12 H19.2'],
   close: ['M6.5 6.5 L17.5 17.5', 'M17.5 6.5 L6.5 17.5'],
   /**
    * Tapered rather than three equal rules. Equal rules read as a list; the taper
    * reads as a control, and it matches the reference the menu is drawn from.
    */
   menu: ['M4.6 8 H19.4', 'M4.6 12 H14.8', 'M4.6 16 H10.8'],
} as const;

export type GlyphId = keyof typeof GLYPHS;

type Props = {
   id: GlyphId;
   /** Prefer an `IconSize` step. Sizes between the steps make a row look misaligned. */
   size?: number;
   color: string;
   /**
    * Weight is optical, not linear — see `Stroke` in `@/theme`. A 16pt glyph on
    * a saturated fill wants `Stroke.heavy`, not the default.
    */
   strokeWidth?: number;
};

export function Glyph({ id, size = IconSize.lg, color, strokeWidth = Stroke.regular }: Props) {
   return (
      /**
       * Wrapped in a fixed-size View: `Svg` measures lazily on Android and a bare
       * one in a flex row can arrive a frame late at zero width.
       */
      <View style={[styles.box, { width: size, height: size }]}>
         <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {GLYPHS[id].map((d) => (
               <Path
                  key={d}
                  d={d}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            ))}
         </Svg>
      </View>
   );
}

const styles = StyleSheet.create({
   box: {
      alignItems: 'center',
      justifyContent: 'center',
   },
});
