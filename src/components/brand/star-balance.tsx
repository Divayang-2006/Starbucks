/**
 * A gold star and a number. The app's currency, wherever it appears.
 *
 * Four places want it and none of them are the same size: the Home header
 * (alongside two other figures), the Rewards hero (as the subject of the
 * screen), Pay, and the tab bar's bottom accessory (in about ten points of
 * height). Three sizes cover all four, and having them here is what stops the
 * fourth site inventing a fourth.
 *
 * The mark is `Glyph id="rewards"` — the same star as the Rewards tab, stroked
 * in `Accent.gold`. Not a filled star and not the `★` character: the glyph set
 * is one drawing language (`glyphs.tsx`), and a solid star next to a stroked tab
 * icon of the same shape looks like two different stars rather than one idea.
 *
 * The number is grouped Indian-style via `formatIndianNumber`. A Star balance
 * reaches four digits well inside a year, and `1250` is the point where an
 * ungrouped number stops reading as a quantity.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Glyph } from '@/components/chrome';
import { formatIndianNumber } from '@/lib/format';
import { Accent, IconSize, Space, Stroke, TextColor, TextStyles } from '@/theme';

type Size = 'sm' | 'md' | 'lg';

type Props = {
   stars: number;
   /** `sm` in a strip or accessory, `md` beside other content, `lg` as the subject. */
   size?: Size;
   tone?: 'light' | 'inverse';
   /** Appends "Stars" after the number. Off where the mark alone is unambiguous. */
   unit?: boolean;
   style?: StyleProp<ViewStyle>;
};

export function StarBalance({
   stars,
   size = 'md',
   tone = 'light',
   unit = false,
   style,
}: Props) {
   const inverse = tone === 'inverse';
   const spec = SPEC[size];

   return (
      <View
         style={[styles.row, { gap: spec.gap }, style]}
         accessibilityLabel={`${formatIndianNumber(stars)} Stars`}
      >
         <Glyph id="rewards" size={spec.glyph} color={Accent.gold} strokeWidth={spec.stroke} />

         <Text
            style={[spec.text, inverse ? styles.valueInverse : styles.value]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
         >
            {formatIndianNumber(stars)}
            {unit ? (
               <Text style={[spec.unit, inverse ? styles.unitInverse : styles.unitLight]}>
                  {' '}
                  Stars
               </Text>
            ) : null}
         </Text>
      </View>
   );
}

/**
 * Glyph size tracks the cap height of the text it sits beside, not the font
 * size — a star matched to the em box floats above the digits' baseline.
 */
const SPEC = {
   sm: {
      glyph: IconSize.xs,
      stroke: Stroke.heavy,
      gap: Space.xs,
      text: TextStyles.bodySmStrong,
      unit: TextStyles.micro,
   },
   md: {
      glyph: IconSize.md,
      stroke: Stroke.medium,
      gap: Space.sm,
      text: TextStyles.h2,
      unit: TextStyles.bodySm,
   },
   lg: {
      glyph: 28,
      stroke: Stroke.regular,
      gap: Space.sm,
      text: TextStyles.display,
      unit: TextStyles.h3,
   },
} as const satisfies Record<Size, unknown>;

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   value: {
      color: TextColor.primary,
   },
   valueInverse: {
      color: TextColor.onDark,
   },
   unitLight: {
      color: TextColor.secondary,
   },
   unitInverse: {
      color: TextColor.onDarkMuted,
   },
});
