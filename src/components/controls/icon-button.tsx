/**
 * A circular, icon-only control that is always a legal tap target.
 *
 * The 30pt round add button was duplicated byte-for-byte in `index.tsx` and
 * `order.tsx`, and both copies had the same bug: a 30pt `View` inside a
 * `Pressable` with no `hitSlop`, which is 14pt short of the 44pt minimum this
 * design system states in DESIGN_SYSTEM §4. It looked fine and it was hard to
 * hit, which is the worst combination because nobody files it.
 *
 * So the size you pass is the size it *draws*, and the difference from
 * `Sizes.tap` comes back as hit-slop automatically. There is no way to use this
 * component and get an illegal target, which is the only reason it exists rather
 * than being a `Pressable` and a `Glyph` at each call site.
 *
 * The glyph's size and weight default from the button's size rather than being
 * fixed: `Stroke` is optical, so a 30pt button gets a 16pt glyph at
 * `Stroke.heavy` and a 44pt one gets a 20pt glyph at `Stroke.medium`. Passing
 * them explicitly is possible and usually means the size is wrong.
 */

import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Glyph, type GlyphId } from '@/components/chrome';
import {
   Action,
   Border,
   IconSize,
   Pressed,
   Radius,
   Sizes,
   Stroke,
   Surface,
   TextColor,
} from '@/theme';

export type IconButtonTone = 'primary' | 'secondary' | 'inverse' | 'onDark' | 'ghost';

type Props = {
   glyph: GlyphId;
   /** Accessibility name. The control is icon-only, so this is all a reader gets. */
   label: string;
   onPress?: () => void;
   /** Drawn diameter. Anything under `Sizes.tap` is made up in hit-slop. */
   size?: number;
   iconSize?: number;
   strokeWidth?: number;
   tone?: IconButtonTone;
   disabled?: boolean;
   style?: StyleProp<ViewStyle>;
};

export function IconButton({
   glyph,
   label,
   onPress,
   size = Sizes.tap,
   iconSize,
   strokeWidth,
   tone = 'primary',
   disabled = false,
   style,
}: Props) {
   const small = size < Sizes.tap;

   /** Half the shortfall on each edge, so the target is centred on the mark. */
   const slop = Math.max(0, (Sizes.tap - size) / 2);

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={label}
         accessibilityState={{ disabled }}
         disabled={disabled}
         hitSlop={slop}
         onPress={onPress}
         style={({ pressed }) => [
            styles.button,
            { width: size, height: size },
            fill[tone],
            disabled && styles.disabled,
            pressed && !disabled && styles.pressed,
            style,
         ]}
      >
         <Glyph
            id={glyph}
            size={iconSize ?? (small ? IconSize.xs : IconSize.md)}
            color={disabled ? TextColor.tertiary : glyphColor[tone]}
            strokeWidth={strokeWidth ?? (small ? Stroke.heavy : Stroke.medium)}
         />
      </Pressable>
   );
}

const glyphColor: Record<IconButtonTone, string> = {
   primary: Action.onPrimary,
   secondary: TextColor.primary,
   inverse: TextColor.onDark,
   onDark: TextColor.onDark,
   ghost: TextColor.secondary,
};

const fill = StyleSheet.create({
   primary: {
      backgroundColor: Action.primary,
   },
   secondary: {
      backgroundColor: Surface.raised,
      borderWidth: 1,
      borderColor: Border.strong,
   },
   inverse: {
      backgroundColor: Surface.inverse,
   },
   /** Translucent white, for a control drawn on House Green. */
   onDark: {
      backgroundColor: Surface.onDarkFill,
   },
   ghost: {
      backgroundColor: 'transparent',
   },
});

const styles = StyleSheet.create({
   button: {
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },
   disabled: {
      backgroundColor: Surface.sunken,
      borderWidth: 0,
   },
   pressed: {
      opacity: Pressed.opacity,
   },
});
