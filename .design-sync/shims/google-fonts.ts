/**
 * Stands in for the nine `@expo-google-fonts/*` subpath modules.
 *
 * On device those modules export a font *asset* (a required .ttf module id) and
 * the only consumer is `APP_FONTS` in `src/theme/typography.ts`, which exists to
 * be handed to `useFonts` at the app root. Nothing in the rendering path reads
 * it: `Type` and `TextStyles` reference families by string name
 * ('Urbanist_700Bold' and friends), never by asset.
 *
 * So exporting the family names as plain strings is faithful, not a fudge — it
 * keeps `APP_FONTS` shaped the same while keeping .ttf binaries out of the
 * bundle. The real typefaces still reach the browser: `fonts/starbucks-fonts.css`
 * declares an @font-face per family pointing at the same .ttf files, so
 * `fontFamily: 'Urbanist_700Bold'` resolves to actual Urbanist.
 */

export const BebasNeue_400Regular = 'BebasNeue_400Regular';
export const Fraunces_400Regular = 'Fraunces_400Regular';
export const Fraunces_600SemiBold = 'Fraunces_600SemiBold';
export const Fraunces_700Bold = 'Fraunces_700Bold';
export const Urbanist_400Regular = 'Urbanist_400Regular';
export const Urbanist_500Medium = 'Urbanist_500Medium';
export const Urbanist_600SemiBold = 'Urbanist_600SemiBold';
export const Urbanist_700Bold = 'Urbanist_700Bold';
export const Urbanist_800ExtraBold = 'Urbanist_800ExtraBold';
