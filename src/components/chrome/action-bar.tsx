/**
 * The sticky bottom bar: Add to Cart, Pay ₹535.50, Continue.
 *
 * No screen needs it yet — the PDP and the cart are not built. It is here now
 * because it is the one piece of chrome whose position is genuinely hard: it has
 * to sit above a native tab bar whose height changes as iOS 26 minimizes it, and
 * the wrong way to do that (a constant, or `useSafeAreaInsets().bottom` plus
 * padding) works on the simulator and hops on a real scroll. `BottomChrome`
 * resolves it natively, and this component's only job is to be the thing that
 * already knows that.
 *
 * The bar is opaque and content scrolls under it. That is the intended reading —
 * the bar is a floor, not a card — and it is why `Screen` reserves the bar's
 * height at the end of the scroll rather than letting the last row hide.
 *
 * Two slots. `summary` is the left-hand fact (item count, total) and shrinks;
 * the action is the right-hand control and does not. A bar with only an action
 * gives it the full width, which is what a `<Button full>` expects.
 */

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { BottomChrome } from './insets';

import { Border, Elevation, Gutter, Space, Surface } from '@/theme';

type Props = {
   /** The action, usually a `<Button>`. Given no `summary`, it fills the bar. */
   children: ReactNode;
   /** Left-hand fact — a total, an item count. Shrinks before the action does. */
   summary?: ReactNode;
   tone?: 'light' | 'inverse';
   /**
    * Wrap in `BottomChrome` here. Leave off when the bar is passed to `Screen`'s
    * `footer`, which already does it — two wrappers means two bottom insets.
    */
   standalone?: boolean;
   style?: StyleProp<ViewStyle>;
};

export function ActionBar({
   children,
   summary,
   tone = 'light',
   standalone = false,
   style,
}: Props) {
   const inverse = tone === 'inverse';

   const bar = (
      <View
         style={[
            styles.bar,
            inverse ? styles.barInverse : styles.barLight,
            style,
         ]}
      >
         {summary ? <View style={styles.summary}>{summary}</View> : null}
         <View style={summary ? styles.action : styles.actionFull}>{children}</View>
      </View>
   );

   if (!standalone) return bar;

   return <BottomChrome style={styles.chrome}>{bar}</BottomChrome>;
}

const styles = StyleSheet.create({
   chrome: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flex: 0,
   },
   bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.base,
      paddingHorizontal: Gutter,
      paddingVertical: Space.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      /**
       * `Elevation.sheet` throws its shadow *upward* (negative y offset), which
       * is the only direction that makes sense for a floor. The hairline does
       * the work on Android, where the elevation would cast the wrong way.
       */
      ...Elevation.sheet,
   },
   barLight: {
      backgroundColor: Surface.raised,
      borderTopColor: Border.hair,
   },
   barInverse: {
      backgroundColor: Surface.inverse,
      borderTopColor: Border.hairOnDark,
   },
   summary: {
      flexShrink: 1,
   },
   action: {
      flexGrow: 1,
      flexShrink: 0,
   },
   actionFull: {
      flex: 1,
   },
});
