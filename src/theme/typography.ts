/**
 * Type system.
 *
 * Three faces, three jobs:
 *
 * - **Urbanist** carries the entire UI. Weight, not family, makes hierarchy —
 *   the same way the reference app works with its brand sans.
 * - **Fraunces** is the display serif, and it is rationed. Rewards hero, store
 *   names, seasonal launch headers, article titles. It never appears in a list
 *   row, a chip, a button, or a form. If it shows up twice on one screen,
 *   one of them is wrong.
 * - **Bebas Neue** exists only to letter the face of the loyalty card, where
 *   it stands in for embossing.
 *
 * Note on Fraunces: `@expo-google-fonts` ships static instances, so its SOFT
 * and WONK axes sit at their defaults — we get the warm old-style character
 * but cannot dial it. That is fine at the sizes we use it.
 *
 * Imported from per-weight subpaths rather than the package root — the root
 * `index.js` does a top-level `require()` of every weight and italic, so
 * importing from it would ship all 18 files per family instead of the few
 * we use.
 */

import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue/400Regular';
import { Fraunces_400Regular } from '@expo-google-fonts/fraunces/400Regular';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces/700Bold';
import { Urbanist_400Regular } from '@expo-google-fonts/urbanist/400Regular';
import { Urbanist_500Medium } from '@expo-google-fonts/urbanist/500Medium';
import { Urbanist_600SemiBold } from '@expo-google-fonts/urbanist/600SemiBold';
import { Urbanist_700Bold } from '@expo-google-fonts/urbanist/700Bold';
import { Urbanist_800ExtraBold } from '@expo-google-fonts/urbanist/800ExtraBold';

/** Pass straight to `useFonts` from expo-font. Load once, at the root. */
export const APP_FONTS = {
   Urbanist_400Regular,
   Urbanist_500Medium,
   Urbanist_600SemiBold,
   Urbanist_700Bold,
   Urbanist_800ExtraBold,
   Fraunces_400Regular,
   Fraunces_600SemiBold,
   Fraunces_700Bold,
   BebasNeue_400Regular,
};

/**
 * Family names to put in `fontFamily`.
 *
 * IMPORTANT: never set `fontWeight` alongside one of these. Each file is a
 * single static weight, so asking for a weight it doesn't contain makes the
 * platform synthesise one — Android smears the glyphs to fake bold, and iOS
 * silently ignores it. Pick the family that already is the weight you want.
 */
export const Type = {
   regular: 'Urbanist_400Regular',
   medium: 'Urbanist_500Medium',
   semibold: 'Urbanist_600SemiBold',
   bold: 'Urbanist_700Bold',
   extrabold: 'Urbanist_800ExtraBold',

   serif: 'Fraunces_400Regular',
   serifSemibold: 'Fraunces_600SemiBold',
   serifBold: 'Fraunces_700Bold',

   /** Caps-only, single weight. Card face only. */
   emboss: 'BebasNeue_400Regular',
} as const;

/**
 * The scale. Spread these into a style rather than restating sizes inline, so
 * a change to line height lands everywhere at once.
 *
 * Sizes are fixed points, not Dynamic Type — the layouts (cards, chips, the
 * sticky bar) are dimensioned around them. Accessibility scaling is handled
 * per-component with `maxFontSizeMultiplier` where the layout can absorb it.
 */
export const TextStyles = {
   /** Star balance, Pay balance — the one number a screen is about. */
   display: { fontFamily: Type.extrabold, fontSize: 34, lineHeight: 40 },
   h1: { fontFamily: Type.bold, fontSize: 28, lineHeight: 34 },
   h2: { fontFamily: Type.bold, fontSize: 22, lineHeight: 28 },
   h3: { fontFamily: Type.semibold, fontSize: 18, lineHeight: 24 },

   /** Rationed serif. See the note at the top of this file. */
   displaySerif: { fontFamily: Type.serifBold, fontSize: 32, lineHeight: 38 },
   titleSerif: { fontFamily: Type.serifSemibold, fontSize: 24, lineHeight: 30 },
   quoteSerif: { fontFamily: Type.serif, fontSize: 18, lineHeight: 27 },

   body: { fontFamily: Type.regular, fontSize: 16, lineHeight: 22 },
   bodyStrong: { fontFamily: Type.semibold, fontSize: 16, lineHeight: 22 },
   bodySm: { fontFamily: Type.regular, fontSize: 14, lineHeight: 20 },
   bodySmStrong: { fontFamily: Type.semibold, fontSize: 14, lineHeight: 20 },

   /** Field values, chip labels. */
   label: { fontFamily: Type.medium, fontSize: 13, lineHeight: 16 },

   /**
    * `FIRST NAME`, `CURRENT ITEM`, `CUSTOMISE YOUR DRINK`. Apply
    * `textTransform: 'uppercase'` at the call site — the tracking here is
    * tuned for caps and will look loose on mixed case.
    */
   caps: { fontFamily: Type.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.9 },

   /** kcal, ml, the FSSAI footer. */
   micro: { fontFamily: Type.regular, fontSize: 11, lineHeight: 14 },

   /** Prices. Semibold so `₹535.50` holds its own next to a product name. */
   price: { fontFamily: Type.semibold, fontSize: 16, lineHeight: 20 },
   priceLg: { fontFamily: Type.bold, fontSize: 20, lineHeight: 24 },
} as const;

export type TextStyleName = keyof typeof TextStyles;
