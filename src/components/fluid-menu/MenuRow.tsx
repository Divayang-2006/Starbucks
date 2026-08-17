/**
 * One menu row, and the reason the whole thing feels fluid.
 *
 * The entrance is **derived from progress, not played back from it.** A row's
 * position is a pure function of `progress` and its own index — there is no
 * `withDelay`, no sequence, no timeline. That is the entire trick:
 *
 * - Drag the panel half-open and hold, and the stagger holds too, frozen
 *   mid-flight with the early rows in and the late ones still out.
 * - Reverse the drag and the stagger runs backwards, correctly, because there
 *   was never a direction baked in.
 * - Let go anywhere and the spring on `progress` carries every row home
 *   together.
 *
 * A `withDelay` chain gives you the same picture on a button tap and falls apart
 * the moment a finger is involved: the animation has already committed to a
 * timeline the gesture can no longer steer.
 */

import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   type SharedValue,
} from 'react-native-reanimated';

import { Glyph } from '@/components/chrome/glyphs';
import { Radius, Sizes, Space, Status, TextColor, TextStyles } from '@/theme';

import type { MenuItem } from './items';
import { LABEL_LAG, ROW_OFFSET, ROW_SPAN, ROW_STAGGER } from './stage';

type Props = {
   item: MenuItem;
   /** Position in the whole list, not within its group — the stagger is global. */
   index: number;
   progress: SharedValue<number>;
   onPress: (item: MenuItem) => void;
};

export function MenuRow({ item, index, progress, onPress }: Props) {
   /**
    * `interpolate` with a clamped, index-shifted input range *is* the stagger.
    * Row 0 runs over progress 0 → 0.55, row 1 over 0.055 → 0.605, and so on.
    */
   const arrive = (p: number) => {
      'worklet';
      const start = index * ROW_STAGGER;
      return interpolate(p, [start, start + ROW_SPAN], [0, 1], Extrapolation.CLAMP);
   };

   const rowStyle = useAnimatedStyle(() => {
      const a = arrive(progress.get());
      return {
         opacity: a,
         transform: [{ translateX: (1 - a) * -ROW_OFFSET }],
      };
   });

   /**
    * The label trails its icon by a few points. Within a single row that reads as
    * the text being dragged along by the icon rather than the pair sliding as one
    * rigid block — the difference between a row that moves and a row that arrives.
    */
   const labelStyle = useAnimatedStyle(() => {
      const a = arrive(progress.get());
      return { transform: [{ translateX: (1 - a) * -LABEL_LAG }] };
   });

   const tint = item.destructive ? Status.errorOnDark : TextColor.onDark;

   return (
      <Animated.View style={rowStyle}>
         <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => onPress(item)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
         >
            <View style={styles.icon}>
               <Glyph id={item.glyph} size={23} color={tint} strokeWidth={1.7} />
            </View>

            <Animated.Text
               style={[styles.label, { color: tint }, labelStyle]}
               numberOfLines={1}
               maxFontSizeMultiplier={1.2}
            >
               {item.label}
            </Animated.Text>
         </Pressable>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   row: {
      minHeight: Sizes.tap,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.base,
      paddingVertical: Space.sm,
      paddingLeft: Space.xl,
      // Runs past the visible edge so a press near the app card still lands.
      paddingRight: Space.xxl,
      borderRadius: Radius.md,
   },
   pressed: {
      backgroundColor: 'rgba(255,255,255,0.09)',
   },
   /** Fixed box so the labels align whatever each glyph's ink extent is. */
   icon: {
      width: 26,
      alignItems: 'center',
   },
   label: {
      ...TextStyles.h3,
      flexShrink: 1,
   },
});
