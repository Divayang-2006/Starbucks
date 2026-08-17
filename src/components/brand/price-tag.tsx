/**
 * `₹535.50`.
 *
 * The price *style* was already duplicated byte-for-byte in `index.tsx` and
 * `order.tsx`; this component exists for the part that was not duplicated yet,
 * because neither screen had reached it. A price is rarely just a number:
 *
 * - **Struck through.** `was` renders the old price before the new one. It is a
 *   sibling `<Text>` rather than the same one, because a strikethrough that runs
 *   through both prices is a rendering bug that only shows up on a discounted
 *   item.
 * - **"from".** A product with size variants has a price range, and showing the
 *   Tall price flat is the kind of small dishonesty that turns into a support
 *   ticket at the till.
 *
 * Formatting is `formatRupees` — Indian grouping, paise on. See `@/lib/format`
 * for why that is not `Intl`.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { formatRupees } from '@/lib/format';
import { Space, TextColor, TextStyles } from '@/theme';

type Props = {
   amount: number;
   /** The pre-discount price. Struck through, ahead of `amount`. */
   was?: number;
   /** Prefixes "from" — the product has cheaper and dearer sizes. */
   from?: boolean;
   size?: 'md' | 'lg';
   tone?: 'light' | 'inverse';
   /** Drop the paise. For summary totals, never for a menu price. */
   paise?: boolean;
   style?: StyleProp<ViewStyle>;
};

export function PriceTag({
   amount,
   was,
   from = false,
   size = 'md',
   tone = 'light',
   paise = true,
   style,
}: Props) {
   const inverse = tone === 'inverse';
   const price = formatRupees(amount, { paise });
   const main = size === 'lg' ? styles.priceLg : styles.price;

   return (
      <View
         style={[styles.row, style]}
         accessibilityLabel={was !== undefined ? `${price}, reduced from ${formatRupees(was, { paise })}` : price}
      >
         {from ? (
            <Text style={[styles.qualifier, inverse && styles.mutedInverse]}>from</Text>
         ) : null}

         {was !== undefined ? (
            <Text style={[styles.was, inverse && styles.mutedInverse]}>
               {formatRupees(was, { paise })}
            </Text>
         ) : null}

         <Text
            style={[main, inverse && styles.priceInverse]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
         >
            {price}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: Space.xs,
   },
   qualifier: {
      ...TextStyles.micro,
      color: TextColor.secondary,
   },
   was: {
      ...TextStyles.bodySm,
      color: TextColor.tertiary,
      textDecorationLine: 'line-through',
   },
   price: {
      ...TextStyles.price,
      color: TextColor.primary,
   },
   priceLg: {
      ...TextStyles.priceLg,
      color: TextColor.primary,
   },
   priceInverse: {
      color: TextColor.onDark,
   },
   mutedInverse: {
      color: TextColor.onDarkMuted,
   },
});
