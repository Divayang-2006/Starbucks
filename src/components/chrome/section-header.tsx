/**
 * The row that opens a section: optional ALL-CAPS kicker, title, and a text
 * action on the right ("View all", "Discover More" — §6 uses both).
 *
 * Titles here are sentence case Urbanist, never the serif. Fraunces is rationed
 * to one moment per screen (DESIGN_SYSTEM §1) and a section header is the
 * easiest place to squander it.
 *
 * `TextAction` lives here rather than in its own file because this is where the
 * canonical version already was. The audit found three treatments of the same
 * in-card link — this one, `gift.tsx`'s caps "Add Item", and Home's marginless
 * "Learn More" — for a control that is one thing: a word you tap that is not
 * important enough to be a button. One of them had to win and the section
 * header's had the most call sites, so the other two come to it.
 */

import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { CapsKicker } from './screen-header';

import { Gutter, Pressed, Space, TextColor, TextStyles } from '@/theme';

type Props = {
   title: string;
   kicker?: string;
   /** Trailing text action. Omit and no action renders. */
   action?: string;
   onAction?: () => void;
   /** `inverse` for a header sitting on a green surface. */
   tone?: 'light' | 'inverse';
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
};

export function SectionHeader({
   title,
   kicker,
   action,
   onAction,
   tone = 'light',
   gutter = true,
}: Props) {
   const inverse = tone === 'inverse';

   return (
      <View style={[styles.row, gutter && styles.rowGutter]}>
         <View style={styles.titles}>
            {kicker ? (
               <Text style={[styles.kicker, inverse && styles.kickerInverse]}>{kicker}</Text>
            ) : null}
            <Text
               style={[styles.title, inverse && styles.titleInverse]}
               maxFontSizeMultiplier={1.3}
            >
               {title}
            </Text>
         </View>

         {action ? <TextAction label={action} onPress={onAction} tone={tone} /> : null}
      </View>
   );
}

type TextActionProps = {
   label: string;
   onPress?: () => void;
   /**
    * `inverse` swaps the green for white and underlines it. Green-on-green is
    * the reason Home's "Change store" was hand-rolled in the first place.
    */
   tone?: 'light' | 'inverse';
   style?: StyleProp<TextStyle>;
};

/**
 * A word you tap. Not a button — no height, no fill, no border, so it never
 * competes with the real CTA on the same card.
 */
export function TextAction({ label, onPress, tone = 'light', style }: TextActionProps) {
   return (
      <Pressable
         /** The text is ~16pt tall; this is what gets it to a 44pt target. */
         hitSlop={Space.md}
         accessibilityRole="button"
         accessibilityLabel={label}
         onPress={onPress}
         style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
         <Text style={[styles.action, tone === 'inverse' && styles.actionInverse, style]}>
            {label}
         </Text>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: Space.md,
   },
   rowGutter: {
      paddingHorizontal: Gutter,
   },
   titles: {
      flexShrink: 1,
      gap: Space.xxs,
   },
   kicker: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   kickerInverse: {
      color: TextColor.onDarkMuted,
   },
   title: {
      ...TextStyles.h3,
      color: TextColor.primary,
   },
   titleInverse: {
      color: TextColor.onDark,
   },
   action: {
      ...TextStyles.bodySmStrong,
      color: TextColor.action,
   },
   actionInverse: {
      color: TextColor.onDark,
      textDecorationLine: 'underline',
   },
   pressed: {
      opacity: Pressed.opacity,
   },
});
