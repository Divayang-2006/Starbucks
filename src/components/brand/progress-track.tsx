/**
 * A bar that fills. Generic on purpose.
 *
 * Two very different things in this app are the same object underneath: the
 * tier gauge ("640 Stars of 1,000 to Gold") and an order's progress ("we're
 * making it"). Building the tier gauge as a tier-specific component is how you
 * end up writing the order one from scratch three weeks later, so this knows
 * about a fraction and a colour and nothing else.
 *
 * `value` is 0–1 and is clamped here. A caller computing
 * `stars / threshold` will hand this 1.4 the first time someone overshoots a
 * milestone, and a fill wider than its track is a visible bug rather than a
 * caught one.
 *
 * The `color` escape hatch exists for the tier: a Gold-tier gauge should be
 * `Tier.gold`, not `Action.primary`, and that is one of the few places in this
 * app where a component legitimately takes a raw colour. It still comes from a
 * token at the call site.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Action, Border, Radius, Sizes, Surface } from '@/theme';

type Props = {
   /** 0–1. Clamped. */
   value: number;
   tone?: 'light' | 'inverse';
   /** Overrides the fill. Pass a `Tier` token, not a literal. */
   color?: string;
   height?: number;
   /** Announced by screen readers: "Progress to Gold tier". */
   label?: string;
   style?: StyleProp<ViewStyle>;
};

export function ProgressTrack({
   value,
   tone = 'light',
   color = Action.primary,
   height = Sizes.trackHeight,
   label,
   style,
}: Props) {
   const fraction = Math.min(1, Math.max(0, value));

   return (
      <View
         accessibilityRole="progressbar"
         accessibilityLabel={label}
         accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }}
         style={[
            styles.track,
            {
               height,
               borderRadius: Radius.pill,
               backgroundColor: tone === 'inverse' ? Border.hairOnDark : Surface.tint,
            },
            style,
         ]}
      >
         <View
            style={[
               styles.fill,
               /**
                * A percentage width rather than a measured one: the track is
                * always inside a laid-out parent, and measuring would mean the
                * fill arrives a frame after the track on first paint.
                */
               { width: `${fraction * 100}%`, backgroundColor: color, borderRadius: Radius.pill },
            ]}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   track: {
      overflow: 'hidden',
      alignSelf: 'stretch',
   },
   fill: {
      height: '100%',
   },
});
