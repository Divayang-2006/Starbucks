/**
 * Fonts for the onboarding flow.
 *
 * Urbanist carries the whole flow; Bebas Neue is used only on the card face.
 *
 * Imported from per-weight subpaths rather than the package root — the root
 * `index.js` does a top-level `require()` of every weight and italic, so
 * importing from it would ship all 18 Urbanist files instead of the 4 we use.
 */

import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue/400Regular';
import { Urbanist_400Regular } from '@expo-google-fonts/urbanist/400Regular';
import { Urbanist_500Medium } from '@expo-google-fonts/urbanist/500Medium';
import { Urbanist_600SemiBold } from '@expo-google-fonts/urbanist/600SemiBold';
import { Urbanist_700Bold } from '@expo-google-fonts/urbanist/700Bold';

/** Pass straight to `useFonts` from expo-font. */
export const ONBOARDING_FONTS = {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
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
  /** Caps-only, single weight. Card face only. */
  display: 'BebasNeue_400Regular',
} as const;
