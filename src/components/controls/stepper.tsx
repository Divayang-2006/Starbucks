/**
 * Quantity: − n +.
 *
 * Two `IconButton`s and a number, which is the whole point — the minus and the
 * plus inherit the hit-slop guarantee rather than each being a bare glyph in a
 * `Pressable`. A stepper is the control most likely to be drawn small and the
 * one most likely to be tapped repeatedly, so it is exactly where an illegal tap
 * target hurts most.
 *
 * The bounds are enforced here rather than by the caller. A stepper that lets
 * you press `−` at 1 and fires `onChange(0)` is a component that has delegated
 * its own contract; `disabled` at the edges also *shows* the bound, which a
 * silently-ignored press does not.
 *
 * The value has a fixed minimum width so the row does not jump as it crosses
 * from 9 to 10.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { IconButton } from './icon-button';

import { Sizes, Space, TextColor, TextStyles } from '@/theme';

type Props = {
   value: number;
   onChange?: (next: number) => void;
   min?: number;
   max?: number;
   /** `sm` is the in-card size — the same 30pt disc as the add button it replaces. */
   size?: 'sm' | 'md';
   /** Names the thing being counted, for screen readers: "Tiramisu Frappuccino". */
   label?: string;
   style?: StyleProp<ViewStyle>;
};

export function Stepper({
   value,
   onChange,
   min = 1,
   max = 99,
   size = 'sm',
   label,
   style,
}: Props) {
   const diameter = size === 'sm' ? Sizes.inlineControl : Sizes.tap;
   const suffix = label ? ` ${label}` : '';

   return (
      <View style={[styles.row, style]} accessibilityLabel={label}>
         <IconButton
            glyph="minus"
            label={`Remove one${suffix}`}
            size={diameter}
            tone="secondary"
            disabled={value <= min}
            onPress={onChange ? () => onChange(Math.max(min, value - 1)) : undefined}
         />

         <Text style={styles.value} maxFontSizeMultiplier={1.2}>
            {value}
         </Text>

         <IconButton
            glyph="plus"
            label={`Add one${suffix}`}
            size={diameter}
            tone="primary"
            disabled={value >= max}
            onPress={onChange ? () => onChange(Math.min(max, value + 1)) : undefined}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
   },
   value: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
      textAlign: 'center',
      /** Room for two digits, so 9 → 10 does not shove the plus button sideways. */
      minWidth: Space.xl,
   },
});
