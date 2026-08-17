/**
 * Nothing here yet, said properly.
 *
 * Distinct from `PlaceholderBlock`, and the distinction matters: a placeholder
 * is a hole in *our* work that a future commit fills, an empty state is a
 * correct rendering of the user's actual situation. An empty cart is not
 * unfinished. Reaching for the grey block when you mean this one tells the user
 * the app is broken.
 *
 * The mark is a stroke glyph on a tinted disc rather than an illustration — the
 * app has one icon language (`glyphs.tsx`) and an empty state is the easiest
 * place to accidentally start a second one.
 *
 * `action` is a slot, not a `label`/`onPress` pair, because the button lives in
 * `controls/` and chrome sits underneath it. Callers pass a `<Button>`.
 */

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Glyph, type GlyphId } from './glyphs';

import {
   IconSize,
   Radius,
   Sizes,
   Space,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

type Props = {
   title: string;
   body?: string;
   /** Drawn on a tinted disc. Ignored when `mark` is given. */
   glyph?: GlyphId;
   /** Replaces the disc entirely — an illustration, a `DietMark`, a photo. */
   mark?: ReactNode;
   /** A `<Button>`, usually `variant="secondary"`. */
   action?: ReactNode;
   tone?: 'light' | 'inverse';
   style?: StyleProp<ViewStyle>;
};

export function EmptyState({ title, body, glyph, mark, action, tone = 'light', style }: Props) {
   const inverse = tone === 'inverse';

   return (
      <View style={[styles.root, style]}>
         {mark ?? (
            glyph ? (
               <View style={[styles.disc, inverse && styles.discInverse]}>
                  <Glyph
                     id={glyph}
                     size={IconSize.lg}
                     color={inverse ? TextColor.onDarkMuted : TextColor.secondary}
                  />
               </View>
            ) : null
         )}

         <Text
            style={[styles.title, inverse && styles.titleInverse]}
            maxFontSizeMultiplier={1.3}
         >
            {title}
         </Text>

         {body ? (
            <Text style={[styles.body, inverse && styles.bodyInverse]}>{body}</Text>
         ) : null}

         {action ? <View style={styles.action}>{action}</View> : null}
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      alignItems: 'center',
      gap: Space.sm,
      paddingVertical: Space.xxl,
      paddingHorizontal: Space.lg,
   },
   disc: {
      width: Sizes.markDisc,
      height: Sizes.markDisc,
      borderRadius: Radius.pill,
      backgroundColor: Surface.sunken,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Space.xs,
   },
   discInverse: {
      backgroundColor: Surface.onDarkFill,
   },
   title: {
      ...TextStyles.h3,
      color: TextColor.primary,
      textAlign: 'center',
   },
   titleInverse: {
      color: TextColor.onDark,
   },
   body: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      textAlign: 'center',
   },
   bodyInverse: {
      color: TextColor.onDarkMuted,
   },
   action: {
      marginTop: Space.md,
   },
});
