/**
 * The mechanism: a menu that the app slides off to reveal.
 *
 * One shared value, `progress`, runs 0 → 1 and everything reads from it — the
 * card's shift, scale and corner radius, the scrim over it, the two round
 * controls, and each row's staggered entrance. Nothing is sequenced against
 * anything else, so there is only ever one source of truth for "how open is it".
 *
 * **It is a gesture first and a button second.** Tapping the hamburger is the
 * obvious way in, but `progress` is also writable directly by a pan, and that is
 * what earns the word fluid: drag from the left edge and the panel tracks your
 * thumb, stagger and all; stop halfway and it stops halfway; reverse and it
 * reverses. A version built out of `withDelay` chains looks identical on a tap
 * and comes apart the instant a finger is involved, because the timeline has
 * already committed to a direction the gesture can no longer steer.
 *
 * **The app content used to be a render prop**, so that this file could hand it
 * `openMenu` — the control that opens the panel lives inside the content, in its
 * header, the way it does in the real app. That argument was right about where
 * the button belongs and wrong about how the callback gets there. It is plain
 * `children` now, and `AppMenuProvider` is mounted below rather than by the
 * caller, because the render prop cost two things it never bought back:
 *
 * - In the app there is a whole tab controller between this file and the button,
 *   and a prop does not cross a navigator. The context always had to exist, so
 *   the render prop was a second mechanism for a job the first one already did.
 * - A function child is re-invoked on every render of the layout that owns it, so
 *   the entire tab tree — provider, `NativeTabs`, five triggers, the bottom
 *   accessory — was rebuilt every time `settledOpen` flipped or the router
 *   reported a route change *anywhere* in the app. A node can be memoized by its
 *   owner and skipped wholesale; a function's return value cannot. See the
 *   `useMemo` in `src/app/(tabs)/_layout.tsx`.
 *
 * **The content keeps its full-size layout while the card is small.** Scale is a
 * transform, so nothing under it re-lays out: the shrunken card still measures a
 * whole screen wide and still reports the un-shrunken safe-area insets, and its
 * header band is still padding for a status bar that is no longer above it. That
 * is correct and is the effect — you are looking at the app, held at arm's
 * length, not at a narrower app. Anything that "fixes" the insets to match the
 * visible size makes the card reflow mid-drag, which is the one thing this
 * mechanism must never do.
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { tapFeedback } from '@/components/onboarding/haptics';
import { Elevation, Surface } from '@/theme';

import { AppMenuProvider } from './AppMenuContext';
import { MenuBackdrop } from './MenuBackdrop';
import { MenuPanel } from './MenuPanel';
import type { MenuItem } from './items';
import {
   DRAG_SPAN,
   EDGE_WIDTH,
   FLICK_VELOCITY,
   RADIUS_OPEN,
   SCALE_OPEN,
   SETTLE,
   SHIFT,
   SNAP_POINT,
} from './stage';

/**
 * How far a finger travels before the pan takes the touch, in points.
 *
 * Two values because the answer depends on which way it is going — see
 * `.activeOffsetX()` below. Spelled as a typed tuple so the ternary that picks
 * between them stays inside `activeOffsetX`'s `number | [number, number]`.
 */
const SLOP_EITHER_WAY: [number, number] = [-20, 20];
const SLOP_RIGHTWARD = 20;

type Props = {
   items: readonly MenuItem[];
   initials?: string;
   caption?: string;
   /**
    * Whether the Account control wears its unread dot. Off by default, and it
    * has to be: the dot is a claim about the account, and a claim nothing can
    * retract is decoration wearing a signal's clothes. It stays a prop rather
    * than being deleted so the affordance is here the day there is something
    * behind it.
    */
   unread?: boolean;
   /**
    * Whether the *closed* panel may be opened by a drag. Defaults on, so a
    * consumer with only one screen — the lab harness — needs to say nothing.
    * The app passes a route test; see `.enabled()` below for why this is a prop
    * rather than a check inside the worklets.
    */
   gestureEnabled?: boolean;
   onSelect: (item: MenuItem) => void;
   onProfile: () => void;
   /**
    * The app. A node, not a function — `openMenu` reaches the button inside it
    * through `AppMenuProvider`, which is mounted here. See the header.
    */
   children: ReactNode;
};

export function FluidMenu({
   items,
   initials,
   caption,
   unread,
   gestureEnabled = true,
   onSelect,
   onProfile,
   children,
}: Props) {
   const { width } = useWindowDimensions();

   const progress = useSharedValue(0);
   /** Where `progress` stood when the current drag began. */
   const from = useSharedValue(0);

   /**
    * A JS-side mirror of the two settled states, for the things React has to know
    * synchronously: whether the app content accepts touches and VoiceOver focus,
    * whether the close-scrim is live, and whether a drag may start in either
    * direction.
    */
   const [settledOpen, setSettledOpen] = useState(false);

   /**
    * The one definition of "commit to a state": flip the mirror, start the
    * spring. A worklet, so the gesture can call the same function at release
    * that the buttons call from JS — the alternative is `onEnd` re-implementing
    * the body, which is how the two got out of step in the first place. Calling
    * it from JS is fine; `scheduleOnRN` detects the RN runtime and falls back to
    * a microtask rather than a thread hop.
    *
    * **The two directions are deliberately not symmetric.**
    *
    * Opening writes `true` immediately, because the card starts moving on this
    * frame and every touch inside it has to die on this frame too.
    *
    * Closing writes `false` from the spring's completion callback, 520 ms later.
    * It used to write it here, alongside the spring, and for the whole of every
    * close the flag said "closed" while the card was still out at `scale 0.66`
    * and half a screen to the right: the app behind it took touches, the scrim
    * stopped taking them, and `.enabled()` dropped back to `gestureEnabled`, so a
    * half-closed panel could not be re-grabbed. The card has to be home before it
    * is live again, and the only thing that knows when it is home is the spring.
    *
    * `finished` is the guard. A spring interrupted by another `progress.set` —
    * a re-grab mid-close, a second tap — fires its callback with `false`, and
    * acting on that would flip the flag for a close that never landed.
    */
   const settle = useCallback(
      (next: boolean) => {
         'worklet';
         if (next) scheduleOnRN(setSettledOpen, true);

         progress.set(
            withSpring(next ? 1 : 0, SETTLE, (finished) => {
               'worklet';
               if (finished && !next) scheduleOnRN(setSettledOpen, false);
            }),
         );
      },
      [progress],
   );

   const openMenu = useCallback(() => {
      tapFeedback();
      settle(true);
   }, [settle]);

   const closeMenu = useCallback(() => {
      tapFeedback();
      settle(false);
   }, [settle]);

   /**
    * Dismissal is this component's job, not the caller's. Choosing a row always
    * puts the menu away, and leaving that to `onSelect` means every consumer has
    * to remember — and the one that forgets navigates with the panel still open.
    */
   const handleSelect = useCallback(
      (item: MenuItem) => {
         tapFeedback();
         settle(false);
         onSelect(item);
      },
      [onSelect, settle],
   );

   const handleProfile = useCallback(() => {
      tapFeedback();
      settle(false);
      onProfile();
   }, [onProfile, settle]);

   /**
    * Memoized, not rebuilt in the render body.
    *
    * It used to be the latter, which was survivable while this component only
    * re-rendered when the panel moved. It is not survivable now that the layout
    * above re-renders on every navigation in the app: a fresh `Gesture.Pan()`
    * per render is a fresh handler config handed to the detector per render,
    * including in the middle of a drag. The dependencies are the four things the
    * worklets actually close over plus the two that change its configuration.
    */
   const pan = useMemo(
      () =>
         Gesture.Pan()
            /**
             * Whole-detector off switch, for the screens where a left-edge drag
             * already means something. The caller decides which those are; what
             * this file insists on is the `|| settledOpen` — once the panel is
             * open a drag from anywhere has to be able to put it away, whatever
             * the screen underneath would otherwise want, because that screen is
             * not taking touches. That clause is only trustworthy because
             * `settledOpen` now stays true for the whole of the closing spring.
             *
             * It has to be `.enabled()` and not an early return inside the
             * worklets, for the same reason `onTouchesDown` fails rather than
             * ignores: a Pan that activates has already taken the touch off the
             * nested ScrollView, so a no-op handler still kills the rail it was
             * scrolling. A disabled gesture never enters the arena at all.
             */
            .enabled(gestureEnabled || settledOpen)
            /**
             * Horizontal intent only — without a threshold the detector would
             * claim vertical drags too and the rails inside the app content would
             * stop scrolling. **And, while closed, rightward intent only.**
             *
             * A symmetric threshold was the bug the 44pt edge strip below was
             * supposed to prevent and instead caused. Every horizontal `Rail` on
             * Home has its leading edge inside that strip, so a leftward drag
             * started there passed the strip test, activated the pan, took the
             * touch off the `ScrollView` — and then clamped to nothing, because
             * `progress` was already 0. The rail simply did not scroll. Closed,
             * the only drag that can mean anything is the one that opens, so the
             * leftward half of the threshold is not narrowed, it is removed:
             * `activeOffsetX(20)` leaves `activeOffsetXStart` unset and a
             * leftward pan never activates at all.
             *
             * It also closes half of a second exposure. The leftmost tab item
             * sits inside the strip too, and horizontal slop on a Home tab tap
             * used to be able to activate the pan and cancel the touch to the
             * native bar; now only slop toward the middle of the screen can.
             *
             * Open, it goes back to both directions, because from there a drag
             * either way should be able to put the panel down.
             */
            .activeOffsetX(settledOpen ? SLOP_EITHER_WAY : SLOP_RIGHTWARD)
            .failOffsetY([-24, 24])
            /**
             * Closed, the panel opens only from the left edge — the app content is
             * full of horizontal rails and a swipe-anywhere-to-open would fight
             * every one of them. Open, a drag from anywhere closes it, because at
             * that point nothing underneath is taking touches.
             *
             * The rejection has to happen *here*, at touch-down, and not by
             * ignoring the drag later: a Pan that activates has already stolen the
             * touch from the nested ScrollView, so a rail would die mid-scroll
             * even with a no-op handler. Failing before activation leaves the
             * touch where it belongs.
             */
            .onTouchesDown((event, manager) => {
               'worklet';
               if (progress.get() > 0.02) return;
               const touch = event.allTouches[0];
               if (touch && touch.absoluteX > EDGE_WIDTH) manager.fail();
            })
            .onBegin(() => {
               'worklet';
               from.set(progress.get());
            })
            .onUpdate((event) => {
               'worklet';
               const span = width * DRAG_SPAN;
               progress.set(Math.min(1, Math.max(0, from.get() + event.translationX / span)));
            })
            /**
             * `onEnd` rather than `onFinalize`, and it takes its `success`
             * argument seriously.
             *
             * `onEnd` fires exactly when the pan owned the touch and then let go
             * of it — on a deliberate release with `success` true, and on a
             * cancellation with it false. That is the right set: `onFinalize`
             * would additionally fire for every touch that failed at the strip
             * test without ever moving anything, and re-settling a panel nobody
             * touched is a spring per tap.
             *
             * A cancelled pan still has to land somewhere — `progress` is stranded
             * wherever the last `onUpdate` left it, and the one outcome worse than
             * snapping to the wrong end is not snapping at all. What it must not
             * do is believe `velocityX`. An interrupted drag's last velocity is
             * whatever the finger happened to be doing when the system took the
             * touch away, not an intention, so on a cancellation position decides
             * alone.
             */
            .onEnd((event, success) => {
               'worklet';
               // A flick decides on its own; a slow drag is decided by where it ended.
               const flick = success ? event.velocityX : 0;
               const next =
                  flick > FLICK_VELOCITY
                     ? true
                     : flick < -FLICK_VELOCITY
                       ? false
                       : progress.get() > SNAP_POINT;

               // Only buzz when the release actually changed the state. A drag that
               // rebounds to where it started did not commit to anything, and a
               // cancellation is not a release at all.
               if (success && next !== (from.get() > SNAP_POINT)) scheduleOnRN(tapFeedback);

               settle(next);
            }),
      [from, gestureEnabled, progress, settle, settledOpen, width],
   );

   const cardStyle = useAnimatedStyle(() => {
      const p = progress.get();
      return {
         transform: [
            // Order is load-bearing: scale about the centre first, then shift by an
            // unscaled amount. Swapping them scales the shift too and the card
            // lands short. See the derivation in `stage.ts`.
            { translateX: p * width * SHIFT },
            { scale: 1 - p * (1 - SCALE_OPEN) },
         ],
      };
   });

   /**
    * Applied to *both* card layers, and it used to be only the inner one — "on
    * the inner view, because the outer one carries the shadow and must not clip".
    * The clipping half of that is still true and is why there are two views at
    * all: iOS clips a view's own shadow when that view sets `overflow: 'hidden'`.
    * The radius half was wrong the moment the outer view got a background. An
    * opaque view with square corners paints four cream corners outside the inner
    * view's rounded ones, and iOS derives the shadow's path from the same radii —
    * so the outer view needs the radius to keep its corners hidden and to cast the
    * right shape. It still does not clip; the inner view does.
    */
   const radiusStyle = useAnimatedStyle(() => ({
      borderRadius: progress.get() * RADIUS_OPEN,
   }));

   /**
    * A light push-back on the content, so the eye reads the panel as nearer. Tops
    * out well below a modal scrim — the card is still meant to look like a live
    * app, not a dimmed one.
    */
   const scrimStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.get(), [0, 1], [0, 0.14], Extrapolation.CLAMP),
   }));

   return (
      /**
       * The detector wraps the whole shell, not just the card, so that once the
       * menu is open a drag anywhere — including across the rows — puts it away.
       * Safe to cover this much because the gesture fails at touch-down outside the
       * edge while closed.
       */
      <GestureDetector gesture={pan}>
         <View style={styles.root}>
            <MenuBackdrop />

            <MenuPanel
               items={items}
               progress={progress}
               initials={initials}
               caption={caption}
               unread={unread}
               modal={settledOpen}
               onSelect={handleSelect}
               onProfile={handleProfile}
               onClose={closeMenu}
            />

            <Animated.View style={[styles.card, cardStyle, radiusStyle]}>
               <Animated.View style={[styles.clip, radiusStyle]}>
                  {/*
                   * Touches are switched off wholesale while the menu is open, so a
                   * tap meant for "put this away" cannot land on a button in the app
                   * behind it.
                   *
                   * `pointerEvents` is a statement about fingers and nothing else —
                   * with it alone a VoiceOver user still walks all of Home and all
                   * five tab items behind a scrim they cannot see. The two
                   * accessibility props are the same containment for the reader:
                   * `accessibilityElementsHidden` on iOS, `no-hide-descendants` on
                   * Android. They are what does the work on Android, where the
                   * panel's `accessibilityViewIsModal` is ignored.
                   *
                   * On the content rather than on the card, because that is the
                   * smallest thing that is actually unreachable. It does not buy
                   * the scrim's "Close menu" target a reader on iOS — the panel is
                   * marked modal and UIKit skips its whole sibling subtree, scrim
                   * included — but the panel's own close control is right there and
                   * is the labelled way out. The narrower scope is what keeps this
                   * honest on the platform that has no modal flag.
                   *
                   * Nothing is needed for the closed state in the other direction:
                   * every element of the panel animates to `opacity: 0`, and a fully
                   * transparent view is already skipped.
                   */}
                  <View
                     style={styles.fill}
                     pointerEvents={settledOpen ? 'none' : 'auto'}
                     accessibilityElementsHidden={settledOpen}
                     importantForAccessibility={settledOpen ? 'no-hide-descendants' : 'auto'}
                  >
                     {/*
                      * The seam. `openMenu` is stable and the provider memoizes its
                      * value on it, so a consumer that only wants the callback never
                      * re-renders for the panel's sake — and `children` arrives as
                      * one element, which is what lets the whole app subtree below
                      * bail out when this component re-renders.
                      */}
                     <AppMenuProvider openMenu={openMenu}>{children}</AppMenuProvider>
                  </View>

                  <Animated.View
                     style={[styles.scrim, scrimStyle]}
                     pointerEvents={settledOpen ? 'auto' : 'none'}
                  >
                     {/*
                      * The whole card is a close target — the gesture's discoverable
                      * twin. Drag it away, or just tap it.
                      */}
                     <Pressable
                        style={styles.fill}
                        accessibilityRole="button"
                        accessibilityLabel="Close menu"
                        onPress={closeMenu}
                     />
                  </Animated.View>
               </Animated.View>
            </Animated.View>
         </View>
      </GestureDetector>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
   card: {
      ...StyleSheet.absoluteFill,
      /**
       * Green-tinted, per DESIGN_SYSTEM §2. Static rather than animated: while the
       * card is full-bleed its shadow falls off-screen, so there is nothing to fade.
       *
       * That says the shadow costs nothing to *animate*. It said nothing about what
       * it costs to *draw*, and it was not free. iOS computes a `shadowPath` from a
       * view's bounds and corner radii only when its background is opaque; with no
       * background it falls back to deriving the shape from the composited alpha of
       * everything inside the view — which here is the entire app — once per frame.
       * `Surface.app` is the cheapest possible answer and is never seen: the app
       * content paints its own background over every pixel of it, and the animated
       * radius above keeps its corners inside the ones the clip layer draws.
       */
      backgroundColor: Surface.app,
      ...Elevation.floating,
      shadowOpacity: 0.34,
      shadowRadius: 28,
   },
   /**
    * Separate from the shadow layer on purpose. iOS clips a view's own shadow when
    * that view sets `overflow: 'hidden'`, so the *clipping* and the shadow cannot
    * live on the same node. The radius itself lives on both — see `radiusStyle`.
    */
   clip: {
      flex: 1,
      overflow: 'hidden',
   },
   fill: {
      flex: 1,
   },
   scrim: {
      ...StyleSheet.absoluteFill,
      // The token, not the hex. `Surface.inverseDeep` is this exact value and is
      // what `MenuBackdrop` already darkens with; two spellings of one colour is
      // one of them going stale.
      backgroundColor: Surface.inverseDeep,
   },
});
