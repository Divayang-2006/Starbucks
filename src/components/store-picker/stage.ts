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
    * The floor, and **both** sheets need one.
    *
    * iOS was running the material over nothing at all, on the theory that a
    * material *is* a floor. It is not: Liquid Glass is a lens, so with clear
    * behind it the sheet inherited whatever the map happened to be — parks,
    * motorways, water — and `TextColor.secondary` and `.tertiary` went to mush
    * over the busy parts. It also meant any strip the SwiftUI group did not
    * reach showed raw map, which is the pale bar along the sheet's bottom edge.
    *
    * 0.62 is a compromise and worth knowing as one: below about 0.5 the text
    * problem comes back, and above about 0.75 the blur has nothing left to blur
    * and the glass reads as flat cream. There is no substitute for looking at
    * this on a device — it is one number, and it is tuned here.
    */
   base: 'rgba(247,245,240,0.62)',
   /** One hairline along the top edge, to give the glass a lip. */
   rim: 'rgba(255,255,255,0.55)',
   grabber: 'rgba(30,57,50,0.28)',
   /**
    * The opaque fallback, for a device with no Liquid Glass to render.
    *
    * Below iOS 26 `glassEffect` is a native no-op, so there is no material and a
    * translucent floor would leave a sheet you can see straight through. This is
    * the one case that still wants a solid surface. Above it, `base` is what the
    * sheet paints and the material sits on top of that.
    */
   opaque: '#FFFFFF',
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
 * A city card in the rail: a square landmark tile, the city, the store count.
 *
 * The tile is the unit everything else follows from. 72 is the smallest square
 * that survives `docs/CITY_IMAGERY.md`'s instruction to simplify a building
 * until its silhouette is all that is left — below about 64 the arch of the
 * Gateway of India closes up and every tile becomes the same green lump.
 */
export const CITY_CARD = {
   tile: 72,
   padding: Space.sm,
   /** Tile plus padding either side. Wide enough for `Bengaluru` on one line. */
   width: 72 + Space.sm * 2,
   /** Tile, the 4pt gap above the label, the label, the count, and the padding. */
   height: 72 + Space.xs + 18 + 14 + Space.sm * 2,
} as const;

/**
 * The header band, in two parts, because it collapses.
 *
 * Both numbers are arithmetic rather than measured, and that is the point.
 * `PickerHeader` used to report its height through `onLayout` — correct until
 * the band started animating, at which point a collapsing child fires layout on
 * every frame of the transition and the screen re-renders eighteen times to move
 * a camera that only cares about where the band ends up.
 *
 * So the band is described here instead, and the screen reports one of exactly
 * two heights. The terms are `ScreenHeader`'s own, in its order.
 *
 * The cost is honest: change the band's paddings and these drift until someone
 * updates them. The map's camera padding is the only consumer, and it is
 * forgiving to a few points.
 */
export const HEADER = {
   /** `Sizes.tap`. The siren and the locate control sit in this row. */
   controlRow: 44,
   /** `TextStyles.caps` line height. */
   kicker: 14,
   /** `TextStyles.h1` line height. */
   title: 34,
} as const;

/**
 * The part that is always there: the safe-area inset the band pads for, the
 * control row, the gap under it and the band's bottom padding.
 */
export function headerChrome(topInset: number): number {
   return topInset + Space.sm + HEADER.controlRow + Space.base + Space.xl;
}

/**
 * The part that collapses when the sheet comes up: kicker, title, city rail.
 *
 * This is the whole reason the collapse is worth doing. A rail of landmark cards
 * is 118 points; a title and a kicker are another 52. Two thirds of the band
 * exists to help you *choose* a city, and once the sheet is up and searchable
 * you have already chosen — so it buys back 170 points of map.
 */
export function headerBlock(): number {
   return (
      HEADER.kicker +
      Space.xs +
      HEADER.title +
      // The band's own gap, then the margin `PickerHeader` puts above the rail.
      Space.xs +
      Space.sm +
      CITY_CARD.height
   );
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

/**
 * The header collapsing and the search field arriving.
 *
 * A timing, not a spring, and slightly slower than `DIM_TIMING`. Both of these
 * animate a *height*, so anything with overshoot in it would bounce the map's
 * visible area — and the user is already dragging the sheet, which is the motion
 * they should be watching. This one gets out of the way underneath it.
 */
export const COLLAPSE_TIMING = { duration: 280, easing: Easing.out(Easing.cubic) } as const;

/** De-emphasis is not an event. It fades, it does not spring. */
export const DIM_TIMING = { duration: 220, easing: Easing.out(Easing.quad) } as const;
export const PRESS_TIMING = { duration: 90, easing: Easing.out(Easing.quad) } as const;
export const PRESS_SPRING = { damping: 15, stiffness: 260, mass: 0.5 } as const;
