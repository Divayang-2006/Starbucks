/**
 * Motion tokens.
 *
 * The app already had good instincts about timing, but they were scattered as
 * literals with the reasoning written in comments next to them — the tab bar's
 * travel spring, the onboarding card's zoom, the keyboard-matched lift. Written
 * down once, they stop being five people's opinions and start being one
 * app's tempo: a tab switch and a sheet arriving should feel like the same hand
 * moved them.
 *
 * Two Reanimated 4 constraints these have to live inside:
 *
 * - `duration`/`dampingRatio` and `stiffness`/`damping`/`mass` are mutually
 *   exclusive spring parameterisations — the types enforce it. Each entry below
 *   picks one and stays in it.
 * - Hopping back to the JS thread from a worklet is `scheduleOnRN` from
 *   `react-native-worklets`. `runOnJS` is gone; reaching for it is the single
 *   most common way to break a build in this SDK.
 *
 * `Easing` is imported here rather than at each call site so the curve set is
 * closed. It costs `@/theme` a dependency edge on Reanimated, which is already
 * unconditional in the bundle (the Babel preset injects the worklets plugin),
 * so nothing new ships.
 */

import { Easing } from 'react-native-reanimated';

export const Duration = {
   /** Press-in. Short enough that the finger is still down when it lands. */
   press: 90,
   /** A state flip with no travel — a tick appearing, a colour changing. */
   quick: 140,
   /** The default. Opacity and colour cross-fades. */
   base: 200,
   /** A control enabling, an element fading in on entrance. */
   moderate: 280,
   /** Something crosses a meaningful distance. */
   slow: 420,
   /** A surface turns over, or a sheet travels the height of the screen. */
   deliberate: 540,
} as const;

/**
 * Curves. Almost everything decelerates — a UI element arrives at rest, it does
 * not launch. `inOut` is reserved for a motion that is one continuous gesture
 * with no arrival in the middle, which in practice means a flip.
 */
export const Ease = {
   out: Easing.out(Easing.quad),
   /** Softer decelerate, for travel long enough that `out` reads as abrupt. */
   outLong: Easing.out(Easing.cubic),
   inOut: Easing.inOut(Easing.cubic),
   /** Progress sweeps and shimmers only — anything that is not going anywhere. */
   linear: Easing.linear,
} as const;

export const Spring = {
   /**
    * Something travelling across the screen: the tab bar capsule, a page
    * indicator. `dampingRatio` under 1 means it overshoots slightly and arrives
    * with a settle rather than a stop, which is the difference between the bar
    * feeling driven and feeling teleported.
    */
   travel: { duration: 460, dampingRatio: 0.74 },
   /** An element arriving from nowhere — a card zooming in, a sheet presenting. */
   enter: { duration: 520, dampingRatio: 0.78 },
   /** The same motion in reverse. Critically damped: leaving should be clean, never bouncy. */
   exit: { duration: 400, dampingRatio: 1 },
   /** Release from a press. Stiff and light, so the control snaps back under the finger. */
   press: { damping: 15, stiffness: 260, mass: 0.5 },
   /** A deliberate bounce — a badge incrementing, a heart filling. */
   pop: { damping: 12, stiffness: 220, mass: 0.5 },
} as const;

/**
 * The one pressed-state opacity.
 *
 * The codebase had two: 0.7 on the round header controls and 0.85 on `Card`.
 * 0.7 won. On a 44pt disc — which is where most presses in this app land — 0.85
 * is close to invisible, and a feedback signal you have to look for is not
 * feedback. A whole card dimming to 0.7 is a larger visual event than a chip
 * doing it, but pressing a whole card *is* a larger event, so the fixed value
 * scales with the target for free. (For reference, RN's own
 * `TouchableOpacity` defaults to 0.2, which is far heavier than either.)
 *
 * Anything that responds to a press reads this. Nothing writes its own.
 */
export const Pressed = {
   opacity: 0.7,
} as const;
