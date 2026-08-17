/**
 * The contract both store sheets satisfy.
 *
 * There are two implementations and the screen must not care which it got:
 * `StoreSheet.ios.tsx` is a real `UISheetPresentationController` with native
 * detents, `StoreSheet.tsx` is the Reanimated sheet that Android and web keep.
 * Metro picks by filename. A shared props type is what keeps that swap honest —
 * without it the two drift and the screen starts branching on platform.
 *
 * Some props are meaningful to only one of them, and that is fine and stated:
 * the collapse trio drives the Reanimated sheet's peek and is ignored on iOS,
 * where UIKit owns detents; `onDetentChange` is the reverse.
 */

import type { Store } from '@/lib/session';

/**
 * How far open the sheet is, in the only terms the *screen* cares about.
 *
 * Deliberately three names rather than the number of points the sheet covers.
 * The screen reacts to this by collapsing its header and revealing the search
 * field, and both of those are decisions — "is the user browsing yet?" — not
 * measurements. A threshold in points would put that decision in two places and
 * let the two platforms disagree about where it sits.
 *
 * - `peek` — the sheet is a lip at the bottom. The map is the screen, the header
 *   is open, and there is nothing to search yet because you can see one row.
 * - `browse` — the sheet is up. The list is the screen; the header gets out of
 *   the way and the search field appears.
 * - `full` — the sheet covers everything. Identical to `browse` as far as the
 *   chrome behind it is concerned, and named separately only because the map
 *   stops being worth padding a camera for.
 */
export type SheetStage = 'peek' | 'browse' | 'full';

export type StoreSheetProps = {
   /** Full sheet height, safe-area inset included. Reanimated sheet only. */
   height: number;
   bottomInset: number;
   /** Null while browsing. Drives which face is forward. */
   selected: Store | null;

   /**
    * Peek state for the Reanimated sheet. Ignored on iOS — a native sheet owns
    * its own detents, and a second source of truth for "how tall is it" is how
    * you get a sheet that fights the user.
    */
   collapsed: boolean;
   /** False when there is no map worth peeking at. */
   collapsible: boolean;
   onToggleCollapsed: () => void;

   onBack: () => void;

   stores: readonly Store[];
   query: string;
   onQueryChange: (query: string) => void;
   distanceFor: (store: Store) => number;
   onSelect: (store: Store) => void;
   onConfirm: (store: Store) => void;
   note: string | null;

   /**
    * How many points of the screen bottom the sheet currently covers, so the map
    * can pad its camera to keep a focused pin clear of it. iOS only: the
    * Reanimated sheet's height is already known to the screen that sized it,
    * whereas a native detent is only knowable after the user drags it.
    */
   onDetentChange?: (covered: number) => void;

   /**
    * Reported by **both** implementations, unlike `onDetentChange`, because the
    * screen's chrome reacts to it and the screen must not have to ask which
    * sheet it got. See `SheetStage`.
    */
   onStageChange?: (stage: SheetStage) => void;
};
