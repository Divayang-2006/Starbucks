/**
 * The underlined "pick one of N" strip.
 *
 * This is the deliberate sibling of `ChipRow`, not a competitor to it. The app
 * had three controls doing "pick one of N" — `ChipRow`, hand-rolled non-scrolling
 * chip rows in two screens, and this strip in `order.tsx` — and the reason that
 * happened is that nobody had written down which one to reach for. So:
 *
 * | | `Segmented` | `ChipRow` |
 * |---|---|---|
 * | What it does | **Partitions** a set: you are looking at exactly one of these | **Filters** across a set: narrows what you already see |
 * | Selection | Always one | One, or none |
 * | Count | 2–5, all visible | Any, scrolls |
 * | Reads as | Tabs within the page | Tokens you can toggle |
 *
 * `order.tsx` gets both, one above the other, and that is correct rather than
 * redundant: the menu tabs (Drinks / Food / Merchandise) partition the
 * catalogue, and the category chips below cut across whatever partition you are
 * in. Two controls, two jobs. Three would be one too many.
 *
 * Drawn as a rule under the label rather than as a filled pill so it cannot be
 * confused with the chips it sits above. The rule is always present and
 * transparent when inactive — laying it out only when selected would shift every
 * label by two points as the selection moves.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Action, Gutter, Pressed, Radius, Space, TextColor, TextStyles } from '@/theme';

type Props = {
   items: readonly string[];
   selectedIndex: number;
   onChange?: (index: number) => void;
   /** On when the labels are long enough to overflow — four menu tabs on a 375pt screen. */
   scroll?: boolean;
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
};

export function Segmented({
   items,
   selectedIndex,
   onChange,
   scroll = false,
   gutter = true,
}: Props) {
   const segments = items.map((item, index) => {
      const on = index === selectedIndex;

      return (
         <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityLabel={item}
            accessibilityState={{ selected: on }}
            hitSlop={Space.sm}
            onPress={onChange ? () => onChange(index) : undefined}
            style={({ pressed }) => [styles.segment, pressed && styles.pressed]}
         >
            <Text
               style={[styles.label, on && styles.labelOn]}
               numberOfLines={1}
               maxFontSizeMultiplier={1.2}
            >
               {item}
            </Text>
            <View style={[styles.rule, on && styles.ruleOn]} />
         </Pressable>
      );
   });

   if (scroll) {
      return (
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.strip, gutter && styles.stripGutter]}
         >
            {segments}
         </ScrollView>
      );
   }

   return <View style={[styles.strip, gutter && styles.stripGutter]}>{segments}</View>;
}

const styles = StyleSheet.create({
   strip: {
      flexDirection: 'row',
      gap: Space.lg,
   },
   stripGutter: {
      paddingHorizontal: Gutter,
   },
   segment: {
      gap: Space.sm,
      flexShrink: 1,
   },
   label: {
      ...TextStyles.bodySmStrong,
      color: TextColor.secondary,
   },
   labelOn: {
      color: TextColor.primary,
   },
   rule: {
      height: 2,
      borderRadius: Radius.pill,
      backgroundColor: 'transparent',
   },
   /** House Green, matching a selected chip — the same "this is the state" green. */
   ruleOn: {
      backgroundColor: Action.selected,
   },
   pressed: {
      opacity: Pressed.opacity,
   },
});
