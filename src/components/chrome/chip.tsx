/**
 * The pill chip, and a row of them.
 *
 * Selected chips fill with House Green, not the CTA green — the reference app is
 * consistent that `Action.selected` is for state and `Action.primary` is for
 * "do the thing", and so are we (DESIGN_SYSTEM §2).
 *
 * The chip does two jobs that look identical and are not:
 *
 * - **A control** (`tone="default"`). Order modes, menu category filters,
 *   gift-card categories. Selectable, `Sizes.chipHeight` tall, a real tap target.
 * - **A badge** (any other tone, `size="sm"`). "★ Reward redeemed" — a tinted
 *   label that states a fact. It ignores `selected` and is not pressable, which
 *   is the honest encoding of "you cannot do anything to this".
 *
 * The badge used to be hand-rolled in `rewards.tsx`. It is here because a badge
 * and a chip drawn a hundred lines apart drift, and then a reader has to work
 * out whether the difference means something.
 *
 * `ChipRow` scrolls by default. Turn it off for a short fixed set — three order
 * modes, two reward segments — where a scroll view is a lie about there being
 * more. For a "pick one of N" that *partitions* a catalogue rather than filtering
 * across it, reach for `Segmented` in `controls/` instead; the note in that file
 * explains the split.
 */

import {
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   View,
   type StyleProp,
   type ViewStyle,
} from 'react-native';

import {
   Accent,
   Action,
   Border,
   Gutter,
   Pressed,
   Radius,
   Sizes,
   Space,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

/** Badge tones. Each pairs a tint with a label colour that clears 4.5:1 on it. */
export type ChipTone = 'default' | 'gold' | 'success';

type ChipProps = {
   label: string;
   selected?: boolean;
   tone?: ChipTone;
   /** `sm` is the badge shape: caps label, hugging height, no tap target. */
   size?: 'md' | 'sm';
   onPress?: () => void;
   style?: StyleProp<ViewStyle>;
};

export function Chip({
   label,
   selected = false,
   tone = 'default',
   size = 'md',
   onPress,
   style,
}: ChipProps) {
   const badge = tone !== 'default';
   const small = size === 'sm';

   const body = (
      <Text
         style={[
            small ? styles.labelSm : styles.label,
            selected && !badge && styles.labelSelected,
            tone === 'gold' && styles.labelGold,
            tone === 'success' && styles.labelSuccess,
         ]}
         numberOfLines={1}
         maxFontSizeMultiplier={1.2}
      >
         {label}
      </Text>
   );

   const box: StyleProp<ViewStyle> = [
      styles.chip,
      small && styles.chipSm,
      selected && !badge && styles.chipSelected,
      tone === 'gold' && styles.chipGold,
      tone === 'success' && styles.chipSuccess,
      style,
   ];

   /** A badge states a fact, so it never becomes a button even if handed one. */
   if (!onPress || badge) {
      return <View style={box}>{body}</View>;
   }

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={label}
         accessibilityState={{ selected }}
         onPress={onPress}
         style={({ pressed }) => [box, pressed && styles.pressed]}
      >
         {body}
      </Pressable>
   );
}

type ChipRowProps = {
   items: readonly string[];
   /** Index of the selected chip, or -1 for none. */
   selectedIndex?: number;
   onSelect?: (index: number) => void;
   /** Off for a short fixed set that already fits on the narrowest screen. */
   scroll?: boolean;
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
   /**
    * Applied to the row itself, not the chips. Exists because the alternative is
    * a wrapper `View` for a single `marginTop`, and a wrapper is how a screen
    * starts accumulating layout again.
    */
   style?: StyleProp<ViewStyle>;
};

export function ChipRow({
   items,
   selectedIndex = -1,
   onSelect,
   scroll = true,
   gutter = true,
   style,
}: ChipRowProps) {
   const chips = items.map((item, index) => (
      <Chip
         key={item}
         label={item}
         selected={index === selectedIndex}
         onPress={onSelect ? () => onSelect(index) : undefined}
      />
   ));

   if (!scroll) {
      /**
       * Wraps rather than shrinking. A fixed set can still overflow at a large
       * Dynamic Type setting, and a second line is a better failure than three
       * chips with their labels clipped.
       */
      return <View style={[styles.rowStatic, gutter && styles.rowGutter, style]}>{chips}</View>;
   }

   return (
      /**
       * `style` goes on the ScrollView, not the content container: a margin on
       * the content would scroll away with it.
       */
      <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={[styles.row, gutter && styles.rowGutter]}
         style={style}
      >
         {chips}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      gap: Space.sm,
   },
   rowStatic: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Space.sm,
   },
   rowGutter: {
      paddingHorizontal: Gutter,
   },

   chip: {
      height: Sizes.chipHeight,
      justifyContent: 'center',
      paddingHorizontal: Space.base,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Border.strong,
      backgroundColor: Surface.sunken,
   },
   chipSm: {
      height: undefined,
      paddingHorizontal: Space.sm,
      paddingVertical: Space.xs,
      alignSelf: 'flex-start',
      borderWidth: 0,
   },
   chipSelected: {
      backgroundColor: Action.selected,
      borderColor: Action.selected,
   },
   chipGold: {
      backgroundColor: Accent.goldSoft,
      borderWidth: 0,
   },
   chipSuccess: {
      backgroundColor: Surface.tint,
      borderWidth: 0,
   },

   label: {
      ...TextStyles.label,
      color: TextColor.primary,
   },
   labelSm: {
      ...TextStyles.caps,
      textTransform: 'uppercase',
      color: TextColor.primary,
   },
   labelSelected: {
      color: TextColor.onDark,
   },
   labelGold: {
      color: Accent.caramel,
   },
   /** House Green rather than `Status.success`, which is only 4.3:1 on mint. */
   labelSuccess: {
      color: Action.selected,
   },

   pressed: {
      opacity: Pressed.opacity,
   },
});
