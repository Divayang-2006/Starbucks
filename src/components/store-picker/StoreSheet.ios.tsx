/**
 * The store sheet, as a real `UISheetPresentationController`.
 *
 * This is a **platform extension, not a `Platform.OS` branch**, and that is
 * load-bearing: `@expo/ui/swift-ui` resolves through
 * `requireNativeView('ExpoUI', 'BottomSheetView')`, which has no Android
 * registration — the *import* throws, so a runtime branch would crash Android
 * before it ever reached the check. `StoreSheet.tsx` next to this file stays as
 * the Android and web implementation and keeps working exactly as before.
 *
 * ## Why native rather than the Reanimated sheet we had
 *
 * Detents, rubber-banding, scroll-to-expand, the grabber, the dimming curve, VoiceOver's
 * sheet rotor and the keyboard dance are all UIKit behaviours. The hand-rolled
 * version reimplemented perhaps a third of that and got the rest subtly wrong.
 *
 * ## The two things that make or break this file
 *
 * 1. **`RNHostView` is mandatory.** SwiftUI hosts our React tree, and
 *    `RNHostView.swift` is the only place in the whole stack that attaches an
 *    `RCTSurfaceTouchHandler`. Without it the sheet renders *perfectly* and is
 *    completely inert — every tap, the search field, the whole store list. It
 *    looks like a styling bug and is not one.
 *
 * 2. **`presentationBackgroundInteraction` is the whole point.** A plain
 *    SwiftUI `.sheet()` is modal: it dims the map and swallows its touches, which
 *    for a store picker is worse than no sheet. `enabledUpThrough: MID` keeps the
 *    map live while the sheet is at peek or half, and lets it go modal only at
 *    full height, which is exactly the Apple Maps contract. It is iOS 16.4+, which
 *    is why `app.json` pins `deploymentTarget` to 16.4 — `@expo/ui`'s podspec
 *    demands the same floor, and React Native's own is 15.1.
 *
 * ## The glass
 *
 * Liquid Glass here is the SwiftUI `glassEffect` modifier, **not** the
 * `GlassView` from `expo-glass-effect` that the Reanimated sheet next door uses.
 * That is not a style preference. `GlassView` is a React Native view, so it can
 * only ever fill the RN content box; the sheet's grabber strip and its
 * home-indicator inset are UIKit's chrome and sit outside that box, so an RN
 * glass layer leaves both of them unpainted. The modifier is applied to the
 * SwiftUI `Group` that *is* the sheet, so it reaches all of it.
 */

import { BottomSheet, Group, Host, RNHostView } from '@expo/ui/swift-ui';
import {
   glassEffect,
   ignoreSafeArea,
   interactiveDismissDisabled,
   presentationBackground,
   presentationBackgroundInteraction,
   presentationDetents,
   presentationDragIndicator,
   type PresentationDetent,
} from '@expo/ui/swift-ui/modifiers';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Surface } from '@/theme';

import { StoreDetail } from './StoreDetail';
import { StoreList } from './StoreList';
import { FACE_IN, FACE_OUT, GLASS, SHEET } from './stage';
import type { StoreSheetProps } from './StoreSheet.shared';

/**
 * Liquid Glass is iOS 26 and up. `glassEffect` is guarded natively with
 * `if #available(iOS 26)` and silently renders nothing below that, so the check
 * has to happen on this side too — otherwise a device on iOS 16–25 gets a
 * `presentationBackground` of clear behind a modifier that does nothing, which
 * is a sheet you can see straight through. Resolved once at module scope
 * because it cannot change while the bundle is running.
 */
const GLASS_AVAILABLE = isLiquidGlassAvailable();

/**
 * Detents as module constants, because `presentationBackgroundInteraction`
 * matches its `detent` argument **by value**. An inline `{ fraction: 0.46 }`
 * there and another one in the array are two different objects describing the
 * same height, and the comparison that decides whether the map stays live is not
 * guaranteed to see them as equal.
 */
const PEEK: PresentationDetent = { height: SHEET.peek };
const MID: PresentationDetent = { fraction: SHEET.heightRatio };
const FULL: PresentationDetent = 'large';

const DETENTS = [PEEK, MID, FULL];

/** What each detent covers, for the camera padding the map needs. */
function detentInset(detent: PresentationDetent, windowHeight: number): number {
   if (detent === 'large') return windowHeight;
   if (detent === 'medium') return windowHeight * 0.5;
   if ('height' in detent) return detent.height;
   return windowHeight * detent.fraction;
}

export function StoreSheet({
   bottomInset,
   selected,
   onBack,
   stores,
   query,
   onQueryChange,
   distanceFor,
   onSelect,
   onConfirm,
   note,
   onDetentChange,
}: StoreSheetProps) {
   const { width, height: windowHeight } = useWindowDimensions();
   const [detent, setDetent] = useState<PresentationDetent>(PEEK);

   const face = useSharedValue(selected ? 1 : 0);

   /**
    * The store the detail face is *showing*, which lags `selected` on the way
    * out. Without it the card would blank to nothing and then slide away empty.
    */
   const [shown, setShown] = useState(selected);

   /**
    * Adjusted during render rather than in an effect: the detail face has to
    * carry its store on the very first frame it animates in, and an effect would
    * land a frame late — you would see the card start moving with the previous
    * store's name still on it.
    */
   if (selected && selected !== shown) setShown(selected);

   useEffect(() => {
      if (selected) {
         face.set(withSpring(1, FACE_IN));
         return;
      }
      face.set(
         withSpring(0, FACE_OUT, (finished) => {
            'worklet';
            if (finished) scheduleOnRN(setShown, null);
         }),
      );
   }, [selected, face]);

   /**
    * Picking a store raises the sheet to half — the detail card has a CTA at the
    * bottom and is unusable at peek. Deselecting does *not* lower it again: you
    * are back to browsing a list, and yanking the sheet down under the thumb that
    * just tapped "back" is the kind of helpfulness nobody asked for.
    *
    * Adjusted during render, alongside `shown` above, because the selection can
    * arrive from the map rather than from this sheet — a pin tap has to raise the
    * sheet on the same commit that starts the detail face animating in, and an
    * effect would land a frame late and read as a stutter.
    */
   const [lastSelected, setLastSelected] = useState(selected);
   if (selected !== lastSelected) {
      setLastSelected(selected);
      if (selected && detent === PEEK) setDetent(MID);
   }

   // Kept in sync so the map can pad its camera by whatever the sheet currently
   // covers, rather than by a guess that is wrong at two detents out of three.
   useEffect(() => {
      onDetentChange?.(detentInset(detent, windowHeight));
   }, [detent, windowHeight, onDetentChange]);

   /**
    * Order is application order, index 0 innermost. `presentationBackground` last
    * so it paints the whole sheet chrome including the grabber strip and the
    * home-indicator inset, which a plain `background()` cannot reach.
    *
    * The first two are the fix for the sheet's bottom edge, and they only work
    * as a pair:
    *
    * - `ignoreSafeArea` on the bottom lets the content run to the sheet's real
    *   bottom edge. Without it SwiftUI insets the content above the home
    *   indicator and *nothing renders in the gap* — which is the white strip
    *   under the last row, painted by `presentationBackground` and reading as an
    *   edge that clips the list. The inset is now React Native's to spend, which
    *   is why both faces are handed `bottomInset` below rather than zero.
    * - `glassEffect` then has the whole sheet to paint, corner to corner.
    */
   const modifiers = useMemo(
      () => [
         ignoreSafeArea({ edges: 'bottom' }),
         ...(GLASS_AVAILABLE
            ? [
                 glassEffect({
                    glass: { variant: 'regular', tint: GLASS.tint },
                    // Rectangle, not roundedRectangle: UIKit already masks the
                    // sheet to its own corner radius, and a second radius inside
                    // that mask draws a visible double curve at the top corners.
                    shape: 'rectangle',
                 }),
              ]
            : []),
         presentationDetents(DETENTS, { selection: detent, onSelectionChange: setDetent }),
         presentationDragIndicator('visible'),
         presentationBackgroundInteraction({ type: 'enabledUpThrough', detent: MID }),
         // The sheet is furniture, not a dialogue. There is nothing behind it to
         // return to, so it must not be swipeable into nonexistence.
         interactiveDismissDisabled(true),
         /**
          * Clear under the glass, opaque without it. An opaque value here is
          * painted *between* the map and the material, so leaving it at
          * `Surface.raised` is what made the sheet a white slab with a liquid
          * glass modifier doing nothing on top of it. Below iOS 26 there is no
          * material, so the white is the sheet and has to stay.
          */
         presentationBackground(GLASS_AVAILABLE ? GLASS.presentationClear : Surface.raised),
      ],
      [detent],
   );

   const browseStyle = useAnimatedStyle(() => ({
      opacity: interpolate(face.get(), [0, 0.65], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateY: face.get() * -22 }],
   }));

   const detailStyle = useAnimatedStyle(() => ({
      opacity: interpolate(face.get(), [0.35, 1], [0, 1], Extrapolation.CLAMP),
      transform: [{ translateY: (1 - face.get()) * 26 }],
   }));

   const browsing = selected === null;

   return (
      /**
       * A zero-height anchor. The sheet is presented *from* this host rather than
       * laid out by it, so the host must not occupy space or intercept touches —
       * `width` is still required because SwiftUI sizes the presentation against
       * its anchor's width, and a host with none presents a zero-width sheet.
       */
      <Host style={[styles.host, { width }]} pointerEvents="none">
         <BottomSheet
            isPresented
            // Never dismissed, so this only ever fires as UIKit echoing back the
            // state we already hold.
            onIsPresentedChange={() => {}}
            fitToContents={false}
         >
            <Group modifiers={modifiers}>
               <RNHostView>
                  {/*
                   * `flexGrow: 1, height: 0` and not `flex: 1`. SwiftUI gives the
                   * hosted view an unbounded proposed height; `flex: 1` against
                   * infinity collapses to nothing, whereas a zero base plus grow
                   * fills whatever detent is currently active.
                   */}
                  <View style={styles.body}>
                     <Animated.View
                        style={[styles.face, browseStyle]}
                        pointerEvents={browsing ? 'auto' : 'none'}
                     >
                        <StoreList
                           stores={stores}
                           query={query}
                           onQueryChange={onQueryChange}
                           distanceFor={distanceFor}
                           onSelect={onSelect}
                           note={note}
                           /*
                            * The real inset, now that `ignoreSafeArea` has handed
                            * the home-indicator strip to this tree. This used to
                            * be zero, on the grounds that SwiftUI was insetting
                            * the content itself — it was, and the strip it left
                            * behind is the white edge under the last row.
                            */
                           bottomInset={bottomInset}
                        />
                     </Animated.View>

                     <Animated.View
                        style={[styles.face, detailStyle]}
                        pointerEvents={browsing ? 'none' : 'auto'}
                     >
                        {shown ? (
                           <StoreDetail
                              store={shown}
                              distanceKm={distanceFor(shown)}
                              onConfirm={onConfirm}
                              onBack={onBack}
                              bottomInset={bottomInset}
                           />
                        ) : null}
                     </Animated.View>
                  </View>
               </RNHostView>
            </Group>
         </BottomSheet>
      </Host>
   );
}

const styles = StyleSheet.create({
   host: {
      position: 'absolute',
   },
   body: {
      flexGrow: 1,
      height: 0,
      /**
       * Clearance for UIKit's drag indicator, which is drawn *over* the top of
       * the content rather than above it. At the old `Space.md` the search field
       * had 2pt to spare and read as welded to the sheet's lip.
       */
      paddingTop: SHEET.contentTop,
   },
   face: {
      ...StyleSheet.absoluteFill,
   },
});
