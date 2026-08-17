/**
 * The scroll container every tab screen uses.
 *
 * It no longer reserves space for the tab bar. It asks iOS to.
 *
 * **Do not put `contentInsetAdjustmentBehavior="never"` back.** That line was
 * correct for exactly as long as the tab bar was a pill we drew ourselves; with
 * a real `UITabBarController` it is the one setting that defeats the system.
 * `NativeTabs` turns on automatic content-inset adjustment for the *first nested
 * ScrollView* of each tab screen, and that adjustment is what keeps the last row
 * clear of the bar — including while the iOS 26 bar minimizes, which no constant
 * can track. It is not even really optional: `RNSScrollViewHelper` walks the
 * screen's first-descendant chain on mount and flips a `Never` scroll view to
 * `Automatic` regardless, so asking for `never` buys a disagreement rather than
 * a behaviour. We ask for what we are going to get.
 *
 * The negative top `contentInset` is the deliberate half of that bargain. The
 * automatic adjustment insets both ends of a vertical scroll view, and the top
 * end is ours: `ScreenHeader` paints its band *behind* the status bar and pads
 * for it itself. Letting iOS inset the top as well would push the band down and
 * leave a strip of cream above a green header. Cancelling it here is one line in
 * one file; the alternative is every header learning to climb back out.
 *
 * **It adds no bottom padding of its own, and that is a resolution rather than
 * an omission.** This file used to end its content with `Space.lg` of air at the
 * same time as `Sheet` was closing itself with `Space.xxl`, for 52pt below the
 * last card — two deliberate decisions taken separately that nobody had seen
 * together. The sheet won: air below content is the business of the surface the
 * content sits on, and every screen in the app ends its scroll with a `Sheet`.
 * A viewport that pads its own content is a workaround for surfaces that do not
 * pad themselves, and it is the copy that cannot be turned off. The tab bar's
 * clearance was the other half of the old argument here and it is gone too —
 * that arrives as a content inset now.
 *
 * Two rules callers have to keep, both from the native-tabs docs:
 *
 *   - the ScrollView must be the screen's **first descendant**. Returning
 *     `<ScreenScroll>` as the screen's root satisfies that. If you must wrap it,
 *     the wrapper needs `collapsable={false}` or the chain breaks and you
 *     silently lose the inset, scroll-to-top and minimize-on-scroll with it.
 *   - `FlatList` is only partly supported here — no scroll-to-top, no
 *     minimize-on-scroll. Prefer this component and map inside it until a screen
 *     is genuinely long enough to need virtualisation.
 */

import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTopInset } from './insets';

import { Surface } from '@/theme';

type Props = {
   children: ReactNode;
   contentContainerStyle?: StyleProp<ViewStyle>;
};

export function ScreenScroll({ children, contentContainerStyle }: Props) {
   const top = useTopInset();

   return (
      <ScrollView
         style={styles.scroll}
         contentContainerStyle={contentContainerStyle}
         showsVerticalScrollIndicator={false}
         /** The bottom half of this is the tab bar clearance. See the header. */
         contentInsetAdjustmentBehavior="automatic"
         /** Cancels only the top half, so the header band keeps the status bar. */
         contentInset={{ top: -top }}
      >
         {children}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   scroll: {
      flex: 1,
      backgroundColor: Surface.app,
   },
});
