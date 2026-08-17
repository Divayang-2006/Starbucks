/**
 * The one number a screen is about, with its caps label above it.
 *
 * `pay.tsx` and `rewards.tsx` wrote the identical three-line block — caps
 * kicker, `TextStyles.display`, an optional smaller unit trailing the figure —
 * and then diverged on the details, because two people typing the same idea
 * always do. Pay centred nothing and left-aligned; Rewards centred everything.
 * Both are right for their card, so alignment is a prop and everything else is
 * not.
 *
 * `value` is a pre-formatted string, not a number. This component has no idea
 * whether it is showing rupees, Stars or minutes — `formatRupees` and
 * `formatIndianNumber` in `@/lib/format` do that, and keeping the formatting
 * outside means a currency change is one call site rather than a prop here.
 *
 * The unit is a nested `<Text>` so it shares the display line's baseline. Laid
 * out as a sibling it would sit at the top of a 40pt line height, floating
 * above the digits.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { CapsKicker } from '@/components/chrome';
import { Space, TextColor, TextStyles } from '@/theme';

type Props = {
   /** ALL-CAPS label: "BALANCE", "TOTAL", "STARS EARNED". */
   kicker: string;
   /** Already formatted — `₹0.00`, `1,250`. */
   value: string;
   /** Trails the figure at a smaller size: "Stars", "kcal". */
   unit?: string;
   tone?: 'light' | 'inverse';
   align?: 'left' | 'center';
   style?: StyleProp<ViewStyle>;
};

export function Balance({
   kicker,
   value,
   unit,
   tone = 'light',
   align = 'left',
   style,
}: Props) {
   const inverse = tone === 'inverse';
   const centred = align === 'center';

   return (
      <View style={[centred && styles.centred, style]}>
         <Text style={[styles.kicker, inverse && styles.kickerInverse]}>{kicker}</Text>

         <Text
            style={[styles.value, inverse && styles.valueInverse]}
            numberOfLines={1}
            /**
             * Tighter than elsewhere. The display size is already 34pt and the
             * cards around it are dimensioned for one line of it.
             */
            maxFontSizeMultiplier={1.15}
            adjustsFontSizeToFit
         >
            {value}
            {unit ? (
               <Text style={[styles.unit, inverse && styles.unitInverse]}> {unit}</Text>
            ) : null}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   centred: {
      alignItems: 'center',
   },
   kicker: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   kickerInverse: {
      color: TextColor.onDarkMuted,
   },
   value: {
      ...TextStyles.display,
      color: TextColor.primary,
      marginTop: Space.xs,
   },
   valueInverse: {
      color: TextColor.onDark,
   },
   unit: {
      ...TextStyles.h3,
      color: TextColor.secondary,
   },
   unitInverse: {
      color: TextColor.onDarkMuted,
   },
});
