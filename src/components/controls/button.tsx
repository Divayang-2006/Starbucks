/**
 * The button. Singular, on purpose.
 *
 * The audit found four implementations of what is visually one control, at two
 * heights, for the same job: Home's locked "Unlock Reward", Rewards' "Use
 * Reward" and "Share invite code", and Pay's two-up action pair. None of them
 * knew about each other, so the locked one was a `View` with no press state at
 * all and the Pay pair had a border the others did not.
 *
 * **Two heights, and they mean different things.** `md` (52) is *the* action of
 * a screen or a sheet — Add to Cart, Continue, Pay. `sm` (36) is an action
 * inside a card, where a 52pt bar would out-weigh the card's own title. The
 * heights match `Sizes.buttonHeight` and `Sizes.chipHeight`, which is not a
 * coincidence: a card-level button and a chip are the same visual mass.
 *
 * **Press feedback.** Everything dims to `Pressed.opacity`, except `primary`,
 * which darkens to `Action.primaryPressed` instead. Dimming a saturated green on
 * cream *lightens* it, and lighter green is the app's disabled signal — so the
 * one variant where opacity would say the wrong thing gets the token that exists
 * for it. One exception, stated, beats five variants each choosing.
 *
 * **Hugging by default.** `full` stretches. A stretched button that should have
 * hugged is a much louder mistake than the reverse, so the quiet option is the
 * default and the loud one is a word you have to type.
 */

import {
   ActivityIndicator,
   Pressable,
   StyleSheet,
   Text,
   type StyleProp,
   type ViewStyle,
} from 'react-native';

import { Glyph, type GlyphId } from '@/components/chrome';
import {
   Action,
   Border,
   IconSize,
   Pressed,
   Radius,
   Sizes,
   Space,
   Status,
   Stroke,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md';

type Props = {
   label: string;
   onPress?: () => void;
   variant?: ButtonVariant;
   size?: ButtonSize;
   /** Leading glyph. Sized and weighted from `size` — see `Stroke` in `@/theme`. */
   glyph?: GlyphId;
   /** Stretch to the container's width. */
   full?: boolean;
   disabled?: boolean;
   /** Swaps the label for a spinner and blocks the press. Still occupies its height. */
   loading?: boolean;
   /** Overrides `label` for screen readers. Rarely needed. */
   accessibilityLabel?: string;
   style?: StyleProp<ViewStyle>;
};

export function Button({
   label,
   onPress,
   variant = 'primary',
   size = 'md',
   glyph,
   full = false,
   disabled = false,
   loading = false,
   accessibilityLabel,
   style,
}: Props) {
   const inert = disabled || loading;
   const small = size === 'sm';
   const tint = labelColor(variant, inert);

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={accessibilityLabel ?? label}
         accessibilityState={{ disabled: inert, busy: loading }}
         disabled={inert}
         onPress={onPress}
         style={({ pressed }) => [
            styles.button,
            small ? styles.sizeSm : styles.sizeMd,
            fill[variant],
            inert && (variant === 'primary' ? styles.disabledPrimary : styles.disabledQuiet),
            full ? styles.full : styles.hug,
            pressed && !inert && (variant === 'primary' ? styles.pressedPrimary : styles.pressed),
            style,
         ]}
      >
         {loading ? (
            <ActivityIndicator size="small" color={tint} />
         ) : (
            <>
               {glyph ? (
                  <Glyph
                     id={glyph}
                     size={small ? IconSize.xs : IconSize.md}
                     color={tint}
                     strokeWidth={small ? Stroke.heavy : Stroke.medium}
                  />
               ) : null}
               <Text
                  style={[small ? styles.labelSm : styles.labelMd, { color: tint }]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.2}
               >
                  {label}
               </Text>
            </>
         )}
      </Pressable>
   );
}

function labelColor(variant: ButtonVariant, inert: boolean): string {
   if (inert) {
      // Filled primary keeps white type on its muted fill; everything else greys out.
      return variant === 'primary' ? Action.onPrimary : TextColor.tertiary;
   }

   switch (variant) {
      case 'primary':
      case 'destructive':
         return Action.onPrimary;
      case 'inverse':
         return TextColor.onDark;
      case 'ghost':
         return TextColor.action;
      case 'secondary':
         return TextColor.primary;
   }
}

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
   ghost: {
      backgroundColor: 'transparent',
   },
   destructive: {
      backgroundColor: Status.error,
   },
});

const styles = StyleSheet.create({
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Space.sm,
      borderRadius: Radius.pill,
   },
   sizeSm: {
      height: Sizes.chipHeight,
      paddingHorizontal: Space.base,
   },
   sizeMd: {
      height: Sizes.buttonHeight,
      paddingHorizontal: Space.lg,
   },
   hug: {
      alignSelf: 'flex-start',
   },
   full: {
      alignSelf: 'stretch',
   },

   /**
    * Recessed, not translucent. This is Home's "Unlock Reward" exactly: a locked
    * action should look like a slot waiting to be filled, which `Surface.sunken`
    * says and a faded green does not.
    */
   disabledQuiet: {
      backgroundColor: Surface.sunken,
      borderWidth: 0,
   },
   disabledPrimary: {
      backgroundColor: Action.primaryDisabled,
   },

   pressed: {
      opacity: Pressed.opacity,
   },
   pressedPrimary: {
      backgroundColor: Action.primaryPressed,
   },

   labelSm: {
      ...TextStyles.bodySmStrong,
   },
   labelMd: {
      ...TextStyles.bodyStrong,
   },
});
