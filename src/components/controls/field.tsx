/**
 * Text entry. Two shapes, because the app has two.
 *
 * **`Field`** is the underline input — a caps label, a value on a rule. Underline
 * rather than a boxed input because the app's boxes are all pills and a pill with
 * a caret in it reads as a chip you can't press. It is also what the onboarding
 * card already does, so a form screen and the join flow will not look like two
 * products.
 *
 * **`SearchField`** is the pill. `order.tsx` built this by hand and, in doing so,
 * re-derived the chip's border recipe (`Radius.pill`, 1pt `Border.hair`, a glyph,
 * `TextColor.tertiary` text) a hundred lines away from `chip.tsx`. Worse, it was
 * a `View` with a `Text` inside it — visually a search field, semantically
 * nothing, invisible to a screen reader as a control.
 *
 * `SearchField` therefore has two modes and the props decide which:
 *
 * - `onPress` given → a **button** that looks like a field. This is the honest
 *   encoding of "tapping this opens the search screen", which is what the menu
 *   actually does, and it announces as a button.
 * - `onChangeText` given → a real `TextInput` that filters in place.
 *
 * Focus moves the rule to `Action.selected` rather than growing it. A rule that
 * changes thickness shifts every line below it by a point on focus.
 */

import { useState, type ReactNode } from 'react';
import {
   Pressable,
   StyleSheet,
   Text,
   TextInput,
   View,
   type StyleProp,
   type TextInputProps,
   type ViewStyle,
} from 'react-native';

import { CapsKicker, Glyph } from '@/components/chrome';
import {
   Action,
   Border,
   Gutter,
   IconSize,
   Pressed,
   Radius,
   Sizes,
   Space,
   Status,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

/** The `TextInput` props a field legitimately forwards. Anything else is a new prop here. */
type ForwardedInput = Pick<
   TextInputProps,
   | 'value'
   | 'onChangeText'
   | 'placeholder'
   | 'keyboardType'
   | 'inputMode'
   | 'autoCapitalize'
   | 'autoComplete'
   | 'autoCorrect'
   | 'autoFocus'
   | 'secureTextEntry'
   | 'maxLength'
   | 'editable'
   | 'returnKeyType'
   | 'textContentType'
   | 'onSubmitEditing'
>;

type FieldProps = ForwardedInput & {
   /** ALL-CAPS label above the rule. */
   label?: string;
   /** Replaces the hint line and turns the rule red. */
   error?: string;
   /** Quiet helper under the rule. Hidden while `error` is showing. */
   hint?: string;
   /** A unit, a clear button, a reveal toggle. */
   trailing?: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function Field({ label, error, hint, trailing, style, ...input }: FieldProps) {
   const [focused, setFocused] = useState(false);
   const disabled = input.editable === false;

   return (
      <View style={[styles.field, style]}>
         {label ? <Text style={styles.label}>{label}</Text> : null}

         <View
            style={[
               styles.line,
               focused && styles.lineFocused,
               error !== undefined && styles.lineError,
            ]}
         >
            <TextInput
               {...input}
               style={[styles.input, disabled && styles.inputDisabled]}
               placeholderTextColor={TextColor.tertiary}
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               maxFontSizeMultiplier={1.3}
            />
            {trailing}
         </View>

         {error !== undefined ? (
            <Text style={styles.error}>{error}</Text>
         ) : hint ? (
            <Text style={styles.hint}>{hint}</Text>
         ) : null}
      </View>
   );
}

type SearchFieldProps = {
   placeholder: string;
   value?: string;
   /** Given, the field filters in place. Ignored when `onPress` is set. */
   onChangeText?: (text: string) => void;
   /** Given, the field is a button that opens search elsewhere. */
   onPress?: () => void;
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
   style?: StyleProp<ViewStyle>;
};

export function SearchField({
   placeholder,
   value,
   onChangeText,
   onPress,
   gutter = false,
   style,
}: SearchFieldProps) {
   const mark = <Glyph id="search" size={IconSize.sm} color={TextColor.tertiary} />;

   if (onPress) {
      return (
         <View style={[gutter && styles.searchGutter, style]}>
            <Pressable
               accessibilityRole="search"
               accessibilityLabel={placeholder}
               onPress={onPress}
               style={({ pressed }) => [styles.search, pressed && styles.pressed]}
            >
               {mark}
               <Text style={styles.searchPlaceholder} numberOfLines={1}>
                  {value || placeholder}
               </Text>
            </Pressable>
         </View>
      );
   }

   return (
      <View style={[gutter && styles.searchGutter, style]}>
         <View style={styles.search}>
            {mark}
            <TextInput
               value={value}
               onChangeText={onChangeText}
               placeholder={placeholder}
               placeholderTextColor={TextColor.tertiary}
               style={styles.searchInput}
               returnKeyType="search"
               autoCorrect={false}
               maxFontSizeMultiplier={1.3}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   field: {
      gap: Space.xs,
   },
   label: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   line: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      minHeight: Sizes.fieldHeight,
      borderBottomWidth: 1,
      borderBottomColor: Border.hair,
   },
   lineFocused: {
      borderBottomColor: Action.selected,
   },
   lineError: {
      borderBottomColor: Status.error,
   },
   input: {
      flex: 1,
      ...TextStyles.body,
      color: TextColor.primary,
      /**
       * Zeroed: iOS pads a `TextInput` vertically by default, which would make
       * the value sit off-centre above the rule.
       */
      paddingVertical: 0,
   },
   inputDisabled: {
      color: TextColor.tertiary,
   },
   error: {
      ...TextStyles.micro,
      color: Status.error,
   },
   hint: {
      ...TextStyles.micro,
      color: TextColor.secondary,
   },

   searchGutter: {
      paddingHorizontal: Gutter,
   },
   search: {
      height: Sizes.fieldHeight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      paddingHorizontal: Space.base,
      borderRadius: Radius.pill,
      backgroundColor: Surface.raised,
      borderWidth: 1,
      borderColor: Border.hair,
   },
   searchPlaceholder: {
      ...TextStyles.body,
      color: TextColor.tertiary,
      flexShrink: 1,
   },
   searchInput: {
      flex: 1,
      ...TextStyles.body,
      color: TextColor.primary,
      paddingVertical: 0,
   },
   pressed: {
      opacity: Pressed.opacity,
   },
});
