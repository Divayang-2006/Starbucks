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
   /** Product image squares in rails and list rows. */
   productThumb: 96,

   /**
    * The round control that sits in the foot of a product card — the add
    * button. Deliberately below `tap`: at 44 it competes with the price for
    * the eye, and a card foot is not where you want the heaviest object on
    * screen. Everything that draws at this size gets the difference back as
    * hit-slop, which is what `IconButton` exists to guarantee.
    */
   inlineControl: 30,
   /** A glyph centred on a tinted circle: milestone marks, empty-state marks, QR slots. */
   markDisc: 56,
   /** A round category button with a label under it — the Home curation rail. */
   categoryDisc: 72,
   /** Progress bars and the tier gauge's track. */
   trackHeight: 8,
   /** Timeline and status dots. */
   dot: 8,
} as const;

/**
 * Fixed widths for cards inside a horizontal rail.
 *
 * Three steps, not four. The screens had 168, 236, 250 and 268 — the middle two
 * are 14pt apart, which is not a design decision, it is two people guessing. 250
 * folds into `feature`; if an editorial card ever genuinely needs to be narrower
 * than a reward card, that is a fourth step with a reason attached, not a
 * rounding difference.
 *
 * These are absolute rather than a fraction of the screen on purpose: the peek
 * of the next card is the affordance that says "this scrolls", and a percentage
 * width makes the peek vanish on a large phone.
 */
export const RailCard = {
   /** Product tiles — the densest rail. Two and a bit fit on a 375pt screen. */
   compact: 168,
   /** A title, a line of body and a CTA. Reward teasers, promo tiles. */
   standard: 236,
   /** An image head with a two-line title under it. Articles, feature rewards. */
   feature: 268,
} as const;

/**
 * Glyph box sizes. `Glyph` draws on a 24pt grid and scales, so these are the
 * four sizes the app actually asks for, named by where they sit.
 */
export const IconSize = {
   /** Inside a 30pt control or a chip — small enough that it needs `Stroke.heavy`. */
   xs: 16,
   /** Trailing chevrons in a list row, the affordance in a field. */
   sm: 18,
   /** A button's leading glyph, a header control. */
   md: 20,
   /** Standalone, with nothing around it. `Glyph`'s own default. */
   lg: 22,
} as const;

/**
 * Stroke weights for `Glyph`.
 *
 * Optical, not linear: a 16pt glyph drawn at 1.6 disappears against a saturated
 * fill, so the small sizes get *more* weight, not less.
 */
export const Stroke = {
   /** Default. The tab bar's resting weight, and what most icons want. */
   regular: 1.6,
   /** 20pt glyphs sitting on a coloured fill. */
   medium: 1.8,
   /** 16pt glyphs that have to survive being white on green. */
   heavy: 2.2,
} as const;
