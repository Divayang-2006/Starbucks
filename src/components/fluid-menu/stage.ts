/**
 * Every number the menu animation is tuned on, in one file.
 *
 * The geometry is measured off the reference frames rather than guessed. In the
 * open frame the app card spans from 69% of the screen width to the right edge,
 * and vertically from 17% to 83% — which is exactly a 0.66 scale about the
 * centre, with no vertical offset. So `SCALE_OPEN` is the measurement and
 * `SHIFT` follows from it:
 *
 *   left edge when scaled about centre = (1 - 0.66) / 2 = 0.17 W
 *   wanted left edge                   =                  0.69 W
 *   therefore translateX               =                  0.52 W
 *
 * Keep that derivation in mind before nudging either one — they are a pair, and
 * changing the scale without re-deriving the shift moves the card off the frame.
 */

/** Scale of the app card once the menu is fully open. */
export const SCALE_OPEN = 0.66;

/** Rightward shift at full open, as a fraction of screen width. See above. */
export const SHIFT = 0.52;

/**
 * Corner radius on the app card at full open, in *pre-scale* units. A radius is
 * scaled along with everything else, so to land on the 24pt corner the frame
 * shows we have to ask for 24 / SCALE_OPEN.
 */
export const RADIUS_OPEN = 24 / SCALE_OPEN;

/**
 * How far you drag to travel the full 0 → 1, as a fraction of screen width.
 * Shorter than `SHIFT` on purpose: matching them makes the card track your
 * thumb exactly, which sounds right and feels sluggish, because the finger has
 * to cross the whole shift to finish the gesture.
 */
export const DRAG_SPAN = 0.62;

/** Only a swipe starting inside this many points of the left edge can open it. */
export const EDGE_WIDTH = 44;

/** Past this, a release completes rather than rebounds. */
export const SNAP_POINT = 0.5;

/** A flick faster than this decides the direction regardless of position. */
export const FLICK_VELOCITY = 550;

/**
 * Progress units between the start of one row's entrance and the next. Nine rows
 * at 0.055 means the last one starts at 0.44 and, over `ROW_SPAN`, finishes just
 * as the gesture does.
 */
export const ROW_STAGGER = 0.055;

/** How much progress a single row takes to complete its entrance. */
export const ROW_SPAN = 0.55;

/** How far a row starts to the left of where it lands. */
export const ROW_OFFSET = 34;

/** Extra travel on the label, so it trails its icon slightly. */
export const LABEL_LAG = 14;

/**
 * The settle. Slightly under-damped so the card arrives with a breath rather
 * than a stop — the same reasoning as the card zoom in the onboarding flow.
 */
export const SETTLE = { duration: 520, dampingRatio: 0.82 } as const;
