/**
 * Dimensions and motion for the store picker. Every number the map, the pin and
 * the sheet animate against lives here so the motion code stays readable — the
 * same split `src/components/onboarding/theme.ts` uses.
 */

import { Easing } from 'react-native-reanimated';

import { Gutter, Radius, Space } from '@/theme';

/**
 * The pin, laid out in absolute coordinates inside a fixed box.
 *
 * The box never changes size. Mapbox positions a MarkerView by measuring its
 * child, so a box that grew on selection would make the map re-anchor the
 * annotation mid-spring — the pin would crawl sideways while it scaled.
 * Everything therefore animates *inside* a constant frame.
 *
 * The stem is not animated, which is the trick that makes the lift look welded
 * rather than assembled. It is a static bar drawn *behind* the disc, so the disc
 * covers all but its bottom 6pt at rest and uncovers it as it rises. That only
 * holds because of one arithmetic identity: scaling the disc about its centre
 * drops its bottom edge by `disc * (selectedScale - 1) / 2`, so the visible stem
 * ends up `lift - disc * (selectedScale - 1) / 2` longer — with disc 30, scale
 * 1.35 and lift 9 that is 9 - 5.25 ≈ 4, taking 6 to just under `stem`. Change
 * any one of those four numbers and re-derive the rest, or the joint splits.
 */
export const PIN = {
   /** Outer frame. Sized to contain the halo at full scale plus the lift. */
   box: 72,
   /** Tap target, concentric with the halo. Above the 44pt minimum. */
   tap: 52,
   halo: 52,
   disc: 30,
   mark: 16,
   /** Full length of the bar. 6pt of it shows at rest; the rest is hidden. */
   stem: 10,
   dot: 5,
   selectedScale: 1.35,
   lift: 9,
   /** How far a search miss recedes rather than disappearing outright. */
   dimOpacity: 0.24,
   dimScale: 0.82,
} as const;

export const SHEET = {
   radius: Radius.sheet,
   /** Visible strip left when the sheet is peeked so the map can be read. */
   peek: 108,
   maxHeight: 420,
   minHeight: 332,
   /** Share of the window the sheet takes when it fits. */
   heightRatio: 0.46,
   /**
    * The header row that carries the back control and the collapse chevron.
    *
    * This was 34, and 34 is the spacing bug: both controls inside it were
    * therefore under the 44pt minimum — the chevron was 44 wide by 34 tall, and
    * the back button asked for `minHeight: 32`. A row that cannot contain a
    * legal tap target is the wrong height by definition, so it is now 56: 44 for
    * the target plus 6 either side, which also leaves room to draw a real
    * grabber above them instead of naming the row after one that was never
    * there.
    */
   headerRow: 56,
   /**
    * The strip above the header that holds the drag handle. This is the top
    * padding the sheet never had — without it the header row began at y=0 and
    * its content sat against the sheet's own rounded edge.
    */
   grabberRow: 22,
   /** The drag handle itself, centred in that row. */
   grabberWidth: 40,
   grabberHeight: 4,
   /**
    * Top padding for the **native** sheet, which draws no grabber row of its own
    * because UIKit owns that strip.
    *
    * This was `Space.md`, and 12 is the search-field collision: UIKit's drag
    * indicator is a 5pt bar inset 5pt from the sheet's top edge, and it is drawn
    * *over* the content rather than above it, so the first control had 2pt of
    * clearance and read as welded to the sheet's lip. 28 clears the indicator
    * and leaves the field a real margin.
    */
   contentTop: 28,
   /** Inner gutter. Matches the app's standard 16pt edge. */
   padding: Gutter,
} as const;

/**
 * The sheet's glass, shared by both implementations.
 *
 * It sits over a light basemap, so a plain white surface reads as a cut-out
 * rectangle with nothing behind it. Tinting the translucency green does two
 * things at once: it keeps the brand present on a screen that is otherwise
 * Mapbox's, and it makes the map legible *through* the sheet, which is what
 * makes the peek state worth having.
 *
 * `tint` is the one value both platforms read, and it is written as `rgba()`
 * rather than a hex pair on purpose: iOS hands it to SwiftUI's `glassEffect`
 * through Expo's colour convertible, which parses `rgba`, `hsl`, named CSS
 * colours and 8-digit hex — but the *alpha* is the whole point here, so a
 * 6-digit hex would silently become an opaque green panel.
 *
 * The tint is deliberately a wash rather than a fill — above about 0.22 the map
 * stops reading through and it becomes a green panel, which is a different and
 * worse idea.
 */
export const GLASS = {
   tint: 'rgba(30,57,50,0.16)',
   /**
    * Sits under the blur so the sheet still has a floor on a busy basemap. Only
    * the Reanimated sheet uses it; on iOS the material *is* the floor.
    */
   base: 'rgba(247,245,240,0.72)',
   /** One hairline along the top edge, to give the glass a lip. */
   rim: 'rgba(255,255,255,0.55)',
   grabber: 'rgba(30,57,50,0.28)',
   /**
    * What the native sheet paints behind the glass.
    *
    * `'transparent'` is a named colour in Expo's convertible table, so this is a
    * real `Color.clear` rather than a string that happens to parse. It has to be
    * clear: `presentationBackground` paints the entire sheet chrome, and any
    * opaque value there sits *between* the map and the glass, which is exactly
    * how the sheet ended up an opaque white slab with a liquid-glass modifier
    * doing nothing above it.
    */
   presentationClear: 'transparent',
} as const;

/**
 * Sheet height is a share of the window, clamped. Below the floor the list has
 * fewer than three rows visible and stops reading as a list; above the ceiling
 * the map stops being the point of the screen.
 */
export function sheetHeight(windowHeight: number): number {
   const wanted = Math.round(windowHeight * SHEET.heightRatio);
   return Math.max(SHEET.minHeight, Math.min(SHEET.maxHeight, wanted));
}

/**
 * Header block, stated rather than measured. `onLayout` would work but it lands
 * a frame late, and the camera padding is computed from this on the very first
 * fly-to — a one-frame-old value there means the opening shot is off-centre.
 */
export const HEADER = {
   titleRow: 44,
   rail: 34,
   gap: Space.md,
} as const;

export function headerHeight(topInset: number): number {
   return topInset + HEADER.gap * 3 + HEADER.titleRow + HEADER.rail;
}

export const CAMERA = {
   /** Whole-country view for the "All" filter. */
   allZoom: 4.1,
   cityZoom: 11.2,
   /** Close enough to read the street the store is on, and no closer. */
   focusZoom: 16.4,
   cityDuration: 900,
   focusDuration: 700,
   /** Keeps a focused pin clear of the header chrome and the sheet lip. */
   edgePadding: Space.xl,
   /**
    * The map never tilts. Selection used to pitch the camera to 52° so an
    * extruded block had somewhere to stand; both are gone. A flat map is
    * strictly easier to read — every pin keeps the same size and none can hide
    * behind a building — and "where is this store" is a plan question, not a
    * perspective one.
    */
   browsePitch: 0,
   focusPitch: 0,
} as const;

/**
 * Mapbox Standard, tinted warm rather than repainted dark.
 *
 * This was a `night` preset in near-black greens, and it failed the one job a
 * store picker has: you could not tell where you were. Two separate causes, both
 * fixed here — the ground was darker than the pins meant to stand on it, and
 * road labels were off, so there were no street names to locate yourself by.
 *
 * The palette now sits in the same cream-and-green family as the app, but with
 * the values inverted: cream land, white roads, pale green parks and water. That
 * keeps the brand reading without asking the map to be legible in the dark. Road
 * names are the map's actual content, so they are on; Mapbox's POI labels stay
 * off because those are what compete with our own pins.
 *
 * The `color*` keys landed in Mapbox Maps v11.18 and this project tracks the
 * wrapper's tested native version (11.23.1, see `docs/SETUP.md`). Unknown keys
 * are ignored by the style import, so an older native SDK degrades to plain
 * Standard rather than failing.
 */
export const BASEMAP = {
   lightPreset: 'day',
   theme: 'default',
   /**
    * On. This is Mapbox's own 3D geometry, not the extruded prism we used to
    * draw per selection — that one is gone for good. The distinction matters:
    * real buildings are basemap context and help you place yourself, whereas a
    * 22 m cylinder over the chosen store was a marker pretending to be
    * architecture.
    */
   show3dObjects: true,
   /** Ours are the only POI pins on this map. */
   showPointOfInterestLabels: false,
   showTransitLabels: false,
   /** Street names to navigate by. Their absence is why the map read as unusable. */
   showRoadLabels: true,
   showPlaceLabels: true,
   showPedestrianRoads: true,
} as const;

/**
 * Arriving overshoots slightly so the sheet feels like it springs up under your
 * thumb; leaving is critically damped, because dismissing something should be
 * clean and never bouncy. `duration`/`dampingRatio` cannot be mixed with
 * `stiffness`/`damping` — Reanimated types them as mutually exclusive.
 */
export const FACE_IN = { duration: 520, dampingRatio: 0.82 } as const;
export const FACE_OUT = { duration: 380, dampingRatio: 1 } as const;

/** Looser than the sheet: a pin popping is allowed to be a little theatrical. */
export const PIN_SPRING = { duration: 460, dampingRatio: 0.6 } as const;
export const PEEK_SPRING = { duration: 480, dampingRatio: 0.9 } as const;

/** De-emphasis is not an event. It fades, it does not spring. */
export const DIM_TIMING = { duration: 220, easing: Easing.out(Easing.quad) } as const;
export const PRESS_TIMING = { duration: 90, easing: Easing.out(Easing.quad) } as const;
export const PRESS_SPRING = { damping: 15, stiffness: 260, mass: 0.5 } as const;
