/**
 * The card tile: a media head, a title, a line of sub, and a way out.
 *
 * It turned up three times with three different names — `articleCard` on Home,
 * `cardTile` on Gift, `rewardCard` on Rewards — and the differences between them
 * were a badge, a button and the wording of the link. Those are slots, not
 * components.
 *
 * The shape is deliberately vertical and fixed-width-agnostic: give it a `width`
 * from `RailCard` for a rail, give it nothing inside a `Grid` and it fills its
 * cell. That is the whole difference between Home's article rail and Gift's
 * two-up catalogue, and it should be.
 *
 * Two slots exist for the foot because they are genuinely different weights.
 * `footer` is a real control — a `Button`, a `Stepper` — and it comes first.
 * `action` is a word you tap, rendered by the canonical `TextAction`, and it
 * closes the card. A tile with both reads correctly: do the thing, or read more
 * about it. A tile with two of either does not.
 */

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card } from './card';
import { TextAction } from './section-header';

import { Space, TextColor, TextStyles } from '@/theme';

type Props = {
   title: string;
   /** The head. An `<Image>`, a `<PlaceholderBlock>`, a gradient — whatever fills it. */
   media?: ReactNode;
   /** Between the media and the title. A `Chip` badge, a `DietMark` row. */
   badge?: ReactNode;
   sub?: string;
   /** A real control at the foot, above `action`. */
   footer?: ReactNode;
   /** The trailing text link — "Learn More", "Add Item", "Details". */
   action?: string;
   onAction?: () => void;
   /** Fixed width, for a rail. Omit inside a `Grid`. */
   width?: number;
   /** Makes the whole tile a tap target. Independent of `action`. */
   onPress?: () => void;
   style?: StyleProp<ViewStyle>;
};

export function Tile({
   title,
   media,
   badge,
   sub,
   footer,
   action,
   onAction,
   width,
   onPress,
   style,
}: Props) {
   return (
      <Card
         onPress={onPress}
         accessibilityLabel={title}
         style={[width !== undefined && { width }, style]}
      >
         {media}

         {badge ? <View style={styles.badge}>{badge}</View> : null}

         <Text style={styles.title} numberOfLines={2} maxFontSizeMultiplier={1.3}>
            {title}
         </Text>

         {sub ? (
            <Text style={styles.sub} numberOfLines={2}>
               {sub}
            </Text>
         ) : null}

         {footer ? <View style={styles.footer}>{footer}</View> : null}

         {action ? (
            <TextAction label={action} onPress={onAction} style={styles.action} />
         ) : null}
      </Card>
   );
}

const styles = StyleSheet.create({
   /** `flexDirection` so a chip sizes to its label instead of stretching the card. */
   badge: {
      flexDirection: 'row',
      marginTop: Space.md,
   },
   title: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
      marginTop: Space.md,
   },
   sub: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      marginTop: Space.xxs,
   },
   footer: {
      marginTop: Space.base,
   },
   action: {
      marginTop: Space.md,
   },
});
