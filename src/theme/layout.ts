/**
 * Spacing, radii and the handful of fixed dimensions the chrome depends on.
 *
 * The spacing scale is 4pt. Use the named steps rather than raw numbers so
 * rhythm stays consistent across screens written weeks apart.
 */

export const Space = {
   xxs: 2,
   xs: 4,
   sm: 8,
   md: 12,
   base: 16,
   lg: 20,
   xl: 24,
   xxl: 32,
   huge: 48,
} as const;

/** Standard gutter from the screen edge to content. */
export const Gutter = Space.base;

export const Radius = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   /** The white sheet that slides up over the dark green header. */
   sheet: 28,
   /** Buttons, chips, the tab bar — full-radius pills are everywhere. */
   pill: 999,
} as const;

export const Sizes = {
   /** Minimum tap target. Nothing interactive goes below this. */
   tap: 44,
   buttonHeight: 52,
   chipHeight: 36,
   fieldHeight: 48,
   /** Floating pill tab bar. */
   tabBarHeight: 64,
   /** Product image squares in rails and list rows. */
   productThumb: 96,
} as const;
