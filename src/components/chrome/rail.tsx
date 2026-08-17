/**
 * The horizontal scroller. One gutter, one gap, one place that knows about the
 * shadow-clipping problem.
 *
 * `PlaceholderRail` was already three-quarters of this and five sections were
 * using it for content that was not a placeholder at all, so this is that
 * component finished: peek and snapping are the two things it was missing.
 *
 * **Peek is the affordance.** A rail whose last visible card ends flush with the
 * screen edge looks like a grid that got cut off. The gutter plus a fixed card
 * width (`RailCard` in `@/theme`) means the next card is always partly visible,
 * which is why those widths are absolute and not a fraction of the screen.
 *
 * **Snapping is opt-in**, and needs `itemWidth` to be honest. Snapping a rail of
 * mixed-width children fights the finger — the interval is a lie and the scroll
 * lands somewhere nobody asked for. A uniform rail (products, rewards) should
 * snap; a ragged one (chips, category discs) should not.
 */

import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Gutter, Space } from '@/theme';

type Props = {
   children: ReactNode;
   /**
    * Snap each card to the gutter. Requires `itemWidth`; without it the
    * interval cannot be computed and the prop is ignored rather than guessed.
    */
   snap?: boolean;
   /** Uniform width of every child. Only read when `snap` is set. */
   itemWidth?: number;
   /** Between cards. Also feeds the snap interval, so it has to be the real gap. */
   gap?: number;
   /** Off when the rail is already inside a `Gutter`. */
   gutter?: boolean;
   contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Rail({
   children,
   snap = false,
   itemWidth,
   gap = Space.md,
   gutter = true,
   contentContainerStyle,
}: Props) {
   const interval = snap && itemWidth ? itemWidth + gap : undefined;

   return (
      <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         /**
          * `start`, not `center`. The gutter is the left edge of the design, so
          * a snapped card should land on it — centring would put the first card
          * half off-screen.
          */
         snapToAlignment="start"
         snapToInterval={interval}
         decelerationRate={interval ? 'fast' : 'normal'}
         contentContainerStyle={[
            styles.content,
            { gap },
            gutter && styles.contentGutter,
            contentContainerStyle,
         ]}
      >
         {children}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   content: {
      flexDirection: 'row',
      /**
       * A horizontal ScrollView clips to its bounds, which lops the top and
       * bottom off every card shadow inside it. This is the room the shadow needs.
       */
      paddingVertical: Space.sm,
   },
   contentGutter: {
      paddingHorizontal: Gutter,
   },
});
