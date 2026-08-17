/**
 * The header band every screen starts with.
 *
 * One component rather than a header per tab, because the band owns the status
 * bar: the moment two screens each pad for the top inset themselves, they drift
 * apart by a few points and the tab switch reads as a jump.
 *
 * `backdrop` is the seam for photography. §6 wants a barista-pour photo behind
 * Home's greeting; until there is an asset the caller passes decoration, and
 * later it passes an `<Image>` without this file changing.
 *
 * Three things are exported alongside the band, all of them formerly local to
 * `index.tsx`:
 *
 * - `CapsKicker`, the ALL-CAPS micro-label rule, which was copy-pasted verbatim
 *   into three screens *and* two other chrome files. It is a style object rather
 *   than a component because half its uses need to compose it with a colour.
 * - `HeaderButton` and `AvatarButton`, the round translucent controls that only
 *   make sense on this band. They live here rather than in `controls/` because
 *   their whole spec is "legible on House Green with no shadow", which is a
 *   statement about this band and nowhere else.
 */

import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';

import { useTopInset } from './insets';
import { SHEET_OVERLAP } from './sheet';

import {
   Action,
   Gutter,
   Pressed,
   Radius,
   Sizes,
   Space,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

/**
 * The caps micro-label: `COLLECTING FROM`, `BALANCE`, `NEW LAUNCH`.
 *
 * `TextStyles.caps` tunes its tracking for capitals, so the transform has to
 * travel with it — which is exactly why every call site was restating both
 * lines. Spread this and add a colour; the colour is the only thing that
 * legitimately varies.
 */
export const CapsKicker: TextStyle = {
   ...TextStyles.caps,
   textTransform: 'uppercase',
};

type Props = {
   title: string;
   /** ALL-CAPS micro-label above the title. */
   kicker?: string;
   /** `inverse` is House Green with light type; `light` sits on the cream app background. */
   tone?: 'light' | 'inverse';
   /** Leading control or mark — the siren on Home, a back chevron on a pushed screen. */
   left?: ReactNode;
   /** Trailing controls — the gift shortcut and the avatar on Home. */
   right?: ReactNode;
   /** Anything that belongs inside the coloured band, under the title. */
   children?: ReactNode;
   /** Absolutely filled behind the band's content. Photo, gradient, line-art. */
   backdrop?: ReactNode;
   /** Set when a `<Sheet>` follows, so the band grows to keep the title clear of its curve. */
   sheetBelow?: boolean;
   /**
    * Folds everything below the control row away — kicker, title and children —
    * and slides the title up into the control row in its place.
    *
    * This is iOS' own large-title behaviour, and it exists here for the same
    * reason UIKit has it: a screen whose content has become the point should not
    * still be spending eighty points on saying what the screen is called. The
    * store picker drives it from how far its sheet is open.
    *
    * Leave it **undefined** and none of this runs — no animation is scheduled,
    * no compact title is rendered, and the band behaves exactly as it did before
    * the prop existed. Every screen that does not opt in is unaffected.
    *
    * The band does not decide this for itself. It has no idea what is happening
    * below it, and a header that guessed would be one more thing to fight.
    */
   collapsed?: boolean;
};

/**
 * Matches `COLLAPSE_TIMING` in the store picker's stage. A timing rather than a
 * spring because this animates a height, and overshoot on a height bounces
 * whatever is underneath the band.
 */
const COLLAPSE = { duration: 280, easing: Easing.out(Easing.cubic) } as const;

export function ScreenHeader({
   title,
   kicker,
   tone = 'light',
   left,
   right,
   children,
   backdrop,
   sheetBelow = false,
   collapsed,
}: Props) {
   /**
    * Not `useSafeAreaInsets().top` directly. Under a native tab bar the scroll
    * view may already have been inset from the top by the system, in which case
    * padding by the raw inset here would double it — `useTopInset` is the one
    * place that knows which of those is true.
    */
   const top = useTopInset();
   const inverse = tone === 'inverse';

   /**
    * `undefined` is not `false`. A screen that never passes `collapsed` gets a
    * shared value pinned at 0 and an effect that never schedules anything, so
    * the animated styles resolve to the same constants the plain band had.
    */
   const collapsible = collapsed !== undefined;

   /**
    * A collapsible band always draws the control row, with or without controls
    * in it — it is where the title goes when it folds, so a band without one has
    * nowhere to put the screen's name and collapses to a blank strip.
    */
   const controlRow = Boolean(left || right) || collapsible;

   const fold = useSharedValue(collapsed ? 1 : 0);

   useEffect(() => {
      if (!collapsible) return;
      fold.set(withTiming(collapsed ? 1 : 0, COLLAPSE));
   }, [collapsible, collapsed, fold]);

   /**
    * `maxHeight` rather than `height`, so the block keeps sizing itself while it
    * is open. A fixed height would need measuring, and measuring a thing that is
    * mid-animation is how a header ends up re-rendering its whole screen on
    * every frame of its own collapse.
    *
    * 400 is past anything a kicker, a title and a rail of cards can reach —
    * `maxHeight` only clamps, so an open block is unconstrained in practice.
    */
   const blockStyle = useAnimatedStyle(() => ({
      maxHeight: (1 - fold.get()) * 400,
      opacity: 1 - fold.get(),
      transform: [{ translateY: fold.get() * -8 }],
   }));

   /** The title's second home. Fades in as the large one leaves. */
   const compactStyle = useAnimatedStyle(() => ({
      opacity: fold.get(),
      transform: [{ translateY: (1 - fold.get()) * 6 }],
   }));

   return (
      <View
         style={[
            styles.band,
            inverse && styles.bandInverse,
            {
               // A control row brings its own air; a bare title needs some.
               paddingTop: top + (controlRow ? Space.sm : Space.lg),
               paddingBottom: Space.xl + (sheetBelow ? SHEET_OVERLAP : 0),
            },
         ]}
      >
         {/*
          * Bounce filler. The band is normally the first thing in a ScrollView,
          * and overscrolling past it would otherwise expose the cream scroll
          * background above a green header. This block travels with the content,
          * so the green appears to continue forever upward — and it also covers
          * the gap when a system content inset pushes the band down the page.
          */}
         {inverse ? <View style={styles.overscroll} pointerEvents="none" /> : null}

         {backdrop ? (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
               {backdrop}
            </View>
         ) : null}

         {controlRow ? (
            <View style={styles.controls}>
               <View style={styles.controlsLeft}>{left}</View>

               {/*
                * Between the two control groups and behind them in the tap
                * order — `pointerEvents` is off so a long city name can overrun
                * a control's box without stealing its taps. Absolute, so its
                * arrival does not push the controls apart.
                */}
               {collapsible ? (
                  <Animated.View
                     style={[styles.compactSlot, compactStyle]}
                     pointerEvents="none"
                     // Hidden from VoiceOver: it is the same string as the large
                     // title below, which stays in the tree, and a rotor that
                     // reads the screen's name twice is a bug.
                     accessibilityElementsHidden
                     importantForAccessibility="no-hide-descendants"
                  >
                     <Text
                        style={[styles.compactTitle, inverse && styles.titleInverse]}
                        numberOfLines={1}
                        maxFontSizeMultiplier={1.2}
                     >
                        {title}
                     </Text>
                  </Animated.View>
               ) : null}

               <View style={styles.controlsRight}>{right}</View>
            </View>
         ) : null}

         <Animated.View style={collapsible ? [styles.block, blockStyle] : styles.block}>
            {kicker ? (
               <Text style={[styles.kicker, inverse && styles.kickerInverse]}>{kicker}</Text>
            ) : null}

            <Text
               style={[styles.title, inverse && styles.titleInverse]}
               maxFontSizeMultiplier={1.3}
            >
               {title}
            </Text>

            {children}
         </Animated.View>
      </View>
   );
}

type HeaderButtonProps = {
   /** Accessibility label. The control is icon-only, so this is the whole name. */
   label: string;
   onPress?: () => void;
   children: ReactNode;
};

/**
 * Round translucent control for the header band. No shadow — a shadow on green
 * reads as dirt, and the translucent fill is already doing the separating.
 */
export function HeaderButton({ label, onPress, children }: HeaderButtonProps) {
   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={label}
         onPress={onPress}
         style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
      >
         {children}
      </Pressable>
   );
}

type AvatarButtonProps = {
   /** One or two characters. Callers derive them; this does not guess. */
   initials: string;
   onPress?: () => void;
   label?: string;
};

/**
 * Double ring, white outside green, per §7. The entrance to the Account stack.
 *
 * Deliberately not `brand/Avatar`: that one is a general-purpose portrait with
 * an optional tier ring, and it can appear anywhere. This is a *header control* —
 * a fixed 44pt target whose white outer ring exists to hold it off the House
 * Green behind it. Layering also forbids it, since chrome sits under brand.
 */
export function AvatarButton({ initials, onPress, label = 'Account' }: AvatarButtonProps) {
   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={label}
         onPress={onPress}
         style={({ pressed }) => [styles.avatarRing, pressed && styles.pressed]}
      >
         <View style={styles.avatar}>
            <Text style={styles.avatarInitials} maxFontSizeMultiplier={1.1}>
               {initials}
            </Text>
         </View>
      </Pressable>
   );
}

/** Deeper than any rubber-band overscroll will reach. */
const OVERSCROLL = 400;

const styles = StyleSheet.create({
   band: {
      paddingHorizontal: Gutter,
      gap: Space.xs,
   },
   bandInverse: {
      backgroundColor: Surface.inverse,
   },
   overscroll: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: -OVERSCROLL,
      height: OVERSCROLL,
      backgroundColor: Surface.inverse,
   },
   controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Space.base,
      /**
       * Stated, not inherited from whatever the tallest control happens to be.
       * The collapsed title lives in this row and is absolutely positioned
       * against it, so a row that sizes to a 30pt siren would clip it — and the
       * arithmetic in the store picker's `stage.ts` assumes 44 either way.
       */
      minHeight: Sizes.tap,
   },
   controlsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
   },
   controlsRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.md,
   },
   /**
    * Inset by a tap target either side so a long title is clipped by
    * `numberOfLines` before it can reach a control, rather than being drawn
    * over one. Absolute, so it costs the control row no height and its arrival
    * does not push the two control groups apart.
    */
   compactSlot: {
      position: 'absolute',
      left: Sizes.tap,
      right: Sizes.tap,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   },
   compactTitle: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   /**
    * Holds everything the band folds away. It carries the 4pt gap that used to
    * be the band's own, so nesting these three children changed no spacing.
    * `overflow` is what makes the animated `maxHeight` a clip rather than an
    * overlap.
    */
   block: {
      gap: Space.xs,
      overflow: 'hidden',
   },
   kicker: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   kickerInverse: {
      color: TextColor.onDarkMuted,
   },
   title: {
      ...TextStyles.h1,
      color: TextColor.primary,
   },
   titleInverse: {
      color: TextColor.onDark,
   },

   pressed: {
      opacity: Pressed.opacity,
   },
   headerButton: {
      width: Sizes.tap,
      height: Sizes.tap,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Surface.onDarkFill,
   },
   avatarRing: {
      width: Sizes.tap,
      height: Sizes.tap,
      borderRadius: Radius.pill,
      padding: Space.xxs,
      backgroundColor: Surface.raised,
   },
   avatar: {
      flex: 1,
      borderRadius: Radius.pill,
      backgroundColor: Action.selected,
      borderWidth: 1.5,
      borderColor: Surface.raised,
      alignItems: 'center',
      justifyContent: 'center',
   },
   avatarInitials: {
      ...TextStyles.label,
      color: TextColor.onDark,
   },
});
